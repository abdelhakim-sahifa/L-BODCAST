import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFmufOx1aX_JMJsfeXMIzD0nGqQ1pSZIA",
  authDomain: "l-bodcast.firebaseapp.com",
  databaseURL: "https://l-bodcast-default-rtdb.firebaseio.com/",
  projectId: "l-bodcast",
  storageBucket: "l-bodcast.appspot.com",
  messagingSenderId: "1007184602665",
  appId: "1:1007184602665:web:dae80c9b3f208f5749de38",
  measurementId: "G-BX9F49FM08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Utility function to update the follow button UI
function updateFollowButton(isFollowing) {
  const followBtn = document.getElementById('followBtn');
  if (isFollowing) {
    followBtn.style.borderColor = "white";
    followBtn.style.backgroundColor = "transparent";
    followBtn.style.color = "white";
    followBtn.innerHTML = "Followed";
  } else {
    followBtn.style.borderColor = "black";
    followBtn.style.backgroundColor = "white";
    followBtn.style.color = "black";
    followBtn.innerHTML = "Follow";
  }
}

// Function to check if the user is following a specific host
export async function isFollowed(hostId) {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is signed in:", user.uid);
        const userRef = ref(database, `/users/${user.uid}/followed_host`);

        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const followedHosts = snapshot.val();
            console.log("Followed hosts:", followedHosts);

            // Check if the hostId is in the followedHosts array
            if (followedHosts.includes(hostId)) {
              console.log('User is following host:', hostId);
              updateFollowButton(true); // Update button UI
              resolve(true);
            } else {
              console.log('User is not following host:', hostId);
              updateFollowButton(false); // Update button UI
              resolve(false);
            }
          } else {
            console.log('No followed hosts found.');
            updateFollowButton(false); // Update button UI
            resolve(false);
          }
        } catch (error) {
          console.error("Error checking followed hosts:", error);
          reject(error);
        }
      } else {
        console.log("No user is signed in.");
        resolve(false);
      }
    });
  });
}

// Function to follow a host
export async function follow(hostId) {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is signed in:", user.uid);
        const userRef = ref(database, `/users/${user.uid}/followed_host`);

        try {
          const snapshot = await get(userRef);
          let data = snapshot.val() || []; // Ensure data is an array, default to empty array if null/undefined

          // Check if the hostId is already in the array to avoid duplicates
          if (!data.includes(hostId)) {
            data.push(hostId); // Add the new hostId to the array
            await set(userRef, data); // Update the database with the new array
            console.log('User started following host:', hostId);
            updateFollowButton(true); // Update button UI
            await addAfollowToCreator(hostId); // Increment the creator's follower count
            resolve(true);
          } else {
            console.log('User is already following host:', hostId);
            resolve(false);
          }
        } catch (error) {
          console.error("Error following host:", error);
          reject(error);
        }
      } else {
        console.log("No user is signed in.");
        resolve(false);
      }
    });
  });
}

// Function to unfollow a host
export async function unfollow(hostId) {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is signed in:", user.uid);
        const userRef = ref(database, `/users/${user.uid}/followed_host`);

        try {
          const snapshot = await get(userRef);
          let data = snapshot.val() || []; // Ensure data is an array, default to empty array if null/undefined

          // Check if the hostId is in the array and remove it
          if (data.includes(hostId)) {
            data = data.filter(id => id !== hostId); // Remove the hostId from the array
            await set(userRef, data); // Update the database with the new array
            console.log('User stopped following host:', hostId);
            updateFollowButton(false); // Update button UI
            await removeAfollowToCreator(hostId); // Decrement the creator's follower count
            resolve(true);
          } else {
            console.log('User is not following host:', hostId);
            resolve(false);
          }
        } catch (error) {
          console.error("Error unfollowing host:", error);
          reject(error);
        }
      } else {
        console.log("No user is signed in.");
        resolve(false);
      }
    });
  });
}

// Function to increment the creator's follower count
async function addAfollowToCreator(hostId) {
  const creatorRef = ref(database, `/creators/${hostId}/followers_count`);
  try {
    const snapshot = await get(creatorRef);
    let followers_count = snapshot.val() || 0; // Default to 0 if null/undefined
    followers_count += 1;
    await set(creatorRef, followers_count);
    document.getElementById('flowerCount').innerHTML = `${followers_count} Followers`;
  } catch (error) {
    console.error("Error updating creator's followers count:", error);
  }
}

// Function to decrement the creator's follower count
async function removeAfollowToCreator(hostId) {
  const creatorRef = ref(database, `/creators/${hostId}/followers_count`);
  try {
    const snapshot = await get(creatorRef);
    let followers_count = snapshot.val() || 0; // Default to 0 if null/undefined
    followers_count = Math.max(0, followers_count - 1); // Ensure count doesn't go below 0
    await set(creatorRef, followers_count);
    document.getElementById('flowerCount').innerHTML = `${followers_count} Followers`;
  } catch (error) {
    console.error("Error updating creator's followers count:", error);
  }
}