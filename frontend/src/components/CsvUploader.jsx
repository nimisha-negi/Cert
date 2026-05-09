import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"

export default function CsvUploader({
  csvFile,
  setCsvFile,
  csvPreview,
  setCsvPreview,
  setCsvData,
  onNext,
  onBack
}) {
  const token = localStorage.getItem("token")

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.name.endsWith(".csv")) {
      setCsvFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setCsvPreview(event.target.result.slice(0, 1000))
      }
      reader.readAsText(file)
    } else {
      toast.error('Please upload a valid CSV file.')
    }
  }

  const handleUpload = async () => {
    if (!csvFile) return toast.error('Please select a CSV file first!')

    const formData = new FormData()
    formData.append("file", csvFile)

    try {
      const response = await axios.post("http://localhost:8080/api/csv/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      })
      setCsvData(response.data.data)
      onNext()
    } catch (error) {
      console.error("CSV upload failed:", error)
      toast.error('Failed to process CSV. Please check the file format.')
    }
  }

  return (
    <div className="text-white py-4 px-0 bg-[#08090a] animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-4">
        <h1 className="text-3xl font-black tracking-tight uppercase italic">
          Upload <span className="text-violet-500">Participant Data</span>
        </h1>
        <p className="text-neutral-500 text-sm font-medium mt-1">Select the CSV file containing participant details</p>
      </div>

      <div className="bg-black border border-violet-500/20 rounded-[24px] p-8">
        <div className="flex flex-col gap-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="text-sm text-neutral-400 block w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-600 file:text-white hover:file:bg-violet-500"
          />
          <div className="flex justify-between items-center mt-2">
            <button
              onClick={onBack}
              className="text-neutral-500 hover:text-white text-xs font-bold transition-all px-2 py-2"
            >
              Back to Template
            </button>
            <button
              onClick={handleUpload}
              className="bg-violet-600 text-white px-8 py-2.5 rounded-md font-black text-xs transition-all active:scale-95"
            >
              Upload & Continue
            </button>
          </div>
        </div>
      </div>

      {csvPreview && (
        <div className="mt-8 border-t border-white/5 pt-8">
          <h3 className="text-sm font-black uppercase tracking-widest text-neutral-500 mb-4">Data Stream Preview</h3>
          <pre className="bg-black border border-violet-500/10 p-6 rounded-2xl text-[10px] font-mono overflow-auto max-h-48 text-violet-300/50 leading-relaxed">{csvPreview}</pre>
        </div>
      )}
    </div>
  )
}
