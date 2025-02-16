
    // Import Firebase modules
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
    import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
    import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDFmufOx1aX_JMJsfeXMIzD0nGqQ1pSZIA",
        authDomain: "l-bodcast.firebaseapp.com",
        projectId: "l-bodcast",
        databaseURL: "https://l-bodcast-default-rtdb.firebaseio.com/", // Ensure this is correct
        storageBucket: "l-bodcast.appspot.com",
        messagingSenderId: "1007184602665",
        appId: "1:1007184602665:web:dae80c9b3f208f5749de38",
        measurementId: "G-BX9F49FM08"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getDatabase(app);

    // Event listener for registration
    document.getElementById("LoginBtn").addEventListener("click", async () => {
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("passwordInput").value;
        const rpassword = document.getElementById("rpasswordInput").value;

        if (!firstName || !lastName || !email || !password || !rpassword) {
            alert("Please fill in all fields.");
            return;
        }

        if (password !== rpassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            // Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user data in Firebase Realtime Database
            await set(ref(db, 'users/' + user.uid), {
                firstName: firstName,
                lastName: lastName,
                email: email,
                profilePic: `https://letter-image-generator.vercel.app/generate_image?firstname=${firstName}&lastname=${lastName}`,
            });

            console.log("User registered and data saved successfully!");

            // Redirect after successful registration
            window.location.href = `chooseUsername.html?useruid=${user.uid}&name=${encodeURIComponent(firstName + " " + lastName)}`;

        } catch (error) {
            console.error("Error during sign-up:", error.message);
            alert(error.message);
        }
    });

    // Listen for authentication state changes
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is logged in:", user.uid);
        } else {
            console.log("User is logged out");
        }
    });
