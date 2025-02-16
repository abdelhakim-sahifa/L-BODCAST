
    // Import Firebase modules
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
    import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
    import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-database.js";

    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDFmufOx1aX_JMJsfeXMIzD0nGqQ1pSZIA",
        authDomain: "l-bodcast.firebaseapp.com",
        projectId: "l-bodcast",
        databaseURL: "https://l-bodcast-default-rtdb.firebaseio.com/",
        storageBucket: "l-bodcast.appspot.com",
        messagingSenderId: "1007184602665",
        appId: "1:1007184602665:web:dae80c9b3f208f5749de38",
        measurementId: "G-BX9F49FM08"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    const db = getDatabase(app); // Pass app to ensure correct initialization

    // Google Sign-In button handler
    document.getElementById('googlebtn').addEventListener('click', async () => {
        try {
            const user = await googleSignIn();
            if (!user) {
                console.error("User not authenticated");
                return;
            }

            // Extract user details
            const fullName = user.displayName || "";
            const nameParts = fullName.split(" ");
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";
            const profilePic = user.photoURL || "";

            // Store user data in Firebase Realtime Database
            await set(ref(db, 'users/' + user.uid), {
                firstName: firstName,
                lastName: lastName,
                email: user.email,
                profilePic: profilePic
            });

            console.log("User data stored successfully");

            // Redirect to username selection page
            window.location.href = "chooseUsername.html?useruid=" + user.uid + "&name=" + encodeURIComponent(user.displayName);

        } catch (error) {
            console.error('Google Sign-In error:', error.message);
        }
    });

    // Function to handle Google sign-in
    const googleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            return result.user; // Return the authenticated user
        } catch (error) {
            console.error("Sign-in error:", error.message);
            throw new Error(error.message);
        }
    };

    // Listen for authentication state changes
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is signed in:", user.displayName);
        } else {
            console.log("User is logged out");
        }
    });

