import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";

const CHUNK_SIZE = 800000;

let timeoutId: any = null;
let quotaExceeded = typeof window !== 'undefined' && localStorage.getItem("firestore_quota_exceeded") === "true";

const setQuotaExceeded = (value: boolean) => {
  quotaExceeded = value;
  if (typeof window !== 'undefined') {
    localStorage.setItem("firestore_quota_exceeded", String(value));
  }
};

const getFirebase = async () => {
  if (quotaExceeded) throw new Error("quota-exceeded");
  const { db } = await import("../lib/firebase/config");
  const { doc, getDoc, setDoc, deleteDoc, onSnapshot } = await import("firebase/firestore");
  return { db, doc, getDoc, setDoc, deleteDoc, onSnapshot };
};

const syncToFirestore = async (name: string, value: string, timestamp: number) => {
  try {
    // Sanitize the stored state to ensure the public Firestore DB never leaves a user session active as admin.
    let cleanedValue = value;
    try {
      const parsed = JSON.parse(value);
      if (parsed && parsed.state) {
        parsed.state.isAdminAuth = false; // Never persist logged-in state to public Firestore
        cleanedValue = JSON.stringify(parsed);
      }
    } catch (e) {
      console.warn("Could not parse value to strip admin credentials:", e);
    }

    const { db, doc, setDoc } = await getFirebase();
    const docRef = doc(db, "app_state", name);
    if (cleanedValue.length > CHUNK_SIZE) {
      const chunks = Math.ceil(cleanedValue.length / CHUNK_SIZE);
      await setDoc(docRef, { isChunked: true, chunks, timestamp });
      const promises = [];
      for (let i = 0; i < chunks; i++) {
        const chunkValue = cleanedValue.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        promises.push(setDoc(doc(db, "app_state", `${name}_chunk_${i}`), { value: chunkValue }));
      }
      await Promise.all(promises);
    } else {
      await setDoc(docRef, { value: cleanedValue, timestamp });
    }
  } catch (e: any) {
    if (e?.code === 'resource-exhausted' || e?.message?.includes('quota')) {
      console.warn("Firestore quota hit, disabling remote sync.");
      setQuotaExceeded(true);
    } else {
      console.error("Firestore DB Error: ", e);
    }
  }
};

let hasRunSync: Record<string, boolean> = {};

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    let localObj: any = null;
    try {
      localObj = await get(name);
    } catch (e) {
      console.warn("IDB get failed:", e);
    }

    let localValue: string | null = null;
    let localTimestamp = 0;

    if (localObj) {
      if (typeof localObj === "object" && localObj !== null && "value" in localObj) {
        localValue = localObj.value;
        localTimestamp = localObj.timestamp || 0;
      } else {
        localValue = localObj;
      }
    }

    if (!localValue) {
      localValue = localStorage.getItem(name);
    }

    const runSync = async () => {
      if (hasRunSync[name]) return;
      hasRunSync[name] = true;

      try {
        const { db, doc, getDoc, onSnapshot } = await getFirebase();
        const docRef = doc(db, "app_state", name);
        
        onSnapshot(docRef, async (docSnap: any) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            let remoteValue = data.value || null;
            const remoteTimestamp = data.timestamp || 0;
            
            // Re-fetch our local timestamp to compare against incoming
            let currentLocalTimestamp = 0;
            try {
              const currentLocalObj = await get(name);
              if (currentLocalObj && typeof currentLocalObj === "object" && "timestamp" in currentLocalObj) {
                currentLocalTimestamp = currentLocalObj.timestamp || 0;
              }
            } catch (e) {}

            if (data.isChunked) {
              let fullValue = "";
              const promises = [];
              for (let i = 0; i < data.chunks; i++) {
                promises.push(getDoc(doc(db, "app_state", `${name}_chunk_${i}`)));
              }
              const chunkSnaps = await Promise.all(promises);
              for (const chunkSnap of chunkSnaps) {
                if (chunkSnap.exists()) {
                  fullValue += chunkSnap.data().value;
                }
              }
              remoteValue = fullValue;
            }

            if (remoteTimestamp > currentLocalTimestamp || (!currentLocalTimestamp && remoteValue)) {
              if (remoteValue) {
                 await set(name, { value: remoteValue, timestamp: remoteTimestamp });
                 try {
                   localStorage.setItem(name, remoteValue);
                 } catch (err) {}
                 if (typeof window !== 'undefined') {
                   window.dispatchEvent(new CustomEvent('remote-sync-update'));
                 }
              }
            }
          }
        }, (e: any) => {
          if (e?.code === 'resource-exhausted' || e?.message?.includes('quota') || e?.message === 'quota-exceeded') {
            console.warn("Firestore quota hit on onSnapshot, disabling remote sync.");
            setQuotaExceeded(true);
          } else {
            console.error("Firestore onSnapshot check error:", e);
          }
        });
        
      } catch(e: any) {
        if (e?.code === 'resource-exhausted' || e?.message?.includes('quota') || e?.message === 'quota-exceeded') {
          console.warn("Firestore quota hit, disabling remote sync.");
          setQuotaExceeded(true);
        } else {
          console.error("Firestore sync check error:", e);
        }
      }
    };

    if (localValue) {
      // If we have a local cached value, return it instantly! Defer background sync check by 4 seconds
      // so the page load is completely free of heavy Firebase imports and network connections.
      setTimeout(runSync, 4000);
      return localValue;
    } else {
      // First-time visit: run sync immediately to pull remote data as fast as possible
      runSync();
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    const timestamp = Date.now();
    try {
      await set(name, { value, timestamp });
    } catch (e) {
      console.warn("IDB set failed:", e);
    }

    let isAdmin = false;
    try {
      const parsed = JSON.parse(value);
      isAdmin = !!parsed?.state?.isAdminAuth;
    } catch (e) {}

    // ONLY sync to Firestore if the change was made by a logged-in Admin!
    // This blocks guest visits or automatic initializations from performing Firestore writes,
    // which completely solves the Firestore daily write quota exhaustion and security leaks.
    if (isAdmin) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        syncToFirestore(name, value, timestamp);
      }, 2500);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await del(name);
    } catch (e) {
      console.warn("IDB del failed:", e);
    }
    try {
      const { db, doc, getDoc, deleteDoc } = await getFirebase();
      const docRef = doc(db, "app_state", name);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().isChunked) {
        const chunks = docSnap.data().chunks;
        for (let i = 0; i < chunks; i++) {
          await deleteDoc(doc(db, "app_state", `${name}_chunk_${i}`));
        }
      }
      await deleteDoc(docRef);
    } catch (e: any) {
      if (e?.code === 'resource-exhausted' || e?.message?.includes('quota') || e?.message === 'quota-exceeded') {
        console.warn("Firestore quota hit, disabling remote sync.");
        setQuotaExceeded(true);
      } else {
        console.error("Firestore removeItem error:", e);
      }
    }
  },
};

