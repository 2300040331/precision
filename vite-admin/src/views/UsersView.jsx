import React, { useState } from 'react';
import { Users as UsersIcon, Plus, ShieldCheck, Key, UserCheck, X } from 'lucide-react';

export default function UsersView({ users, onCreateUser, onUpdateUser, onDeleteUser }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'EDITOR',
    twoFactor: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateUser(form);
    setIsModalOpen(false);
    setForm({ name: '', email: '', password: '', role: 'EDITOR', twoFactor: false });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
            <UsersIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Admin Users & RBAC Permissions</h1>
            <p className="text-slate-400 text-xs">Manage administrative team accounts, roles, security privileges, and 2FA authentication.</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all border border-indigo-400/30"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Create New Admin User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800/80 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <th className="py-3 px-4">User Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role Privileges</th>
              <th className="py-3 px-4">2FA Security</th>
              <th className="py-3 px-4">Last Login</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {(Array.isArray(users) ? users : []).map(u => (
              <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-white flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-xs">
                    {u.name[0]}
                  </div>
                  <span>{u.name}</span>
                </td>
                <td className="py-3 px-4 text-slate-300 font-mono">{u.email}</td>
                <td className="py-3 px-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.twoFactor ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    {u.twoFactor ? '2FA Enabled' : 'Disabled'}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400">{u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onDeleteUser(u.id)}
                    className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-semibold text-[11px]"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <h2 className="text-base font-bold text-white">Create New Admin User Account</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Email Address *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Password *</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Role Level</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                >
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Full System Access)</option>
                  <option value="ADMIN">ADMIN (Manage Content & Leads)</option>
                  <option value="EDITOR">EDITOR (Content Editing)</option>
                  <option value="MARKETING">MARKETING (Analytics & Forms)</option>
                  <option value="READ_ONLY">READ_ONLY (View Only)</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="2faCheck"
                  checked={form.twoFactor}
                  onChange={(e) => setForm({ ...form, twoFactor: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="2faCheck" className="text-slate-300 font-semibold cursor-pointer">
                  Require 2FA Security Verification
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
