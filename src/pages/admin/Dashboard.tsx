import { useState } from 'react';
import { useStore } from '../../store';
import { Plus, Trash2, Edit2, X, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
  const store = useStore();
  
  const [activeTab, setActiveTab ] = useState<'profile'|'contact'|'members'|'events'|'companies'|'news'|'credentials'>('profile');

  // Credentials edit state
  const [newUsername, setNewUsername] = useState(store.adminUsername || 'admin');
  const [newPassword, setNewPassword] = useState(store.adminPassword || '2222');
  const [confirmPassword, setConfirmPassword] = useState(store.adminPassword || '2222');
  const [credentialsSuccess, setCredentialsSuccess] = useState('');
  const [credentialsError, setCredentialsError] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const getWordCount = (text: string) => {
    return (text || '').trim().split(/\s+/).filter(Boolean).length;
  };

  const isFormValid = () => {
    if (!modalConfig || !modalConfig.fields) return true;
    for (const field of modalConfig.fields) {
      if (field.type === 'textarea' && field.wordLimit) {
        const val = formData[field.name] || '';
        if (getWordCount(val) > field.wordLimit) {
          return false;
        }
      }
    }
    return true;
  };

  const openModal = (type: string) => {
    let config: any = {};
    let initialData: any = {};
    if (type === 'companies') {
      config = { title: 'Add Company', fields: [{ name: 'name', label: 'Name' }, { name: 'description', label: 'Description', type: 'textarea' }, { name: 'imageUrl', label: 'Image', type: 'image' }, { name: 'website', label: 'Website' }] };
    } else if (type === 'events') {
      config = { title: 'Add Event', fields: [{ name: 'title', label: 'Title' }, { name: 'description', label: 'Description', type: 'textarea', wordLimit: 30 }, { name: 'imageUrl', label: 'Image', type: 'image' }, { name: 'bgColor', label: 'Background Color', type: 'color' }] };
      initialData = { bgColor: '#1A1A1A' };
    } else if (type === 'members') {
      config = { title: 'Add Member', fields: [{ name: 'name', label: 'Name' }, { name: 'position', label: 'Position' }, { name: 'groupName', label: 'Group / Company Name' }, { name: 'imageUrl', label: 'Image', type: 'image' }] };
    } else if (type === 'news') {
      config = { title: 'Add News', fields: [{ name: 'title', label: 'Title' }, { name: 'imageUrl', label: 'Image', type: 'image' }, { name: 'date', label: 'Date', type: 'date' }] };
      initialData = { date: new Date().toISOString().split('T')[0] };
    }
    setModalConfig({ ...config, type });
    setFormData(initialData);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const id = Date.now().toString();
    const order = Array.isArray(store.events) ? store.events.length : 0;
    const eventData = { id, order, ...formData };
    
    // Simple validation for event
    if (modalConfig.type === 'events') {
      if (!eventData.title || !eventData.imageUrl || !eventData.bgColor) {
        alert("Please fill in all required fields: Title, Image, and Background Color.");
        return;
      }
    }
    
    switch(modalConfig.type) {
      case 'companies': store.addCompany({ id, ...formData } as any); break;
      case 'events': store.addEvent(eventData as any); break;
      case 'members': store.addMember({ id, ...formData } as any); break;
      case 'news': store.addNews({ id, ...formData } as any); break;
    }
    setIsModalOpen(false);
  };

  const tabs = [
    { id: 'profile', label: 'Corporate Profile' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'companies', label: 'Sister Concerns' },
    { id: 'events', label: 'Events Slider' },
    { id: 'members', label: 'Team Members' },
    { id: 'news', label: 'News' },
    { id: 'credentials', label: 'Admin Security' },
  ] as const;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header>
        <h1 className="font-display text-4xl text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Manage your website content here. All changes are reflected immediately on the live site.</p>
      </header>

      <div className="flex space-x-1 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-medium whitespace-nowrap rounded-t-lg transition-colors ${activeTab === tab.id ? 'text-gold-500 bg-white/5 border-b-2 border-gold-500' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-dark-900 border border-white/5 p-8 rounded-xl">
        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display text-white">Manage Corporate Profile</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {['mission', 'vision', 'overview', 'coreValues'].map((key) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-gold-500 block">{key}</label>
                  <textarea 
                    className="w-full bg-dark-950 border border-white/10 rounded-lg p-4 text-white focus:border-gold-500 transition-colors resize-none"
                    rows={4}
                    value={store.profile[key as keyof typeof store.profile]}
                    onChange={(e) => store.updateProfile({ [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTACT TAB */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display text-white">Manage Contact Info</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-gold-500 block">Headquarters Address</label>
                <textarea 
                  className="w-full bg-dark-950 border border-white/10 rounded-lg p-4 text-white focus:border-gold-500 transition-colors resize-none"
                  rows={3}
                  value={store.contact?.address || ""}
                  onChange={(e) => store.updateContact({ address: e.target.value })}
                  placeholder="e.g. JPN Tower, 123 Luxury Avenue, Commercial District, Dhaka, Bangladesh"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-gold-500 block">Phone Number</label>
                <input 
                  type="text"
                  className="w-full bg-dark-950 border border-white/10 rounded-lg p-4 text-white focus:border-gold-500 transition-colors"
                  value={store.contact?.phone || ""}
                  onChange={(e) => store.updateContact({ phone: e.target.value })}
                  placeholder="e.g. +880 123 456 789"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-gold-500 block">Email Address (Comma-separated)</label>
                <input 
                  type="text"
                  className="w-full bg-dark-950 border border-white/10 rounded-lg p-4 text-white focus:border-gold-500 transition-colors"
                  value={store.contact?.email || ""}
                  onChange={(e) => store.updateContact({ email: e.target.value })}
                  placeholder="e.g. investors@jpngroup.bd, info@jpngroup.bd"
                />
              </div>
            </div>
          </div>
        )}

        {/* COMPANIES TAB */}
        {activeTab === 'companies' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-display text-white">Manage Sister Concerns</h2>
              <button onClick={() => openModal('companies')} className="flex items-center space-x-2 bg-gold-600 hover:bg-gold-500 text-dark-950 px-4 py-2 rounded-lg font-medium transition-colors">
                <Plus size={18} />
                <span>Add Company</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {store.companies.map(comp => (
                <div key={comp.id} className="bg-dark-950 p-6 rounded-xl border border-white/10">
                  {comp.logoUrl && comp.logoUrl !== 'undefined' ? (
                    <img src={comp.logoUrl} alt="Logo" className="h-10 object-contain mb-4 bg-white/10 p-2 rounded" />
                  ) : comp.imageUrl && comp.imageUrl !== 'undefined' ? (
                    <img src={comp.imageUrl} alt="Logo" className="h-10 object-contain mb-4 bg-white/10 p-2 rounded" />
                  ) : (
                    <div className="h-10 w-10 flex items-center justify-center mb-4 bg-white/10 p-2 rounded text-white/50 text-[10px] font-bold uppercase">
                      {comp.name ? comp.name.substring(0, 3) : '---'}
                    </div>
                  )}
                  <h3 className="text-xl text-white font-medium mb-2">{comp.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{comp.description}</p>
                  <div className="flex space-x-2 mt-auto">
                    <button onClick={() => store.removeCompany(comp.id)} className="flex-1 flex justify-center items-center space-x-2 text-red-400 border border-red-400/20 py-2 rounded transition-colors hover:bg-red-400/10">
                      <Trash2 size={16} /> <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EVENTS TAB */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-display text-white">Manage Event Slider</h2>
              <button onClick={() => openModal('events')} className="flex items-center space-x-2 bg-gold-600 hover:bg-gold-500 text-dark-950 px-4 py-2 rounded-lg font-medium transition-colors">
                <Plus size={18} />
                <span>Add Event</span>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {store.events.map(ev => (
                <div key={ev.id} className="bg-dark-950 p-6 rounded-xl border border-white/10 flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-black/40 border border-white/5 relative flex items-center justify-center">
                    {/* Beautiful blurred backdrop for premium layout */}
                    <img 
                      src={ev.imageUrl} 
                      alt="" 
                      className="absolute inset-0 w-full h-full object-cover blur opacity-25 select-none pointer-events-none" 
                      referrerPolicy="no-referrer"
                    />
                    <img 
                      src={ev.imageUrl} 
                      alt={ev.title} 
                      className="relative z-10 max-w-full max-h-full object-contain p-1" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                       <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: ev.bgColor }} title={`Background: ${ev.bgColor}`} />
                       <h3 className="text-xl text-white font-medium">{ev.title}</h3>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{ev.description}</p>
                  </div>
                  <button onClick={() => store.removeEvent(ev.id)} className="text-red-400 p-2 hover:bg-red-400/10 rounded border border-red-400/20">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MEMBERS TAB */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-display text-white">Manage Team</h2>
              <button onClick={() => openModal('members')} className="flex items-center space-x-2 bg-gold-600 hover:bg-gold-500 text-dark-950 px-4 py-2 rounded-lg font-medium transition-colors">
                <Plus size={18} />
                <span>Add Member</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {store.members.map(member => (
                <div key={member.id} className="bg-dark-950 p-6 rounded-xl flex flex-col border border-white/10">
                  <div className="flex items-center space-x-4 mb-4">
                    <img src={member.imageUrl} alt={member.name} className="w-16 h-16 rounded-full object-contain bg-white border border-gold-600/30 p-1" />
                    <div>
                      <h3 className="text-lg text-white font-medium">{member.name}</h3>
                      <p className="text-gold-500 text-xs uppercase">{member.position}</p>
                      {member.groupName && <p className="text-gray-400 text-[10px] uppercase font-semibold">{member.groupName}</p>}
                    </div>
                  </div>
                  {member.bio && <p className="text-gray-400 text-sm mb-4 flex-1">{member.bio}</p>}
                  <button onClick={() => store.removeMember(member.id)} className="flex items-center justify-center space-x-2 text-red-400 hover:bg-red-400/10 py-2 rounded transition-colors border border-red-400/20">
                    <Trash2 size={16} /> <span>Delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NEWS TAB */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-display text-white">Manage News</h2>
              <button onClick={() => openModal('news')} className="flex items-center space-x-2 bg-gold-600 hover:bg-gold-500 text-dark-950 px-4 py-2 rounded-lg font-medium transition-colors">
                <Plus size={18} />
                <span>Add News</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {store.news.map(n => (
                <div key={n.id} className="bg-dark-950 p-6 rounded-xl flex flex-col border border-white/10">
                  <span className="text-xs text-gold-500 mb-2">{n.date} - {n.category}</span>
                  <h3 className="text-xl text-white mb-2">{n.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{n.description}</p>
                  <button onClick={() => store.removeNews(n.id)} className="mt-auto flex items-center justify-center space-x-2 text-red-400 hover:bg-red-400/10 py-2 rounded transition-colors border border-red-400/20 w-fit px-4">
                    <Trash2 size={16} /> <span>Delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        

        {/* CREDENTIALS TAB */}
        {activeTab === 'credentials' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h2 className="text-2xl font-display text-white mb-2">Admin Security</h2>
              <p className="text-gray-400 text-sm">Update your administrator account credentials. Always memorise your new settings.</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCredentialsSuccess('');
                setCredentialsError('');

                const cleanUser = newUsername.trim();
                const cleanPass = newPassword.trim();

                if (!cleanUser) {
                  setCredentialsError('Username cannot be empty.');
                  return;
                }
                if (!cleanPass) {
                  setCredentialsError('Password cannot be empty.');
                  return;
                }
                if (cleanPass !== confirmPassword.trim()) {
                  setCredentialsError('Passwords do not match.');
                  return;
                }

                store.updateCredentials(cleanUser, cleanPass);
                setCredentialsSuccess('Admin credentials updated successfully!');
              }}
              className="space-y-6 bg-dark-950 p-8 rounded-xl border border-white/10"
            >
              {credentialsError && (
                <div className="bg-red-950/40 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg text-sm">
                  {credentialsError}
                </div>
              )}

              {credentialsSuccess && (
                <div className="bg-green-950/40 border border-green-500/30 text-green-500 px-4 py-3 rounded-lg text-sm">
                  {credentialsSuccess}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gold-500 block">
                  Admin Username
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-gold-500 transition-colors"
                  placeholder="Enter administrator username"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gold-500 block">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-gold-500 transition-colors"
                  placeholder="Enter new admin password"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gold-500 block">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-gold-500 transition-colors"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gold-600 hover:bg-gold-500 text-dark-950 px-6 py-3 rounded-lg font-bold transition-colors shadow-lg"
              >
                Save Security Changes
              </button>
            </form>
          </div>
        )}

        {false && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-display text-white">Manage Services</h2>
              <button onClick={() => openModal('services')} className="flex items-center space-x-2 bg-gold-600 hover:bg-gold-500 text-dark-950 px-4 py-2 rounded-lg font-medium transition-colors">
                <Plus size={18} />
                <span>Add Service</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {([] as any[]).map(s => (
                <div key={s.id} className="bg-dark-950 p-6 rounded-xl flex flex-col border border-white/10">
                  <h3 className="text-xl text-white mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{s.description}</p>
                  <button onClick={() => undefined} className="mt-auto flex items-center justify-center space-x-2 text-red-400 hover:bg-red-400/10 py-2 rounded border border-red-400/20 w-fit px-4">
                    <Trash2 size={16} /> <span>Delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}



      </div>

      {isModalOpen && modalConfig && (
        <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-gold-600/30 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col relative shadow-[0_0_50px_rgba(202,138,4,0.1)]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-display text-white">{modalConfig.title}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {modalConfig.fields.map((field: any) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-sm font-bold text-gray-300 block">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <div className="space-y-1">
                      <textarea 
                        className={`w-full bg-dark-950 border rounded-lg p-3 text-white focus:border-gold-500 transition-colors resize-none ${
                          field.wordLimit && getWordCount(formData[field.name]) > field.wordLimit 
                            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                            : 'border-white/10'
                        }`}
                        rows={4}
                        value={formData[field.name] || ''}
                        onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                      />
                      {field.wordLimit && (
                        <div className="flex justify-between items-center text-xs mt-1">
                          <span className={getWordCount(formData[field.name]) > field.wordLimit ? 'text-red-400 font-medium' : 'text-gray-500'}>
                            {getWordCount(formData[field.name]) > field.wordLimit 
                              ? `⚠️ Exceeded word limit by ${getWordCount(formData[field.name]) - field.wordLimit} words` 
                              : `Max limit: ${field.wordLimit} words`}
                          </span>
                          <span className={`${
                            getWordCount(formData[field.name]) > field.wordLimit 
                              ? 'text-red-400 font-bold' 
                              : getWordCount(formData[field.name]) >= field.wordLimit - 5 
                                ? 'text-gold-400 font-medium' 
                                : 'text-gray-400'
                          }`}>
                            {getWordCount(formData[field.name])} / {field.wordLimit} words
                          </span>
                        </div>
                      )}
                    </div>
                  ) : field.type === 'color' ? (
                    <div className="flex items-center space-x-3">
                      <input 
                        type="color"
                        value={formData[field.name] || '#000000'}
                        onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                        className="w-12 h-12 bg-dark-950 rounded cursor-pointer border border-white/10"
                      />
                      <span className="text-gray-400">{formData[field.name] || '#000000'}</span>
                    </div>
                  ) : field.type === 'image' ? (
                    <div className="space-y-4">
                      {formData[field.name] && (
                        <img 
                          src={formData[field.name]} 
                          alt="Preview" 
                          className="w-full max-h-40 object-contain rounded-lg border border-white/10 bg-dark-950"
                        />
                      )}
                      <input 
                        type="file"
                        accept="image/*"
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-colors cursor-pointer text-ellipsis overflow-hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData(prev => ({...prev, [field.name]: reader.result as string}));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <input 
                      type={field.type || 'text'}
                      className="w-full bg-dark-950 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 transition-colors"
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-white/10 flex justify-end space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg text-gray-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={!isFormValid()}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isFormValid() 
                    ? 'bg-gold-600 hover:bg-gold-500 text-dark-950 cursor-pointer' 
                    : 'bg-white/10 text-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
