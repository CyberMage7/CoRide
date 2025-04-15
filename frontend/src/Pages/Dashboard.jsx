import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getUserProfile } from "../services/operations/authAPI"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {
    User,
    School,
    AlertCircle,
    Lock,
    Edit2,
    Save,
    Car,
    DollarSign,
    Calendar,
    MapPin,
    Shield,
    Award,
    Loader,
} from "lucide-react"

// Custom Button Component
const Button = ({ children, variant = "default", size = "default", className = "", ...props }) => {
    const baseStyles =
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50"

    const variants = {
        default: "bg-[#9CAFAA] text-white hover:bg-[#8a9e99] focus-visible:ring-[#9CAFAA]",
        outline: "border border-[#D6DAC8] bg-white hover:bg-[#FBF3D5]/20 hover:text-[#9CAFAA] focus-visible:ring-[#9CAFAA]",
    }

    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-sm",
    }

    return (
        <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
            {children}
        </button>
    )
}

// Custom Card Components
const Card = ({ children, className = "", ...props }) => {
    return (
        <div className={`rounded-lg border border-[#D6DAC8]/60 bg-white text-gray-800 shadow ${className}`} {...props}>
            {children}
        </div>
    )
}

const CardContent = ({ children, className = "", ...props }) => {
    return (
        <div className={`p-6 ${className}`} {...props}>
            {children}
        </div>
    )
}

const CardDescription = ({ children, className = "", ...props }) => {
    return (
        <p className={`text-sm text-gray-500 ${className}`} {...props}>
            {children}
        </p>
    )
}

const CardFooter = ({ children, className = "", ...props }) => {
    return (
        <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>
            {children}
        </div>
    )
}

const CardTitle = ({ children, className = "", ...props }) => {
    return (
        <h3 className={`text-lg font-semibold leading-none tracking-tight text-gray-800 ${className}`} {...props}>
            {children}
        </h3>
    )
}

