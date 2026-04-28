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











