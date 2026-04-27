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
    let videoBox = document.getElementById("videoContainer");

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
            { name: "Jumping Jacks", img: "pic/jumping.jpg", video: "https://www.youtube.com/embed/c4DAnQ6DtF8" },
            { name: "Jump Rope", img: "pic/jump.jpg", video: "https://www.youtube.com/embed/1BZM6gq1kW4" }
        ]
    };

    if (!bodyPart) {
        box.innerHTML = "<p class='placeholder'>Choose a body part</p>";
        videoBox.innerHTML = "<p class='placeholder'>Select a body part to see demos</p>";
        return;
    }

    let html = "";
    let videoHTML = "";

    data[bodyPart].forEach(item => {

        // images (top)
        html += `
            <div class="exercise-card">
                <img src="${item.img}" alt="${item.name}">
                <p>${item.name}</p>
            </div>
        `;

        // videos (bottom)
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

function logout() {
    localStorage.clear();   // remove saved login/session data
    window.location.href = "login.html";   // go to login page
}