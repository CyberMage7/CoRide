const bcrypt = require("bcrypt")
const User = require("../models/User")
const OTP = require("../models/OTP")
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")
const mailSender = require("../utils/mailSender")
exports.signup = async (req, res) => {
  try {
    const { fullName, email, phone, password,collegeName,preferredGender,emergencyContact,otp, } = req.body
     // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }
     // Get thumbnail image from request files
    
        // Find the most recent OTP for the email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
        console.log(response)
        if (response.length === 0) {
          // OTP not found for the email
          return res.status(400).json({
            success: false,
            message: "The OTP is not found",
          })
        } else if (otp !== response[0].otp) {
          // Invalid OTP
          return res.status(400).json({
            success: false,
            message: "The OTP is not valid",
          })
        }
   

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
        fullName,
        email,
        phone,
        password: hashedPassword,
        collegeName,
        preferredGender,
        emergencyContact,
        // collegeId: "",
        // profilePicture: `https://api.dicebear.com/5.x/initials/svg?seed=${fullName}`,
      })
      
      return res.status(200).json({
        success: true,
        user,
        message: "User registered successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "User cannot be registered. Please try again.",
      })
    }
}

exports.sendotp = async (req, res) => {
	try {
		const { email } = req.body;

		// Check if user is already present
		// Find user with provided email
		const checkUserPresent = await User.findOne({ email });
		// to be used in case of signup

		// If user found with provided email
		if (checkUserPresent) {
			// Return 401 Unauthorized status code with error message
			return res.status(401).json({
				success: false,
				message: `User is Already Registered`,
			});
		}

		var otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});
		const result = await OTP.findOne({ otp: otp });
		console.log("Result is Generate OTP Func");
		console.log("OTP", otp);
		console.log("Result", result);
		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
			});
		}
		const otpPayload = { email, otp };
		const otpBody = await OTP.create(otpPayload);
		console.log("OTP Body", otpBody);
		res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
			otp,
		});
	} catch (error) {
		console.log("faild to sent otp")
		console.log(error.message);
		return res.status(500).json({ success: false, error: error.message });
	}
};

// Login controller for authenticating users
exports.login = async (req, res) => {
	try {
		// Get email and password from request body
		const { email, password } = req.body;

		// Check if email or password is missing
		if (!email || !password) {
			// Return 400 Bad Request status code with error message
			return res.status(400).json({
				success: false,
				message: `Please Fill up All the Required Fields`,
			});
		}

		// Find user with provided email
		const user = await User.findOne({ email })

		// If user not found with provided email
		if (!user) {
			// Return 401 Unauthorized status code with error message
			return res.status(401).json({
				success: false,
				message: `User is not Registered with Us Please SignUp to Continue`,
			});
		}

		// Generate JWT token and Compare Password
		if (await bcrypt.compare(password, user.password)) {
			const token = jwt.sign(
				{ email: user.email, id: user._id},
				process.env.JWT_SECRET,
				{
					expiresIn: "24h",
				}
			);

			// Save token to user document in database
			user.token = token;
			user.password = undefined;
			// Set cookie for token and return success response
			const options = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
				httpOnly: true,
			};
			res.cookie("token", token, options).status(200).json({
				success: true,
				token,
				user,
				message: `User Login Success`,
			});
		} else {
			return res.status(401).json({
				success: false,
				message: `Password is incorrect`,
			});
		}
	} catch (error) {
		console.error(error);
		// Return 500 Internal Server Error status code with error message
		return res.status(500).json({
			success: false,
			message: `Login Failure Please Try Again`,
		});
	}
};

// Send OTP For Email Verification
// exports.sendotp = async (req, res) => {
//     try {
//       const { email } = req.body
  
//       // Check if user is already present
//       // Find user with provided email
//       const checkUserPresent = await User.findOne({ email })
//       // to be used in case of signup
  
//       // If user found with provided email
//       if (checkUserPresent) {
//         // Return 401 Unauthorized status code with error message
//         return res.status(401).json({
//           success: false,
//           message: `User is Already Registered`,
//         })
//       }
  
//       var otp = otpGenerator.generate(6, {
//         upperCaseAlphabets: false,
//         lowerCaseAlphabets: false,
//         specialChars: false,
//       })
//       const result = await OTP.findOne({ otp: otp })
//       console.log("Result is Generate OTP Func")
//       console.log("OTP", otp)
//       console.log("Result", result)
//       while (result) {
//         otp = otpGenerator.generate(6, {
//           upperCaseAlphabets: false,
//         })
//       }
//       const otpPayload = { email, otp }
//       const otpBody = await OTP.create(otpPayload)
//       console.log("OTP Body", otpBody)
//       res.status(200).json({
//         success: true,
//         message: `OTP Sent Successfully`,
//         otp,
//       })
//     } catch (error) {
//       console.log(error.message)
//       return res.status(500).json({ success: false, error: error.message })
//     }
//   }



