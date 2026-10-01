const fs = require("fs");
const path = require("path");
const db = require("./db");

const dataPath = path.join(__dirname, "..", "data", "internships.json");

const internships = JSON.parse(
  fs.readFileSync(dataPath, "utf8")
);

db.get("SELECT COUNT(*) AS count FROM internships", (err, row) => {
  if (err) {
    console.error("Database check failed:", err.message);
    return;
  }

  if (row.count > 0) {
    console.log("Database already contains internship records.");
    db.close();
    return;
  }

  const sql = `
    INSERT INTO internships
    (title, company, domain, location, type, duration, stipend)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  let completed = 0;

  internships.forEach((internship) => {
    db.run(
      sql,
      [
        internship.title,
        internship.company,
        internship.domain,
        internship.location,
        internship.type,
        internship.duration,
        internship.stipend
      ],
      (err) => {
        if (err) {
          console.error("Insert failed:", err.message);
          return;
        }

        completed++;

        if (completed === internships.length) {
          console.log(
            `Successfully inserted ${completed} internships.`
          );
          db.close();
        }
      }
    );
  });
});
