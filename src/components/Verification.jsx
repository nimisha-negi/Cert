import { useState } from "react"
import { FiCheckCircle, FiAlertCircle, FiSearch } from "react-icons/fi"

export default function Verification() {
  const [code, setCode] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
  setLoading(true)
  setResult(null)

  try {
    const res = await fetch(`http://localhost:8080/api/certificates/verify/${code}`)
    const data = await res.json()

    if (res.ok) {
      setResult({ status: "valid", data })
    } else {
      setResult({ status: "invalid" })
    }
  } catch (err) {
    setResult({ status: "invalid" })
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-2">Verify Certificate</h1>
      <p className="text-gray-400 mb-6 text-center max-w-md">
        Enter the certificate ID printed on your certificate to confirm its authenticity.
      </p>

      <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md mb-4">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          type="text"
          placeholder="Enter Certificate ID"
          className="w-full px-4 py-2 rounded-md bg-neutral-900 text-white border border-neutral-600"
        />
        <button
          onClick={handleVerify}
          disabled={loading || !code}
          className="flex items-center justify-center px-4 py-2 bg-white text-black rounded-md font-semibold hover:bg-gray-200 transition"
        >
          <FiSearch className="mr-2" /> {loading ? "Verifying..." : "Verify"}
        </button>
      </div>

      {result && result.status === "valid" && (
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-6 mt-4 max-w-md w-full text-green-200">
          <FiCheckCircle className="text-green-400 text-2xl mb-2" />
          <p className="font-semibold mb-1">Certificate is valid!</p>
          <p><span className="font-medium">Name:</span> {result.data.name}</p>
          <p><span className="font-medium">Email:</span> {result.data.email}</p>
          <p><span className="font-medium">Template:</span> {result.data.templateName}</p>
          <p><span className="font-medium">Issued:</span> {new Date(result.data.issuedDate).toLocaleDateString()}</p>
          <p><span className="font-medium">Certificate ID:</span> {result.data.certificateId}</p>
        </div>
      )}

      {result && result.status === "invalid" && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 mt-4 max-w-md w-full text-red-200 text-center">
          <FiAlertCircle className="text-red-400 text-2xl mb-2" />
          <p className="font-semibold">Invalid Certificate ID</p>
          <p className="text-sm">Please check the code and try again.</p>
        </div>
      )}
    </div>
  )
}
