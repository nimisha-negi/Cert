import React, { useState } from 'react'
import { FiX, FiSave, FiAlertCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function EditCertificateModal({ certificate, onClose, onSave }) {
  const [formData, setFormData] = useState(() => {
    try {
      return JSON.parse(certificate.participantData)
    } catch (e) {
      return { name: certificate.name, email: certificate.email }
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/certificates/${certificate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Backend Error:", errorText)
        throw new Error(errorText || 'Failed to update certificate')
      }
      
      // Download the new PDF immediately
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${formData.name || 'certificate'}_corrected.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      
      toast.success('Certificate updated and downloading!')
      onSave()
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to update certificate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0e0e0e] border border-neutral-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
          <h3 className="text-xl font-bold">Edit Certificate Details</h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 p-3 rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <FiAlertCircle />
              {error}
            </div>
          )}

          <div className="grid gap-4">
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                  {key.replace(/_/g, ' ')}
                </label>
                <input
                  type="text"
                  value={formData[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                  required
                />
              </div>
            ))}
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-neutral-800 hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-95"
            >
              {loading ? 'Regenerating...' : <><FiSave /> Save & Download</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
