const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const port = 3024;

const app = express();
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/data_info');

const db = mongoose.connection;
db.once('open', () => {
    console.log("Mongodb Connection Successful");
});

const userSchema = new mongoose.Schema({
    course: String,
    branch: String,
    year: String,
    phno: String,
    email: String,
    answers: Object,
    marks: Number
});
const users = mongoose.model('User', userSchema);



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'exam.html'));
});

app.post('/submit', async (req, res) => {
    const { course, branch, year, phno, email,answers, marks } = req.body;
    const user = new users({
        course,
        branch,
        year,
        phno,
        email,
        answers,
        marks 
    });
    await user.save();
    res.sendFile(path.join(__dirname, 'exam.html'));
});

app.post('/submit_exam', async (req, res) => {
    const { email, q1, q2 } = req.body;
    const correctAnswers = { q1: '4', q2: 'Paris' };
    let marks = 0;

    if (q1 === correctAnswers.q1) marks=marks+1;
    if (q2 === correctAnswers.q2) marks=marks+1;

    await users.findOneAndUpdate({ email }, {
        answers: { q1, q2 },
        marks
    });
    console.log('Marks:', marks); 
    res.json({ marks: marks });


    console.log("Exam Submitted Successfully");
});

app.listen(port, () => {
    console.log(`Server Started on port ${port}`);
});