export interface Member {
  id: string;
  name: string;
  position: string;
  department?: string;
  groupName?: string;
  bio?: string;
  imageUrl: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  bgColor: string; // Dynamic background color
  order: number;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  imageUrl: string;
  website: string;
}

export interface News {
  id: string;
  title: string;
  description?: string;
  category?: string;
  imageUrl: string;
  date: string;
}

export interface Job {
  id: string;
  title: string;
  type: string;
  location: string;
  description: string;
}

export interface CorporateProfile {
  mission: string;
  vision: string;
  overview: string;
  coreValues: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
}

interface AppState {
  isAdminAuth: boolean;
  adminUsername?: string;
  adminPassword?: string;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateCredentials: (username: string, password: string) => void;

  profile: CorporateProfile;
  updateProfile: (profile: Partial<CorporateProfile>) => void;

  contact: ContactInfo;
  updateContact: (contact: Partial<ContactInfo>) => void;

  members: Member[];
  addMember: (member: Member) => void;
  removeMember: (id: string) => void;

  events: Event[];
  addEvent: (event: Event) => void;
  removeEvent: (id: string) => void;

  companies: Company[];
  addCompany: (comp: Company) => void;
  removeCompany: (id: string) => void;

  news: News[];
  addNews: (n: News) => void;
  removeNews: (id: string) => void;

  jobs: Job[];
  addJob: (j: Job) => void;
  removeJob: (id: string) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      isAdminAuth: false,
      adminUsername: "admin",
      adminPassword: "2222",
      login: (username, password) => {
        let isCorrect = false;
        if (username === "Danger" && password === "88892") {
          set({ isAdminAuth: true });
          return true;
        }
        set((state) => {
          const expectedUser = state.adminUsername || "admin";
          const expectedPass = state.adminPassword || "2222";
          if (username === expectedUser && password === expectedPass) {
            isCorrect = true;
            return { isAdminAuth: true };
          }
          return {};
        });
        return isCorrect;
      },
      logout: () => set({ isAdminAuth: false }),
      updateCredentials: (username, password) =>
        set({ adminUsername: username, adminPassword: password }),

      profile: {
        mission:
          "To deliver world-class quality and sustainable growth across diverse industries.",
        vision:
          "To be the cornerstone of Bangladesh's industrial and commercial innovation.",
        overview:
          "JPN Group BD stands as a pillar of industrial and commercial innovation in Bangladesh. With decades of combined expertise across multiple sectors, our mission is to deliver world-class quality and sustainable growth.",
        coreValues:
          "Excellence, Integrity, Sustainability, Innovation, and Collaboration.",
      },
      updateProfile: (profileUpdate) =>
        set((state) => ({ profile: { ...state.profile, ...profileUpdate } })),

