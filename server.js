const express = require('express');
const mysql = require('mysql2');
const nodemon = require('nodemon');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "election",
  },
  console.log("Connected to election database")
);

// GET a single candidate
db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
  if (err) {
    console.log(err);
  }
  console.log(row);
});

//* Delete a candidate
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

// Create a new candidate
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
            VALUES (?, ?, ?, ?)`;
const params = [1, 'Ronald', 'Firbank', 1];

db.query(sql, params, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
});


//  Catch all route for error handling
app.use((req, re) => {
    res.status(404).end();
})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});