import React, { useEffect, useState } from 'react'
import { FiArrowLeft, FiEdit2, FiDownload, FiSearch, FiRefreshCw, FiTrash2 } from 'react-icons/fi'
import EditCertificateModal from './EditCertificateModal'
import toast from 'react-hot-toast'

export default function BatchDetails({ batchId, onBack }) {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingCert, setEditingCert] = useState(null)

  useEffect(() => {
    fetchCertificates()
  }, [batchId])

  const fetchCertificates = async () => {
    const token = localStorage.getItem('token')
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/api/batches/${batchId}/certificates`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setCertificates(data)
    } catch (error) {
      console.error('Error fetching certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (certId, name) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`http://localhost:8080/api/certificates/${certId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${name.replace(/\s+/g, '_')}_certificate.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success(`Downloaded certificate for ${name}`)
    } catch (err) {
      console.error('Download failed:', err)
      toast.error('Download failed. Please try again.')
    }
  }

  const handleDeleteCertificate = async (id) => {
    const token = localStorage.getItem('token')
    if (!window.confirm('Are you sure you want to delete this participant?')) return

    try {
      const response = await fetch(`http://localhost:8080/api/certificates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        setCertificates(prev => prev.filter(c => c.id !== id))
        toast.success('Participant removed successfully.')
      } else {
        toast.error('Failed to delete participant.')
      }
    } catch (err) {
      console.error('Error deleting participant:', err)
      toast.error('Error deleting participant.')
    }
  }

  const filteredCerts = certificates.filter(c => {
    const name = (c.name || '').toLowerCase()
    const email = (c.email || '').toLowerCase()
    const certId = (c.certificateId || '').toLowerCase()
    const s = search.toLowerCase()
    return name.includes(s) || email.includes(s) || certId.includes(s)
  })

  console.log("Fetched certificates:", certificates)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to History</span>
        </button>
        <h2 className="text-2xl font-bold">Batch Participants</h2>
        <button onClick={fetchCertificates} className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors">
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input 
          type="text"
          placeholder="Search by name, email or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-12 pr-4 py-3 focus:border-blue-500 transition-all outline-none"
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-neutral-500">Loading participants...</div>
      ) : (
        <div className="bg-[#0e0e0e] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-900/50 border-b border-neutral-800">
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Participant</th>
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Certificate ID</th>
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Issued Date</th>
                <th className="p-4 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filteredCerts.map((cert) => (
                <tr key={cert.id} className="hover:bg-neutral-900/30 transition-colors group">
                  <td className="p-4">
                    <div className="font-semibold text-neutral-200">{cert.name}</div>
                    <div className="text-xs text-neutral-500">{cert.email}</div>
                  </td>
                  <td className="p-4 font-mono text-sm text-blue-400">{cert.certificateId}</td>
                  <td className="p-4 text-sm text-neutral-400">
                    {new Date(cert.issuedDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleDownload(cert.id, cert.name)}
                        className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 hover:text-blue-400 transition-all active:scale-95"
                        title="Download Certificate"
                      >
                        <FiDownload size={16} />
                      </button>
                      <button
                        onClick={() => setEditingCert(cert)}
                        className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 hover:text-yellow-400 transition-all active:scale-95"
                        title="Edit Details"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCertificate(cert.id)}
                        className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 hover:text-red-500 transition-all active:scale-95"
                        title="Delete Participant"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCerts.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-neutral-500 italic">
                    No participants found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editingCert && (
        <EditCertificateModal 
          certificate={editingCert} 
          onClose={() => setEditingCert(null)}
          onSave={fetchCertificates}
        />
      )}
    </div>
  )
}
