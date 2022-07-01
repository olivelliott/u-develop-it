const express = require("express");
const router = express.Router();
const db = require("../../db/connection");
const inputCheck = require("../../utils/inputCheck");

// * Show all voters & sort by last name
router.get('/voters', (req, res) => {
    const sql = `SELECT * FROM voters ORDER BY last_name`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows,
        });
    });
});


// * Get a single voter
router.get('/voter/:id', (req, res) => {
    const sql = `SELECT * FROM voters WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        res.json({
            message: 'success',
            data: row
        });
    });
});

// * Create a single voter
router.post('/voter', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'email');
    if(errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `INSERT INTO voters (first_name, last_name, email) VALUES (?, ?, ?)`;
    const params = [body.first_name, body.last_name, body.email];

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


// *

module.exports = router;


// * Other useful SQL clauses
//? -- get all voters who do not have a last name of Cooper or Jarman
// SELECT * FROM voters WHERE last_name != 'Cooper' AND last_name != 'Jarman';

//? -- get all voters who have a .edu email address
// SELECT * FROM voters WHERE email LIKE '%.edu';

//? -- get only the last created voter
// SELECT * FROM voters ORDER BY created_at DESC LIMIT 1;