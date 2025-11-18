'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  LogOut,
  Users,
  TrendingUp,
  Loader2,
  Package,
  Plus,
  X,
  Search,
  Edit,
  Trash2,
  AlertCircle,
  UserPlus,
  UserCog,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
interface Buyer {
  buyerCode: string;
  buyerName: string;
  vatNo: string;
  address: string;
  contactPerson: string;
  phoneNo: string;
  mobBuyer: string;
  frequent: string;
  svatNo: string;
  vatType: string;
  bGrantee: boolean;
}

interface Sale {
  date: string;
  total: number;
}

interface PendingSale {
  id: number;
  date: string;
  total: number;
  status: string;
  // Add more fields as your backend returns
}

interface Edo {
  name?: string;
  edoName?: string;
  count?: number;
  total?: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  buyerCode: string;
  roleId: number;
}

interface CreateBuyerForm {
  buyerCode: string;
  buyerName: string;
  vatNo: string;
  address: string;
  contactPerson: string;
  phoneNo: string;
  mobBuyer: string;
  frequent: string;
  svatNo: string;
  vatType: string;
  bGrantee: boolean;
}

interface CreateUserForm {
  name: string;
  email: string;
  password: string;
  buyerCode: string;
  roleId: number;
}

interface UpdateUserForm {
  name: string;
  email: string;
  buyerCode: string;
  roleId: number;
}

/* ------------------------------------------------------------------ */
/*  CSS Styles                                                        */
/* ------------------------------------------------------------------ */
const styles = `
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}

.neu {
  background: linear-gradient(145deg, #1e293b, #334155);
  border-radius: 16px;
  box-shadow: 5px 5px 10px #0f172a, -5px -5px 10px #334155;
}

.input {
  width: 100%;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  transition: all 0.2s;
}

.input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

.input::placeholder {
  color: #94a3b8;
}

.btn {
  position: relative;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(45deg, #8b5cf6, #6366f1);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(45deg, #7c3aed, #4f46e5);
  transform: translateY(-1px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.btn-danger {
  background: linear-gradient(45deg, #ef4444, #dc2626);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: linear-gradient(45deg, #dc2626, #b91c1c);
  transform: translateY(-1px);
}

.btn-indigo {
  background: linear-gradient(45deg, #6366f1, #4f46e5);
  color: white;
}

.btn-indigo:hover:not(:disabled) {
  background: linear-gradient(45deg, #4f46e5, #4338ca);
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}
`;

/* ------------------------------------------------------------------ */
/*  Re‑usable UI Atoms                                                */
/* ------------------------------------------------------------------ */
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-700/50 rounded-xl ${className}`} />
);

const Stat = ({
  icon: Icon,
  title,
  value,
  loading,
  grad,
}: {
  icon: React.ElementType;
  title: string;
  value: React.ReactNode;
  loading?: boolean;
  grad: string;
}) => (
  <motion.div whileHover={{ scale: 1.03 }} className="neu p-6 flex flex-col h-full">
    <div className="flex items-center justify-between mb-4">
      <div
        className={`w-12 h-12 bg-gradient-to-br ${grad} rounded-full flex items-center justify-center opacity-80`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      {loading ? <Skeleton className="h-9 w-24" /> : <span className="text-3xl font-bold text-white">{value}</span>}
    </div>
    <p className="text-sm text-gray-400">{title}</p>
  </motion.div>
);

const Input = ({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: 'text' | 'password' | 'email';
  required?: boolean;
  disabled?: boolean;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1.5">
      {label}
      {required && <span className="text-emerald-400">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="input disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
);

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="glass w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

const RippleButton = ({
  onClick,
  children,
  className,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
  };

  return (
    <button
      onClick={(e) => {
        addRipple(e);
        onClick();
      }}
      disabled={disabled}
      className={`btn ${className} ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute animate-ping rounded-full bg-white/30"
          style={{
            width: 120,
            height: 120,
            left: r.x,
            top: r.y,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </button>
  );
};

