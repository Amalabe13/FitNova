const faqs = document.querySelectorAll(".faq-item");

faqs.forEach(item => {
  const btn = item.querySelector(".faq-question");

  btn.addEventListener("click", () => {

    // close others (optional - makes it cleaner)
    faqs.forEach(i => {
      if (i !== item) i.classList.remove("active");
    });

    item.classList.toggle("active");
  });
});

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











