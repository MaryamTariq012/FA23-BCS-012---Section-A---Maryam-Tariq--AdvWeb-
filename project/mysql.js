const mysql = require("mysql2");

// Replace password if you have one
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "studentDB"
});

connection.connect();

// CREATE
connection.query(
    "INSERT INTO students (name, age) VALUES ('Sara', 20)",
    (err, result) => {
        if (err) throw err;
        console.log("MySQL: Record inserted");
    }
);

// READ
connection.query(
    "SELECT * FROM students",
    (err, result) => {
        if (err) throw err;
        console.log("MySQL Data:", result);
    }
);

// UPDATE
connection.query(
    "UPDATE students SET age=21 WHERE name='Sara'",
    (err) => {
        if (err) throw err;
        console.log("MySQL: Record updated");
    }
);

// DELETE
connection.query(
    "DELETE FROM students WHERE name='Sara'",
    (err) => {
        if (err) throw err;
        console.log("MySQL: Record deleted");
    }
);

connection.end();