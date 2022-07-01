const express = require('express');
const mysql = require('mysql2');
const nodemon = require('nodemon');
const inputCheck = require('./utils/inputCheck');
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


//  * Get all candidates
app.get('/api/candidates', (req, res) => {
  const sql = `SELECT candidates.*, parties.name
             AS party_name
             FROM candidates
             LEFT JOIN parties
             ON candidates.party_id = parties.id`;

  //* GET a single candidate
  db.query(sql, (err, rows) => {
    if (err) {
        //  ! error code 500: server error
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
        message: 'success',
        data: rows
    });
  });
});


//  * Get a single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
             AS party_name
             FROM candidates
             LEFT JOIN parties
             ON candidates.party_id = parties.id
             WHERE candidates.id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            // ! error code 400: user request error
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});



//* Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Candidate not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});



// * Create a new candidate
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({ errors: errors });
        return;
    };

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
        VALUES (?, ?, ?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});


//         console.log(err);
//     }
//     console.log(result);
// });


//  Catch all route for error handling
app.use((req, re) => {
    res.status(404).end();
})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});