const express = require("express");
const router = express.Router();

const db = require("../db");
const validateInternship = require("../middleware/validation");


// ==========================================
// GET ALL INTERNSHIPS
// GET /api/internships
// ==========================================

router.get("/", (req, res) => {

    const page = Math.max(
        parseInt(req.query.page) || 1,
        1
    );

    const limit = Math.min(
        Math.max(parseInt(req.query.limit) || 6, 1),
        50
    );

    const offset = (page - 1) * limit;

    const search =
        String(req.query.search || "").trim();

    const domain =
        String(req.query.domain || "").trim();


    let conditions = [];
    let params = [];


    if (search) {

        conditions.push(`
            (
                title LIKE ?
                OR company LIKE ?
                OR domain LIKE ?
            )
        `);

        const searchValue = `%${search}%`;

        params.push(
            searchValue,
            searchValue,
            searchValue
        );
    }


    if (domain && domain !== "all") {

        conditions.push("domain = ?");

        params.push(domain);
    }


    const whereClause =
        conditions.length > 0
            ? `WHERE ${conditions.join(" AND ")}`
            : "";


    const countQuery = `
        SELECT COUNT(*) AS total
        FROM internships
        ${whereClause}
    `;


    db.get(
        countQuery,
        params,
        (countError, countResult) => {

            if (countError) {

                return res.status(500).json({
                    success: false,
                    message: "Failed to count internships"
                });
            }


            const total = countResult.total;

            const totalPages =
                Math.ceil(total / limit);


            const dataQuery = `
                SELECT *
                FROM internships
                ${whereClause}
                ORDER BY id DESC
                LIMIT ? OFFSET ?
            `;


            db.all(
                dataQuery,
                [...params, limit, offset],
                (error, rows) => {

                    if (error) {

                        return res.status(500).json({
                            success: false,
                            message: "Failed to fetch internships"
                        });
                    }


                    res.json({
                        success: true,

                        pagination: {
                            page,
                            limit,
                            total,
                            totalPages
                        },

                        data: rows
                    });
                }
            );
        }
    );
});


// ==========================================
// GET ONE INTERNSHIP
// GET /api/internships/:id
// ==========================================

router.get("/:id", (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {

        return res.status(400).json({
            success: false,
            message: "Invalid internship ID"
        });
    }


    db.get(
        "SELECT * FROM internships WHERE id = ?",
        [id],
        (error, row) => {

            if (error) {

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch internship"
                });
            }


            if (!row) {

                return res.status(404).json({
                    success: false,
                    message: "Internship not found"
                });
            }


            res.json({
                success: true,
                data: row
            });
        }
    );
});


// ==========================================
// CREATE INTERNSHIP
// POST /api/internships
// ==========================================

router.post(
    "/",
    validateInternship,
    (req, res) => {

        const {
            title,
            company,
            domain,
            location,
            type,
            duration,
            stipend
        } = req.body;


        const query = `
            INSERT INTO internships
            (
                title,
                company,
                domain,
                location,
                type,
                duration,
                stipend
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;


        db.run(
            query,
            [
                title.trim(),
                company.trim(),
                domain.trim(),
                location.trim(),
                type.trim(),
                duration.trim(),
                stipend.trim()
            ],
            function (error) {

                if (error) {

                    return res.status(500).json({
                        success: false,
                        message: "Failed to create internship"
                    });
                }


                res.status(201).json({
                    success: true,
                    message: "Internship created successfully",
                    id: this.lastID
                });
            }
        );
    }
);


// ==========================================
// UPDATE INTERNSHIP
// PUT /api/internships/:id
// ==========================================

router.put(
    "/:id",
    validateInternship,
    (req, res) => {

        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid internship ID"
            });
        }


        const {
            title,
            company,
            domain,
            location,
            type,
            duration,
            stipend
        } = req.body;


        const query = `
            UPDATE internships
            SET
                title = ?,
                company = ?,
                domain = ?,
                location = ?,
                type = ?,
                duration = ?,
                stipend = ?
            WHERE id = ?
        `;


        db.run(
            query,
            [
                title.trim(),
                company.trim(),
                domain.trim(),
                location.trim(),
                type.trim(),
                duration.trim(),
                stipend.trim(),
                id
            ],
            function (error) {

                if (error) {

                    return res.status(500).json({
                        success: false,
                        message: "Failed to update internship"
                    });
                }


                if (this.changes === 0) {

                    return res.status(404).json({
                        success: false,
                        message: "Internship not found"
                    });
                }


                res.json({
                    success: true,
                    message: "Internship updated successfully"
                });
            }
        );
    }
);


// ==========================================
// DELETE INTERNSHIP
// DELETE /api/internships/:id
// ==========================================

router.delete("/:id", (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {

        return res.status(400).json({
            success: false,
            message: "Invalid internship ID"
        });
    }


    db.run(
        "DELETE FROM internships WHERE id = ?",
        [id],
        function (error) {

            if (error) {

                return res.status(500).json({
                    success: false,
                    message: "Failed to delete internship"
                });
            }


            if (this.changes === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Internship not found"
                });
            }


            res.json({
                success: true,
                message: "Internship deleted successfully"
            });
        }
    );
});


module.exports = router;
