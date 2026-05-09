
import { useState } from "react"
import { FaCheckCircle } from "react-icons/fa"
import { MdOutlineWorkspacePremium } from "react-icons/md"
import axios from "axios"
import toast from "react-hot-toast"

export default function GenerateCertificates({ csvFile, csvData, onBack }) {
  const [generatedCount, setGeneratedCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    const templateId = localStorage.getItem("templateId")
    const token = localStorage.getItem("token")

    if (!templateId || !csvFile) {
      toast.error('Please upload both the SVG template and the CSV file.')
      return
    }

    const formData = new FormData()
    formData.append("templateId", templateId)
    formData.append("csvFile", csvFile)

    try {
      setIsLoading(true)
      const response = await axios.post("http://localhost:8080/api/certificates/generate", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ include token
          "Content-Type": "multipart/form-data"
        },
        responseType: "blob"
      })

      const blob = new Blob([response.data], { type: "application/zip" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "certificates.zip")
      document.body.appendChild(link)
      link.click()
      link.remove()

      setGeneratedCount(csvData.length)
      toast.success(`${csvData.length} certificates generated successfully!`)
    } catch (err) {
      console.error("Certificate generation failed:", err)
      toast.error('Generation failed: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="bg-[#08090a] text-white px-0 py-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-4">
        <h1 className="text-3xl font-black tracking-tight uppercase italic">
          Generate <span className="text-violet-500">Certificates</span>
        </h1>
        <p className="text-neutral-500 text-sm font-medium mt-1">
          Distribute certificates automatically to all participants
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-black border border-violet-500/20 rounded-[24px] p-8">
          <h2 className="text-base font-semibold mb-2 flex items-center gap-2">🎓 Generation</h2>
          <p className="text-xs text-gray-400 mb-3">Review and execute</p>

          <div className="space-y-1 text-green-500 text-xs font-medium">
            <p><FaCheckCircle className="inline text-green-500 mr-2" /> Template uploaded</p>
            <p><FaCheckCircle className="inline text-green-500 mr-2" /> Participant data ready</p>
          </div>

          <div className="mt-4 bg-white/5 rounded-2xl flex justify-between items-center px-4 py-2 border border-white/5">
            <div className="text-center">
              <div className="text-lg font-bold">{csvData?.length || 0}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-tighter">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{generatedCount}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-tighter">Generated</div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="mt-4 w-full bg-violet-600 text-white py-2 rounded-xl font-bold text-xs disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "▶ Generate All Certificates"}
          </button>
        </div>

        <div className="bg-black border border-violet-500/20 rounded-[24px] p-8 text-center flex flex-col justify-center items-center">
          <h2 className="text-lg font-semibold mb-1">📬 Status</h2>
          <p className="text-xs text-gray-400 mb-4">Results summary</p>

          {generatedCount === 0 ? (
            <div className="text-center text-neutral-500 flex flex-col items-center gap-2">
              <MdOutlineWorkspacePremium className="text-3xl text-neutral-800" />
              <p className="text-xs italic">Pending generation...</p>
            </div>
          ) : (
            <div className="text-green-400 font-bold text-sm">
              ✨ {generatedCount} certificates ready!
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-start">
        <button
          onClick={onBack}
          className="text-neutral-500 hover:text-white text-xs font-bold transition-all flex items-center gap-2"
        >
          Adjust Participant Data
        </button>
      </div>
    </div>
  )
}