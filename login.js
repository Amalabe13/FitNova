window.addEventListener("load", function () {
    if (localStorage.getItem("un")) {
        window.location.replace("home.html");
    }
});
document.getElementById("profilePic").addEventListener("change", function () {
    let file = this.files[0];
    if (file) {
        let reader = new FileReader();

        reader.onload = function (e) {
        localStorage.setItem("profilePic", e.target.result);
        alert("Profile picture saved!");
        };

        reader.readAsDataURL(file);
    }
});
function saveData() {
    let name = document.getElementById("un").value;
    if (name === "") {
        alert("Enter your name");
        return;
    }
    localStorage.setItem("un", name);
    window.location.replace("home.html");
}