/* ------------------------------------------------------------------ */
/*  Dashboard                                                         */
/* ------------------------------------------------------------------ */
export default function AdminDashboard() {
  const [authToken, setAuthToken] = useState<string | null>(null);

  // ── Loading ─────────────────────────────────────
  const [buyersLoading, setBuyersLoading] = useState(true);
  const [salesLoading, setSalesLoading] = useState(true);
  const [edoLoading, setEdoLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [pendingSalesLoading, setPendingSalesLoading] = useState(true);

  // ── Data ────────────────────────────────────────
  const [totalBuyers, setTotalBuyers] = useState(0);
  const [salesData, setSalesData] = useState<any>({ labels: [], datasets: [] });
  const [edoData, setEdoData] = useState<any>({ labels: [], datasets: [] });
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [pendingSales, setPendingSales] = useState<PendingSale[]>([]);

  // ── UI ──────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [isCreateBuyerOpen, setIsCreateBuyerOpen] = useState(false);
  const [isEditBuyerOpen, setIsEditBuyerOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // ── Form Loading ───────────────────────────────
  const [createBuyerLoading, setCreateBuyerLoading] = useState(false);
  const [editBuyerLoading, setEditBuyerLoading] = useState(false);
  const [deleteBuyerLoading, setDeleteBuyerLoading] = useState(false);
  const [createUserLoading, setCreateUserLoading] = useState(false);
  const [editUserLoading, setEditUserLoading] = useState(false);

  const [buyerForm, setBuyerForm] = useState<CreateBuyerForm>({
    buyerCode: '',
    buyerName: '',
    vatNo: '',
    address: '',
    contactPerson: '',
    phoneNo: '',
    mobBuyer: '',
    frequent: '',
    svatNo: '',
    vatType: '',
    bGrantee: true,
  });
  const [userForm, setUserForm] = useState<CreateUserForm>({
    name: '',
    email: '',
    password: '',
    buyerCode: '',
    roleId: 3,
  });
  const [updateUserForm, setUpdateUserForm] = useState<UpdateUserForm>({
    name: '',
    email: '',
    buyerCode: '',
    roleId: 3,
  });

  /* ────────────────────── Auth ────────────────────── */
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Login required');
      window.location.href = '/login';
      return;
    }
    setAuthToken(token);
  }, []);

  /* ────────────────────── Fetchers ────────────────────── */
  const fetchBuyers = async () => {
    if (!authToken) return;
    setBuyersLoading(true);
    try {
      const res = await fetch('http://51.75.119.133:8080/api/Buyer', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const txt = await res.text();
      if (!res.ok) throw new Error(txt || 'Buyers fetch failed');
      const data = txt.trim() ? JSON.parse(txt) : [];
      const buyersArray: Buyer[] = Array.isArray(data) ? data : [];
      setBuyers(buyersArray);
      setTotalBuyers(buyersArray.length);
    } catch (e: any) {
      console.error('Fetch buyers error:', e);
      toast.error(e.message);
      setBuyers([]);
      setTotalBuyers(0);
    } finally {
      setBuyersLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!authToken) return;
    setUsersLoading(true);
    try {
      const res = await fetch('http://51.75.119.133:8080/api/v1/User', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const txt = await res.text();
      if (!res.ok) throw new Error(txt || 'Users fetch failed');
      const data = txt.trim() ? JSON.parse(txt) : [];
      const usersArray: User[] = Array.isArray(data) ? data : [];
      setUsers(usersArray);
    } catch (e: any) {
      console.error('Fetch users error:', e);
      toast.error(e.message);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchSales = async () => {
    if (!authToken) return;
    setSalesLoading(true);
    try {
      const res = await fetch('http://51.75.119.133:8080/api/Sales', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const txt = await res.text();
      if (!res.ok) throw new Error(txt || 'Sales fetch failed');
      const data = txt.trim() ? JSON.parse(txt) : [];

      const monthly: Record<string, number> = {};
      if (Array.isArray(data)) {
        data.forEach((s: Sale) => {
          const month = s.date.split('T')[0].slice(0, 7);
          monthly[month] = (monthly[month] || 0) + s.total;
        });
      }
      const labels = Object.keys(monthly).sort();
      setSalesData({
        labels,
        datasets: [
          {
            label: 'Sales ($)',
            data: labels.map((m) => monthly[m]),
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139,92,246,0.15)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#c4b5fd',
            pointHoverRadius: 8,
          },
        ],
      });
    } catch (e: any) {
      console.error('Fetch sales error:', e);
      toast.error(e.message);
      setSalesData({ labels: [], datasets: [] });
    } finally {
      setSalesLoading(false);
    }
  };

  const fetchEdo = async () => {
    if (!authToken) return;
    setEdoLoading(true);
    try {
      const res = await fetch('http://51.75.119.133:8080/api/Edo', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const txt = await res.text();
      if (!res.ok) throw new Error(txt || 'EDO fetch failed');
      const raw = txt.trim() ? JSON.parse(txt) : [];

      const labels: string[] = [];
      const values: number[] = [];

      if (Array.isArray(raw)) {
        raw.forEach((item: Edo) => {
          const name = item.name ?? item.edoName ?? 'Unknown';
          const cnt = item.count ?? item.total ?? 0;
          labels.push(name);
          values.push(cnt);
        });
      }

      setEdoData({
        labels,
        datasets: [
          {
            label: 'EDO Count',
            data: values,
            backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'],
            borderColor: '#fff',
            borderWidth: 2,
          },
        ],
      });
    } catch (e: any) {
      console.error('Fetch EDO error:', e);
      toast.error(e.message);
      setEdoData({ labels: [], datasets: [] });
    } finally {
      setEdoLoading(false);
    }
  };

  const fetchPendingSales = async () => {
    if (!authToken) return;
    setPendingSalesLoading(true);
    try {
      const res = await fetch('http://51.75.119.133:8080/api/Sales/pending', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const txt = await res.text();
      if (!res.ok) throw new Error(txt || 'Pending sales fetch failed');
      const data = txt.trim() ? JSON.parse(txt) : [];
      const arr: PendingSale[] = Array.isArray(data) ? data : [];
      setPendingSales(arr);
    } catch (e: any) {
      console.error('Fetch pending sales error:', e);
      toast.error(e.message);
      setPendingSales([]);
    } finally {
      setPendingSalesLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchBuyers();
      fetchUsers();
      fetchSales();
      fetchEdo();
      fetchPendingSales();
    }
  }, [authToken]);

  /* ────────────────────── CRUD - Buyers ────────────────────── */
  const handleCreateBuyer = async () => {
    if (!buyerForm.buyerCode || !buyerForm.buyerName) return toast.error('Code & Name required');
    setCreateBuyerLoading(true);
    try {
      const res = await fetch('http://51.75.119.133:8080/api/Buyer', {
        method: 'POST',
        headers: {
          accept: 'text/plain',
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buyerForm),
      });
      const txt = await res.text();
      if (!res.ok) throw new Error(txt || 'Create failed');
      toast.success('Buyer created');
      setIsCreateBuyerOpen(false);
      resetBuyerForm();
      fetchBuyers();
    } catch (e: any) {
      console.error('Create buyer error:', e);
      toast.error(e.message);
    } finally {
      setCreateBuyerLoading(false);
    }
  };

  const openEdit = (b: Buyer) => {
    setSelectedBuyer(b);
    setBuyerForm({ ...b });
    setIsEditBuyerOpen(true);
  };

  const handleEditBuyer = async () => {
    if (!selectedBuyer) return;
    setEditBuyerLoading(true);
    try {
      const res = await fetch(`http://51.75.119.133:8080/api/Buyer/${selectedBuyer.buyerCode}`, {
        method: 'PUT',
        headers: {
          accept: 'text/plain',
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buyerForm),
      });
      const txt = await res.text();
      if (!res.ok) throw new Error(txt || 'Update failed');
      toast.success('Buyer updated');
      setIsEditBuyerOpen(false);
      resetBuyerForm();
      fetchBuyers();
    } catch (e: any) {
      console.error('Edit buyer error:', e);
      toast.error(e.message);
    } finally {
      setEditBuyerLoading(false);
    }
  };

  const openDelete = (b: Buyer) => {
    setSelectedBuyer(b);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteBuyer = async () => {
    if (!selectedBuyer) return;
    setDeleteBuyerLoading(true);
    try {
      const res = await fetch(`http://51.75.119.133:8080/api/Buyer/${selectedBuyer.buyerCode}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error(await res.text() || 'Delete failed');
      toast.success('Buyer deleted');
      setIsDeleteConfirmOpen(false);
      setSelectedBuyer(null);
      fetchBuyers();
    } catch (e: any) {
      console.error('Delete buyer error:', e);
      toast.error(e.message);
    } finally {
      setDeleteBuyerLoading(false);
    }
  };

  /* ────────────────────── CRUD - Users ────────────────────── */
  const handleCreateUser = async () => {
    if (!userForm.name || !userForm.email || !userForm.password || !userForm.buyerCode)
      return toast.error('All fields required');
    setCreateUserLoading(true);
    try {
      const res = await fetch('http://51.75.119.133:8080/api/Auth/register-user', {
        method: 'POST',
        headers: {
          accept: 'text/plain',
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userForm),
      });
      const txt = await res.text();
      if (!res.ok) throw new Error(txt || 'Create user failed');
      toast.success('User created');
      setIsCreateUserOpen(false);
      resetUserForm();
      fetchUsers();
    } catch (e: any) {
      console.error('Create user error:', e);
      toast.error(e.message);
    } finally {
      setCreateUserLoading(false);
    }
  };

  const openEditUser = (u: User) => {
    setSelectedUser(u);
    setUpdateUserForm({
      name: u.name,
      email: u.email,
      buyerCode: u.buyerCode,
      roleId: u.roleId,
    });
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    if (!updateUserForm.name || !updateUserForm.email || !updateUserForm.buyerCode)
      return toast.error('All fields required');
    setEditUserLoading(true);
    try {
      const res = await fetch(`http://51.75.119.133:8080/api/v1/User/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          accept: 'text/plain',
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateUserForm),
      });
      const txt = await res.text();
      if (!res.ok) throw new Error(txt || 'Update user failed');
      toast.success('User updated');
      setIsEditUserOpen(false);
      setSelectedUser(null);
      resetUpdateUserForm();
      fetchUsers();
    } catch (e: any) {
      console.error('Update user error:', e);
      toast.error(e.message);
    } finally {
      setEditUserLoading(false);
    }
  };

  /* ────────────────────── Helpers ────────────────────── */
  const resetBuyerForm = () =>
    setBuyerForm({
      buyerCode: '',
      buyerName: '',
      vatNo: '',
      address: '',
      contactPerson: '',
      phoneNo: '',
      mobBuyer: '',
      frequent: '',
      svatNo: '',
      vatType: '',
      bGrantee: true,
    });
  const resetUserForm = () =>
    setUserForm({ name: '', email: '', password: '', buyerCode: '', roleId: 3 });
  const resetUpdateUserForm = () =>
    setUpdateUserForm({ name: '', email: '', buyerCode: '', roleId: 3 });

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    window.location.href = '/login';
  };

  const filtered = useMemo(() => {
    if (!Array.isArray(buyers)) return [];
    if (!searchTerm) return buyers;
    const q = searchTerm.toLowerCase();
    return buyers.filter(
      (b) =>
        b.buyerCode.toLowerCase().includes(q) || b.buyerName.toLowerCase().includes(q)
    );
  }, [buyers, searchTerm]);

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    if (!userSearchTerm) return users;
    const q = userSearchTerm.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.buyerCode.toLowerCase().includes(q)
    );
  }, [users, userSearchTerm]);

  const getRoleName = (roleId: number) => {
    switch (roleId) {
      case 1:
        return 'Admin';
      case 2:
        return 'Manager';
      case 3:
        return 'User';
      default:
        return 'Unknown';
    }
  };

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#e2e8f0' } },
      tooltip: { backgroundColor: '#1e293b', titleColor: '#e2e8f0', bodyColor: '#e2e8f0' },
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true },
    },
  };

  /* ────────────────────── Render ────────────────────── */
  return (
    <>
      <style jsx>{styles}</style>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' },
        }}
      />

      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{ x: [-100, 100], y: [-80, 80] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute top-20 left-20 w-96 h-96 bg-purple-700/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [100, -100], y: [80, -80] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-pink-700/30 rounded-full blur-3xl"
        />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 flex flex-col">
        {/* Header */}
        <header className="p-6 md:p-8 flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
          >
            Admin Portal
          </motion.h1>
          <RippleButton onClick={handleLogout} className="btn-danger">
            <LogOut className="w-5 h-5" /> Logout
          </RippleButton>
        </header>

        <main className="flex-1 px-6 md:px-8 pb-12 space-y-10">
          {/* Stats */}
          <section className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Stat
              icon={Users}
              title="Total Buyers"
              value={totalBuyers}
              loading={buyersLoading}
              grad="from-emerald-500 to-teal-500"
            />
            <Stat
              icon={UserCog}
              title="Total Users"
              value={users.length}
              loading={usersLoading}
              grad="from-blue-500 to-cyan-500"
            />
            <Stat
              icon={TrendingUp}
              title="Sales Trend"
              value={salesData.labels.length ? 'Active' : '—'}
              loading={salesLoading}
              grad="from-violet-500 to-purple-500"
            />
            <Stat
              icon={Package}
              title="EDO Items"
              value={edoData.labels.length}
              loading={edoLoading}
              grad="from-amber-500 to-orange-500"
            />
            <Stat
              icon={ShieldCheck}
              title="Pending Sales"
              value={pendingSales.length}
              loading={pendingSalesLoading}
              grad="from-yellow-500 to-red-500"
            />
          </section>

          {/* Charts */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 h-72 lg:h-96"
            >
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                <TrendingUp className="w-5 h-5 text-violet-400" /> Sales Trend
              </h3>
              {salesLoading ? <Skeleton className="h-full" /> : <Line data={salesData} options={chartOpts} />}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-6 h-72 lg:h-96"
            >
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                <Package className="w-5 h-5 text-amber-400" /> EDO Distribution
              </h3>
              {edoLoading ? (
                <Skeleton className="h-full" />
              ) : (
                <Doughnut data={edoData} options={{ ...chartOpts, cutout: '65%' }} />
              )}
            </motion.div>
          </section>

          {/* Buyer Table */}
          <section className="glass p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                <Users className="w-5 h-5 text-emerald-400" /> Buyer List
              </h2>
              <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10 w-full sm:w-64"
                  />
                </div>
                <RippleButton onClick={() => setIsCreateBuyerOpen(true)} className="btn-primary">
                  <Plus className="w-5 h-5" /> Add Buyer
                </RippleButton>
              </div>
            </div>

            <div className="overflow-x-auto">
              {buyersLoading ? (
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <p className="text-center text-gray-400 py-12">No buyers found</p>
              ) : (
                <table className="w-full text-sm text-left text-gray-300">
                  <thead className="text-xs uppercase bg-slate-800/50 border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-3">CODE</th>
                      <th className="px-4 py-3">NAME</th>
                      <th className="px-4 py-3 hidden md:table-cell">VAT</th>
                      <th className="px-4 py-3 hidden lg:table-cell">CONTACT</th>
                      <th className="px-4 py-3">GRANTEE</th>
                      <th className="px-4 py-3 text-center">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((b, i) => (
                      <motion.tr
                        key={b.buyerCode}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-slate-700 hover:bg-white/5 transition"
                      >
                        <td className="px-4 py-3 font-medium text-purple-300">{b.buyerCode}</td>
                        <td className="px-4 py-3">{b.buyerName}</td>
                        <td className="px-4 py-3 hidden md:table-cell">{b.vatNo || '-'}</td>
                        <td className="px-4 py-3 hidden lg:table-cell">{b.contactPerson || '-'}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              b.bGrantee ? 'bg-emerald-900/50 text-emerald-300' : 'bg-red-900/50 text-red-300'
                            }`}
                          >
                            {b.bGrantee ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openEdit(b)} className="text-blue-400 hover:text-blue-300">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => openDelete(b)} className="text-red-400 hover:text-red-300">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* User Table */}
          <section className="glass p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                <UserCog className="w-5 h-5 text-blue-400" /> User List
              </h2>
              <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users…"
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="input pl-10 w-full sm:w-64"
                  />
                </div>
                <RippleButton onClick={() => setIsCreateUserOpen(true)} className="btn-indigo">
                  <UserPlus className="w-5 h-5" /> Add User
                </RippleButton>
              </div>
            </div>

            <div className="overflow-x-auto">
              {usersLoading ? (
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : filteredUsers.length === 0 ? (
                <p className="text-center text-gray-400 py-12">No users found</p>
              ) : (
                <table className="w-full text-sm text-left text-gray-300">
                  <thead className="text-xs uppercase bg-slate-800/50 border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">NAME</th>
                      <th className="px-4 py-3 hidden md:table-cell">EMAIL</th>
                      <th className="px-4 py-3 hidden lg:table-cell">BUYER CODE</th>
                      <th className="px-4 py-3">ROLE</th>
                      <th className="px-4 py-3 text-center">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u, i) => (
                      <motion.tr
                        key={u.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-slate-700 hover:bg-white/5 transition"
                      >
                        <td className="px-4 py-3 font-medium text-blue-300">{u.id}</td>
                        <td className="px-4 py-3">{u.name}</td>
                        <td className="px-4 py-3 hidden md:table-cell">{u.email}</td>
                        <td className="px-4 py-3 hidden lg:table-cell">{u.buyerCode}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              u.roleId === 1
                                ? 'bg-red-900/50 text-red-300'
                                : u.roleId === 2
                                ? 'bg-yellow-900/50 text-yellow-300'
                                : 'bg-blue-900/50 text-blue-300'
                            }`}
                          >
                            {getRoleName(u.roleId)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openEditUser(u)} className="text-blue-400 hover:text-blue-300">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* Pending Sales Table */}
          <section className="glass p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-4">
              <ShieldCheck className="w-5 h-5 text-yellow-400" /> Pending Sales
            </h2>
            <div className="overflow-x-auto">
              {pendingSalesLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-12" />
                  ))}
                </div>
              ) : pendingSales.length === 0 ? (
                <p className="text-center text-gray-400 py-12">No pending sales</p>
              ) : (
                <table className="w-full text-sm text-left text-gray-300">
                  <thead className="text-xs uppercase bg-slate-800/50 border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">DATE</th>
                      <th className="px-4 py-3">TOTAL</th>
                      <th className="px-4 py-3">STATUS</th>
                      {/* Add more headers if more fields */}
                    </tr>
                  </thead>
                  <tbody>
                    {pendingSales.map((ps, i) => (
                      <motion.tr
                        key={ps.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-slate-700 hover:bg-white/5 transition"
                      >
                        <td className="px-4 py-3">{ps.id}</td>
                        <td className="px-4 py-3">{new Date(ps.date).toLocaleString()}</td>
                        <td className="px-4 py-3">{ps.total}</td>
                        <td className="px-4 py-3">{ps.status}</td>
                        {/* Add more cells if more fields */}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* ── Modals ── */}
      <Modal
        isOpen={isCreateBuyerOpen}
        onClose={() => {
          setIsCreateBuyerOpen(false);
          resetBuyerForm();
        }}
        title="Create Buyer"
      >
        <BuyerForm form={buyerForm} setForm={setBuyerForm} onSubmit={handleCreateBuyer} loading={createBuyerLoading} />
      </Modal>

      <Modal
        isOpen={isEditBuyerOpen}
        onClose={() => {
          setIsEditBuyerOpen(false);
          resetBuyerForm();
        }}
        title="Edit Buyer"
      >
        <BuyerForm form={buyerForm} setForm={setBuyerForm} onSubmit={handleEditBuyer} loading={editBuyerLoading} />
      </Modal>

      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Delete Buyer?"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-gray-300 mb-6">
            Delete{' '}
            <span className="font-semibold text-purple-300">{selectedBuyer?.buyerName}</span>? This cannot be
            undone.
          </p>
          <div className="flex justify-center gap-3">
            <RippleButton onClick={() => setIsDeleteConfirmOpen(false)} className="btn-secondary">
              Cancel
            </RippleButton>
            <RippleButton onClick={handleDeleteBuyer} disabled={deleteBuyerLoading} className="btn-danger">
              {deleteBuyerLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Deleting…
                </>
              ) : (
                'Delete'
              )}
            </RippleButton>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isCreateUserOpen}
        onClose={() => {
          setIsCreateUserOpen(false);
          resetUserForm();
        }}
        title="Create User"
      >
        <CreateUserForm form={userForm} setForm={setUserForm} onSubmit={handleCreateUser} loading={createUserLoading} />
      </Modal>

      <Modal
        isOpen={isEditUserOpen}
        onClose={() => {
          setIsEditUserOpen(false);
          resetUpdateUserForm();
        }}
        title="Edit User"
      >
        <UpdateUserForm
          form={updateUserForm}
          setForm={setUpdateUserForm}
          onSubmit={handleUpdateUser}
          loading={editUserLoading}
          userId={selectedUser?.id}
        />
      </Modal>
    </>
  );
}

