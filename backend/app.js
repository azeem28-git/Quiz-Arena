const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/quizapp")
.then(()=>console.log("DB connected"))
.catch(err=>console.log(err));

// Serve static files from views directory
app.use(express.static(path.join(__dirname, '../views')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Root route
app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/quiz', (req, res) => {
    res.render('quiz.ejs');
});

app.get('/index', (req, res) => {
    res.render('index.ejs');
});

app.get('/leaderboard', (req, res) => {
    res.render('leaderboard.ejs');
});

app.get('/auth', (req, res) => {
    res.render('auth.ejs');
});

try {
    console.log("Server setup successful");
} catch (err) {
    console.log(err);
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});