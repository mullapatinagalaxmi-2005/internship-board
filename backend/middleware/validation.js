function validateInternship(req, res, next) {

    const requiredFields = [
        "title",
        "company",
        "domain",
        "location",
        "type",
        "duration",
        "stipend"
    ];

    const missingFields = requiredFields.filter(
        (field) =>
            !req.body[field] ||
            String(req.body[field]).trim() === ""
    );

    if (missingFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            missingFields
        });
    }

    next();
}

module.exports = validateInternship;