/* ────────────────────── Buyer Form ────────────────────── */
const BuyerForm = ({
  form,
  setForm,
  onSubmit,
  loading,
}: {
  form: CreateBuyerForm;
  setForm: React.Dispatch<React.SetStateAction<CreateBuyerForm>>;
  onSubmit: () => void;
  loading: boolean;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input
      label="Buyer Code"
      value={form.buyerCode}
      onChange={(v) => setForm({ ...form, buyerCode: v })}
      required
    />
    <Input
      label="Buyer Name"
      value={form.buyerName}
      onChange={(v) => setForm({ ...form, buyerName: v })}
      required
    />
    <Input label="VAT No" value={form.vatNo} onChange={(v) => setForm({ ...form, vatNo: v })} />
    <Input label="SVAT No" value={form.svatNo} onChange={(v) => setForm({ ...form, svatNo: v })} />
    <Input label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
    <Input
      label="Contact Person"
      value={form.contactPerson}
      onChange={(v) => setForm({ ...form, contactPerson: v })}
    />
    <Input label="Phone No" value={form.phoneNo} onChange={(v) => setForm({ ...form, phoneNo: v })} />
    <Input label="Mobile" value={form.mobBuyer} onChange={(v) => setForm({ ...form, mobBuyer: v })} />
    <Input label="Frequent" value={form.frequent} onChange={(v) => setForm({ ...form, frequent: v })} />
    <Input label="VAT Type" value={form.vatType} onChange={(v) => setForm({ ...form, vatType: v })} />
    <div className="md:col-span-2 flex items-center gap-3">
      <input
        type="checkbox"
        id="bGrantee"
        checked={form.bGrantee}
        onChange={(e) => setForm({ ...form, bGrantee: e.target.checked })}
        className="w-5 h-5 text-emerald-500 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500"
      />
      <label htmlFor="bGrantee" className="text-sm font-medium text-gray-300">
        B Grantee
      </label>
    </div>
    <div className="md:col-span-2 flex justify-end gap-3 pt-4">
      <RippleButton onClick={onSubmit} disabled={loading} className="btn-primary">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Saving…
          </>
        ) : (
          'Save Buyer'
        )}
      </RippleButton>
    </div>
  </div>
);

