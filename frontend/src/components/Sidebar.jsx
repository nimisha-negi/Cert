import React from 'react'
import { FiHome, FiLayers, FiClock, FiSettings, FiFileText, FiHelpCircle, FiZap, FiShield } from 'react-icons/fi'

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'Overview', icon: <FiHome />, label: 'Dashboard' },
    { id: 'Generator', icon: <FiZap />, label: 'Batch Generator' },
    { id: 'Verification', icon: <FiShield />, label: 'Verification' },
  ]

  const bottomItems = [
    { id: 'Docs', icon: <FiFileText />, label: 'Docs' },
    { id: 'Help', icon: <FiHelpCircle />, label: 'Help' },
  ]

  return (
    <div className="w-64 bg-[#0a0b10] border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-20">
      <div className="p-8 pb-10">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-violet-600/10 p-1.5 rounded-lg border border-violet-500/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-violet-500">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic text-white">
            Cert<span className="text-violet-500">InSync</span>
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === item.id
                ? 'bg-black text-violet-400 border border-violet-500/30'
                : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-neutral-500 hover:text-neutral-300 hover:bg-white/5 transition-all"
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
