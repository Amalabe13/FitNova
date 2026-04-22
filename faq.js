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