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


// * Update user email address
router.post('/voter/:id', (req, res) => {
    // Data validation
    const errors = inputCheck(req.body, "email");
    if (errors) {
       res.status(400).json({ error: errors });
       return;
    }

    const sql = `UPDATE voters SET email = ? WHERE id = ?`;
    const params = [req.body.email, req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Voter not found'
            });
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});


// * Delete voter from database
router.delete("/voter/:id", (req, res) => {
    const sql = `DELETE FROM voters WHERE id = ?`;

    db.query(sql, req.params.id, (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({
                message: "Voter not found",
            });
        } else {
            res.json({
                message: "deleted",
                changes: result.affectedRows,
                id: req.params.id,
            });
        }
    });
});

module.exports = router;


// * Other useful SQL clauses
//? -- get all voters who do not have a last name of Cooper or Jarman
// SELECT * FROM voters WHERE last_name != 'Cooper' AND last_name != 'Jarman';

//? -- get all voters who have a .edu email address
// SELECT * FROM voters WHERE email LIKE '%.edu';

//? -- get only the last created voter
// SELECT * FROM voters ORDER BY created_at DESC LIMIT 1;