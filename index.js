require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("./helpers/appLogger");
const PORT = process.env.PORT || process.env.DEV_PORT;

// Import database connection
require("./database/mongoConnection");

// Middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
express.urlencoded({ extended: true });
app.use(cookieParser());

// Set trust proxy for secure cookies
app.set("trust proxy", 1);

// Routes
app.get("/", (req, res) => {
  res.send("Ayur Minds Authentication Service");
});

const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

// HTTP request logger
app.listen(PORT, () => {
  logger.info(`Server is starting at ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Promise Rejection: ${err}`);
});