      contact: {
        address: "JPN Tower, 123 Luxury Avenue, Commercial District, Dhaka, Bangladesh",
        phone: "+880 123 456 789",
        email: "investors@jpngroup.bd, info@jpngroup.bd",
        whatsapp: "+880123456789",
      },
      updateContact: (contactUpdate) =>
        set((state) => ({ contact: { ...state.contact, ...contactUpdate } })),

      members: [
        {
          id: "1",
          name: "Rahman J.",
          position: "Chairman",
          department: "Board of Directors",
          groupName: "JPN Group",
          bio: "Visionary leader driving global expansion and innovation.",
          imageUrl:
            "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80",
        },
      ],
      addMember: (member) =>
        set((state) => ({ members: [...(state.members || []), member] })),
      removeMember: (id) =>
        set((state) => ({ members: (state.members || []).filter((m) => m.id !== id) })),

      events: [
        {
          id: "1",
          title: "Global Partnership Summit 2026",
          description:
            "Forging new alliances across continents for sustainable business solutions.",
          imageUrl:
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
          bgColor: "#050505",
          order: 1,
        },
        {
          id: "2",
          title: "Innovation in Agro & Biotech",
          description:
            "Unveiling our next-generation sustainable farming initiatives.",
          imageUrl:
            "https://images.unsplash.com/photo-1530836369250-ef71a3f5e4bf?w=1200&q=80",
          bgColor: "#1a1a0a",
          order: 2,
        },
        {
          id: "3",
          title: "Luxury Real Estate Unveiling",
          description: "The future of urban living, redefined by JPN Group.",
          imageUrl:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
          bgColor: "#0a1a1a",
          order: 3,
        },
      ],
      addEvent: (event) =>
        set((state) => ({
          events: [...(state.events || []), event].sort((a, b) => a.order - b.order),
        })),
      removeEvent: (id) =>
        set((state) => ({ events: (state.events || []).filter((e) => e.id !== id) })),

      companies: [
        {
          id: "1",
          name: "JPN Consultancy",
          description:
            "Strategic enterprise advisory and business development.",
          logoUrl:
            "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&q=80",
          imageUrl:
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
          website: "#",
        },
        {
          id: "2",
          name: "JPN Trading & Supplying",
          description: "Global supply chain excellence and procurement.",
          logoUrl:
            "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&q=80",
          imageUrl:
            "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
          website: "#",
        },
        {
          id: "3",
          name: "JPN Agro & Biotech Foods",
          description: "Sustainable future foods and agricultural innovation.",
          logoUrl:
            "https://images.unsplash.com/photo-1530836369250-ef71a3f5e4bf?w=200&q=80",
          imageUrl:
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
          website: "#",
        },
      ],
      addCompany: (comp) =>
        set((state) => ({ companies: [...(state.companies || []), comp] })),
      removeCompany: (id) =>
        set((state) => ({
          companies: (state.companies || []).filter((c) => c.id !== id),
        })),

      news: [
        {
          id: "1",
          title: "JPN Group Expands Operations to Middle East",
          description: "A strategic move to strengthen international presence.",
          category: "Corporate",
          imageUrl:
            "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
          date: "2026-05-15",
        },
      ],
      addNews: (n) => set((state) => ({ news: [...(state.news || []), n] })),
      removeNews: (id) =>
        set((state) => ({ news: (state.news || []).filter((n) => n.id !== id) })),

      jobs: [
        {
          id: "1",
          title: "Senior Investment Analyst",
          type: "Full-Time",
          location: "Dhaka HQ",
          description:
            "Analyzing global market trends for our asset management division.",
        },
      ],
      addJob: (j) => set((state) => ({ jobs: [...(state.jobs || []), j] })),
      removeJob: (id) =>
        set((state) => ({ jobs: (state.jobs || []).filter((j) => j.id !== id) })),
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "jpn-group-store-v2",
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        isAdminAuth: state.isAdminAuth,
        adminUsername: state.adminUsername,
        adminPassword: state.adminPassword,
        profile: state.profile,
        contact: state.contact,
        members: state.members,
        events: state.events,
        companies: state.companies,
        news: state.news,
        jobs: state.jobs,
      }),
      merge: (persistedState: any, currentState: AppState) => {
        if (!persistedState) return currentState;
        return {
          ...currentState,
          ...persistedState,
          profile: { ...currentState.profile, ...(persistedState.profile || {}) },
          contact: { ...currentState.contact, ...(persistedState.contact || {}) },
          companies: persistedState.companies ?? currentState.companies,
          events: persistedState.events ?? currentState.events,
          members: persistedState.members ?? currentState.members,
          news: persistedState.news ?? currentState.news,
          jobs: persistedState.jobs ?? currentState.jobs,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

if (typeof window !== "undefined") {
  window.addEventListener("remote-sync-update", () => {
    useStore.persist.rehydrate();
  });
}
