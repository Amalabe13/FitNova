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
    const part = document.getElementById("bodyPart").value;
    const box = document.getElementById("suggestResult");
    const videoBox = document.getElementById("videoContainer");

    localStorage.setItem("selectedPart", part);

    let data = {
        belly: {
            exercises: [
                { name: "Crunches", img: "pic/crunches.jpg" },
                { name: "Plank", img: "pic/plank.png" },
                { name: "Leg Raises", img: "pic/legraise.jpg" }
            ],
            videos: [
                "https://www.youtube.com/embed/Xyd_fa5zoEU", // crunches
                "https://www.youtube.com/embed/pSHjTRCQxIw",  // plank
                "https://www.youtube.com/embed/JB2oyawG9KI"  // leg raises
            ]
        },
        arms: {
            exercises: [
                { name: "Push-ups", img: "pic/pushup.png" },
                { name: "Bicep Curl", img: "pic/curl.png" },
                { name: "Tricep Dips", img: "pic/dips.jpg" }
            ],
            videos: [
                "https://www.youtube.com/embed/IODxDxX7oi4",    // push-ups
                "https://www.youtube.com/embed/ykJmrZ5v0Oo",    // bicep curl
                "https://www.youtube.com/embed/0326dy_-CzM"     // tricep dips
            ]
        },
        legs: {
            exercises: [
                { name: "Squats", img: "pic/squat.jpg" },
                { name: "Lunges", img: "pic/lunges.jpg" },
                { name: "Jump Rope", img: "pic/jump.jpg" }
            ],
            videos: [
                "https://www.youtube.com/embed/aclHkVaku9U",    // squats
                "https://www.youtube.com/embed/QOVaHwm-Q6U",    // lunges
                "https://www.youtube.com/embed/1BZM6jGkZkQ"     // jump rope
            ]
        },
        full: {
            exercises: [
                { name: "Burpees", img: "pic/burpee.jpg" },
                { name: "Mountain Climbers", img: "pic/climb.jpg" },
                { name: "Jumping Jacks", img: "pic/jumping.jpg" }
            ],
            videos: [
                "https://www.youtube.com/embed/TU8QYVW0gDU",    // Burpees
                "https://www.youtube.com/embed/cnyTQDSE884",   // Mountain Climbers
                "https://www.youtube.com/embed/c4DAnQ6DtF8"   //Jumping Jacks
            ]
        }
    };

    if (!part) {
        box.innerHTML = `<p class="placeholder">Choose a body part</p>`;
        videoBox.innerHTML = `<p class="placeholder">Select a body part to see demo videos</p>`;
        return;
    }

    let selected = data[part];

    // EXERCISES
    box.innerHTML = selected.exercises.map(ex => `
        <div class="exercise-card" onclick="fillExercise('${ex.name}')">
            <img src="${ex.img}">
            <span>${ex.name}</span>
        </div>
    `).join("");

    // VIDEOS
    videoBox.innerHTML = selected.videos.map(v => `
        <iframe src="${v}" allowfullscreen></iframe>
    `).join("");
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