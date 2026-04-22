window.addEventListener("load", function () {
    const username = localStorage.getItem("un") || "Athlete";
    document.getElementById("cname").innerText = username;

    // 1. GET THE DATA
    const foods = JSON.parse(localStorage.getItem("foods")) || [];
    const exercises = JSON.parse(localStorage.getItem("exercises")) || [];
    const waterIntake = parseFloat(localStorage.getItem("intake")) || 0;
    
    const calGoal = Number(localStorage.getItem("goal")) || 2000;
    const burnGoal = Number(localStorage.getItem("burnGoal")) || 500;
    const waterTarget = parseFloat(localStorage.getItem("target")) || 3;

    // 2. SETUP THE DATE FILTER (Last 7 Days)
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7); 

    // 3. FILTERING LOGIC
    // We only count items where the date is within the last 7 days.
    // If NO date exists, we include it as "recent" data so the screen isn't empty.
    const weeklyFoods = foods.filter(f => {
        if(!f.date) return true; 
        return new Date(f.date) >= oneWeekAgo;
    });

    const weeklyExercises = exercises.filter(e => {
        if(!e.date) return true;
        return new Date(e.date) >= oneWeekAgo;
    });

    // 4. CALCULATE WEEKLY TOTALS
    const totalConsumed = weeklyFoods.reduce((s, f) => s + (Number(f.calories) || 0), 0);
    const totalBurned = weeklyExercises.reduce((s, e) => s + (Number(e.calories) || 0), 0);
    const totalDuration = weeklyExercises.reduce((s, e) => s + (Number(e.duration) || 0), 0);

    // 5. UPDATE TOP OVERVIEW BOXES
    document.getElementById("box-burned").innerText = totalBurned + " kcal";
    // Show Daily Average for calories (Total / 7)
    document.getElementById("avg-cal").innerText = Math.round(totalConsumed / 7).toLocaleString();
    document.getElementById("active-time").innerText = totalDuration + "m";
    document.getElementById("workout-count").innerText = weeklyExercises.length;
    document.getElementById("water-val").innerText = waterIntake.toFixed(1) + " L";
    document.getElementById("weight-val").innerText = "-0.8 kg"; 

    // 6. UPDATE GOAL VS ACHIEVEMENT (Weekly Perspective)
    const weeklyBurnTarget = burnGoal * 7; 
    document.getElementById("target-goal").innerText = weeklyBurnTarget + " kcal (7-Day Goal)";
    document.getElementById("current-achievement").innerText = totalBurned + " kcal";

    // 7. SCORE CALCULATION
    let score = 0;
    // Water (33%) - Current status
    score += Math.min((waterIntake / waterTarget) * 33, 33);
    // Exercise (34%) - Weekly progress
    score += Math.min((totalBurned / weeklyBurnTarget) * 34, 34);
    // Diet (33%) - Weekly average vs goal
    if (totalConsumed > 0 && totalConsumed <= (weeklyBurnTarget * 4)) score += 33;

    const finalScore = Math.min(Math.round(score), 100);
    document.getElementById("fitness-score-text").innerText = finalScore;

    // 8. STATUS & MOTIVATION
    const status = document.getElementById("score-status");
    const motivate = document.getElementById("motivate");

    if (finalScore >= 80) {
        status.innerText = "Elite";
        status.style.color = "#4CAF50";
        motivate.innerText = "You've crushed your weekly goal! Keep it up. 🔥";
    } else if (finalScore >= 40) {
        status.innerText = "On Track";
        status.style.color = "#FF7A00";
        motivate.innerText = "You need " + Math.max(0, (weeklyBurnTarget - totalBurned)) + " more kcal to hit your weekly burn target.";
    } else {
        status.innerText = "Start Moving";
        status.style.color = "#888";
        motivate.innerText = "Logging more workouts will boost your weekly score!";
    }
});

function logout() {
    localStorage.removeItem("un");
    window.location.href = "login.html";
}