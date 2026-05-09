import { useRef } from "react"
import { FiUpload, FiFileText, FiTrash2 } from "react-icons/fi"
import axios from "axios"
import toast from "react-hot-toast"

export default function Template({ file, setFile, onNext }) {
  const fileInputRef = useRef(null)
  const token = localStorage.getItem("token");

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === "image/svg+xml") {
      setFile(selectedFile);

      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await axios.post("http://localhost:8080/api/templates/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        })

        const { templateId } = response.data;
        if (templateId) {
          localStorage.setItem("templateId", templateId);
          setFile(selectedFile);
          toast.success('Template uploaded successfully!')
        } else {
          toast.error('Template ID not returned from server')
        }
      } catch (error) {
        console.error("Template upload failed:", error);
        toast.error('Template upload failed. Please try again.')
      }
    } else {
      toast.error('Please upload a valid SVG file.')
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  const resetUpload = () => {
    setFile(null)
    fileInputRef.current.value = null
  }

  return (
    <div className="bg-[#08090a] text-white px-0 py-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-4">
        <h1 className="text-3xl font-black tracking-tight uppercase italic">
          Import <span className="text-violet-500">Template</span>
        </h1>
        <p className="text-neutral-500 text-sm font-medium mt-1">
          Upload your professionally designed certificate template
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upload Panel */}
        <div className="bg-black border border-violet-500/20 rounded-[24px] p-6">
          <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
            🎨 Upload Template
          </h2>
          <p className="text-xs text-gray-400 mb-2">Import your SVG certificate template</p>

          <label
            htmlFor="upload"
            className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/5 rounded-2xl cursor-pointer mb-4 hover:border-violet-500/30 transition-all"
            onClick={handleUploadClick}
          >
            <FiFileText size={32} className="text-neutral-700" />
            <p className="mt-2 text-xs text-neutral-500 text-center">
              Drop your SVG template here
              <br />
              <span className="text-[10px]">(or click to browse)</span>
            </p>
            <input
              id="upload"
              type="file"
              accept=".svg"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <button
            onClick={handleUploadClick}
            className="bg-white text-black px-4 py-2 rounded-md flex items-center gap-2 font-bold text-xs"
          >
            <FiUpload /> Choose SVG
          </button>

          {file && (
            <div className="flex items-center justify-between mt-4 p-3 rounded-md bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <span className="text-xs font-medium truncate">{file.name} uploaded</span>
              <button
                onClick={resetUpload}
                className="text-red-600 hover:text-red-800"
                title="Remove file"
              >
                <FiTrash2 />
              </button>
            </div>
          )}

          {/* Template Requirements */}
          <div className="mt-6 border-t border-white/5 pt-4">
            <h3 className="font-semibold text-sm mb-2">Requirements:</h3>
            <ul className="space-y-1 text-xs text-green-500/70">
              <li>✔ Use placeholders like <code className="text-white">{'{name}, {event}'}</code></li>
              <li>✔ SVG format from Canva, Figma, or Adobe</li>
            </ul>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-black border border-violet-500/20 rounded-[24px] p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1">📄 Template Preview</h2>
            <p className="text-xs text-gray-400 mb-2">How your certificate will look</p>

            {file ? (
              <div className="flex flex-col items-center justify-center h-56 border border-violet-500/30 bg-violet-500/5 rounded-2xl p-6 text-center">
                <FiFileText size={32} className="text-violet-400 mb-2" />
                <p className="text-xs text-violet-200">{file.name}</p>
                <p className="text-[10px] text-violet-400">Ready to preview</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-56 border-2 border-dashed border-white/5 rounded-2xl text-center">
                <FiFileText size={32} className="text-neutral-700" />
                <p className="mt-2 text-xs text-neutral-500">Upload a template to see preview</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onNext}
              disabled={!file}
              className={`flex items-center gap-2 px-6 py-2 rounded-md bg-violet-600 text-white text-xs font-black hover:bg-violet-500 transition-all active:scale-95 ${!file && "opacity-50 cursor-not-allowed"}`}
            >
              Next Step
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