/* ────────────────────── Create User Form ────────────────────── */
const CreateUserForm = ({
  form,
  setForm,
  onSubmit,
  loading,
}: {
  form: CreateUserForm;
  setForm: React.Dispatch<React.SetStateAction<CreateUserForm>>;
  onSubmit: () => void;
  loading: boolean;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
    <Input
      label="Email"
      type="email"
      value={form.email}
      onChange={(v) => setForm({ ...form, email: v })}
      required
    />
    <Input
      label="Password"
      type="password"
      value={form.password}
      onChange={(v) => setForm({ ...form, password: v })}
      required
    />
    <Input
      label="Buyer Code"
      value={form.buyerCode}
      onChange={(v) => setForm({ ...form, buyerCode: v })}
      required
    />
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-300 mb-1.5">Role</label>
      <select
        value={form.roleId}
        onChange={(e) => setForm({ ...form, roleId: Number(e.target.value) })}
        className="input"
      >
        <option value={1}>Admin (1)</option>
        <option value={2}>Manager (2)</option>
        <option value={3}>User (3)</option>
      </select>
    </div>
    <div className="md:col-span-2 flex justify-end gap-3 pt-4">
      <RippleButton onClick={onSubmit} disabled={loading} className="btn-indigo">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Creating…
          </>
        ) : (
          'Create User'
        )}
      </RippleButton>
    </div>
  </div>
);

