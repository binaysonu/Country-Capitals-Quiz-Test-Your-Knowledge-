import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/worldDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the schema
const capitalSchema = new mongoose.Schema({
  country: String,
  capital: String,
});

// Create the model
const Capital = mongoose.model("Capital", capitalSchema);

// Sample data (50 countries and capitals)
const sampleData = [
  { country: "United States", capital: "Washington, D.C." },
  { country: "Canada", capital: "Ottawa" },
  { country: "United Kingdom", capital: "London" },
  { country: "Germany", capital: "Berlin" },
  { country: "France", capital: "Paris" },
  { country: "Italy", capital: "Rome" },
  { country: "Spain", capital: "Madrid" },
  { country: "Russia", capital: "Moscow" },
  { country: "China", capital: "Beijing" },
  { country: "Japan", capital: "Tokyo" },
  { country: "India", capital: "New Delhi" },
  { country: "Brazil", capital: "Brasília" },
  { country: "Mexico", capital: "Mexico City" },
  { country: "Australia", capital: "Canberra" },
  { country: "South Korea", capital: "Seoul" },
  { country: "South Africa", capital: "Pretoria" },
  { country: "Argentina", capital: "Buenos Aires" },
  { country: "Colombia", capital: "Bogotá" },
  { country: "Egypt", capital: "Cairo" },
  { country: "Nigeria", capital: "Abuja" },
  { country: "Turkey", capital: "Ankara" },
  { country: "Thailand", capital: "Bangkok" },
  { country: "Vietnam", capital: "Hanoi" },
  { country: "Indonesia", capital: "Jakarta" },
  { country: "Malaysia", capital: "Kuala Lumpur" },
  { country: "Philippines", capital: "Manila" },
  { country: "Pakistan", capital: "Islamabad" },
  { country: "Bangladesh", capital: "Dhaka" },
  { country: "Saudi Arabia", capital: "Riyadh" },
  { country: "Iran", capital: "Tehran" },
  { country: "Iraq", capital: "Baghdad" },
  { country: "Israel", capital: "Jerusalem" },
  { country: "Sweden", capital: "Stockholm" },
  { country: "Norway", capital: "Oslo" },
  { country: "Denmark", capital: "Copenhagen" },
  { country: "Finland", capital: "Helsinki" },
  { country: "Poland", capital: "Warsaw" },
  { country: "Netherlands", capital: "Amsterdam" },
  { country: "Belgium", capital: "Brussels" },
  { country: "Switzerland", capital: "Bern" },
  { country: "Portugal", capital: "Lisbon" },
  { country: "Greece", capital: "Athens" },
  { country: "Czech Republic", capital: "Prague" },
  { country: "Hungary", capital: "Budapest" },
  { country: "Austria", capital: "Vienna" },
  { country: "New Zealand", capital: "Wellington" },
  { country: "Chile", capital: "Santiago" },
  { country: "Peru", capital: "Lima" },
  { country: "Venezuela", capital: "Caracas" },
  { country: "Cuba", capital: "Havana" },
];

// Function to insert data if DB is empty
async function seedDatabase() {
  const count = await Capital.countDocuments();
  if (count === 0) {
    await Capital.insertMany(sampleData);
    console.log("Database seeded with 50 country-capital pairs.");
  } else {
    console.log("Database already contains data.");
  }
}

await seedDatabase(); // Run at startup

let quiz = [];
let totalCorrect = 0;
let currentQuestion = {};

// Load quiz data
async function loadQuizData() {
  quiz = await Capital.find();
}
await loadQuizData();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  await nextQuestion();
  res.render("index.ejs", { question: currentQuestion });
});

// POST answer submission
app.post("/submit", async (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;

  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    isCorrect = true;
  }

  await nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

// Function to select the next question
async function nextQuestion() {
  if (quiz.length > 0) {
    currentQuestion = quiz[Math.floor(Math.random() * quiz.length)];
  } else {
    console.error("Quiz data is empty.");
  }
}

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

