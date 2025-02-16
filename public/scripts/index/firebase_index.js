
    // Import Firebase modules
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
    import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
    import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-database.js";




console.log("s")
const bottomDiv = document.getElementById('bottomDiv');
const profilePic = document.getElementById('profilePic');
const categories =document.getElementById('categories')

if (bottomDiv && profilePic) {
    profilePic.addEventListener('click', () => {
        bottomDiv.classList.toggle('show');
    });
}

const podcastCategories = [
"all" , 
"News",
"Politics",
"Technology",
"Science",
"Education",
"Business",
"Finance",
"Crime",
"Health",
"Wellness",
"Comedy",
"Sports",
"Entertainment",
"Culture",
"SelfImprovement",
"Fiction",
"Philosophy",
"Spirituality"
];

for (const categorieName of podcastCategories) {
const label = document.createElement("label");
label.innerHTML = categorieName;
label.id = categorieName;
label.className = categorieName == 'all' ?  "categorieLabel chosenCategorie" : "categorieLabel" ;


label.addEventListener("click", (event) => {
document.querySelectorAll(".categorieLabel").forEach((el) => {
    el.classList.remove("chosenCategorie");
});
event.target.classList.toggle("chosenCategorie");
});

categories.append(label);
}



/*const podcastsMap = {
"podcat_id_1" : {
"cover" : "https://i.ibb.co/NBYWskR/1.png"
},
"podcat_id_2" : {
"cover" : "https://i.ibb.co/NBYWskR/1.png"
},
"podcat_id_3" : {
"cover" : "https://i.ibb.co/NBYWskR/1.png"
},
}
*/
function displayPodcasts(podcastsMap){
const trendingPodcasts = document.getElementById('TrendingPodcasts')
for(const podcastId in podcastsMap){
const podcastCover = podcastsMap[podcastId].cover
const podcastCard = document.createElement('img')
podcastCard.src = podcastCover
podcastCard.id = podcastId 
podcastCard.className = "podcastCard"
podcastCard.addEventListener('click' , 
() => {window.location.href = "podcast.html?id=" + podcastId }
)
trendingPodcasts.append(podcastCard)



}

document.querySelectorAll('.skeleton.podcastCard').forEach(element => {
element.style.display = "none";
});
}
//displayPodcasts(podcastsMap)


/*const creatorsMap = {

"creator_id_1" : {
"avatar" : "https://i.ibb.co/4wkTPcn9/icon-2.png"
},
"creator_id_2" : {
"avatar" : "https://i.ibb.co/4wkTPcn9/icon-2.png"
},
"creator_id_3" : {
"avatar" : "https://i.ibb.co/4wkTPcn9/icon-2.png"
},
"creator_id_4" : {
"avatar" : "https://i.ibb.co/4wkTPcn9/icon-2.png"
},
"creator_id_5" : {
"avatar" : "https://i.ibb.co/4wkTPcn9/icon-2.png"
},

}*/

function displayCreators(creatorsMap){
const topCreators =  document.getElementById('TopCreators')

for(const creator_id in creatorsMap){
const creatorAvatar = creatorsMap[creator_id].avatar 
const creatorCard = document.createElement('img') ; 
creatorCard.src = creatorAvatar 
creatorCard.id = creator_id 
creatorCard.className = 'creatorCard'
creatorCard.addEventListener('click' , () => {console.log(creator_id) ; })
topCreators.append(creatorCard)


}
document.querySelectorAll('.skeleton.creatorCard').forEach(element => {
element.style.display = "none";
});
}

//displayCreators(creatorsMap)













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
    const db = getDatabase(app); // ✅ Fix: Pass app to ensure correct initialization

    // Retrieve user data from local storage (if needed)
    const userdata = localStorage.getItem('userCredential');
    console.log("User Credential Data:", userdata);

    // Get reference to HTML container
    const container = document.getElementById('container');

    // Listen for authentication state changes
    onAuthStateChanged(auth, async (user) => { // ✅ Fix: Correct syntax, first argument is `auth`
        if (user) {
            console.log("User is logged in:", user.email);

            try {
              //  const usernamesnapshot = await get(ref(db, `users/${user.uid}/profilePic`));

                // ✅ Fetch user profile picture from Firebase Database
                const snapshot = await get(ref(db, `users/${user.uid}`));
                const profilePicsrc = snapshot.exists() ? snapshot.val().profilePic : "default-profile.png"; // Use default if not found
                const displayName = snapshot.exists() ? snapshot.val().firstName : "default-profile.png"; // Use default if not found
             

                profilePic.src = profilePicsrc
                document.getElementById('name-b').innerHTML = `<strong>Name:</strong> ${displayName}`
                document.getElementById('email-b').innerHTML = `<strong>Email:</strong> ${user.email}`
              
            } catch (error) {
                console.error("Error fetching profile picture:", error.message);
            }
        } else {
            console.log("User is not logged in , redirecting...");
            window.location.href = 'welcom.html'; 
        }
    });




    const podcastsMap = await get(ref(db, `podcasts`));
    const creatorsMap = await get(ref(db, `creators`));

    displayPodcasts(podcastsMap.val())

    displayCreators(creatorsMap.val())






    // Function to log out user
    function logout() {
        signOut(auth) // 
            .then(() => {
                console.log("User logged out");
                window.location.href = "loginMethod.html"; // Redirect to login page
            })
            .catch(error => {
                alert("Error logging out: " + error.message);
            });
    }

    // Attach event listener to logout button
    document.getElementById('logout').addEventListener('click', () => {
        logout();
    });

