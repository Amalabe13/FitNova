document.addEventListener('DOMContentLoaded', () => {
    // 1. Define the 7-day week
    const weekDays = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ];

    function updateWeeklyDashboard() {
        let totalScore = 0;
        let totalWeightChange = 0;
        let totalCalories = 0;
        let totalWorkouts = 0;
        let dataCount = 0;

        // 2. Loop through the week to get data from localStorage
        weekDays.forEach(day => {
            // Assumes data is saved as: data_Monday, data_Tuesday, etc.
            const dayData = JSON.parse(localStorage.getItem(`data_${day}`));

            if (dayData) {
                totalScore += (dayData.score || 0);
                totalWeightChange += (parseFloat(dayData.weightChange) || 0);
                totalCalories += (dayData.calories || 0);
                totalWorkouts += (dayData.workouts || 0);
                dataCount++;
            }
        });

        // 3. Calculate Averages
        const avgScore = dataCount > 0 ? Math.round(totalScore / dataCount) : 0;
        const avgCals = dataCount > 0 ? Math.round(totalCalories / dataCount) : 0;

        // 4. Update UI: Performance Overview
        const weightEl = document.getElementById('weight-val');
        const calEl = document.getElementById('avg-cal');
        const workoutEl = document.getElementById('workout-count');

        if (weightEl) weightEl.innerText = `${totalWeightChange > 0 ? '+' : ''}${totalWeightChange.toFixed(1)} kg`;
        if (calEl) calEl.innerText = avgCals.toLocaleString();
        if (workoutEl) workoutEl.innerText = totalWorkouts;

        // 5. Update UI: Health Analysis (Fitness Score)
        const scoreText = document.getElementById('fitness-score-text');
        const scoreStatus = document.getElementById('score-status');

        if (scoreText) scoreText.innerText = avgScore;

        // Update the status and logic for improvement
        if (scoreStatus) {
            if (avgScore >= 80) {
                scoreStatus.innerText = "Excellent";
            } else if (avgScore >= 60) {
                scoreStatus.innerText = "Good";
            } else {
                scoreStatus.innerText = "Needs Improvement";
            }
        }

        // 6. Update UI: Goal vs Achievement
        // We use the Weekly average fitness score as the achievement percentage
        const currentAchieve = document.getElementById('current-achievement');
        if (currentAchieve) {
            currentAchieve.innerText = `${avgScore}% Overall`;
        }
    }

    // Run the update function
    updateWeeklyDashboard();
});

/**
 * Logout function
 */
function logout() {
    window.location.href = "login.html";
}














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
