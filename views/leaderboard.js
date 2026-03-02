// Leaderboard functionality
const auth = new AuthSystem();

function showLeaderboard(category = 'all') {
  const leaderboard = auth.getLeaderboard(category === 'all' ? null : category);
  const listEl = document.getElementById('leaderboardList');
  
  // Update active button
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  if (leaderboard.length === 0) {
    listEl.innerHTML = '<div class="no-scores">No scores available yet!</div>';
    return;
  }

  listEl.innerHTML = leaderboard.map((entry, index) => {
    const date = new Date(entry.date).toLocaleDateString();
    const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
    
    return `
      <div class="leaderboard-entry">
        <span class="rank">${rankEmoji}</span>
        <span class="username">${entry.username}</span>
        <span class="category">${entry.category}</span>
        <span class="score">${entry.score}/${entry.totalQuestions} (${entry.percentage}%)</span>
        <span class="date">${date}</span>
      </div>
    `;
  }).join('');
}

function logout() {
  auth.logout();
  window.location.href = '/';
}

// Initialize leaderboard on page load
document.addEventListener('DOMContentLoaded', () => {
  if (!auth.isLoggedIn()) {
    window.location.href = '/';
    return;
  }
  
  showLeaderboard('all');
});
app.get("/leaderboard", async (req,res)=>{
  const scores = await Score.find().sort({percentage:-1}).limit(10);
  res.render("leaderboard", { scores });
});