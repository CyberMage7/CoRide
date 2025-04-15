import { useRef, useState } from "react"
import { AiOutlineCaretDown } from "react-icons/ai"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
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
    useState(() => {
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    if (!user) return null

    // Generate user image URL
    const userImage =  `https://api.dicebear.com/5.x/initials/svg?seed=${user?.fullName}`

    return (
        <button className="relative" onClick={() => setOpen(!open)}>
            <div className="flex items-center gap-x-1">
                <img
                    src={userImage}
                    alt={`profile-${user?.fullName}`}
                    className="aspect-square w-[30px] rounded-full object-cover"
                />
                <AiOutlineCaretDown className="text-sm text-[#4A5D58]" />
            </div>
            {open && (
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-[118%] right-0 z-[1000] divide-y-[1px] divide-[#D6DAC8] overflow-hidden rounded-md border-[1px] border-[#D6DAC8] bg-white shadow-lg"
                    ref={ref}
                >
                    <Link to="/dashboard" onClick={() => setOpen(false)}>
                        <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-[#4A5D58] hover:bg-[#FBF3D5]/50">
                            <VscDashboard className="text-lg" />
                            Dashboard
                        </div>
                    </Link>
                    <div
                        onClick={() => {
                            dispatch(logout(navigate))
                            setOpen(false)
                        }}
                        className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-[#4A5D58] hover:bg-[#FBF3D5]/50"
                    >
                        <VscSignOut className="text-lg" />
                        Logout
                    </div>
                </div>
            )}
        </button>
    )
} 