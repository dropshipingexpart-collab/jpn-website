import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

const DB_FILE = path.join(process.cwd(), "local_db.json");

// Helper to read DB
async function readDb() {
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}

// Helper to write DB
async function writeDb(data: any) {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(data), "utf-8");
  } catch (err) {
    console.error("Failed to write to local db:", err);
  }
}

let subscribers: any[] = [];

// API routes
app.get("/api/state/:name", async (req, res) => {
  const name = req.params.name;
  const db = await readDb();
  if (db[name]) {
    res.json(db[name]);
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

app.post("/api/state/:name", async (req, res) => {
  const name = req.params.name;
  const { value, timestamp } = req.body;
  
  const db = await readDb();
  db[name] = { value, timestamp };
  await writeDb(db);
  
  // Notify long polling clients
  const notifications = subscribers.filter(s => s.name === name);
  subscribers = subscribers.filter(s => s.name !== name);
  
  for (const sub of notifications) {
    try {
      sub.res.json({ value, timestamp });
    } catch(e) {}
  }
  
  res.json({ success: true });
});

// Long polling endpoint for real time sync
app.get("/api/state/:name/listen", async (req, res) => {
  const name = req.params.name;
  
  // Timeout after 30 seconds to avoid hung connections
  const timeoutId = setTimeout(() => {
    subscribers = subscribers.filter(s => s.res !== res);
    res.json({ timeout: true });
  }, 30000);
  
  subscribers.push({ name, res, timeoutId });
  
  req.on('close', () => {
    clearTimeout(timeoutId);
    subscribers = subscribers.filter(s => s.res !== res);
  });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
