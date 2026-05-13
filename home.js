window.onload = function () {
    loadCalories();
    loadWater();
    loadExercise();
};
function loadCalories() {
    let foods = JSON.parse(localStorage.getItem("foods")) || [];
    let goal = parseInt(localStorage.getItem("calorieGoal")) || 0;

    let total = 0;

    foods.forEach(item => {
        total += Number(item.calories);
    });

    let left = goal - total;
    if (left < 0) left = 0;

    document.getElementById("calMain").innerText =
        total + "/" + goal + " cal";

    document.getElementById("calLeft").innerText =
        left + " cal left";
}
function loadWater() {
    let total = parseFloat(localStorage.getItem("waterTotal")) || 0;
    let goal = parseFloat(localStorage.getItem("waterGoal")) || 0;
    if (goal > 20) goal = goal / 1000;
    let totalML = Math.round(total * 1000);
    let goalML = Math.round(goal * 1000);

    let left = goalML - totalML;
    if (left < 0) left = 0;

    document.getElementById("waterMain").innerText =
        totalML + "/" + goalML + " ml";

    document.getElementById("waterLeft").innerText =
        left + " ml left";
}
function loadExercise() {
    let burned = parseInt(localStorage.getItem("totalBurn")) || 0;
    let goal = parseInt(localStorage.getItem("burnGoal")) || 0;

    if (goal === 0) {
        document.getElementById("exMain").innerText =
          "0/0 cal";
        return;
    }

    let left = goal - burned;
    if (left < 0) left = 0;

    document.getElementById("exMain").innerText =
        burned + "/" + goal + " cal";

    document.getElementById("exLeft").innerText =
        left + " cal left";
}
window.addEventListener("storage", function () {
    loadCalories();
    loadWater();
    loadExercise();
});

// logout

function logout() {
    localStorage.clear();  
    window.location.href = "login.html";   
}
window.addEventListener('load', function () {
  let name = localStorage.getItem('un');
  let photo = localStorage.getItem('profilePic');
  if (name) document.getElementById('cname').innerText = name;
  if (photo) document.getElementById('icon').src = photo;
});

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








