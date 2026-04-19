/* =========================
   FULL FINAL exercise.js
   Burn Calories Tracker
   ========================= */

let totalBurn = 0;
let burnGoal = 0;
let exerciseData = JSON.parse(localStorage.getItem("exerciseData")) || [];

/* ---------- PAGE LOAD ---------- */
window.onload = function () {
    totalBurn = parseInt(localStorage.getItem("totalBurn")) || 0;
    burnGoal = parseInt(localStorage.getItem("burnGoal")) || 0;

    let name = localStorage.getItem("un");
    let photo = localStorage.getItem("profilePic");

    if (name) document.getElementById("cname").innerText = name;
    if (photo) document.getElementById("icon").src = photo;

    render();
};

/* ---------- ADD EXERCISE ---------- */
function addExercise() {
    let ex = document.getElementById("exercise").value.trim();
    let mins = parseInt(document.getElementById("duration").value);

    if (ex === "" || isNaN(mins) || mins <= 0) {
        return alert("Enter valid data");
    }

    let calories = mins * 5; // 5 kcal per min

    exerciseData.push({
        name: ex,
        duration: mins,
        calories: calories
    });

    totalBurn += calories;

    localStorage.setItem("exerciseData", JSON.stringify(exerciseData));
    localStorage.setItem("totalBurn", totalBurn);

    document.getElementById("exercise").value = "";
    document.getElementById("duration").value = "";

    render();
}

/* ---------- DELETE EXERCISE ---------- */
function deleteExercise(index) {
    totalBurn -= exerciseData[index].calories;

    if (totalBurn < 0) totalBurn = 0;

    exerciseData.splice(index, 1);

    localStorage.setItem("exerciseData", JSON.stringify(exerciseData));
    localStorage.setItem("totalBurn", totalBurn);

    render();
}

/* ---------- SET GOAL ---------- */
function setBurnGoal() {
    let val = parseInt(document.getElementById("burnGoalInput").value);

    if (isNaN(val) || val <= 0) {
        return alert("Enter valid goal");
    }

    burnGoal = val;

    localStorage.setItem("burnGoal", burnGoal);

    render();
}

/* ---------- EXERCISE SUGGESTION ---------- */
function suggestExercise() {
    let bodyPart = document.getElementById("bodyPart").value;
    let box = document.getElementById("suggestResult");

    let data = {
        belly: ["Crunches", "Plank", "Mountain Climbers"],
        arms: ["Push-ups", "Bicep Curls", "Tricep Dips"],
        legs: ["Squats", "Lunges", "Calf Raises"],
        full: ["Burpees", "Jumping Jacks", "High Knees"]
    };

    if (!bodyPart) {
        box.innerHTML = "<p class='placeholder'>Choose a body part to get suggestions</p>";
        return;
    }

    let html = "<ul>";

    data[bodyPart].forEach(item => {
        html += "<li>" + item + "</li>";
    });

    html += "</ul>";

    box.innerHTML = html;
}

/* ---------- RENDER ---------- */
function render() {
    let body = document.getElementById("exerciseList");
    body.innerHTML = "";

    exerciseData.forEach((item, index) => {
        body.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.duration}</td>
                <td>${item.calories} kcal</td>
                <td>
                    <button onclick="deleteExercise(${index})">
                        X
                    </button>
                </td>
            </tr>
        `;
    });

    document.getElementById("totalBurn").innerText =
        totalBurn + " kcal";

    document.getElementById("burnGoalText").innerText =
        "Burn Goal: " + burnGoal + " kcal";

    /* Progress bar */
    let percent = 0;

    if (burnGoal > 0) {
        percent = (totalBurn / burnGoal) * 100;

        if (percent > 100) percent = 100;
    }

    document.getElementById("burnPercent").innerText =
        Math.round(percent) + "%";

    document.getElementById("burnProgress").style.width =
        percent + "%";

    /* Message */
    let msg = document.getElementById("burn-msg");

    if (burnGoal === 0) {
        msg.innerText = "Set your calorie goal";
    }
    else if (totalBurn >= burnGoal) {
        msg.innerText = "Goal achieved!";
    }
    else {
        let left = burnGoal - totalBurn;
        msg.innerText = left + " cal left";
    }
}