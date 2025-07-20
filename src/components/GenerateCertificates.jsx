
import { useState } from "react"
import { FaCheckCircle } from "react-icons/fa"
import { MdOutlineWorkspacePremium } from "react-icons/md"
import axios from "axios"

export default function GenerateCertificates({ csvFile, csvData }) {
  const [generatedCount, setGeneratedCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
  const templateId = localStorage.getItem("templateId")
  const token = localStorage.getItem("token") // ✅ important

  console.log("Generating with:", templateId, csvFile)

  if (!templateId || !csvFile) {
    alert("Please upload both the SVG template and the CSV file.")
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
  } catch (err) {
    console.error("Certificate generation failed:", err)
    alert("Generation failed: " + (err.response?.data?.message || err.message))
  } finally {
    setIsLoading(false)
  }
}


  return (
    <div className="bg-black text-white min-h-screen px-10 py-8">
      <h1 className="text-3xl font-bold mb-4">Generate Certificates</h1>
      <p className="text-neutral-400 mb-8">
        Generate and distribute certificates automatically to all participants
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">🎓 Certificate Generation</h2>
          <p className="text-gray-400 mb-4">Generate certificates for all participants</p>

          <div className="space-y-2 text-green-400 text-sm font-medium">
            <p><FaCheckCircle className="inline text-green-500 mr-1" /> Certificate template uploaded</p>
            <p><FaCheckCircle className="inline text-green-500 mr-1" /> Participant data uploaded</p>
            <p><FaCheckCircle className="inline text-green-500 mr-1" /> Field mapping confirmed</p>
          </div>

          <div className="mt-6 bg-neutral-800 rounded-lg flex justify-between items-center px-4 py-3">
            <div className="text-center">
              <div className="text-2xl font-bold">{csvData?.length || 0}</div>
              <div className="text-sm text-gray-400">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{generatedCount}</div>
              <div className="text-sm text-gray-400">Generated</div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="mt-4 w-full bg-white text-black py-2 rounded-md font-semibold disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "▶ Generate All Certificates"}
          </button>
        </div>

        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 text-center flex flex-col justify-center items-center">
          <h2 className="text-xl font-semibold mb-2">📬 Generation Results</h2>
          <p className="text-gray-400 mb-6">Status of generated certificates</p>

          {generatedCount === 0 ? (
            <div className="text-center text-neutral-500 flex flex-col items-center gap-2">
              <MdOutlineWorkspacePremium className="text-4xl text-gray-500" />
              <p>No certificates generated yet</p>
            </div>
          ) : (
            <div className="text-green-400 font-medium">All {generatedCount} certificates generated and downloaded!</div>
          )}
        </div>
      </div>
    </div>
  )
}