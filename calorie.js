let foods = JSON.parse(localStorage.getItem('foods')) || [];
let storedGoal = localStorage.getItem('goal');
let goal = storedGoal ? parseInt(storedGoal) : null;
let isAuto = localStorage.getItem('isAuto') === 'true';

function getTodayKey() {
    return new Date().toISOString().split('T')[0];
}
function saveTodayCalories(total) {
    localStorage.setItem('calorie_' + getTodayKey(), total);
}
function getWeeklyCalorieData() {
    let arr = [];
    for (let i = 6; i >= 0; i--) {
        let d = new Date();
        d.setDate(d.getDate() - i);
        let key = d.toISOString().split('T')[0];
        let v = localStorage.getItem('calorie_' + key);
        arr.push(v ? parseInt(v) : 0);
    }
    return arr;
}

const foodInput = document.getElementById('food');
const calorieInput = document.getElementById('calories');
const list = document.getElementById('list');
const totalDiv = document.getElementById('total');
const weightInput = document.getElementById('weight');
const activityInput = document.getElementById('activity');
const goalTypeInput = document.getElementById('goalType');
const suggestResult = document.getElementById('suggest-result');
const goalText = document.getElementById('goalText');
const percentText = document.getElementById('percent');
const goalInput = document.getElementById('goalInput');
const progressBar = document.getElementById('progress');
const goalMsg = document.getElementById('goal-msg');
const autoMsg = document.getElementById('auto-msg');
const editBtn = document.getElementById('editBtn');
const manualGoalBox = document.getElementById('manualGoalBox');

function saveData() {
    localStorage.setItem('foods', JSON.stringify(foods));
    if (goal === null) {
        localStorage.removeItem('goal');
    }
    else {
        localStorage.setItem('goal', goal);
    }
    localStorage.setItem('isAuto', isAuto);
}

function addItem() {
    const food = foodInput.value.trim();
    const calories = parseInt(calorieInput.value);
    if (food === '' || isNaN(calories)) return alert('Enter valid data');
    foods.push({ food, calories }); saveData();
    foodInput.value = '';
    calorieInput.value = '';
    render();
}
function deleteItem(index) {
    foods.splice(index, 1);
    saveData();
    render();
}

function render() {
    const body = document.getElementById("calorieBody");
    body.innerHTML = "";

    let total = 0;

    foods.forEach((item, index) => {
        total += item.calories;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.food}</td>
            <td>${item.calories} kcal</td>
            <td>
                <button class="delete-btn" onclick="deleteItem(${index})">
                    <img src="pic/close.svg">
                </button>
            </td>
        `;

        body.appendChild(row);
    });

    // update total in <tfoot>
    document.getElementById("totalCalories").innerText = total + " kcal";

    saveTodayCalories(total);

    // goal text
    if (goal === null) {
        goalText.innerText = 'Daily Goal: Not set';
    } else {
        goalText.innerText = 'Daily Goal: ' + goal + ' kcal';
    }

    // UI visibility logic
    if (goal === null) {
        manualGoalBox.style.display = 'block';
        editBtn.style.display = 'none';
        autoMsg.style.display = 'none';
    } else if (isAuto) {
        manualGoalBox.style.display = 'none';
        editBtn.style.display = 'inline-block';
        autoMsg.style.display = 'block';
    } else {
        manualGoalBox.style.display = 'block';
        editBtn.style.display = 'none';
        autoMsg.style.display = 'none';
    }

    // progress bar
    if (goal !== null && goal > 0) {
        let percent = (total / goal) * 100;
        if (percent > 100) percent = 100;

        progressBar.style.width = percent + '%';
        percentText.innerText = Math.round(percent) + '%';

        if (total > goal)
            goalMsg.innerText = 'Exceeded by ' + (total - goal) + ' kcal';
        else if (total === goal)
            goalMsg.innerText = 'You have met your goal!';
        else if (total === 0)
            goalMsg.innerText = 'Not started yet';
        else
            goalMsg.innerText = 'You are within your goal';
    } else {
        progressBar.style.width = '0%';
        percentText.innerText = '0%';
        goalMsg.innerText = 'Set your daily goal';
    }
}

function suggestCalories() {
    const weight = parseFloat(weightInput.value);
    const activity = parseInt(activityInput.value);
    const goalType = goalTypeInput.value;
    if (isNaN(weight))
        return alert('Enter weight');
    let calories = weight * activity;
    if (goalType === 'lose')
        calories -= 300;
    if (goalType === 'gain')
        calories += 300;
    calories = Math.round(calories);
    suggestResult.innerText = 'Suggested Calories: ' + calories + ' kcal';
    goal = calories;
    isAuto = true;
    saveData();
    render();
}
function setGoal() {
    let val = parseInt(document.getElementById("goalInput").value);

    if (isNaN(val) || val <= 0) {
        return alert("Enter valid goal");
    }

    goal = val;
    isAuto = false;

    localStorage.setItem("calorieGoal", goal);
    localStorage.setItem("isAuto", isAuto);

    render();
}
function enableManualGoal() {
    manualGoalBox.style.display = 'block';
    editBtn.style.display = 'none';
    autoMsg.style.display = 'none';
    isAuto = false;
    saveData();
}

render();

window.onload = function () {
    if (!localStorage.getItem('un'))
        window.location.href = 'login.html';
    let name = localStorage.getItem('un');
    let photo = localStorage.getItem('profilePic');
    if (name) document.getElementById('cname').innerText = name;
    if (photo) document.getElementById('icon').src = photo;
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








// jkkkkk


