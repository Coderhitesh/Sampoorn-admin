const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db/db");
const router = require("./routers/router");

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route Handlers
app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the API!" });
});

app.post('/admin-login', (req, res) => {
    console.log(req.body)
    const { email, password } = req.body;
    const defaultEmail = process.env.ADMIN_EMAIL || "admin@gmail.com"
    const defaultPassword = process.env.ADMIN_PASSWORD || "upfda@admin";

    console.log(defaultEmail)
    if (email === defaultEmail && password === defaultPassword) {

        res.json({ message: 'Login successful', login: true })
    } else {
        res.status(401).json({ message: 'Invalid credentials' })
    }
})

// API Routes
app.use('/api/v1', router);

// 404 Middleware (for unknown routes)
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error"
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});