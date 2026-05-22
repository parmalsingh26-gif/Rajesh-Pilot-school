import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Image as ImageIcon, Bell, Users, FileText, Plus, Trash2, Edit, Activity, BarChart3, Save, ArrowUp, ArrowDown, Settings, Mail, Check, Download, GraduationCap, Database, Bot, HelpCircle, Briefcase, ToggleLeft, ToggleRight } from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<{ username: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => setUser(data.user))
      .catch(() => navigate('/admin/login'));
  }, [navigate]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    navigate('/admin/login');
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-blue-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <LayoutDashboard />
            Admin Panel
          </h2>
          <p className="text-blue-300 text-sm mt-1">Rajesh Pilot School</p>
          <p className="text-blue-400 text-xs mt-0.5">Welcome, {user.username}</p>
        </div>
        <nav className="flex-1 py-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${activeTab === 'dashboard' ? 'bg-blue-800 border-l-4 border-white' : 'hover:bg-blue-800/50'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('sliders')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${activeTab === 'sliders' ? 'bg-blue-800 border-l-4 border-white' : 'hover:bg-blue-800/50'}`}
          >
            <ImageIcon size={20} /> Hero Sliders
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${activeTab === 'gallery' ? 'bg-blue-800 border-l-4 border-white' : 'hover:bg-blue-800/50'}`}
          >
            <ImageIcon size={20} /> Media Gallery
          </button>
          <button
            onClick={() => setActiveTab('tickers')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${activeTab === 'tickers' ? 'bg-blue-800 border-l-4 border-white' : 'hover:bg-blue-800/50'}`}
          >
            <Bell size={20} /> News Ticker
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${activeTab === 'notifications' ? 'bg-blue-800 border-l-4 border-white' : 'hover:bg-blue-800/50'}`}
          >
            <FileText size={20} /> Notifications
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${activeTab === 'pages' ? 'bg-blue-800 border-l-4 border-white' : 'hover:bg-blue-800/50'}`}
          >
            <FileText size={20} /> Pages
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${activeTab === 'results' ? 'bg-blue-800 border-l-4 border-white' : 'hover:bg-blue-800/50'}`}
          >
            <GraduationCap size={20} /> Results
          </button>
          <button
            onClick={() => setActiveTab('officers')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${activeTab === 'officers' ? 'bg-blue-800 border-l-4 border-white' : 'hover:bg-blue-800/50'}`}
          >
            <Users size={20} /> Staff & Teachers
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${activeTab === 'stats' ? 'bg-blue-800 border-l-4 border-white' : 'hover:bg-blue-800/50'}`}
          >
            <BarChart3 size={20} /> School Stats
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${activeTab === 'messages' ? 'bg-blue-800 border-l-4 border-white' : 'hover:bg-blue-800/50'}`}
          >
            <Mail size={20} /> Enquiries
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${activeTab === 'faqs' ? 'bg-blue-800 border-l-4 border-white' : 'hover:bg-blue-800/50'}`}
          >
            <HelpCircle size={20} /> FAQ Manager
          </button>
          <button
            onClick={() => setActiveTab('careers')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${activeTab === 'careers' ? 'bg-blue-800 border-l-4 border-white' : 'hover:bg-blue-800/50'}`}
          >
            <Briefcase size={20} /> Career / Jobs
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${activeTab === 'settings' ? 'bg-blue-800 border-l-4 border-white' : 'hover:bg-blue-800/50'}`}
          >
            <Settings size={20} /> Settings
          </button>
        </nav>
        <div className="p-4 border-t border-blue-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[calc(100vh-4rem)]">
          {activeTab === 'dashboard' && <MainDashboard />}
          {activeTab === 'sliders' && <SliderManager />}
          {activeTab === 'gallery' && <GalleryManager />}
          {activeTab === 'tickers' && <TickerManager />}
          {activeTab === 'notifications' && <NotificationManager />}
          {activeTab === 'pages' && <PageManager />}
          {activeTab === 'results' && <ResultsManager />}
          {activeTab === 'officers' && <OfficerManager />}
          {activeTab === 'stats' && <StatsManager />}
          {activeTab === 'messages' && <MessagesManager />}
          {activeTab === 'faqs' && <FAQManager />}
          {activeTab === 'careers' && <CareerManager />}
          {activeTab === 'settings' && <SettingsManager />}
        </div>
      </main>
    </div>
  );
}

// --- Sub Components ---

const CHART_COLORS = { emerald: '#059669', blue: '#2563eb', purple: '#7c3aed' };
const PIE_COLORS = [CHART_COLORS.emerald, CHART_COLORS.blue];

function MainDashboard() {
  const [stats, setStats] = useState({ totalPdfs: 0, totalSliders: 0, totalNews: 0 });
  const [logs, setLogs] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<{
    notificationsByCategory: { name: string; value: number }[];
    resultsByCategory: { name: string; value: number }[];
    messagesStats: { name: string; value: number }[];
  } | null>(null);

  useEffect(() => {
    fetch('/api/admin/quick-stats').then(res => res.json()).then(setStats);
    fetch('/api/admin/activity-logs').then(res => res.json()).then(setLogs);
    fetch('/api/admin/analytics')
      .then(res => res.ok ? res.json() : null)
      .then(setAnalytics)
      .catch(() => setAnalytics(null));
  }, []);

  // Combine notifications and results by category for bar chart (union of categories)
  const categoryMap = new Map<string, { name: string; notifications: number; results: number }>();
  (analytics?.notificationsByCategory ?? []).forEach(({ name, value }) => {
    categoryMap.set(name, { name, notifications: value, results: categoryMap.get(name)?.results ?? 0 });
  });
  (analytics?.resultsByCategory ?? []).forEach(({ name, value }) => {
    const existing = categoryMap.get(name);
    categoryMap.set(name, {
      name,
      notifications: existing?.notifications ?? 0,
      results: value,
    });
  });
  const barChartData = Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Dashboard Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-center gap-4">
          <div className="bg-blue-600 text-white p-4 rounded-lg"><FileText size={24} /></div>
          <div>
            <p className="text-sm text-blue-600 font-medium uppercase tracking-wide">Total PDFs</p>
            <p className="text-3xl font-bold text-slate-800">{stats.totalPdfs}</p>
          </div>
        </div>
        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 flex items-center gap-4">
          <div className="bg-emerald-600 text-white p-4 rounded-lg"><ImageIcon size={24} /></div>
          <div>
            <p className="text-sm text-emerald-600 font-medium uppercase tracking-wide">Slider Images</p>
            <p className="text-3xl font-bold text-slate-800">{stats.totalSliders}</p>
          </div>
        </div>
        <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 flex items-center gap-4">
          <div className="bg-amber-600 text-white p-4 rounded-lg"><Bell size={24} /></div>
          <div>
            <p className="text-sm text-amber-600 font-medium uppercase tracking-wide">News Flashes</p>
            <p className="text-3xl font-bold text-slate-800">{stats.totalNews}</p>
          </div>
        </div>
      </div>

      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h4 className="text-lg font-bold text-slate-800 mb-4">Notifications & Results by Category</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="notifications" name="Notifications" fill={CHART_COLORS.blue} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="results" name="Results" fill={CHART_COLORS.purple} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h4 className="text-lg font-bold text-slate-800 mb-4">Messages: Read vs Unread</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.messagesStats}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {analytics.messagesStats.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Activity size={20} className="text-blue-600" /> Recent Activity
      </h4>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <ul className="divide-y divide-slate-100">
          {logs.map(log => (
            <li key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
              <div>
                <p className="font-medium text-slate-800">{log.action}</p>
                <p className="text-sm text-slate-500">{log.details}</p>
              </div>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">
                {new Date(log.timestamp.replace(' ', 'T')).toLocaleString('en-IN')}
              </span>
            </li>
          ))}
          {logs.length === 0 && <li className="p-4 text-slate-500 text-center">No recent activity</li>}
        </ul>
      </div>
    </div>
  );
}

function SliderManager() {
  const [sliders, setSliders] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const fetchSliders = () => fetch('/api/sliders').then(res => res.json()).then(setSliders);
  useEffect(() => { fetchSliders(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Please select an image');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', file);
    formData.append('orderIndex', sliders.length.toString());

    await fetch('/api/sliders', { method: 'POST', body: formData });
    setTitle('');
    setFile(null);
    fetchSliders();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/sliders/${id}`, { method: 'DELETE' });
    fetchSliders();
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sliders.length) return;
    const reordered = [...sliders];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    const payload = reordered.map((item, i) => ({ id: item.id, orderIndex: i }));
    await fetch('/api/sliders/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    fetchSliders();
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Manage Hero Sliders</h3>
      <form onSubmit={handleAdd} className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title (Optional)</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="Slide Title" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Image File</label>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full border border-slate-300 rounded-lg px-3 py-1.5 bg-white" required />
          </div>
        </div>
        <button type="submit" className="self-start bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus size={18} /> Add Slide
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sliders.map((slider, index) => (
          <div key={slider.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <img src={slider.imageUrl} alt={slider.title} className="w-full h-40 object-cover" />
            <div className="p-4 flex justify-between items-center gap-2">
              <span className="font-medium text-slate-700 truncate min-w-0">{slider.title || 'Untitled'}</span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleReorder(index, 'up')}
                  disabled={index === 0}
                  className="p-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  title="Move up"
                >
                  <ArrowUp size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleReorder(index, 'down')}
                  disabled={index === sliders.length - 1}
                  className="p-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  title="Move down"
                >
                  <ArrowDown size={18} />
                </button>
                <button onClick={() => handleDelete(slider.id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg" title="Delete"><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TickerManager() {
  const [tickers, setTickers] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);

  const fetchTickers = () => fetch('/api/admin/tickers').then(res => res.json()).then(setTickers);
  useEffect(() => { fetchTickers(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;
    await fetch('/api/tickers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, isActive: true })
    });
    setText('');
    fetchTickers();
  };

  const handleEnhanceWithAI = async () => {
    const input = text.trim();
    if (!input) {
      alert('Please enter some text to enhance first.');
      return;
    }
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/ai/enhance-ticker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.error || 'Failed to enhance text. Please try again.');
        return;
      }
      if (data.enhancedText) setText(data.enhancedText);
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/tickers/${id}`, { method: 'DELETE' });
    fetchTickers();
  };

  const handleToggleActive = async (id: number, currentActive: boolean) => {
    await fetch(`/api/tickers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !currentActive }),
    });
    fetchTickers();
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Manage News Ticker</h3>
      <form onSubmit={handleAdd} className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-slate-700 mb-1">News Text</label>
          <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="Enter breaking news..." required />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleEnhanceWithAI}
            disabled={isEnhancing}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 h-[42px] disabled:cursor-not-allowed transition-colors"
          >
            {isEnhancing ? '✨ Enhancing...' : '✨ Enhance with AI'}
          </button>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 h-[42px]">
            <Plus size={18} /> Add
          </button>
        </div>
      </form>

      <ul className="space-y-3">
        {tickers.map(ticker => {
          const isActive = !!ticker.isActive;
          return (
            <li key={ticker.id} className="flex justify-between items-center gap-4 p-4 border border-slate-200 rounded-lg bg-white shadow-sm">
              <span className={clsx('flex-1 min-w-0', !isActive && 'text-slate-400 line-through')}>{ticker.text}</span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  role="switch"
                  aria-checked={isActive}
                  aria-label={isActive ? 'Mark inactive' : 'Mark active'}
                  onClick={() => handleToggleActive(ticker.id, isActive)}
                  className={clsx(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2',
                    isActive ? 'bg-blue-600' : 'bg-slate-300'
                  )}
                >
                  <span
                    className={clsx(
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition',
                      isActive ? 'translate-x-5' : 'translate-x-0.5'
                    )}
                  />
                </button>
                <button onClick={() => handleDelete(ticker.id)} className="text-red-500 hover:text-red-700 p-2" title="Delete"><Trash2 size={18} /></button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function NotificationManager() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [file, setFile] = useState<File | null>(null);

  const fetchNotifications = () => fetch('/api/notifications?limit=100').then(res => res.json()).then(data => setNotifications(data.notifications || []));
  useEffect(() => { fetchNotifications(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return alert('Please provide title and PDF');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('pdf', file);

    await fetch('/api/notifications', { method: 'POST', body: formData });
    setTitle('');
    setCategory('General');
    setFile(null);
    fetchNotifications();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
    fetchNotifications();
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Manage Notifications & Circulars</h3>
      <form onSubmit={handleAdd} className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notification Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="e.g. Promotion Order 2024" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white">
              <option value="General">General</option>
              <option value="Admission">Admission</option>
              <option value="Examination">Examination</option>
              <option value="Events">Events</option>
              <option value="Holiday Notice">Holiday Notice</option>
              <option value="Academic">Academic</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">PDF File</label>
            <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full border border-slate-300 rounded-lg px-3 py-1.5 bg-white" required />
          </div>
        </div>
        <button type="submit" className="self-start bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus size={18} /> Publish Notification
        </button>
      </form>

      <ul className="space-y-3">
        {notifications.map(notif => (
          <li key={notif.id} className="flex justify-between items-center p-4 border border-slate-200 rounded-lg bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={24} />
              <div>
                <p className="font-semibold text-slate-800">{notif.title}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">{notif.category}</span>
                  <a href={notif.pdfUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View PDF</a>
                </div>
              </div>
            </div>
            <button onClick={() => handleDelete(notif.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18} /></button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GalleryManager() {
  const [images, setImages] = useState<any[]>([]);
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const fetchImages = () => fetch('/api/gallery').then(res => res.json()).then(setImages);
  useEffect(() => { fetchImages(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Please select an image');
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('image', file);

    await fetch('/api/gallery', { method: 'POST', body: formData });
    setCaption('');
    setFile(null);
    fetchImages();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    fetchImages();
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Manage Media Gallery</h3>
      <form onSubmit={handleAdd} className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Caption (Optional)</label>
            <input type="text" value={caption} onChange={e => setCaption(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="Image Caption" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Image File</label>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full border border-slate-300 rounded-lg px-3 py-1.5 bg-white" required />
          </div>
        </div>
        <button type="submit" className="self-start bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus size={18} /> Add to Gallery
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map(img => (
          <div key={img.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <img src={img.imageUrl} alt={img.caption} className="w-full h-40 object-cover" />
            <div className="p-4 flex justify-between items-center">
              <span className="font-medium text-slate-700 truncate pr-4 text-sm">{img.caption || 'No caption'}</span>
              <button onClick={() => handleDelete(img.id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsManager() {
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/stats').then(res => res.json()).then(setStats);
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/stats', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stats })
    });
    alert('Stats updated successfully!');
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newStats = [...stats];
    newStats[index][field] = value;
    setStats(newStats);
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Manage School Stats</h3>
      <form onSubmit={handleUpdate} className="space-y-6">
        {stats.map((stat, index) => (
          <div key={stat.id} className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Label</label>
              <input type="text" value={stat.label} onChange={e => handleChange(index, 'label', e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2" required />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Value</label>
              <input type="text" value={stat.value} onChange={e => handleChange(index, 'value', e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 font-bold" required />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Icon Name (Lucide)</label>
              <input type="text" value={stat.icon} onChange={e => handleChange(index, 'icon', e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 font-mono text-sm" required />
            </div>
          </div>
        ))}
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2">
          <Save size={20} /> Save All Stats
        </button>
      </form>
    </div>
  );
}

const PAGE_SLUG_OPTIONS = [
  { value: 'about-history', label: 'About › History' },
  { value: 'about-vision-mission', label: 'About › Vision & Mission' },
  { value: 'about-our-team', label: 'About › Our Team' },
  { value: 'academics-curriculum', label: 'Academics › Curriculum' },
  { value: 'academics-subjects', label: 'Academics › Subjects' },
  { value: 'academics-timetable', label: 'Academics › Timetable' },
  { value: 'admissions-process', label: 'Admissions › Process' },
  { value: 'admissions-fee-structure', label: 'Admissions › Fee Structure' },
  { value: 'school-life-initiatives', label: 'School Life › Initiatives' },
  { value: 'school-life-transport', label: 'School Life › Transport Policy' },
];

function PageManager() {
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadPage = (selectedSlug: string) => {
    if (!selectedSlug) {
      setTitle('');
      setContent('');
      return;
    }
    setLoading(true);
    fetch(`/api/pages/${selectedSlug}`)
      .then((res) => {
        if (res.ok) return res.json();
        setTitle('');
        setContent('');
      })
      .then((data) => {
        if (data?.page) {
          setTitle(data.page.title);
          setContent(data.page.content ?? '');
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (slug) loadPage(slug);
  }, [slug]);

  const handleSlugChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSlug(e.target.value);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/pages/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), content }),
      });
      alert('Page saved successfully.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Manage Pages</h3>
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Select page to edit</label>
        <select
          value={slug}
          onChange={handleSlugChange}
          className="w-full max-w-md border border-slate-300 rounded-lg px-3 py-2 bg-white"
        >
          <option value="">— Choose a page —</option>
          {PAGE_SLUG_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      {slug && (
        <form onSubmit={handleSave} className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4 max-w-3xl">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 disabled:opacity-60"
              placeholder="Page title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              rows={12}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 resize-y disabled:opacity-60"
              placeholder="Page content (line breaks will be preserved)"
            />
          </div>
          <button
            type="submit"
            disabled={loading || saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </form>
      )}
    </div>
  );
}

function OfficerManager() {
  const [officers, setOfficers] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [addName, setAddName] = useState('');
  const [addDesignation, setAddDesignation] = useState('');
  const [addOrderIndex, setAddOrderIndex] = useState(0);
  const [addFile, setAddFile] = useState<File | null>(null);

  const fetchOfficers = () => fetch('/api/officers').then(res => res.json()).then(setOfficers);
  useEffect(() => { fetchOfficers(); }, []);

  const handleEdit = (officer: any) => {
    setEditingId(officer.id);
    setName(officer.name);
    setDesignation(officer.designation);
    setFile(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFile || !addName.trim() || !addDesignation.trim()) return alert('Name, designation, and image are required');
    const formData = new FormData();
    formData.append('name', addName.trim());
    formData.append('designation', addDesignation.trim());
    formData.append('orderIndex', String(addOrderIndex));
    formData.append('image', addFile);
    await fetch('/api/officers', { method: 'POST', body: formData });
    setAddName('');
    setAddDesignation('');
    setAddOrderIndex(officers.length);
    setAddFile(null);
    fetchOfficers();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this officer?')) return;
    await fetch(`/api/officers/${id}`, { method: 'DELETE' });
    fetchOfficers();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('designation', designation);
    if (file) formData.append('image', file);

    await fetch(`/api/officers/${editingId}`, { method: 'PUT', body: formData });
    setEditingId(null);
    fetchOfficers();
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= officers.length) return;
    const reordered = [...officers];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    const payload = reordered.map((item, i) => ({ id: item.id, orderIndex: i }));
    await fetch('/api/officers/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    fetchOfficers();
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Manage Staff & Teachers</h3>

      <form onSubmit={handleAdd} className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 flex flex-col gap-4">
        <h4 className="font-semibold text-slate-800">Add New Staff / Teacher</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
            <input type="text" value={addName} onChange={e => setAddName(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="Full name" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Designation *</label>
            <input type="text" value={addDesignation} onChange={e => setAddDesignation(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="e.g. PGT Mathematics" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Order</label>
            <input type="number" min={0} value={addOrderIndex} onChange={e => setAddOrderIndex(Number(e.target.value) || 0)} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Photo *</label>
            <input type="file" accept="image/*" onChange={e => setAddFile(e.target.files?.[0] || null)} className="w-full border border-slate-300 rounded-lg px-3 py-1.5 bg-white" required />
          </div>
        </div>
        <button type="submit" className="self-start bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus size={18} /> Add Officer
        </button>
      </form>
      
      {editingId && (
        <form onSubmit={handleUpdate} className="bg-blue-50 p-6 rounded-xl border border-blue-200 mb-8 flex flex-col gap-4">
          <h4 className="font-semibold text-blue-900">Edit Officer Profile</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Designation</label>
              <input type="text" value={designation} onChange={e => setDesignation(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">New Photo (Optional)</label>
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full border border-slate-300 rounded-lg px-3 py-1.5 bg-white" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">Save Changes</button>
            <button type="button" onClick={() => setEditingId(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-2 rounded-lg font-medium">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {officers.map((officer, index) => (
          <div key={officer.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
            <img src={officer.imageUrl} alt={officer.name} className="w-full h-48 object-cover" />
            <div className="p-4 flex-1 flex flex-col">
              <h4 className="font-bold text-slate-800">{officer.name}</h4>
              <p className="text-sm text-blue-600 mb-4">{officer.designation}</p>
              <div className="mt-auto flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleReorder(index, 'up')}
                  disabled={index === 0}
                  className="p-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  title="Move up"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleReorder(index, 'down')}
                  disabled={index === officers.length - 1}
                  className="p-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  title="Move down"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  onClick={() => handleEdit(officer)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg transition-colors"
                >
                  <Edit size={16} /> Edit Profile
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(officer.id)}
                  className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultsManager() {
  const [results, setResults] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Class X');
  const [file, setFile] = useState<File | null>(null);

  const fetchResults = () => fetch('/api/results?limit=100').then(res => res.json()).then(data => setResults(data.results || []));
  useEffect(() => { fetchResults(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return alert('Please provide title and PDF');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('pdf', file);
    await fetch('/api/results', { method: 'POST', body: formData });
    setTitle('');
    setCategory('Class X');
    setFile(null);
    fetchResults();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/results/${id}`, { method: 'DELETE' });
    fetchResults();
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Manage Student Results</h3>
      <form onSubmit={handleAdd} className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="e.g. LDCE 2024 Results" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white">
              <option value="Class X">Class X</option>
              <option value="Class XII">Class XII</option>
              <option value="Internal Exam">Internal Exam</option>
              <option value="Merit List">Merit List</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">PDF File</label>
            <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full border border-slate-300 rounded-lg px-3 py-1.5 bg-white" required />
          </div>
        </div>
        <button type="submit" className="self-start bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus size={18} /> Publish Result
        </button>
      </form>

      <ul className="space-y-3">
        {results.map((item) => (
          <li key={item.id} className="flex justify-between items-center p-4 border border-slate-200 rounded-lg bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={24} />
              <div>
                <p className="font-semibold text-slate-800">{item.title}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">{item.category}</span>
                  <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View PDF</a>
                </div>
              </div>
            </div>
            <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18} /></button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MessagesManager() {
  const [messages, setMessages] = useState<any[]>([]);

  const fetchMessages = () => fetch('/api/admin/messages').then(res => res.json()).then(setMessages);
  useEffect(() => { fetchMessages(); }, []);

  const handleMarkRead = async (id: number) => {
    await fetch(`/api/admin/messages/${id}/read`, { method: 'PUT' });
    fetchMessages();
  };

  const escapeCsvField = (value: unknown): string => {
    const str = value == null ? '' : String(value);
    return '"' + str.replace(/"/g, '""') + '"';
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Subject', 'Message', 'Date', 'Status'];
    const rows = messages.map((msg) => [
      escapeCsvField(msg.name),
      escapeCsvField(msg.email),
      escapeCsvField(msg.subject ?? ''),
      escapeCsvField(msg.message ?? ''),
      escapeCsvField(msg.createdAt ? new Date(msg.createdAt.replace(' ', 'T')).toLocaleString('en-IN') : ''),
      escapeCsvField(msg.isRead ? 'Read' : 'Unread'),
    ]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workshop_enquiries.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b pb-4">
        <h3 className="text-2xl font-bold text-slate-800">Enquiries & Messages</h3>
        <button
          type="button"
          onClick={exportToCSV}
          disabled={messages.length === 0}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shrink-0"
        >
          <Download size={18} /> Export to CSV
        </button>
      </div>
      {messages.length === 0 ? (
        <p className="text-slate-500 py-8">No messages yet.</p>
      ) : (
        <ul className="space-y-3">
          {messages.map((msg) => {
            const unread = !msg.isRead;
            return (
              <li
                key={msg.id}
                className={clsx(
                  'border rounded-xl p-4 transition-colors',
                  unread
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                )}
              >
                <div className="flex justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={clsx('font-semibold text-slate-800 dark:text-slate-200', unread && 'font-bold')}>
                        {msg.name}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{msg.email}</span>
                      {msg.subject && (
                        <span className="text-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                          {msg.subject}
                        </span>
                      )}
                    </div>
                    <p className={clsx('mt-2 text-slate-600 dark:text-slate-400 text-sm whitespace-pre-wrap', unread && 'font-medium')}>
                      {msg.message}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                      {new Date(msg.createdAt?.replace(' ', 'T')).toLocaleString('en-IN')}
                    </p>
                  </div>
                  {unread && (
                    <button
                      type="button"
                      onClick={() => handleMarkRead(msg.id)}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                      title="Mark as read"
                    >
                      <Check size={16} /> Mark as Read
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function SettingsManager() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [aiModels, setAiModels] = useState<string[]>([]);
  const [selectedAiModel, setSelectedAiModel] = useState('');
  const [aiModelsLoading, setAiModelsLoading] = useState(false);
  const [aiSaveLoading, setAiSaveLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    setAiModelsLoading(true);
    setAiError('');
    Promise.all([
      fetch('/api/admin/ai-models').then((r) => r.json()),
      fetch('/api/admin/settings/ai').then((r) => r.json()),
    ])
      .then(([modelsRes, settingsRes]) => {
        const models = Array.isArray(modelsRes?.models) ? modelsRes.models : [];
        if (modelsRes?.error) setAiError(modelsRes.error);
        setAiModels(models);
        const current = typeof settingsRes?.modelName === 'string' ? settingsRes.modelName : '';
        setSelectedAiModel(current && models.includes(current) ? current : models[0] || '');
      })
      .catch(() => setAiError('Failed to load AI settings.'))
      .finally(() => setAiModelsLoading(false));
  }, []);

  const handleSaveAiModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAiModel) return;
    setAiSaveLoading(true);
    setAiError('');
    try {
      const res = await fetch('/api/admin/settings/ai', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelName: selectedAiModel }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiError(data?.error || 'Failed to save.');
        return;
      }
      setAiError('');
    } catch {
      setAiError('Network error. Please try again.');
    } finally {
      setAiSaveLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Failed to update password.');
        return;
      }
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Settings</h3>
      <div className="max-w-md">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Change Password</h4>
        <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
              Password updated successfully.
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
              placeholder="Enter current password"
              required
              autoComplete="current-password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
              placeholder="At least 6 characters"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
              placeholder="Re-enter new password"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      <div className="mt-10 max-w-md">
        <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Bot size={22} className="text-blue-600" /> AI Configuration
        </h4>
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
          {aiError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {aiError}
            </div>
          )}
          {aiModelsLoading ? (
            <p className="text-sm text-slate-600">Loading available models...</p>
          ) : (
            <form onSubmit={handleSaveAiModel} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">AI Model (Ticker &amp; School Mitra)</label>
                <select
                  value={selectedAiModel}
                  onChange={(e) => setSelectedAiModel(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900"
                  disabled={aiModels.length === 0}
                >
                  {aiModels.length === 0 && <option value="">No models available (check GEMINI_API_KEY)</option>}
                  {aiModels.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={aiSaveLoading || aiModels.length === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save size={18} /> {aiSaveLoading ? 'Saving...' : 'Save AI Model'}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="mt-10 max-w-md">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Data Management</h4>
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-600 mb-4">Download a full copy of the system database for backup or audit purposes.</p>
          <a
            href="/api/admin/backup"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            <Database size={18} />
            <Download size={18} />
            Download System Backup
          </a>
        </div>
      </div>
    </div>
  );
}

function FAQManager() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQ, setEditQ] = useState('');
  const [editA, setEditA] = useState('');

  const fetchFaqs = () => fetch('/api/faqs').then(res => res.json()).then(setFaqs);
  useEffect(() => { fetchFaqs(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return alert('Question and answer are required');
    await fetch('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: question.trim(), answer: answer.trim(), orderIndex: faqs.length }),
    });
    setQuestion('');
    setAnswer('');
    fetchFaqs();
  };

  const handleEdit = (faq: any) => { setEditingId(faq.id); setEditQ(faq.question); setEditA(faq.answer); };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    await fetch(`/api/faqs/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: editQ, answer: editA }),
    });
    setEditingId(null);
    fetchFaqs();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this FAQ?')) return;
    await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
    fetchFaqs();
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Manage FAQs</h3>
      <form onSubmit={handleAdd} className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 flex flex-col gap-4">
        <h4 className="font-semibold text-slate-800">Add New FAQ</h4>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Question *</label>
          <input type="text" value={question} onChange={e => setQuestion(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="Enter the question" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Answer *</label>
          <textarea value={answer} onChange={e => setAnswer(e.target.value)} rows={4} className="w-full border border-slate-300 rounded-lg px-3 py-2 resize-y" placeholder="Enter the answer" required />
        </div>
        <button type="submit" className="self-start bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus size={18} /> Add FAQ
        </button>
      </form>

      {editingId && (
        <form onSubmit={handleUpdate} className="bg-blue-50 p-6 rounded-xl border border-blue-200 mb-8 flex flex-col gap-4">
          <h4 className="font-semibold text-blue-900">Edit FAQ</h4>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Question</label>
            <input type="text" value={editQ} onChange={e => setEditQ(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Answer</label>
            <textarea value={editA} onChange={e => setEditA(e.target.value)} rows={4} className="w-full border border-slate-300 rounded-lg px-3 py-2 resize-y" required />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">Save Changes</button>
            <button type="button" onClick={() => setEditingId(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-2 rounded-lg font-medium">Cancel</button>
          </div>
        </form>
      )}

      <ul className="space-y-4">
        {faqs.map((faq, index) => (
          <li key={faq.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-bold text-slate-800 mb-1">Q{index + 1}. {faq.question}</p>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{faq.answer}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => handleEdit(faq)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50" title="Edit"><Edit size={18} /></button>
                <button onClick={() => handleDelete(faq.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50" title="Delete"><Trash2 size={18} /></button>
              </div>
            </div>
          </li>
        ))}
        {faqs.length === 0 && <li className="text-slate-500 text-center py-8">No FAQs yet. Add one above.</li>}
      </ul>
    </div>
  );
}

function CareerManager() {
  const [careers, setCareers] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', department: '', qualification: '', experience: '', deadline: '', description: '', isActive: true });
  const [addForm, setAddForm] = useState({ title: '', department: '', qualification: '', experience: 'Fresher', deadline: '', description: '' });

  const fetchCareers = () => fetch('/api/admin/careers').then(res => res.json()).then(setCareers);
  useEffect(() => { fetchCareers(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.title.trim() || !addForm.department.trim()) return alert('Title and department are required');
    await fetch('/api/careers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addForm),
    });
    setAddForm({ title: '', department: '', qualification: '', experience: 'Fresher', deadline: '', description: '' });
    fetchCareers();
  };

  const handleEdit = (career: any) => {
    setEditingId(career.id);
    setForm({ title: career.title, department: career.department, qualification: career.qualification, experience: career.experience, deadline: career.deadline || '', description: career.description || '', isActive: !!career.isActive });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    await fetch(`/api/careers/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setEditingId(null);
    fetchCareers();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this vacancy?')) return;
    await fetch(`/api/careers/${id}`, { method: 'DELETE' });
    fetchCareers();
  };

  const handleToggle = async (career: any) => {
    await fetch(`/api/careers/${career.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...career, isActive: !career.isActive }),
    });
    fetchCareers();
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Manage Career Vacancies</h3>
      <form onSubmit={handleAdd} className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 flex flex-col gap-4">
        <h4 className="font-semibold text-slate-800">Post New Vacancy</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job Title *</label>
            <input type="text" value={addForm.title} onChange={e => setAddForm({...addForm, title: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="e.g. PGT Mathematics" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Department *</label>
            <input type="text" value={addForm.department} onChange={e => setAddForm({...addForm, department: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="e.g. Mathematics" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Qualification Required</label>
            <input type="text" value={addForm.qualification} onChange={e => setAddForm({...addForm, qualification: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="e.g. M.Sc. + B.Ed." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Experience</label>
            <input type="text" value={addForm.experience} onChange={e => setAddForm({...addForm, experience: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="e.g. 2+ years" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Application Deadline</label>
            <input type="date" value={addForm.deadline} onChange={e => setAddForm({...addForm, deadline: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Job Description</label>
          <textarea value={addForm.description} onChange={e => setAddForm({...addForm, description: e.target.value})} rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 resize-y" placeholder="Job description, responsibilities, requirements..." />
        </div>
        <button type="submit" className="self-start bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus size={18} /> Post Vacancy
        </button>
      </form>

      {editingId && (
        <form onSubmit={handleUpdate} className="bg-blue-50 p-6 rounded-xl border border-blue-200 mb-8 flex flex-col gap-4">
          <h4 className="font-semibold text-blue-900">Edit Vacancy</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
              <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <input type="text" value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Qualification</label>
              <input type="text" value={form.qualification} onChange={e => setForm({...form, qualification: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Experience</label>
              <input type="text" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
              <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <label className="text-sm font-medium text-slate-700">Mark as Active</label>
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="w-4 h-4 accent-blue-600" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 resize-y" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">Save Changes</button>
            <button type="button" onClick={() => setEditingId(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-2 rounded-lg font-medium">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {careers.map(career => (
          <div key={career.id} className={`bg-white border rounded-xl p-5 shadow-sm ${career.isActive ? 'border-slate-200' : 'border-slate-100 opacity-60'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h4 className="font-bold text-slate-800">{career.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${career.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {career.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-blue-600 mb-2">{career.department}</p>
                <div className="text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                  {career.qualification && <span>📚 {career.qualification}</span>}
                  {career.experience && <span>⏱ {career.experience}</span>}
                  {career.deadline && <span>📅 Deadline: {career.deadline}</span>}
                </div>
                {career.description && <p className="text-sm text-slate-600 mt-2">{career.description}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => handleToggle(career)} className={`p-2 rounded-lg ${career.isActive ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'}`} title={career.isActive ? 'Deactivate' : 'Activate'}>
                  {career.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                </button>
                <button onClick={() => handleEdit(career)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50" title="Edit"><Edit size={18} /></button>
                <button onClick={() => handleDelete(career.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50" title="Delete"><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
        {careers.length === 0 && <p className="text-slate-500 text-center py-8">No career vacancies posted yet.</p>}
      </div>
    </div>
  );
}
