import { Navigate } from "react-router-dom"
import Login from "./Login"

const Navbar = () => {
  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center border-b border-neutral-800">
      <div className="text-lg font-bold flex items-center gap-2">
        <span>🏅 CertInSync</span>
        
      </div>

      {/* <div className="flex items-center gap-4">
        
        <button className="bg-white text-black px-4 py-1.5 rounded-md font-semibold text-sm hover:bg-gray-200"
        onClick={<Login/>}>
          Logout
        </button>
      </div> */}
    </nav>
  )
}

export default Navbar