// Custom Input Component
const Input = ({ className = "", disabled, ...props }) => {
    return (
        <input
            className={`flex h-10 w-full rounded-md border border-[#D6DAC8] bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9CAFAA]/50 focus-visible:border-[#9CAFAA] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            disabled={disabled}
            {...props}
        />
    )
}

// Custom Label Component
const Label = ({ children, className = "", ...props }) => {
    return (
        <label
            className={`text-sm font-medium leading-none text-gray-500 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
            {...props}
        >
            {children}
        </label>
    )
}

const Separator = ({ className = "", ...props }) => {
    return <div className={`h-[1px] w-full bg-[#D6DAC8]/50 ${className}`} {...props} />
}

const Avatar = ({ children, className = "", ...props }) => {
    return (
        <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`} {...props}>
            {children}
        </div>
    )
}

const AvatarImage = ({ src, alt = "", className = "", ...props }) => {
    return (
        <img
            src={src || "/placeholder.svg"}
            alt={alt}
            className={`aspect-square h-full w-full object-cover ${className}`}
            {...props}
        />
    )
}

const AvatarFallback = ({ children, className = "", ...props }) => {
    return (
        <div
            className={`flex h-full w-full items-center justify-center rounded-full bg-[#FBF3D5] text-[#9CAFAA] ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}

const Badge = ({ children, variant = "default", className = "", ...props }) => {
    const variants = {
        default: "bg-[#9CAFAA] text-white",
        outline: "text-gray-700 border border-[#D6DAC8] bg-[#FBF3D5]/30",
    }

    return (
        <div
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#9CAFAA] focus:ring-offset-2 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}

const Progress = ({ value = 0, className = "", color = "#9CAFAA", ...props }) => {
    return (
        <div className={`relative h-2 w-full overflow-hidden rounded-full bg-[#D6DAC8]/30 ${className}`} {...props}>
            <div
                className="h-full w-full flex-1 transition-all"
                style={{ transform: `translateX(-${100 - value}%)`, backgroundColor: color }}
            />
        </div>
    )
}

export default function UserDashboard() {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [showPasswordChange, setShowPasswordChange] = useState(false)
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [passwordError, setPasswordError] = useState("")
    const profile = useSelector((state) => state.profile)
    const user = profile?.user || null
    const { token } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    
    // Default values will be used while loading
    const [userData, setUserData] = useState({
        fullName: "",
        age: "24", // Hardcoded as requested
        sex: "Not specified",
        phone: "",
        email: "",
        collegeName: "",
        collegeId: "",
        emergencyContact: "",
        password: "••••••••",
        ridesTaken: 0,
        lastRide: "No rides yet",
    })
    
    useEffect(() => {
        console.log("Dashboard mounted, FULL state:", { profile, token });
        
        // Try to get user data from localStorage first as a fallback
        let userFromStorage = null;
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                userFromStorage = JSON.parse(storedUser);
                console.log("User data from localStorage:", userFromStorage);
            }
        } catch (error) {
            console.error("Error parsing user from localStorage:", error);
        }
        
        // If we have user data from Redux or localStorage, use it
        if (user || userFromStorage) {
            const userData = user || userFromStorage;
            console.log("Setting userData from:", userData);
            
            setUserData({
                ...userData,
                fullName: userData.fullName || "",
                phone: userData.phone || "",
                email: userData.email || "",
                collegeName: userData.collegeName || "",
                collegeId: userData.collegeId?.secure_url || userData.image || "",
                emergencyContact: userData.emergencyContact || "",
            });
            setIsLoading(false);
        }
        // Otherwise if we have a token, try to fetch the user data
        else if (token) {
            console.log("Fetching user data with token");
            dispatch(getUserProfile(token))
                .then((response) => {
                    console.log("getUserProfile response:", response);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to fetch user profile:", err);
                    setIsLoading(false);
                });
        } else {
            console.log("No user data or token available");
            setIsLoading(false);
        }
    }, [user, token, dispatch])
    
    // Update userData when user data changes in Redux store
    useEffect(() => {
        if (user) {
            console.log("User data changed in Redux, updating component state:", user);
            setUserData({
                ...userData,
                fullName: user.fullName || "",
                phone: user.phone || "",
                email: user.email || "",
                collegeName: user.collegeName || "",
                collegeId: user.collegeId?.secure_url || user.image || "",
                emergencyContact: user.emergencyContact || "",
            })
        }
    }, [user])

    // Fetch user rides for dashboard
    useEffect(() => {
        const fetchUserRides = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/rides`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                
                const rides = response.data.data || [];
                
                if (rides.length > 0) {
                    // Sort rides by date (newest first) to find the latest ride
                    const sortedRides = [...rides].sort((a, b) => 
                        new Date(b.pickupTime) - new Date(a.pickupTime)
                    );
                    
                    // Format the date of the latest ride
                    const lastRideDate = new Date(sortedRides[0].pickupTime);
                    const formattedDate = new Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    }).format(lastRideDate);
                    
                    // Update user data with ride information
                    setUserData(prev => ({
                        ...prev,
                        ridesTaken: rides.length,
                        lastRide: formattedDate
                    }));
                }
            } catch (err) {
                console.error("Error fetching user rides:", err);
            }
        };
        
        if (!isLoading) {
            fetchUserRides();
        }
    }, [isLoading]);

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = () => {
        setIsEditing(false)
        // Here you would typically save the data to your backend
        // For now just revert to the data from the store
        if (user) {
            setUserData({
                ...userData,
                fullName: user.fullName || "",
                phone: user.phone || "",
                email: user.email || "",
                collegeName: user.collegeName || "",
                collegeId: user.collegeId?.secure_url || "",
                emergencyContact: user.emergencyContact || "",
            })
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user types
        if (passwordError) setPasswordError("")
    }

    const handlePasswordSubmit = async () => {
        // Validate passwords
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("New passwords do not match")
            return
        }
        if (passwordData.newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters long")
            return
        }

        try {
            const response = await apiConnector("PUT", UPDATE_PASSWORD_API, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, {
                Authorization: `Bearer ${token}`
            })

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Password updated successfully")
            setShowPasswordChange(false)
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            })
        } catch (error) {
            console.error("Password update error:", error)
            setPasswordError(error.response?.data?.message || "Failed to update password")
        }
    }

    // Navigate to ride history
    const goToRideHistory = () => {
        navigate('/my-rides?view=all');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader className="h-8 w-8 animate-spin mx-auto text-[#9CAFAA]" />
                    <p className="mt-2 text-gray-600">Loading your profile...</p>
                </div>
            </div>
        )
    }
    const userImage = `https://api.dicebear.com/5.x/initials/svg?seed=${user?.fullName}`
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FBF3D5]/50 to-white">
            <div className="container mx-auto py-10 px-4 max-w-6xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-4 border-[#EFBC9B]/30">
                            {user && user.image ? (
                                <AvatarImage src={userImage} alt={userData.fullName} />
                            ) : (
                                <AvatarFallback className="text-xl bg-[#FBF3D5] text-[#9CAFAA]">
                                    {userData.fullName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{userData.fullName}</h1>
                            <div className="flex items-center gap-2 text-gray-500">
                                <School className="h-4 w-4" />
                                <span>{userData.collegeName}</span>
                            </div>
                        </div>
                    </div>
                    <Badge variant="outline" className="px-3 py-1 text-sm bg-[#FBF3D5]/50 border-[#EFBC9B]/30 text-gray-700">
                        <Shield className="h-3.5 w-3.5 mr-1 text-[#9CAFAA]" />
                        Verified Student
                    </Badge>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Main Profile Card */}
                    <Card className="md:col-span-2 shadow-lg border-[#D6DAC8]/40 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#D6DAC8]/30 to-[#D6DAC8]/10 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl text-gray-800">Profile Information</CardTitle>
                                    <CardDescription>View and manage your personal details</CardDescription>
                                </div>
                                <Button
                                    variant={isEditing ? "default" : "outline"}
                                    size="sm"
                                    onClick={isEditing ? handleSave : handleEdit}
                                    className="flex items-center gap-1.5"
                                >
                                    {isEditing ? (
                                        <>
                                            <Save className="h-4 w-4" /> Save Changes
                                        </>
                                    ) : (
                                        <>
                                            <Edit2 className="h-4 w-4" /> Edit Profile
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        <CardContent className="space-y-8 p-6">
                            {/* Personal Details */}
                            <div>
                                <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-gray-800">
                                    <User className="h-5 w-5 text-[#9CAFAA]" /> Personal Details
                                </h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2.5">
                                        <Label htmlFor="fullName" className="text-sm text-gray-500">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="fullName"
                                            name="fullName"
                                            value={userData.fullName}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="border-[#D6DAC8]/60 focus:border-[#9CAFAA]"
                                        />
                                    </div>

                                    <div className="space-y-2.5">
                                        <Label htmlFor="age" className="text-sm text-gray-500">
                                            Age
                                        </Label>
                                        <Input
                                            id="age"
                                            name="age"
                                            value={userData.age}
                                            onChange={handleChange}
                                            disabled={true} // Age is hardcoded as requested
                                            className="border-[#D6DAC8]/60 focus:border-[#9CAFAA]"
                                        />
                                    </div>

                                    <div className="space-y-2.5">
                                        <Label htmlFor="sex" className="text-sm text-gray-500">
                                            Gender
                                        </Label>
                                        <Input
                                            id="sex"
                                            name="sex"
                                            value={user?.preferredGender || userData.sex}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="border-[#D6DAC8]/60 focus:border-[#9CAFAA]"
                                        />
                                    </div>

                                    <div className="space-y-2.5">
                                        <Label htmlFor="phone" className="text-sm text-gray-500">
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            value={userData.phone}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="border-[#D6DAC8]/60 focus:border-[#9CAFAA]"
                                        />
                                    </div>

                                    <div className="space-y-2.5 md:col-span-2">
                                        <Label htmlFor="email" className="text-sm text-gray-500">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            value={userData.email}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            type="email"
                                            className="border-[#D6DAC8]/60 focus:border-[#9CAFAA]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-[#D6DAC8]/30" />

                            {/* Academic Details */}
                            <div>
                                <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-gray-800">
                                    <School className="h-5 w-5 text-[#9CAFAA]" /> Academic Details
                                </h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2.5">
                                        <Label htmlFor="collegeName" className="text-sm text-gray-500">
                                            College Name
                                        </Label>
                                        <Input
                                            id="collegeName"
                                            name="collegeName"
                                            value={userData.collegeName}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="border-[#D6DAC8]/60 focus:border-[#9CAFAA]"
                                        />
                                    </div>

                                    <div className="space-y-2.5">
                                        <Label htmlFor="collegeId" className="text-sm text-gray-500">
                                            College ID
                                        </Label>
                                        {userData.collegeId ? (
                                            <div className="mt-2">
                                                <img 
                                                    src={userData.collegeId} 
                                                    alt="College ID" 
                                                    className="w-full max-h-48 object-contain rounded-lg border border-[#D6DAC8]/60"
                                                />
                                            </div>
                                        ) : (
                                            <Input
                                                id="collegeId"
                                                name="collegeId"
                                                value="No ID uploaded"
                                                disabled={true}
                                                className="border-[#D6DAC8]/60 focus:border-[#9CAFAA]"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-[#D6DAC8]/30" />

                            {/* Emergency Contact */}
                            <div>
                                <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-gray-800">
                                    <AlertCircle className="h-5 w-5 text-[#9CAFAA]" /> Emergency Contact
                                </h3>
                                <div className="space-y-2.5">
                                    <Label htmlFor="emergencyContact" className="text-sm text-gray-500">
                                        Emergency Contact Number
                                    </Label>
                                    <Input
                                        id="emergencyContact"
                                        name="emergencyContact"
                                        value={userData.emergencyContact}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="border-[#D6DAC8]/60 focus:border-[#9CAFAA]"
                                    />
                                </div>
                            </div>

                            <Separator className="bg-[#D6DAC8]/30" />

                            {/* Password Information */}
                            <div>
                                <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-gray-800">
                                    <Lock className="h-5 w-5 text-[#9CAFAA]" /> Password Information
                                </h3>
                                <div className="space-y-4">
                                    {!showPasswordChange ? (
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-500">Password</p>
                                                <p className="text-gray-700">••••••••</p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowPasswordChange(true)}
                                                className="flex items-center gap-1.5"
                                            >
                                                <Edit2 className="h-4 w-4" /> Change Password
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="currentPassword">Current Password</Label>
                                                <Input
                                                    id="currentPassword"
                                                    name="currentPassword"
                                                    type="password"
                                                    value={passwordData.currentPassword}
                                                    onChange={handlePasswordChange}
                                                    className="border-[#D6DAC8]/60 focus:border-[#9CAFAA]"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="newPassword">New Password</Label>
                                                <Input
                                                    id="newPassword"
                                                    name="newPassword"
                                                    type="password"
                                                    value={passwordData.newPassword}
                                                    onChange={handlePasswordChange}
                                                    className="border-[#D6DAC8]/60 focus:border-[#9CAFAA]"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                                <Input
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    type="password"
                                                    value={passwordData.confirmPassword}
                                                    onChange={handlePasswordChange}
                                                    className="border-[#D6DAC8]/60 focus:border-[#9CAFAA]"
                                                />
                                            </div>
                                            {passwordError && (
                                                <p className="text-sm text-red-500">{passwordError}</p>
                                            )}
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="default"
                                                    onClick={handlePasswordSubmit}
                                                    className="flex items-center gap-1.5"
                                                >
                                                    <Save className="h-4 w-4" /> Update Password
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setShowPasswordChange(false)
                                                        setPasswordData({
                                                            currentPassword: "",
                                                            newPassword: "",
                                                            confirmPassword: ""
                                                        })
                                                        setPasswordError("")
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Column - Stats and Info */}
                    <div className="space-y-8">
                        {/* Ride Statistics Card */}
                        <Card className="shadow-lg border-[#D6DAC8]/40 overflow-hidden">
                            <div className="bg-gradient-to-r from-[#D6DAC8]/30 to-[#D6DAC8]/10 px-6 py-4">
                                <CardTitle className="text-xl text-gray-800">Ride Statistics</CardTitle>
                                <CardDescription>Your ride activity summary</CardDescription>
                            </div>

                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-5">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-[#9CAFAA]/20 p-2 rounded-full">
                                                    <Car className="h-5 w-5 text-[#9CAFAA]" />
                                                </div>
                                                <span className="font-medium text-gray-700">Rides Taken</span>
                                            </div>
                                            <span className="text-2xl font-bold text-gray-800">{userData.ridesTaken}</span>
                                        </div>
                                        <Progress value={Math.min(userData.ridesTaken * 10, 100)} color="#9CAFAA" className="h-2" />
                                    </div>

                                    <div className="pt-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-[#D6DAC8]/30 p-2 rounded-full">
                                                    <Calendar className="h-5 w-5 text-[#9CAFAA]" />
                                                </div>
                                                <span className="font-medium text-gray-700">Last Ride</span>
                                            </div>
                                            <span className="font-medium text-gray-600">{userData.lastRide}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="px-6 pb-6 pt-0">
                                <Button 
                                    className="w-full bg-[#9CAFAA] hover:bg-[#8a9e99] text-white"
                                    onClick={goToRideHistory}
                                >
                                    View Ride History
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* College ID Card */}
                        {userData.collegeId && (
                            <Card className="shadow-lg border-[#D6DAC8]/40 overflow-hidden">
                                <div className="bg-gradient-to-r from-[#D6DAC8]/30 to-[#D6DAC8]/10 px-6 py-4">
                                    <CardTitle className="text-xl text-gray-800">College ID</CardTitle>
                                    <CardDescription>Your verified college identification</CardDescription>
                                </div>

                                <CardContent className="p-6">
                                    <div className="flex justify-center">
                                        <img
                                            src={userData.collegeId}
                                            alt="College ID"
                                            className="max-h-72 w-auto object-contain rounded-lg border border-[#D6DAC8]/60"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

