
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
    import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

    const firebaseConfig = {
        apiKey: "AIzaSyDFmufOx1aX_JMJsfeXMIzD0nGqQ1pSZIA",
        authDomain: "l-bodcast.firebaseapp.com",
        projectId: "l-bodcast",
        storageBucket: "l-bodcast.appspot.com",  // Fixed URL
        messagingSenderId: "1007184602665",
        appId: "1:1007184602665:web:dae80c9b3f208f5749de38",
        measurementId: "G-BX9F49FM08"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    // Login function
    function login() {
        const email = document.getElementById("email").value;
        const password = document.getElementById("passwordInput").value;

        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userCredential", userCredential);
                window.location.href = "index.html"
               
            })
            .catch(error => {
                alert(error.message);
            });
    }

    // Check authentication state
    onAuthStateChanged(auth, user => {
        if (user) {
            window.location.href = "index.html"

        } else {
            console.log("User is logged out");
        }
    });

    // Attach event listener to login button
    document.getElementById('LoginBtn').addEventListener('click', login);
