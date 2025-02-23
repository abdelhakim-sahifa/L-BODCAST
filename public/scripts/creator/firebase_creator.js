// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { isFollowed , follow , unfollow} from './follow.js'; // Same directory


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

// Function to get the creator ID from the URL
function getCreatorIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

const creatorId = getCreatorIdFromURL();
isFollowed(creatorId)

if (creatorId) {
    const creatorRef = ref(database, `/creators/${creatorId}`);

    // Fetch the creator's data
    async function fetchCreatorData() {
        try {
            const snapshot = await get(creatorRef);
            if (snapshot.exists()) {
                const profileData = snapshot.val();  // Get the data from Firebase
                displayProfile(profileData);
            } else {
                console.log("No data found for this creator.");
                document.getElementById('info').innerText = "No data found for this creator.";
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            document.getElementById('info').innerText = "Error fetching data.";
        }
    }

    fetchCreatorData();
} else {
    document.getElementById('info').innerText = "Invalid creator ID.";
}

// Function to display profile data
function displayProfile(data) {
    document.title = ` ${data.name} | L'BODCAST `;
    const profileElement = document.getElementById('profile');

    // Profile Name and Avatar
    const profileHeader = `
        <div class="host-details">
            <img src="${data.avatar || ''}" alt="Host Avatar">
            <div class="hostAndName">
                <div class="nameAndBadge">
                    <p class="host-name">${data.name || 'No name available'}</p>
                    <i class="material-icons">${data.verified ? "verified" : ""}</i>
                </div>
                <p id="flowerCount" class="flower-count">${data.followers_count || 0} Followers</p>
            </div>
            <div class="btn-div">
                <button id="followBtn" class="follow-btn">Follow</button>
            </div>
        </div>
    `;

    // Bio
    const bio = `
        <p id="profile-bio"><strong>Bio</strong> <br> ${data.bio || 'No bio available'}</p>
    `;

    // Location and Experience
    const locationExperience = `
        <p id="profile-location"><strong>Location</strong> <br> ${data.location || 'No location available'}</p>
        <p id="profile-experience"><strong>Experience</strong> <br> ${data.experience || 'No experience available'}</p>
    `;

    // Social Links
    const socialLinks = `
        <div id="profile-social-links" class="social-links">
            ${data.social_links?.instagram ? `<a id="profile-instagram social" href="${data.social_links.instagram}" target="_blank">Instagram</a>` : ''}
            ${data.social_links?.linkedin ? `<a id="profile-linkedin social" href="${data.social_links.linkedin}" target="_blank">LinkedIn</a>` : ''}
            ${data.social_links?.twitter ? `<a id="profile-twitter social" href="${data.social_links.twitter}" target="_blank">Twitter</a>` : ''}
            ${data.social_links?.website ? `<a id="profile-website social" href="${data.social_links.website}" target="_blank">Website</a>` : ''}
            ${!data.social_links?.instagram && !data.social_links?.linkedin && !data.social_links?.twitter && !data.social_links?.website ? 'No social links available' : ''}
        </div>
    `;

    // Monetization and Sponsorships
    const monetization = `
        <div id="profile-monetization"><strong>Monetization:</strong>
            ${data.monetization?.donation_links?.buymeacoffee || data.monetization?.donation_links?.patreon ? `
                <ul id="profile-donations">
                    ${data.monetization.donation_links.buymeacoffee ? `<li><a id="profile-buymeacoffee" href="${data.monetization.donation_links.buymeacoffee}" target="_blank">BuyMeACoffee</a></li>` : ''}
                    ${data.monetization.donation_links.patreon ? `<li><a id="profile-patreon" href="${data.monetization.donation_links.patreon}" target="_blank">Patreon</a></li>` : ''}
                </ul>
            ` : '<p>No monetization available</p>'}
        </div>
        <div id="profile-sponsorships"><strong>Sponsorships:</strong>
            ${data.monetization?.sponsorships?.length > 0 ? `
                <ul id="profile-sponsorship-list">
                    ${data.monetization.sponsorships.map(s => `<li id="profile-sponsorship">${s}</li>`).join('')}
                </ul>
            ` : '<p>No sponsorships available</p>'}
        </div>
    `;

    // Collaboration
    const collaborations = `
        <p id="profile-collaborations"><strong>Collaborations:</strong> <br> ${data.collaborations?.length > 0 ? data.collaborations.join(', ') : 'No collaborations available'}</p>
    `;

    // Ratings
    const ratings = `
        <p id="profile-ratings"><strong>Ratings:</strong> <br> ${data.ratings?.average_rating ? `${data.ratings.average_rating} (${data.ratings.total_reviews} reviews)` : 'No ratings available'}</p>
    `;

    // Complete profile content
    profileElement.innerHTML = `
        ${profileHeader}
        ${bio}
        ${locationExperience}
        ${socialLinks}
        ${monetization}
        ${collaborations}
        ${ratings}
    `;
}