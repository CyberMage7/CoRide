const express = require("express");
const app = express();

const userRoutes = require("./routes/authRoutes");
// const profileRoutes = require("./routes/Profile");

const fileUpload = require("express-fileupload");
const database = require("./config/database");
const cloudinary = require("./config/cloudinary");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();
//cloudinary connect
cloudinary.cloudinaryConnect();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: ["http://localhost:3000", "http://localhost:5173"],
		credentials:true,
	})
);
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
		debug: true,
		limits: { fileSize: 10 * 1024 * 1024 },
		abortOnLimit: true,
		responseOnLimit: "File size limit exceeded (10MB)"
	})
);

app.use("/api/v1/auth", userRoutes);
// app.use("/api/v1/profile", profileRoutes);

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})



