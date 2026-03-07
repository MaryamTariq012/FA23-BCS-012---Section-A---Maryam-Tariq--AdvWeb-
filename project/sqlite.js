const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("students.db");

db.serialize(() => {

    db.run("CREATE TABLE IF NOT EXISTS students (id INTEGER, name TEXT)");

    db.run("INSERT INTO students VALUES (1,'Ahmed')");

    db.each("SELECT * FROM students", (err, row) => {
        console.log(row);
    });

});

db.close();