const firebaseConfig = {
    apiKey: "AIzaSyAqzjDSYawZr9IdPR8Yr5pIhTxdei10DRA",
    authDomain: "travel-agency-3ea70.firebaseapp.com",
    projectId: "travel-agency-3ea70",
    storageBucket: "travel-agency-3ea70.firebasestorage.app",
    messagingSenderId: "630304664282",
    appId: "1:630304664282:web:12a885b210b77cf77f53e3",
    measurementId: "G-GM0QYDSV1F"
  };

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();

  // Login
  document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        document.getElementById("success-message").innerText = "Login successful!";
        document.getElementById("success-message").style.display = "block";
        window.location.href = "dashboard.html"; // redirect after login
      })
      .catch((error) => {
        document.getElementById("error-message").innerText = error.message;
        document.getElementById("error-message").style.display = "block";
      });
  });

  // Signup modal toggle
  document.getElementById("show-signup").addEventListener("click", () => {
    new bootstrap.Modal(document.getElementById("signupModal")).show();
  });

  // Signup
  document.getElementById("signup-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("signup-confirm-password").value;

    if (password !== confirmPassword) {
      document.getElementById("signup-error").innerText = "Passwords do not match.";
      document.getElementById("signup-error").style.display = "block";
      return;
    }

    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        userCredential.user.updateProfile({ displayName: name });
        alert("Signup successful! Please log in.");
        bootstrap.Modal.getInstance(document.getElementById("signupModal")).hide();
      })
      .catch((error) => {
        document.getElementById("signup-error").innerText = error.message;
        document.getElementById("signup-error").style.display = "block";
      });
  });