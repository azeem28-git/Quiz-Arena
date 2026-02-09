console.log("JS Loaded");

const params = new URLSearchParams(window.location.search);
const category = params.get("cat");

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const title = document.getElementById("categoryTitle");
const qCount = document.getElementById("qCount");

if (!category) {
  questionEl.innerText = "No category selected!";
  throw "Category missing";
}

title.innerText = category + " Quiz";

const questions = expandedQuestions;

const quiz = questions[category];

if (!quiz) {
  questionEl.innerText = "Invalid category!";
  throw "Wrong category";
}

// Shuffle questions randomly and take only 15
const shuffledQuiz = [...quiz].sort(() => Math.random() - 0.5).slice(0, 15);

let index = 0;
let score = 0;
let selectedAnswer = null;
let timeLeft = 30;
let timerInterval = null;

function startTimer() {
  timeLeft = 30;
  updateTimerDisplay();
  
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      nextBtn.onclick(); // Auto-advance when time runs out
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerEl = document.getElementById('timer');
  timerEl.textContent = `${timeLeft}s`;
  
  // Change color based on time left
  if (timeLeft <= 10) {
    timerEl.style.color = '#ef4444'; // Red
  } else if (timeLeft <= 20) {
    timerEl.style.color = '#f59e0b'; // Orange
  } else {
    timerEl.style.color = '#ffb703'; // Yellow
  }
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function loadQuestion() {
  stopTimer(); // Stop previous timer
  
  qCount.innerText = `Q ${index + 1}/${shuffledQuiz.length}`;
  questionEl.innerText = shuffledQuiz[index].q;
  optionsEl.innerHTML = "";
  selectedAnswer = null;
  nextBtn.disabled = true;

  shuffledQuiz[index].o.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.innerText = opt;
    btn.onclick = () => selectAnswer(i, btn);
    optionsEl.appendChild(btn);
  });
  
  startTimer(); // Start timer for new question
}

function selectAnswer(answerIndex, button) {
  selectedAnswer = answerIndex;
  
  // Remove previous selections
  document.querySelectorAll('.option').forEach(btn => {
    btn.style.background = '#12232e';
    btn.style.borderColor = '#334e68';
  });
  
  // Highlight selected answer
  button.style.background = '#1e3c72';
  button.style.borderColor = '#38bdf8';
  
  nextBtn.disabled = false;
}

nextBtn.onclick = () => {
  if (selectedAnswer !== null) {
    // Check if answer is correct
    if (selectedAnswer === shuffledQuiz[index].a) {
      score++;
    }
  }
  
  index++;
  if (index < shuffledQuiz.length) {
    loadQuestion();
    updateProgress();
  } else {
    showResults();
  }
};

function updateProgress() {
  const progress = (index / shuffledQuiz.length) * 100;
  document.getElementById('bar').style.width = progress + '%';
}

function showResults() {
  stopTimer(); // Stop timer when quiz ends
  
  const percentage = Math.round((score / shuffledQuiz.length) * 100);
  questionEl.innerText = `Quiz Completed! 🎉\nScore: ${score}/${shuffledQuiz.length} (${percentage}%)`;
  optionsEl.innerHTML = "";
  nextBtn.style.display = "none";
  document.getElementById('bar').style.width = '100%';
  
  // Hide timer
  document.getElementById('timer').style.display = 'none';
  
  // Save score to leaderboard
  if (typeof auth !== 'undefined' && auth.isLoggedIn()) {
    auth.saveScore(category, score, shuffledQuiz.length);
    
    // Add view leaderboard button
    const leaderboardBtn = document.createElement('button');
    leaderboardBtn.className = 'next';
    leaderboardBtn.innerText = 'View Leaderboard';
    leaderboardBtn.onclick = () => window.location.href = 'leaderboard.html';
    optionsEl.appendChild(leaderboardBtn);
  }
}

loadQuestion();
updateProgress();