// export const verifyOTP = async (req, res) => {
//   try {
//     const { phone, otp } = req.body
//     // Implement OTP verification logic here
//     // For demonstration, we'll assume the OTP is always valid
//     const user = await User.findOne({ phone })
//     if (!user) {
//       return res.status(404).json({ message: "User not found" })
//     }
//     user.isVerified = true
//     await user.save()
//     res.json({ message: "OTP verified successfully" })
//   } catch (error) {
//     res.status(500).json({ message: "Error verifying OTP", error: error.message })
//   }
// }


// import jwt from "jsonwebtoken"
// import User from "../models/User.js"
// import OTP from "../models/OTP.js"
// import { sendEmail } from "../utils/mailSender.js"
// import { createOTP } from "../utils/otpServices.js"
// import emailVerificationTemplate from "../mail/templates/emailVerificationTemplate.js"

// // Generate JWT token
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE,
//   })
// }

// // @desc    Register user
// // @route   POST /api/auth/register
// // @access  Public
// export const register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body

//     // Check if user already exists
//     const existingUser = await User.findOne({ email })
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists",
//       })
//     }

//     // Create user
//     const user = await User.create({
//       name,
//       email,
//       password,
//     })

//     // Generate OTP for email verification
//     const otp = await createOTP(user._id, email)

//     // Send verification email
//     const verificationEmail = emailVerificationTemplate(name, otp)
//     await sendEmail({
//       to: email,
//       subject: "Email Verification",
//       html: verificationEmail,
//     })

//     // Generate token
//     const token = generateToken(user._id)

//     res.status(201).json({
//       success: true,
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         isEmailVerified: user.isEmailVerified,
//       },
//     })
//   } catch (error) {
//     console.error("Registration error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

// // @desc    Login user
// // @route   POST /api/auth/login
// // @access  Public
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body

//     // Check if email and password are provided
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide email and password",
//       })
//     }

//     // Check if user exists
//     const user = await User.findOne({ email }).select("+password")
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       })
//     }

//     // Check if password matches
//     const isMatch = await user.matchPassword(password)
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       })
//     }

//     // Generate token
//     const token = generateToken(user._id)

//     res.status(200).json({
//       success: true,
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         isEmailVerified: user.isEmailVerified,
//       },
//     })
//   } catch (error) {
//     console.error("Login error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

// // @desc    Verify email with OTP
// // @route   POST /api/auth/verify-email
// // @access  Private
// export const verifyEmail = async (req, res) => {
//   try {
//     const { otp } = req.body
//     const userId = req.user.id

//     // Find the OTP record
//     const otpRecord = await OTP.findOne({ userId })
//     if (!otpRecord) {
//       return res.status(400).json({
//         success: false,
//         message: "OTP not found or expired",
//       })
//     }

//     // Check if OTP is expired
//     if (otpRecord.expiresAt < Date.now()) {
//       await OTP.deleteOne({ _id: otpRecord._id })
//       return res.status(400).json({
//         success: false,
//         message: "OTP expired",
//       })
//     }

//     // Verify OTP
//     if (otpRecord.otp !== otp) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid OTP",
//       })
//     }

//     // Update user's email verification status
//     await User.findByIdAndUpdate(userId, { isEmailVerified: true })

//     // Delete the used OTP
//     await OTP.deleteOne({ _id: otpRecord._id })

//     res.status(200).json({
//       success: true,
//       message: "Email verified successfully",
//     })
//   } catch (error) {
//     console.error("Email verification error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

// // @desc    Resend verification OTP
// // @route   POST /api/auth/resend-otp
// // @access  Private
// export const resendOTP = async (req, res) => {
//   try {
//     const userId = req.user.id

//     // Get user
//     const user = await User.findById(userId)
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       })
//     }

//     // Check if email is already verified
//     if (user.isEmailVerified) {
//       return res.status(400).json({
//         success: false,
//         message: "Email already verified",
//       })
//     }

//     // Generate new OTP
//     const otp = await createOTP(userId, user.email)

//     // Send verification email
//     const verificationEmail = emailVerificationTemplate(user.name, otp)
//     await sendEmail({
//       to: user.email,
//       subject: "Email Verification",
//       html: verificationEmail,
//     })

//     res.status(200).json({
//       success: true,
//       message: "Verification OTP sent successfully",
//     })
//   } catch (error) {
//     console.error("Resend OTP error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

// // @desc    Get current user
// // @route   GET /api/auth/me
// // @access  Private
// export const getMe = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id)

//     res.status(200).json({
//       success: true,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         isEmailVerified: user.isEmailVerified,
//       },
//     })
//   } catch (error) {
//     console.error("Get me error:", error)
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

