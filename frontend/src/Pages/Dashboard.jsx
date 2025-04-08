import { useState } from "react"
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
    const [isEditing, setIsEditing] = useState(false)

    const [userData, setUserData] = useState({
        fullName: "John Doe",
        age: "22",
        sex: "Male",
        phone: "+1 (555) 123-4567",
        email: "john.doe@example.com",
        collegeName: "University of Technology",
        collegeId: "UT2023456",
        emergencyContact: "+1 (555) 987-6543",
        password: "••••••••",
        ridesTaken: 42,
        lastRide: "March 8, 2025",
    })

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = () => {
        setIsEditing(false)
        // Here you would typically save the data to your backend
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FBF3D5]/50 to-white">
            <div className="container mx-auto py-10 px-4 max-w-6xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-4 border-[#EFBC9B]/30">
                            <AvatarImage src="/placeholder.svg?height=64&width=64" alt={userData.fullName} />
                            <AvatarFallback className="text-xl bg-[#FBF3D5] text-[#9CAFAA]">
                                {userData.fullName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </AvatarFallback>
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
                                            disabled={!isEditing}
                                            className="border-[#D6DAC8]/60 focus:border-[#9CAFAA]"
                                        />
                                    </div>

                                    <div className="space-y-2.5">
                                        <Label htmlFor="sex" className="text-sm text-gray-500">
                                            Sex
                                        </Label>
                                        <Input
                                            id="sex"
                                            name="sex"
                                            value={userData.sex}
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
                                        <Input
                                            id="collegeId"
                                            name="collegeId"
                                            value={userData.collegeId}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="border-[#D6DAC8]/60 focus:border-[#9CAFAA]"
                                        />
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
                                <div className="space-y-2.5">
                                    <Label htmlFor="password" className="text-sm text-gray-500">
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        value={userData.password}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        type={isEditing ? "text" : "password"}
                                        className="border-[#D6DAC8]/60 focus:border-[#9CAFAA]"
                                    />
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
                                        <Progress value={70} color="#9CAFAA" className="h-2" />
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
                                <Button className="w-full bg-[#9CAFAA] hover:bg-[#8a9e99] text-white">View Ride History</Button>
                            </CardFooter>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    )
}

