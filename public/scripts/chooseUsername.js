import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, set, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
const db = getDatabase(app);

const usernameInput = document.getElementById("usernameInput");
const registerButton = document.getElementById("register");
const messageElement = document.getElementById("message");

// Get costume_id from URL params
const urlParams = new URLSearchParams(window.location.search);
const costumeId = urlParams.get('useruid');
const name = urlParams.get('name') || "";

document.getElementById("welcom").innerText = "Welcome " + name;

if (!costumeId) {
    messageElement.innerText = "Invalid user ID.";
}

(async function checkExistingUsername() {
    try {
        const usernameStatus = await get(ref(db, `users/${costumeId}/username`));
        if (usernameStatus.exists()) {
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error("Error checking existing username:", error);
    }
})();

registerButton.disabled = true; // Disable button initially

registerButton.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    
    if (usernameInput.classList.contains("valid")) {
        const usernameRef = ref(db, `usernames/${username}`);
        const userRef = ref(db, `users/${costumeId}`);

        try {
            await set(usernameRef, { "username": username });
            await update(userRef, { username: username });
            window.location.href = "index.html";
        } catch (error) {
            console.error("Error:", error);
            messageElement.innerText = "An error occurred. Try again.";
        }
    }
});

async function isUsernameTaken() {
    const username = usernameInput.value.trim();
    if (!username) return;

    const usernameRef = ref(db, `usernames/${username}`);

    try {
        const snapshot = await get(usernameRef);
        if (snapshot.exists()) {
            messageElement.innerText = "Username is already taken.";
            usernameInput.classList.remove("valid");
            usernameInput.classList.add("invalid");
        } else {
            messageElement.innerText = "";
            usernameInput.classList.remove("invalid");
            usernameInput.classList.add("valid");
        }
        toggleRegisterButton();
    } catch (error) {
        console.error("Error checking username:", error);
        messageElement.innerText = "An error occurred. Try again.";
    }
}

function isValidName(name) {
    const regex = /^[^\s@#$%^&*()+={}\[\]<>?/\\|~.]+$/;
    return regex.test(name);
}

function toggleRegisterButton() {
    registerButton.disabled = usernameInput.classList.contains("invalid") || usernameInput.value.trim() === "";
}

usernameInput.addEventListener("input", () => {
    const username = usernameInput.value.trim();

    if (isValidName(username)) {
        usernameInput.classList.remove("invalid");
        usernameInput.classList.add("valid");
        isUsernameTaken();
    } else if (username === "") {
        usernameInput.classList.remove("valid", "invalid");
        messageElement.innerText = "";
    } else {
        usernameInput.classList.remove("valid");
        usernameInput.classList.add("invalid");
        messageElement.innerText = "Don't use spaces or special characters.";
    }
    toggleRegisterButton();
});
