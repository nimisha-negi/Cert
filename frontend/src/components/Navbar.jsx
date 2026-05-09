import React from 'react'
import { FiLogOut, FiUser } from 'react-icons/fi'

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-[#08090a]/90 backdrop-blur-xl text-white px-8 py-4 flex justify-end items-center border-b border-white/5 sticky top-0 z-40">
      <div className="flex items-center gap-6">
        {user && (
          <div className="flex items-center gap-3 bg-black px-4 py-2 rounded-xl border border-violet-500/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all cursor-pointer">
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-violet-500/40"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-xs font-black shadow-lg shadow-violet-900/20">
                {user.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-xs font-black text-white italic">{user.name}</p>
              <p className="text-[10px] text-neutral-500 font-medium">{user.email}</p>
            </div>
          </div>
        )}
        
        <button 
          onClick={onLogout}
          className="p-3 bg-white/5 border border-white/10 rounded-xl text-neutral-400 hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/20 transition-all active:scale-95"
          title="Terminate Session"
        >
          <FiLogOut size={18} />
        </button>
      </div>
    </nav>
  )
}

export default Navbar
