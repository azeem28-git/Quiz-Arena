// Authentication System
class AuthSystem {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('quizUsers')) || {};
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
  }

  signup(username, email, password) {
    if (this.users[username]) {
      return { success: false, message: 'Username already exists!' };
    }

    this.users[username] = {
      email,
      password,
      scores: [],
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('quizUsers', JSON.stringify(this.users));
    return { success: true, message: 'Account created successfully!' };
  }

  login(username, password) {
    const user = this.users[username];
    
    if (!user) {
      return { success: false, message: 'User not found!' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Incorrect password!' };
    }

    this.currentUser = username;
    localStorage.setItem('currentUser', JSON.stringify(username));
    return { success: true, message: 'Login successful!' };
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  saveScore(category, score, totalQuestions) {
    if (!this.currentUser) return;

    const user = this.users[this.currentUser];
    const scoreData = {
      category,
      score,
      totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
      date: new Date().toISOString()
    };

    user.scores.push(scoreData);
    localStorage.setItem('quizUsers', JSON.stringify(this.users));
  }

  getLeaderboard(category = null) {
    let allScores = [];

    Object.keys(this.users).forEach(username => {
      this.users[username].scores.forEach(score => {
        if (!category || score.category === category) {
          allScores.push({
            username,
            ...score
          });
        }
      });
    });

    return allScores.sort((a, b) => b.percentage - a.percentage).slice(0, 10);
  }
}

const auth = new AuthSystem();

// UI Functions
function showLogin() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('signupForm').style.display = 'none';
  document.querySelectorAll('.auth-tab')[0].classList.add('active');
  document.querySelectorAll('.auth-tab')[1].classList.remove('active');
}

function showSignup() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('signupForm').style.display = 'block';
  document.querySelectorAll('.auth-tab')[0].classList.remove('active');
  document.querySelectorAll('.auth-tab')[1].classList.add('active');
}

function handleLogin(event) {
  event.preventDefault();
  
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  const messageEl = document.getElementById('loginMessage');

  const result = auth.login(username, password);
  
  if (result.success) {
    messageEl.style.color = '#4ade80';
    messageEl.textContent = result.message;
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } else {
    messageEl.style.color = '#f87171';
    messageEl.textContent = result.message;
  }
}

function handleSignup(event) {
  event.preventDefault();
  
  const username = document.getElementById('signupUsername').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const messageEl = document.getElementById('signupMessage');

  if (password !== confirmPassword) {
    messageEl.style.color = '#f87171';
    messageEl.textContent = 'Passwords do not match!';
    return;
  }

  const result = auth.signup(username, email, password);
  
  if (result.success) {
    messageEl.style.color = '#4ade80';
    messageEl.textContent = result.message;
    setTimeout(() => {
      showLogin();
    }, 1500);
  } else {
    messageEl.style.color = '#f87171';
    messageEl.textContent = result.message;
  }
}

// Check if user is logged in and redirect if needed
if (auth.isLoggedIn() && window.location.pathname.includes('auth.html')) {
  window.location.href = 'index.html';
}
