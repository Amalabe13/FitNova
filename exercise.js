let totalBurn = 0;
let burnGoal = 0;
let exerciseData = [];

/* ---------- PAGE LOAD ---------- */
window.onload = function () {

    // Load all saved values
    totalBurn = parseInt(localStorage.getItem("totalBurn")) || 0;
    burnGoal = parseInt(localStorage.getItem("burnGoal")) || 0;
    exerciseData = JSON.parse(localStorage.getItem("exerciseData")) || [];

    let name = localStorage.getItem("un");
    let photo = localStorage.getItem("profilePic");

    if (name && document.getElementById("cname")) {
        document.getElementById("cname").innerText = name;
    }

    if (photo && document.getElementById("icon")) {
        document.getElementById("icon").src = photo;
    }

    render();

    // Reload selected body part + images + videos
    let savedBodyPart = localStorage.getItem("selectedBodyPart");
    if (savedBodyPart && document.getElementById("bodyPart")) {
        document.getElementById("bodyPart").value = savedBodyPart;
        suggestExercise();
    }
};

/* ---------- SAVE ALL DATA ---------- */
function saveData() {
    localStorage.setItem("exerciseData", JSON.stringify(exerciseData));
    localStorage.setItem("totalBurn", totalBurn);
    localStorage.setItem("burnGoal", burnGoal);
}

/* ---------- ADD EXERCISE ---------- */
function addExercise() {

    let ex = document.getElementById("exercise").value.trim();
    let mins = parseInt(document.getElementById("duration").value);

    if (ex === "" || isNaN(mins) || mins <= 0) {
        alert("Enter valid data");
        return;
    }

    let calories = mins * 5;

    exerciseData.push({
        name: ex,
        duration: mins,
        calories: calories
    });

    totalBurn += calories;

    saveData();
    render();

    document.getElementById("exercise").value = "";
    document.getElementById("duration").value = "";
}

/* ---------- DELETE EXERCISE ---------- */
function deleteExercise(index) {

    totalBurn -= exerciseData[index].calories;

    if (totalBurn < 0) totalBurn = 0;

    exerciseData.splice(index, 1);

    saveData();
    render();
}

/* ---------- SET GOAL ---------- */
function setBurnGoal() {

    let val = parseInt(document.getElementById("burnGoalInput").value);

    if (isNaN(val) || val <= 0) {
        alert("Enter valid goal");
        return;
    }

    burnGoal = val;

    saveData();
    render();
}

/* ---------- EXERCISE SUGGESTION ---------- */
function suggestExercise() {

    let bodyPart = document.getElementById("bodyPart").value;
    let box = document.getElementById("suggestResult");
    let videoBox = document.getElementById("videoContainer");

    // Save selected body part
    localStorage.setItem("selectedBodyPart", bodyPart);

    let data = {

        belly: [
            { name: "Crunches", img: "pic/crunches.jpg", video: "https://www.youtube.com/embed/Xyd_fa5zoEU" },
            { name: "Plank", img: "pic/plank.png", video: "https://www.youtube.com/embed/pSHjTRCQxIw" },
            { name: "Mountain Climbers", img: "pic/climb.jpg", video: "https://www.youtube.com/embed/nmwgirgXLYM" }
        ],

        arms: [
            { name: "Push-ups", img: "pic/pushup.png", video: "https://www.youtube.com/embed/IODxDxX7oi4" },
            { name: "Bicep Curls", img: "pic/curl.png", video: "https://www.youtube.com/embed/ykJmrZ5v0Oo" },
            { name: "Tricep Dips", img: "pic/dips.jpg", video: "https://www.youtube.com/embed/6kALZikXxLc" }
        ],

        legs: [
            { name: "Squats", img: "pic/squat.jpg", video: "https://www.youtube.com/embed/aclHkVaku9U" },
            { name: "Lunges", img: "pic/lunges.jpg", video: "https://www.youtube.com/embed/QOVaHwm-Q6U" },
            { name: "Leg Raises", img: "pic/legraise.jpg", video: "https://www.youtube.com/embed/JB2oyawG9KI" }
        ],

        full: [
            { name: "Burpees", img: "pic/burpee.jpg", video: "https://www.youtube.com/embed/dZgVxmf6jkA" },
            { name: "Jumping Jacks", img: "pic/jumping.jpg", video: "https://www.youtube.com/embed/2W4ZNSwoW_4" },
            { name: "Jump Rope", img: "pic/jump.jpg", video: "https://www.youtube.com/embed/u3zgHI8QnqE" }
        ]
    };

    if (bodyPart === "") {
        box.innerHTML = "";
        videoBox.innerHTML = "";
        return;
    }

    let html = "";
    let videoHTML = "";

    data[bodyPart].forEach(function(item) {

        html += `
            <div class="exercise-card">
                <img src="${item.img}" alt="${item.name}">
                <p>${item.name}</p>
            </div>
        `;

        videoHTML += `
            <iframe src="${item.video}" allowfullscreen></iframe>
        `;
    });

    box.innerHTML = html;
    videoBox.innerHTML = videoHTML;
}

/* ---------- RENDER ---------- */
function render() {

    let body = document.getElementById("exerciseList");

    if (body) {

        body.innerHTML = "";

        exerciseData.forEach(function(item, index) {

            body.innerHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.duration}</td>
                    <td>${item.calories} kcal</td>
                    <td>
                        <button onclick="deleteExercise(${index})">X</button>
                    </td>
                </tr>
            `;
        });
    }

    if (document.getElementById("totalBurn")) {
        document.getElementById("totalBurn").innerText = totalBurn + " kcal";
    }

    if (document.getElementById("burnGoalText")) {
        document.getElementById("burnGoalText").innerText =
            "Burn Goal: " + burnGoal + " kcal";
    }

    let percent = 0;

    if (burnGoal > 0) {
        percent = (totalBurn / burnGoal) * 100;
        if (percent > 100) percent = 100;
    }

    if (document.getElementById("burnPercent")) {
        document.getElementById("burnPercent").innerText =
            Math.round(percent) + "%";
    }

    if (document.getElementById("burnProgress")) {
        document.getElementById("burnProgress").style.width =
            percent + "%";
    }

    let msg = document.getElementById("burn-msg");

    if (msg) {

        if (burnGoal === 0) {
            msg.innerText = "Set your calorie goal";
        }
        else if (totalBurn >= burnGoal) {
            msg.innerText = "Goal achieved!";
        }
        else {
            msg.innerText = (burnGoal - totalBurn) + " cal left";
        }
    }
}

/* ---------- LOGOUT ---------- */
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}



// theme

function toggleTheme() {
    let current = localStorage.getItem("theme") || "dark";
    let next = current === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme();
}

function applyTheme() {
   
    let page = window.location.pathname.split("/").pop().replace(".html","");
    let theme = localStorage.getItem("theme") || "dark";
    let css = document.getElementById("theme-css");

    if(theme === "light"){
        css.href = page + "l.css";
    } else {
        css.href = page + ".css";
    }
}

applyTheme();










