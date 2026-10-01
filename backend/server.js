const express = require("express");
const cors = require("cors");

require("./db");

const internshipRoutes = require("./routes/internships");

const app = express();

const PORT = process.env.PORT || 5000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Internship Board API is running"
    });

});


// ==========================================
// API ROUTES
// ==========================================

app.use(
    "/api/internships",
    internshipRoutes
);


// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Route not found"
    });

});


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});
