import { useRef } from "react"
import { FiUpload, FiFileText, FiEye, FiDownload, FiTrash2 } from "react-icons/fi"
import axios from "axios"

export default function Template({ file, setFile }) {
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

    const templateId = response.data.templateId;
if (templateId) {
  localStorage.setItem("templateId", templateId);
  console.log("Stored templateId:", templateId);
} else {
  alert("Template ID not returned from server");
}

    // console.log("Template upload success:", response.data);
    // // Optional: store templateId from response for use in generation
    // localStorage.setItem("templateId", response.data.templateId);

  } catch (error) {
    console.error("Template upload failed:", error);
    alert("Upload failed!");
  }
} else {
  alert("Please upload a valid SVG file.");
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
    <div className="bg-black text-white min-h-screen px-10 py-8">
      <h1 className="text-3xl font-bold mb-2">Import Certificate Template</h1>
      <p className="text-gray-400 mb-8">
        Upload your professionally designed certificate template from Canva or other design tools
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Panel */}
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
            🎨 Upload Template
          </h2>
          <p className="text-gray-400 mb-4">Import your SVG certificate template</p>

          <label
            htmlFor="upload"
            className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer mb-4"
            onClick={handleUploadClick}
          >
            <FiFileText size={36} className="text-gray-500" />
            <p className="mt-2 text-gray-400">
              Drop your SVG template here
              <br />
              <span className="text-sm">(or click to browse – Max 10MB)</span>
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
            className="bg-white text-black px-4 py-2 rounded-md flex items-center gap-2 font-medium"
          >
            <FiUpload /> Choose SVG
          </button>

          {file && (
            <div className="flex items-center justify-between mt-4 p-3 rounded-md bg-green-100 text-green-900">
              <span className="text-sm font-medium truncate">{file.name} uploaded successfully</span>
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
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-2">Template Requirements:</h3>
            <ul className="space-y-2 text-sm text-green-400">
              <li>✔ Use placeholders like <code className="text-white">{'{name}, {event}'}</code></li>
              <li>✔ High resolution (300 DPI recommended)</li>
              <li>✔ Standard certificate size (A4 or Letter)</li>
              <li>✔ SVG format from Canva, Figma, or Adobe</li>
            </ul>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-1">📄 Template Preview</h2>
            <p className="text-gray-400 mb-4">Preview how your certificate will look with sample data</p>

            {file ? (
              <div className="flex flex-col items-center justify-center h-64 border border-green-600 bg-green-900/20 rounded-lg p-6 text-center">
                <FiFileText size={36} className="text-green-400 mb-2" />
                <p className="text-green-200">{file.name}</p>
                <p className="text-sm text-green-400">Ready to preview and download</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-600 rounded-lg text-center">
                <FiFileText size={36} className="text-gray-500" />
                <p className="mt-2 text-gray-400">Upload a template to see preview</p>
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => {
                if (file) {
                  const blobUrl = URL.createObjectURL(file)
                  window.open(blobUrl, '_blank')
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition ${!file && "opacity-50 cursor-not-allowed"}`}
              disabled={!file}
            >
              <FiEye /> Full Preview
            </button>

            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition ${!file && "opacity-50 cursor-not-allowed"}`}
              disabled={!file}
            >
              <FiDownload /> Download Sample
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
