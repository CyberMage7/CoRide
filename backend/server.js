const express = require("express");
const app = express();

const userRoutes = require("./routes/authRoutes");
// const profileRoutes = require("./routes/Profile");


const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: ["http://localhost:3000", "http://localhost:5173"],
		credentials:true,
	})
)


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



