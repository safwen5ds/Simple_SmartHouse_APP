document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === "admin@smarthouse.com" && password === "admin") {
      alert("Connexion réussie !");

      window.location.href = "Home.html";
    } else {
      alert("Identifiants incorrects. Veuillez réessayer.");
    }
  });