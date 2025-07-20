import Papa from "papaparse"
import axios from "axios"

export default function CsvUploader({
  csvFile,
  setCsvFile,
  csvPreview,
  setCsvPreview,
  setCsvData,
  setFieldMapping,
}) {
  const token = localStorage.getItem("token");
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setCsvFile(file)

    const reader = new FileReader()
    reader.onload = (e) => setCsvPreview(e.target.result)
    reader.readAsText(file)
  }

  const handleUpload = async () => {
  if (!csvFile) return alert("Please select a file");

  const formData = new FormData();
  formData.append("file", csvFile);

  try {
    const response = await axios.post("http://localhost:8080/api/csv/upload", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });

    alert("Upload success: " + response.data.message); // ✅ FIXED HERE

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const data = results.data;
        console.log("Parsed CSV Data:", data);

        if (data.length > 0) {
          setCsvData(data);

          const mapping = {};
          Object.keys(data[0]).forEach((key) => {
            mapping[key] = `{${key}}`;
          });
          console.log("Auto Mapping:", mapping);
          setFieldMapping(mapping);
        }
      },
    });
  } catch (err) {
    console.error("CSV Upload failed:", err);
    alert("Upload failed");
  }
};


  return (
    <div className="text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Upload Participant Data</h1>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload} className="mt-4 bg-white text-black px-4 py-2 rounded">
        Upload CSV
      </button>

      {csvPreview && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">CSV Preview</h3>
          <pre className="bg-gray-800 p-4 rounded">{csvPreview}</pre>
        </div>
      )}
    </div>
  )
}
