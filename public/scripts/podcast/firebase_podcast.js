
// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
const database = getDatabase(app);
const podcastContainer = document.getElementById("podcast-card");
const skeletonContainer = document.getElementById('skeleton-container')

// Get podcast ID from URL
function getPodcastIdFromURL() {
const params = new URLSearchParams(window.location.search);
return params.get("id");
}


async function getHostDetails(hostId){
const Ref = ref(database, `/creators/${hostId}`);
const snapshot = await get(Ref);

return snapshot.val(); // Add parentheses to call val() correctly
}


// Function to fetch and display podcast data
async function fetchPodcastData() {
const podcastId = getPodcastIdFromURL();
const podcastRef = ref(database, `/podcasts/${podcastId}`);

try {
const snapshot = await get(podcastRef);
if (snapshot.exists()) {
    const data = snapshot.val();
   const hostDetails = await getHostDetails(data.host)
   document.title = `${data.title} - L'BODCAST`;
   document.querySelector(".fa-xmark").addEventListener('click'
    , ()=> {
        const playerBody = document.querySelector('.body')
        playerBody.style.bottom = "-100vh"
        document.getElementById('favicon').href = "https://i.ibb.co/TDBpFZ8P/favicon.png"
        document.title = `${data.title} - L'BODCAST`;

    }
)
    // Fill data into HTML elements
    document.getElementById("podcast-cover").src = data.cover;
    document.getElementById("podcast-title").textContent = data.title;
    document.getElementById("podcast-description").textContent = data.description;
    document.getElementById("podcast-host").innerHTML = ` <img src="${hostDetails.avatar}"><p> ${hostDetails.hostName}</p><i class="material-icons">${hostDetails.verified? "verified" : ""}</i> ● <p class="flower-count"> ${hostDetails.followers_count} followers </p>` ;
    document.getElementById("podcast-guests").textContent = `Guests: ${data.guests.join(", ")}`;
    document.getElementById("podcast-category").textContent = `Category: ${data.category}`;
    document.getElementById("podcast-language").textContent = `Language: ${data.language}`;
    document.getElementById("podcast-schedule").textContent = `Release Schedule: ${data.release_schedule}`;
    document.getElementById("podcast-rating").textContent = `Rating: ${data.rating}`;

    // Fill episode data
    const episodesContainer = document.getElementById("episodes");
    episodesContainer.innerHTML = ""; // Clear previous episodes if any
    data.episodes.forEach(episode => {
        const episodeCard = document.createElement("div");
        episodeCard.classList.add("episode-card");
        episodeCard.id = `episode-${episode.episode_id}`;
        episodeCard.addEventListener('click' , 
            () =>{
                const playerBody = document.querySelector('.body')
                playerBody.style.bottom = "0"
                document.title = episode.title + " | " + hostDetails.hostName
                document.getElementById('podcastTitle').innerHTML = episode.title
                document.getElementById('podcastDescription').innerHTML = episode.description
                document.getElementById('favicon').href = episode.episode_cover
                document.getElementById('podcastCover').src = episode.episode_cover
                document.getElementById('audio').src = episode.audio_url
            }
        )
        const episodeTitle = document.createElement("h4");
        episodeTitle.classList.add("episode-title");
        episodeTitle.textContent = episode.title;

        const episodeDescription = document.createElement("p");
        episodeDescription.classList.add("episode-description");
        episodeDescription.textContent = episode.description;

        const episodeDuration = document.createElement("p");
        episodeDuration.classList.add("episode-duration");
        episodeDuration.textContent = `Duration: ${episode.duration}`;

        const episodeReleaseDate = document.createElement("p");
        episodeReleaseDate.classList.add("episode-release-date");
        episodeReleaseDate.textContent = `Release Date: ${episode.release_date}`;

        episodeCard.appendChild(episodeTitle);
        episodeCard.appendChild(episodeDescription);
        episodeCard.appendChild(episodeDuration);
        episodeCard.appendChild(episodeReleaseDate);

        episodesContainer.appendChild(episodeCard);
    });

    // Fill platform links
    const platformLinksContainer = document.getElementById("platform-links");
    platformLinksContainer.innerHTML = ""; // Clear previous links if any
    for (const platform in data.platform_links) {
const platformLink = document.createElement("a");
platformLink.classList.add("platform-link");
platformLink.href = data.platform_links[platform];
platformLink.target = "_blank";

// Create icon element
const icon = document.createElement("i");
icon.classList.add("fab");

// Map platform names to Font Awesome classes
const iconClasses = {
spotify: "fa-spotify",
apple_podcasts: "fa-apple",
google_podcasts: "fa-google",
youtube: "fa-youtube"
};

if (iconClasses[platform]) {
icon.classList.add(iconClasses[platform]);
} else {
icon.classList.add("fa-link"); // Default icon if not mapped
}

// Capitalize platform name and format it
const formattedName = platform
.replace("_podcasts", "") // Remove '_podcasts' suffix
.replace("_", " ") // Replace underscores with spaces
.split(" ") // Split words
.map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
.join(" "); // Join words back

const textNode = document.createTextNode(" " + formattedName);

// Append icon and text to the link
platformLink.appendChild(icon);
platformLink.appendChild(textNode);

// Append the link to the container
platformLinksContainer.appendChild(platformLink);
}

skeletonContainer.style.display = "none"
podcastContainer.style.display = "block"


} else {
    console.error("No data available for this podcast.");
}
} catch (error) {
console.error("Error fetching podcast data:", error);
}
}

// Fetch the podcast data when the page loads
fetchPodcastData();

