const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // confirmpassword:{type:String,required:true},
    collegeName: { type: String, required: true },
    // profilePicture: { type: String }, // images
    collegeId: { 
      public_id: { type: String },
      secure_url: { type: String },
    },  // images from cloudinary
    preferredGender: { type: String },
    emergencyContact: { type: String },
    token: {
        type: String,
      },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
)



module.exports = mongoose.model("user", userSchema);

// import mongoose from "mongoose"
// import bcrypt from "bcryptjs"
// import crypto from "crypto"

// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Please provide a name"],
//   },
//   email: {
//     type: String,
//     required: [true, "Please provide an email"],
//     unique: true,
//     match: [/^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Please provide a valid email"],
//   },
//   password: {
//     type: String,
//     required: [true, "Please add a password"],
//     minlength: 6,
//     select: false,
//   },
//   isEmailVerified: {
//     type: Boolean,
//     default: false,
//   },
//   resetPasswordToken: String,
//   resetPasswordExpire: Date,
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// })

// // Hash password before saving
// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next()
//   }

//   const salt = await bcrypt.genSalt(10)
//   this.password = await bcrypt.hash(this.password, salt)
//   next()
// })

// // Match password
// UserSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password)
// }

// // Generate reset password token
// UserSchema.methods.getResetPasswordToken = function () {
//   const resetToken = crypto.randomBytes(20).toString("hex")

//   this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

//   this.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // 10 minutes

//   return resetToken
// }

// export default mongoose.model("User", UserSchema)

