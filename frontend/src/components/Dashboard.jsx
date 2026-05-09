import React, { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Template from './Template'
import CsvUploader from './CsvUploader'
import GenerateCertificates from './GenerateCertificates'
import Verification from './Verification'
import Overview from './Overview'

export default function Dashboard({ user, onLogout }) {
  const [isGenerating, setIsGenerating] = useState(() => {
    return localStorage.getItem('isGenerating') === 'true'
  })
  const [step, setStep] = useState(() => {
    return parseInt(localStorage.getItem('generationStep')) || 0
  })
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'Overview'
  })

  React.useEffect(() => {
    localStorage.setItem('activeTab', activeTab)
  }, [activeTab])

  React.useEffect(() => {
    localStorage.setItem('isGenerating', isGenerating)
    localStorage.setItem('generationStep', step)
  }, [isGenerating, step])

  const [templateFile, setTemplateFile] = useState(null)
  const [csvFile, setCsvFile] = useState(null)
  const [csvData, setCsvData] = useState(null)
  const [csvPreview, setCsvPreview] = useState("")
  const [fieldMapping, setFieldMapping] = useState(null)

  const generationSteps = ["Template", "CSV Data", "Preview"]

  const goNext = () => {
    if (step < generationSteps.length - 1) setStep(step + 1)
  }

  const goBack = () => {
    if (step > 0) setStep(step - 1)
  }

  return (
    <div className="bg-[#08090a] min-h-screen text-white flex">
      <Sidebar 
        activeTab={isGenerating ? 'Generator' : activeTab} 
        setActiveTab={(tab) => { 
          if (tab === 'Generator') {
            setIsGenerating(true);
            setStep(0);
          } else {
            setActiveTab(tab); 
            setIsGenerating(false); 
          }
        }} 
      />
      
      <div className="flex-1 ml-64">
        <Navbar user={user} onLogout={onLogout} />

        <main className="p-4 sm:p-6 max-w-7xl mx-auto">
          {isGenerating ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="mb-4 flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex gap-4">
                  {generationSteps.map((s, i) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${i <= step ? 'bg-violet-500' : 'bg-white/10'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${i === step ? 'text-white' : 'text-neutral-500'}`}>{s}</span>
                      {i < generationSteps.length - 1 && <div className="w-8 h-[1px] bg-white/5 ml-2" />}
                    </div>
                  ))}
                </div>
              </div>

              {generationSteps[step] === "Template" && (
                <Template 
                  file={templateFile} 
                  setFile={(f) => {
                    setTemplateFile(f)
                  }} 
                  onNext={goNext} 
                />
              )}

              {generationSteps[step] === "CSV Data" && (
                <CsvUploader
                  csvFile={csvFile}
                  setCsvFile={setCsvFile}
                  csvPreview={csvPreview}
                  setCsvPreview={setCsvPreview}
                  setCsvData={setCsvData}
                  onNext={goNext}
                  onBack={goBack}
                />
              )}

              {generationSteps[step] === "Preview" && (
                <GenerateCertificates
                  csvFile={csvFile}
                  csvData={csvData}
                  onBack={goBack}
                />
              )}
            </div>
          ) : (
            <>
              {activeTab === "Overview" && (
                <Overview onStartGeneration={() => { setIsGenerating(true); setStep(0); }} user={user} />
              )}
              {activeTab === "Verification" && (
                <Verification user={user} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
