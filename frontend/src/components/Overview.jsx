import React, { useEffect, useState } from 'react'
import { FiDownload, FiClock, FiUsers, FiFileText, FiList, FiTrash2, FiRefreshCw, FiActivity, FiZap, FiCheckCircle } from 'react-icons/fi'
import BatchDetails from './BatchDetails'
import toast from 'react-hot-toast'

export default function Overview({ onStartGeneration, user }) {
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBatchId, setSelectedBatchId] = useState(null)

  useEffect(() => {
    fetchBatches()
  }, [])

  const fetchBatches = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('http://localhost:8080/api/batches', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setBatches(data)
    } catch (error) {
      console.error('Error fetching batches:', error)
      toast.error('Failed to load batch history.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBatch = async (e, id) => {
    const token = localStorage.getItem('token')
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this entire batch?')) return

    try {
      const response = await fetch(`http://localhost:8080/api/batches/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        setBatches(prev => prev.filter(b => b.id !== id))
        toast.success('Batch deleted successfully.')
      }
    } catch (err) {
      console.error('Error deleting batch:', err)
      toast.error('Failed to delete batch.')
    }
  }

  const handleDownload = async (e, id) => {
    const token = localStorage.getItem('token')
    e.stopPropagation()
    try {
      const response = await fetch(`http://localhost:8080/api/batches/${id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `batch_${id}_certificates.zip`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Batch download started!')
    } catch (err) {
      console.error('Download failed:', err)
      toast.error('Download failed. Please try again.')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  if (loading) return <div className="text-center py-20 text-neutral-500 animate-pulse uppercase tracking-[0.3em] text-xs font-black">Synchronizing Data...</div>

  if (selectedBatchId) {
    return <BatchDetails batchId={selectedBatchId} onBack={() => setSelectedBatchId(null)} />
  }

  const totalCertificates = batches.reduce((sum, b) => sum + b.participantCount, 0)
  const totalBatches = batches.length

  const OrbitalChart = () => {
    const size = 180
    const radius = 60
    const center = size / 2
    const circumference = 2 * Math.PI * radius

    let currentOffset = 0
    const colors = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#7c3aed', '#6d28d9']
    const gap = 4

    return (
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90 overflow-visible">
          <circle
            cx={center} cy={center} r={radius}
            fill="transparent" stroke="rgba(139, 92, 246, 0.05)" strokeWidth="14"
          />

          {batches.length === 0 ? (
            <circle
              cx={center} cy={center} r={radius}
              fill="transparent" stroke="rgba(139, 92, 246, 0.1)" strokeWidth="14"
              strokeDasharray={circumference}
              className="opacity-20"
            />
          ) : (
            batches.slice(0, 5).map((batch, i) => {
              const percentage = (batch.participantCount / (totalCertificates || 1))
              const dashArray = (percentage * circumference) - (batches.length > 1 ? gap : 0)
              const offset = currentOffset
              currentOffset += (percentage * circumference)

              const color = colors[i % colors.length]

              return (
                <circle
                  key={batch.id}
                  cx={center} cy={center} r={radius}
                  fill="transparent"
                  stroke={color}
                  strokeWidth="14"
                  strokeDasharray={`${dashArray > 0 ? dashArray : 0} ${circumference}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              )
            })
          )}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-black text-white leading-none tracking-tighter tabular-nums">{totalBatches}</span>
          <span className="text-[9px] font-black text-neutral-500 tracking-[0.2em] uppercase mt-1">Total</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 uppercase italic">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-neutral-500 text-sm font-medium mt-1">Monitor and manage your certificate synchronization protocol.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">All systems operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Pipeline Overview Card */}
        <div className="lg:col-span-8 bg-[#0d0f14] border border-white/5 rounded-[32px] p-10 relative overflow-hidden flex flex-col sm:flex-row items-center gap-12">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.08)_0%,transparent_50%)]"></div>

          <div className="flex-1 space-y-10 relative z-10 w-full">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FiActivity className="text-violet-500" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Sync Protocol Status</h3>
              </div>
              <p className="text-neutral-500 text-xs font-medium">Real-time status of your certificate synchronization protocol</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-[10px] text-neutral-500 font-black tracking-widest uppercase mb-2">Total Batches</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-white">{totalBatches}</p>
                  <span className="text-neutral-600 text-[10px] font-bold">All time</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-neutral-500 font-black tracking-widest uppercase mb-2">Live Batches</p>
                <div className="flex items-baseline gap-2 text-green-500">
                  <p className="text-3xl font-black">{batches.filter(b => b.participantCount > 0).length}</p>
                  <span className="text-[10px] font-bold">• Running</span>
                </div>
              </div>


            </div>
          </div>

          <div className="relative z-10 flex-shrink-0 scale-110">
            <OrbitalChart />
          </div>
        </div>

        {/* Command Center Card */}
        <div className="lg:col-span-4 flex flex-col">
          <div
            className="flex-1 bg-gradient-to-br from-violet-600/20 to-purple-900/10 border border-violet-500/20 p-10 rounded-[32px] relative overflow-hidden group flex flex-col justify-between"
          >
            <div className="absolute -top-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
              <FiZap size={220} className="text-violet-400" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <FiZap className="text-violet-400" />
                <p className="text-violet-400 text-[10px] font-black tracking-[0.3em] uppercase">Command Center</p>
              </div>
              <h3 className="text-4xl font-black text-white leading-[0.9] mb-4 uppercase italic tracking-tighter">Sync<br />Now</h3>
              <p className="text-neutral-400 text-[10px] font-medium opacity-80 leading-relaxed max-w-[200px]">
                Initialize the synchronization protocol and keep your certificates in sync.
              </p>
            </div>

            <div className="relative z-10 mt-8 space-y-4">
              <button
                onClick={onStartGeneration}
                className="w-full bg-violet-600 text-white px-6 py-4 rounded-2xl font-black text-xs tracking-[0.1em] flex items-center justify-between hover:bg-violet-500 transition-all active:scale-95"
              >
                INITIALIZE SYNC
              </button>
              <div className="flex justify-center gap-4 text-[9px] font-black text-neutral-500 uppercase tracking-widest">
                <span>Secure</span> • <span>Verified</span> • <span>Automated</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <div>
            <h2 className="text-xl font-black tracking-tight uppercase italic">Recent Activity</h2>
            <p className="text-neutral-500 text-xs font-medium mt-1">Latest batch generation history</p>
          </div>

        </div>

        <div className="bg-[#0d0f14] border border-white/5 rounded-[32px] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Batch Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Started At</th>
                <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Duration</th>
                <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {batches.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-neutral-600 italic text-sm">No recent activity detected. Initialize a sync to begin.</td>
                </tr>
              ) : (
                batches.map((batch) => (
                  <tr key={batch.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-violet-600/10 text-violet-500 rounded-xl">
                          <FiFileText size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">{batch.templateName}</p>
                          <p className="text-[10px] text-neutral-600 font-mono mt-1">Batch ID: {String(batch.id || "").substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-green-500">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Live</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs text-neutral-400 font-medium">{formatDate(batch.timestamp)}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs text-neutral-500 font-medium tabular-nums">2m 14s</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelectedBatchId(batch.id)}
                          className="px-4 py-2 bg-violet-600/10 border border-violet-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-violet-400 hover:text-white transition-all hover:bg-violet-600/30"
                        >
                          View Details
                        </button>
                        <button onClick={(e) => handleDownload(e, batch.id)} className="p-2 text-neutral-600 hover:text-white transition-colors"><FiDownload size={16} /></button>
                        <button onClick={(e) => handleDeleteBatch(e, batch.id)} className="p-2 text-neutral-600 hover:text-red-500 transition-colors"><FiTrash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
