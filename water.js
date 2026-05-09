let total = 0;
let goal = 0;

function getTodayKey() {
    return new Date().toISOString().split('T')[0];
}

/* Save daily water */
function saveTodayWater() {
    localStorage.setItem('water_' + getTodayKey(), total);
}

/* Weekly data */
function getWeeklyWaterData() {
    let arr = [];

    for (let i = 6; i >= 0; i--) {
        let d = new Date();
        d.setDate(d.getDate() - i);

        let key = d.toISOString().split('T')[0];
        let val = localStorage.getItem('water_' + key);

        arr.push(val ? parseFloat(val) : 0);
    }

    return arr;
}

/* Load saved data */
window.onload = function () {

    let savedGoal = localStorage.getItem("waterGoal");
    let savedTotal = localStorage.getItem("waterTotal");
    let savedWeight = localStorage.getItem("weight");

    if (savedWeight)
        document.getElementById("weight").value = savedWeight;

    if (savedGoal) {
        goal = parseFloat(savedGoal);
    }

    if (savedTotal) {
        total = parseFloat(savedTotal);
    }

    updateUI();

    let name = localStorage.getItem("un");
    let photo = localStorage.getItem("profilePic");

    if (name) document.getElementById("cname").innerText = name;
    if (photo) document.getElementById("icon").src = photo;
};

/* Update screen */
function updateUI() {

    document.getElementById("goalText").innerText =
        "Goal: " + goal.toFixed(2) + " L";

    document.getElementById("target").innerText =
        "Target: " + goal.toFixed(2) + "L";

    document.getElementById("intake").innerText =
        "Intake: " + total.toFixed(2) + "L";

    document.getElementById("comp").innerText =
        total.toFixed(2) + "L / " + goal.toFixed(2) + "L";

    let percent = goal > 0 ? (total / goal) * 100 : 0;

    if (percent > 100) percent = 100;

    document.getElementById("progress").style.height =
        percent + "%";

    if (goal === 0)
        document.getElementById("status").innerText = "Start drinking 💧";
    else if (total >= goal)
        document.getElementById("status").innerText = "Goal achieved!!!";
    else
        document.getElementById("status").innerText =
            Math.round(percent) + "% completed";
}

/* Set goal from weight */
function setGoal() {

    let weight = parseFloat(document.getElementById("weight").value);

    if (!weight || weight <= 0)
        return alert("Enter valid weight");

    localStorage.setItem("weight", weight);

    goal = +(weight * 0.033).toFixed(2);

    total = 0;

    localStorage.setItem("waterGoal", goal);
    localStorage.setItem("waterTotal", total);

    saveTodayWater();
    updateUI();
}

/* Add water */
function addWater(amount) {

    if (goal === 0)
        return alert("Set goal first!");

    total += amount / 1000;

    if (total > goal)
        total = goal;

    localStorage.setItem("waterTotal", total);

    saveTodayWater();
    updateUI();
}

/* Reset only water data */
function reset() {

    total = 0;
    goal = 0;

    localStorage.removeItem("waterGoal");
    localStorage.removeItem("waterTotal");
    localStorage.removeItem("weight");

    document.getElementById("weight").value = "";

    updateUI();
}

/* Voice */
function speakText(text) {
    let speech = new SpeechSynthesisUtterance(text);
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;
    window.speechSynthesis.speak(speech);
}

function logout() {
    localStorage.clear();   // remove saved login/session data
    window.location.href = "login.html";   // go to login page
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