/* ────────────────────── Update User Form ────────────────────── */
const UpdateUserForm = ({
  form,
  setForm,
  onSubmit,
  loading,
  userId,
}: {
  form: UpdateUserForm;
  setForm: React.Dispatch<React.SetStateAction<UpdateUserForm>>;
  onSubmit: () => void;
  loading: boolean;
  userId?: number;
}) => (
  <div className="grid grid-cols=1 md:grid-cols-2 gap-4">
    <Input label="User ID" value={String(userId ?? '')} onChange={() => {}} disabled />
    <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
    <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
    <Input
      label="Buyer Code"
      value={form.buyerCode}
      onChange={(v) => setForm({ ...form, buyerCode: v })}
      required
    />
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-300 mb-1.5">Role</label>
      <select
        value={form.roleId}
        onChange={(e) => setForm({ ...form, roleId: Number(e.target.value) })}
        className="input"
      >
        <option value={1}>Admin (1)</option>
        <option value={2}>Manager (2)</option>
        <option value={3}>User (3)</option>
      </select>
    </div>
    <div className="md:col-span-2 flex justify-end gap-3 pt-4">
      <RippleButton onClick={onSubmit} disabled={loading} className="btn-indigo">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Updating…
          </>
        ) : (
          'Update User'
        )}
      </RippleButton>
    </div>
  </div>
);
