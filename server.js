const express = require('express');
const nodemon = require('nodemon');
const db = require('./db/connection');
const apiRoutes = require("./routes/apiRoutes");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api", apiRoutes);


//*  Catch all route for error handling
app.use((req, re) => {
    res.status(404).end();
})

//* Start server after DB connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});