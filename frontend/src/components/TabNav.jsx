// components/TabNav.jsx

const tabs = ["Overview", "Template", "CSV Data", "Preview", "Verification"]

export default function TabNav({ activeTab, setActiveTab }) {
  return (
    <div className="w-full bg-white px-6 py-3 shadow-sm border-b border-gray-200">
      <div className="flex gap-2">
        {tabs.map((label) => (
          <button
            key={label}
            onClick={() => setActiveTab(label)}
            className={`px-5 py-2 text-sm rounded-full transition-all duration-200
              ${
                activeTab === label
                  ? "bg-black text-white font-semibold shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
