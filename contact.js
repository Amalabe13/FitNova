document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();

  document.getElementById("contact-msg").innerText = 
    "Message sent successfully! We'll get back to you soon.";

  this.reset();
});
function logout() {
    localStorage.clear();   // remove saved login/session data
    window.location.href = "login.html";   // go to login page
}