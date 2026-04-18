let burnGoal = parseInt(localStorage.getItem("burnGoal")) || 0;
let exercises = JSON.parse(localStorage.getItem("exercises")) || [];

function getTodayKey() {
    return new Date().toISOString().split("T")[0];
}

function saveTodayBurn(total) {
    localStorage.setItem("burn_" + getTodayKey(), total);
}

function getWeeklyBurnData() {
    let arr = [];

    for (let i = 6; i >= 0; i--) {
        let d = new Date();
        d.setDate(d.getDate() - i);

        let key = d.toISOString().split("T")[0];
        let v = localStorage.getItem("burn_" + key);

        arr.push(v ? parseInt(v) : 0);
    }

    return arr;
}

function suggestExercise() {
    const part = document.getElementById("bodyPart").value;
    const box = document.getElementById("suggestResult");

    localStorage.setItem("selectedPart", part);

    let data = {
        belly: [
            { name: "Crunches", img: "pic/crunches.jpg" },
            { name: "Plank", img: "pic/plank.png" },
            { name: "Leg Raises", img: "pic/legraise.jpg" }
        ],
        arms: [
            { name: "Push-ups", img: "pic/pushup.png" },
            { name: "Bicep Curl", img: "pic/curl.png" },
            { name: "Tricep Dips", img: "pic/dips.jpg" }
        ],
        legs: [
            { name: "Squats", img: "pic/squat.jpg" },
            { name: "Lunges", img: "pic/lunges.jpg" },
            { name: "Jump Rope", img: "pic/jump.jpg" }
        ],
        full: [
            { name: "Burpees", img: "pic/burpee.jpg" },
            { name: "Mountain Climbers", img: "pic/climb.jpg" },
            { name: "Jumping Jacks", img: "pic/jumping.jpg" }
        ]
    };

    if (!part) {
        box.innerHTML = `<p class="placeholder">Choose a body part to get suggestions</p>`;
        return;
    }

    let suggested = data[part];

    box.innerHTML = suggested.map(ex => `
        <div class="exercise-card" onclick="fillExercise('${ex.name}')">
            <img src="${ex.img}" alt="${ex.name}">
            <span>${ex.name}</span>
        </div>
    `).join("");
}

function fillExercise(name) {
    document.getElementById("exercise").value = name;
}

function setBurnGoal() {
    const value = parseInt(document.getElementById("burnGoalInput").value);

    if (!value || value <= 0) {
        return;
    }

    burnGoal = value;
    localStorage.setItem("burnGoal", value);

    updateBurnProgress();
}

function updateBurnProgress() {
    let total = 0;

    exercises.forEach(ex => total += ex.calories);
    saveTodayBurn(total);

    if (!burnGoal) {
        return;
    }

    let percent = (total / burnGoal) * 100;

    if (percent > 100) {
        percent = 100;
    }

    document.getElementById("burnProgress").style.width = percent + "%";
    document.getElementById("burnPercent").innerText = Math.floor(percent) + "%";
    document.getElementById("burnGoalText").innerText = "Burn Goal: " + burnGoal + " kcal";

    const msg = document.getElementById("burn-msg");

    if (total < burnGoal) {
        msg.innerText = (burnGoal - total) + " kcal left";
        msg.style.color = "#FF7A00";
    } else if (total === burnGoal) {
        msg.innerText = "Goal achieved!";
        msg.style.color = "#FF7A00";
    } else {
        msg.innerText = "Exceeded by " + (total - burnGoal) + " kcal";
        msg.style.color = "#FF5C5C";
    }
}

function calculateCalories(exercise, duration) {
    const rates = {
        running: 10,
        walking: 4,
        cycling: 8,
        yoga: 3,
        default: 5
    };

    exercise = exercise.toLowerCase();

    let rate = rates[exercise] || rates.default;

    return rate * duration;
}

function addExercise() {
    const name = document.getElementById("exercise").value;
    const duration = parseInt(document.getElementById("duration").value);

    if (!name || !duration) {
        alert("Enter all fields");
        return;
    }

    const calories = calculateCalories(name, duration);

    exercises.push({ name, duration, calories });
    localStorage.setItem("exercises", JSON.stringify(exercises));

    document.getElementById("exercise").value = "";
    document.getElementById("duration").value = "";

    renderExercises();
    updateBurnProgress();
}

function renderExercises() {
    const list = document.getElementById("exerciseList");

    list.innerHTML = "";
    exercises = JSON.parse(localStorage.getItem("exercises")) || [];

    let total = 0;

    exercises.forEach((ex, index) => {
        total += ex.calories;

        const row = document.createElement("tr");

        row.innerHTML = `<td>${ex.name}</td>
            <td>${ex.duration}</td>
            <td>${ex.calories} kcal</td>
            <td>
                <button class="delete-btn" onclick="removeExercise
            (${index})">❌<span class="tooltip">Remove</span>
                </button>
            </td>`;

        list.appendChild(row);

        div.innerHTML = `
            <span>${ex.name}</span>
            <span>${ex.duration} min</span>
            <span>${ex.calories} kcal</span>
            <button class="delete-btn" onclick="removeExercise(${index}">
                <img src="pic/close.svg" alt="Delete">
            </button>`;

        list.appendChild(div);
    });

    document.getElementById("totalBurn").innerText = "Total Burned: " + total + " kcal";

    saveTodayBurn(total);
    updateBurnProgress();
}

function removeExercise(index) {
    exercises.splice(index, 1);
    localStorage.setItem("exercises", JSON.stringify(exercises));

    renderExercises();
    updateBurnProgress();
}

window.onload = function () {
    let stored = localStorage.getItem("exercises");
    exercises = stored ? JSON.parse(stored) : [];

    renderExercises();
    updateBurnProgress();

    let savedPart = localStorage.getItem("selectedPart");

    if (savedPart) {
        document.getElementById("bodyPart").value = savedPart;
        suggestExercise();
    }

    let name = localStorage.getItem("un");
    let photo = localStorage.getItem("profilePic");

    if (name) {
        document.getElementById("cname").innerText = name;
    }

    if (photo) {
        document.getElementById("icon").src = photo;
    }
};