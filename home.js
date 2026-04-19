/* =========================
   FULL FINAL home.js
   ========================= */

window.onload = function () {
    loadCalories();
    loadWater();
    loadExercise();
};

/* -------------------------
   CALORIES
------------------------- */
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

/* -------------------------
   WATER
------------------------- */
function loadWater() {
    let total = parseFloat(localStorage.getItem("waterTotal")) || 0;
    let goal = parseFloat(localStorage.getItem("waterGoal")) || 0;

    /* safety fix for old wrong values */
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

/* -------------------------
   EXERCISE
------------------------- */
function loadExercise() {
    let burned = parseInt(localStorage.getItem("totalBurn")) || 0;
    let goal = parseInt(localStorage.getItem("burnGoal")) || 0;

    if (goal === 0) {
        document.getElementById("exMain").innerText =
          "0/0 cal";

        // document.getElementById("exLeft").innerText =
        //     "Set goal first";

        return;
    }

    let left = goal - burned;
    if (left < 0) left = 0;

    document.getElementById("exMain").innerText =
        burned + "/" + goal + " cal";

    document.getElementById("exLeft").innerText =
        left + " cal left";
}

/* -------------------------
   AUTO UPDATE
------------------------- */
window.addEventListener("storage", function () {
    loadCalories();
    loadWater();
    loadExercise();
});

/* -------------------------
   LOGOUT
------------------------- */
function logout() {
    localStorage.clear();   // remove saved login/session data
    window.location.href = "login.html";   // go to login page
}
window.addEventListener('load', function () {
  let name = localStorage.getItem('un');
  let photo = localStorage.getItem('profilePic');
  if (name) document.getElementById('cname').innerText = name;
  if (photo) document.getElementById('icon').src = photo;
});








// jkkkkk


