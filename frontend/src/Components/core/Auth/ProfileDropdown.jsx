import { useEffect, useRef, useState } from "react"
import { AiOutlineCaretDown } from "react-icons/ai"
import { VscDashboard, VscSignOut, VscAccount } from "react-icons/vsc"
import { FaCar } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { logout } from "../../../services/operations/authAPI"

export default function ProfileDropdown() {
    const profile = useSelector((state) => state.profile)
    const user = profile?.user || null
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    // Close dropdown when clicking outside
    const handleClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            setOpen(false)
        }
    }

    // Add event listener for clicks outside
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    if (!user) return null

    // Generate user image URL
    const userImage = `https://api.dicebear.com/5.x/initials/svg?seed=${user?.fullName}`

    return (
        <button className="relative" onClick={() => setOpen(!open)}>
            <div className="flex items-center gap-x-2 bg-white/20 hover:bg-white/30 transition-colors duration-300 rounded-full py-1 px-1 mr-6 shadow-sm">
                <img
                    src={userImage}
                    alt={`profile-${user?.fullName}`}
                    className="aspect-square w-[40px] h-[40px] rounded-full object-cover border-2 border-white shadow-md"
                />
                <span className="text-sm font-medium text-[#4A5D58] hidden md:block">
                    {user?.fullName?.split(' ')[0]}
                </span>
                <AiOutlineCaretDown className={`text-sm text-[#4A5D58] transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
            </div>
            {open && (
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-[120%] right-0 z-[1000] w-64 divide-y-[1px] divide-[#D6DAC8] overflow-hidden rounded-xl border-[1px] border-[#D6DAC8] bg-white shadow-xl transition-all duration-300 animate-fadeIn mr-3"
                    ref={ref}
                >
                    <div className="bg-gradient-to-r from-[#EFBC9B] to-[#F5D0B5] p-4">
                        <div className="flex items-center gap-4">
                            <img
                                src={userImage}
                                alt={`profile-${user?.fullName}`}
                                className="aspect-square w-[50px] h-[50px] rounded-full object-cover border-2 border-white shadow-md"
                            />
                            <div>
                                <h4 className="font-medium text-[#4A5D58]">{user?.fullName}</h4>
                                <p className="text-xs text-[#4A5D58]/80">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                    
                    <Link to="/dashboard" onClick={() => setOpen(false)}>
                        <div className="flex w-full items-center gap-x-2 py-[12px] px-[16px] text-sm text-[#4A5D58] hover:bg-[#FBF3D5]/50 transition-colors duration-200">
                            <VscAccount className="text-xl" />
                            Dashboard
                        </div>
                    </Link>
                    
                    <Link to="/my-rides?view=all" onClick={() => setOpen(false)}>
                        <div className="flex w-full items-center gap-x-2 py-[12px] px-[16px] text-sm text-[#4A5D58] hover:bg-[#FBF3D5]/50 transition-colors duration-200">
                            <FaCar className="text-xl" />
                            View All Rides
                        </div>
                    </Link>
                    
                    <div
                        onClick={() => {
                            dispatch(logout(navigate))
                            setOpen(false)
                        }}
                        className="flex w-full items-center gap-x-2 py-[12px] px-[16px] text-sm text-[#4A5D58] hover:bg-[#FBF3D5]/50 transition-colors duration-200"
                    >
                        <VscSignOut className="text-xl" />
                        Logout
                    </div>
                </div>
            )}
        </button>
    )
}