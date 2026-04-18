window.addEventListener("load", function () {
    // 1. SESSION CHECK
    const username = localStorage.getItem("un");
    if (!username) {
        window.location.href = "login.html";
        return;
    }

    // Update Profile Sidebar
    document.getElementById("cname").innerText = username;
    const photo = localStorage.getItem("profilePic");
    if (photo) document.getElementById("icon").src = photo;

    // 2. DATA EXTRACTION
    const calGoal = Number(localStorage.getItem("goal")) || 2000;
    const foods = JSON.parse(localStorage.getItem("foods")) || [];
    const totalCalsConsumed = foods.reduce((sum, f) => sum + (Number(f.calories) || 0), 0);

    const burnGoal = Number(localStorage.getItem("burnGoal")) || 500;
    const exercises = JSON.parse(localStorage.getItem("exercises")) || [];
    const totalCalsBurned = exercises.reduce((sum, e) => sum + (Number(e.calories) || 0), 0);
    const totalMinutes = exercises.reduce((sum, e) => sum + (Number(e.duration) || 0), 0);

    const waterIntake = parseFloat(localStorage.getItem("intake")) || 0;
    const waterTarget = parseFloat(localStorage.getItem("target")) || 3;

    // 3. UI UPDATES
    document.getElementById("steps-val").innerText = (totalMinutes * 100).toLocaleString();
    document.getElementById("avg-cal").innerText = totalCalsConsumed.toLocaleString();
    document.getElementById("workout-count").innerText = exercises.length;

    // Weight Display
    const weightVal = document.getElementById("weight-val");
    const mockWeightChange = -0.2; 
    weightVal.innerText = mockWeightChange < 0 ? `${Math.abs(mockWeightChange)} kg (Loss)` : `${mockWeightChange} kg (Gain)`;
    weightVal.style.color = mockWeightChange <= 0 ? "#4CAF50" : "#FF7A00";

    // 4. GOAL VS ACHIEVEMENT
    const achElement = document.getElementById("current-achievement");
    achElement.innerText = `${totalCalsBurned} kcal`;
    document.getElementById("target-goal").innerText = `${burnGoal} kcal`;

    const motivation = document.getElementById("motivate");
    if (totalCalsBurned >= burnGoal && burnGoal > 0) {
        motivation.innerText = "Target Reached! Performance is Optimal. 🔥";
        motivation.style.color = "#FF7A00";
    }

    // 5. RENDER CHART & SCORE
    renderActivityChart(totalCalsBurned, totalCalsConsumed);
    calculateAdvancedFitnessScore(totalCalsConsumed, calGoal, totalCalsBurned, burnGoal, waterIntake, waterTarget);
});

// FIXED SCORE LOGIC
function calculateAdvancedFitnessScore(consumed, cGoal, burned, bGoal, water, wTarget) {
    let score = 0;

    // Water (Max 33%): Only award points if water is actually logged
    if (water > 0 && wTarget > 0) {
        score += Math.min((water / wTarget) * 33, 33);
    }

    // Exercise (Max 34%): Only award points if calories are actually burned
    if (burned > 0 && bGoal > 0) {
        score += Math.min((burned / bGoal) * 34, 34);
    }

    // Diet Analysis (Max 33%)
    // CRITICAL FIX: Only award points if food was actually logged today
    if (consumed > 0) {
        if (consumed <= cGoal && consumed > (cGoal * 0.5)) {
            // Full points for being in a healthy range (not starving, not overeating)
            score += 33;
        } else if (consumed <= (cGoal * 0.5)) {
            // Partial points if calorie intake is suspiciously low (under-eating)
            score += 15;
        } else if (consumed > cGoal && consumed < cGoal * 1.2) {
            score += 10; // Small overage
        } else {
            score += 0; // Heavy overage or no data
        }
    }

    const finalScore = Math.round(score);
    document.getElementById("fitness-score-text").innerText = finalScore;
    
    const status = document.getElementById("score-status");
    if (finalScore >= 80) {
        status.innerText = "Excellent";
        status.style.color = "#4CAF50";
    } else if (finalScore >= 40) {
        status.innerText = "Active";
        status.style.color = "#FF7A00";
    } else {
        status.innerText = "Low Activity";
        status.style.color = "#FF5C5C";
    }
}

function renderActivityChart(burn, cons) {
    const canvas = document.getElementById('activityChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Burned',
                data: [400, 600, 500, 700, 400, 300, burn],
                borderColor: '#FF7A00',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(230, 106, 0, 0.1)'
            }, {
                label: 'Consumed',
                data: [1800, 2000, 1700, 2200, 1900, 2500, cons],
                borderColor: '#ffffff',
                borderDash: [5, 5],
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { grid: { color: '#222' }, ticks: { color: '#888' } },
                x: { ticks: { color: '#888' } }
            },
            plugins: { legend: { labels: { color: '#fff' } } }
        }
    });
}

// Keep your helper functions (renderDailyChart, updateDailyScore, logout) 
// OUTSIDE the event listener block above.
window.onload = updateDisplay;
window.addEventListener("load", function () {
  let name = localStorage.getItem("un");
  let photo = localStorage.getItem("profilePic");

  if (name) {
    document.getElementById("cname").innerText = name;
  }

  if (photo) {
    document.getElementById("icon").src = photo;
  }
});