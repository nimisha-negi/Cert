import React, { useState } from 'react'
import Navbar from './Navbar'
import TabNav from './TabNav'
import Template from './Template'
import CsvUploader from './CsvUploader'
import GenerateCertificates from './GenerateCertificates'
import Verification from './Verification'

export default function Dashboard() {
  const [step, setStep] = useState(0)

  const [templateFile, setTemplateFile] = useState(null)
  const [csvFile, setCsvFile] = useState(null)              // ✅ FIXED
  const [csvData, setCsvData] = useState(null)
  const [csvPreview, setCsvPreview] = useState("")
  const [fieldMapping, setFieldMapping] = useState(null)

  const steps = ["Template", "CSV Data", "Preview", "Verification"]
  const activeTab = steps[step]

  const goNext = () => {
    if (step < steps.length - 1) setStep(step + 1)
  }

  const goBack = () => {
    if (step > 0) setStep(step - 1)
  }



  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <TabNav activeTab={activeTab} setActiveTab={(tab) => setStep(steps.indexOf(tab))} />

      <main className="p-6">
        {activeTab === "Overview" && (
          <Overview/>

        )}
        {activeTab === "Template" && (
          <Template file={templateFile} setFile={setTemplateFile} />

        )}

        {activeTab === "CSV Data" && (
          <CsvUploader
          csvFile={csvFile}
          setCsvFile={setCsvFile}
          csvPreview={csvPreview}
          setCsvPreview={setCsvPreview}
          setCsvData={setCsvData}           // ✅ GOOD
          setFieldMapping={setFieldMapping} // ✅ GOOD
          />

        )}

        {activeTab === "Preview" && (
          <GenerateCertificates
  templateFile={templateFile}
  csvFile={csvFile}            // <-- Add this line
  csvData={csvData}
  fieldMapping={fieldMapping}
/>


        )}

        {activeTab === "Verification" && (
          <Verification />
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            className="bg-gray-700 px-4 py-2 rounded disabled:opacity-40"
            onClick={goBack}
            disabled={step === 0}
          >
            Back
          </button>

          <button
            className="bg-blue-600 px-4 py-2 rounded disabled:opacity-40"
            onClick={goNext}
            disabled={step === steps.length - 1}
          >
            Next 
          </button>
        </div>
      </main>
    </div>
  )
}
