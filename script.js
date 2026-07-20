// Backend API endpoint (instead of direct Chess.com API)
const API_ENDPOINT = 'http://localhost:3000/api/chess-profile';

// Get username from URL parameter, localStorage, or default
function getUsername() {
    const params = new URLSearchParams(window.location.search);
    const urlUsername = params.get('user');
    if (urlUsername) {
        localStorage.setItem('chessUsername', urlUsername);
        return urlUsername;
    }
    return localStorage.getItem('chessUsername') || 'crayon';
}

let USERNAME = getUsername();

// Fetch user profile data from backend
async function loadChessProfile() {
    try {
        // Get basic user info from our backend
        const response = await fetch(`${API_ENDPOINT}/${USERNAME}`);
        
        if (!response.ok) {
            console.error('Failed to fetch Chess.com profile');
            showError('User not found. Check the username and try again.');
            return;
        }

        const data = await response.json();

        // Update profile name
        const profileNameElement = document.getElementById('profileName');
        profileNameElement.textContent = data.username || 'Chess Player';

        // Update view count (followers)
        const viewCountElement = document.getElementById('viewCount');
        viewCountElement.textContent = data.followers || '0';

        // Update profile picture
        if (data.avatar) {
            document.getElementById('profilePic').src = data.avatar;
        } else {
            // Use a default avatar if none available
            document.getElementById('profilePic').src = `https://www.gravatar.com/avatar/${data.id}?s=200&d=identicon`;
        }

        // Clear any error message
        clearError();

        // Log the full data for reference
        console.log('Chess.com Profile Data:', data);
    } catch (error) {
        console.error('Error loading Chess.com profile:', error);
        showError('Error loading profile. Please try again later.');
    }
}

// Show error message
function showError(message) {
    const profileNameElement = document.getElementById('profileName');
    profileNameElement.textContent = message;
    profileNameElement.style.color = 'red';
}

// Clear error message
function clearError() {
    const profileNameElement = document.getElementById('profileName');
    profileNameElement.style.color = '';
}

// Set up button click handlers
function setupButtons() {
    const buttons = document.querySelectorAll('.nav-button');
    
    buttons.forEach((button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const buttonText = button.querySelector('.button-text')?.textContent?.trim() || '';
            
            // Define actions for each button
            const actions = {
                'Play': () => window.open(`https://www.chess.com/member/${USERNAME}`, '_blank'),
                'Stats': () => window.open(`https://www.chess.com/stats/live/${USERNAME}`, '_blank'),
                'Puzzles': () => window.open(`https://www.chess.com/puzzles`, '_blank'),
                'Followers': () => window.open(`https://www.chess.com/member/${USERNAME}/followers`, '_blank'),
                'Settings': () => handleSettings(),
            };

            // Execute the corresponding action
            if (actions[buttonText]) {
                actions[buttonText]();
            } else {
                console.warn(`No action defined for button: "${buttonText}"`);
            }
        });
    });
}

// Handle settings action
function handleSettings() {
    const newUsername = prompt('Enter Chess.com username:', USERNAME);
    if (newUsername && newUsername.trim()) {
        USERNAME = newUsername.trim();
        localStorage.setItem('chessUsername', USERNAME);
        loadChessProfile();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadChessProfile();
    setupButtons();
});
