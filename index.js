import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

let quiz = [
  { country: "France", capital: "Paris" },
  { country: "United Kingdom", capital: "London" },
  { country: "United States of America", capital: "Washington, D.C." },
  { country: "Germany", capital: "Berlin" },
  { country: "Italy", capital: "Rome" },
  { country: "Spain", capital: "Madrid" },
  { country: "Canada", capital: "Ottawa" },
  { country: "Australia", capital: "Canberra" },
  { country: "Japan", capital: "Tokyo" },
  { country: "China", capital: "Beijing" },
  { country: "India", capital: "New Delhi" },
  { country: "Brazil", capital: "Brasilia" },
  { country: "Russia", capital: "Moscow" },
  { country: "Mexico", capital: "Mexico City" },
  { country: "South Korea", capital: "Seoul" },
  { country: "Argentina", capital: "Buenos Aires" },
  { country: "South Africa", capital: "Pretoria" },
  { country: "Egypt", capital: "Cairo" },
  { country: "Turkey", capital: "Ankara" },
  { country: "Netherlands", capital: "Amsterdam" },
  { country: "Sweden", capital: "Stockholm" },
  { country: "Switzerland", capital: "Bern" },
  { country: "Greece", capital: "Athens" },
];

let totalCorrect = 0;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = {};

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  await nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];

  currentQuestion = randomCountry;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
