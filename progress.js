window.addEventListener("load", function () {
    // SESSION & PROFILE
    const username = localStorage.getItem("un") || "User";
    document.getElementById("cname").innerText = username;
    const photo = localStorage.getItem("profilePic");
    if (photo) document.getElementById("icon").src = photo;

    // DATA EXTRACTION (Total accumulation from all pages)
    const foods = JSON.parse(localStorage.getItem("foods")) || [];
    const exercises = JSON.parse(localStorage.getItem("exercises")) || [];
    
    // Weekly Totals
    const totalCalsConsumed = foods.reduce((sum, f) => sum + (Number(f.calories) || 0), 0);
    const totalCalsBurned = exercises.reduce((sum, e) => sum + (Number(e.calories) || 0), 0);
    const totalMinutes = exercises.reduce((sum, e) => sum + (Number(e.duration) || 0), 0);
    
    const waterIntake = parseFloat(localStorage.getItem("intake")) || 0;
    const dailyWaterTarget = parseFloat(localStorage.getItem("target")) || 3;
    const weeklyWaterTarget = dailyWaterTarget * 7;

    // UI UPDATES
    document.getElementById("steps-val").innerText = (totalMinutes * 100).toLocaleString();
    document.getElementById("avg-cal").innerText = Math.round(totalCalsConsumed / 7).toLocaleString(); // Weekly Avg
    document.getElementById("workout-count").innerText = exercises.length;

    // Weekly Achievement Logic
    const dailyBurnGoal = Number(localStorage.getItem("burnGoal")) || 500;
    const weeklyBurnGoal = dailyBurnGoal * 7;
    
    document.getElementById("current-achievement").innerText = `${totalCalsBurned} kcal`;
    document.getElementById("target-goal").innerText = `${weeklyBurnGoal} kcal`;

    // Calculate Score based on Weekly Averages
    calculateWeeklyFitnessScore(totalCalsConsumed/7, 2000, totalCalsBurned/7, dailyBurnGoal, waterIntake/7, dailyWaterTarget);
    
    // Render Chart with dummy data for Mon-Sat and real data for Sun
    renderActivityChart(totalCalsBurned, totalCalsConsumed);
});

function calculateWeeklyFitnessScore(avgCons, cGoal, avgBurn, bGoal, avgWater, wTarget) {
    let score = 0;
    // Water contribution
    if (avgWater > 0) score += Math.min((avgWater / wTarget) * 33, 33);
    // Exercise contribution
    if (avgBurn > 0) score += Math.min((avgBurn / bGoal) * 34, 34);
    // Diet contribution
    if (avgCons > 0 && avgCons <= cGoal) score += 33;

    const finalScore = Math.round(score);
    const scoreElement = document.getElementById("fitness-score-text");
    if(scoreElement) scoreElement.innerText = finalScore;
    
    const status = document.getElementById("score-status");
    if (finalScore >= 80) { status.innerText = "Excellent"; status.style.color = "#4CAF50"; }
    else if (finalScore >= 40) { status.innerText = "Active"; status.style.color = "#FF7A00"; }
    else { status.innerText = "Low Activity"; status.style.color = "#FF5C5C"; }
}