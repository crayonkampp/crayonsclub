// Chess.com API endpoint
const CHESS_COM_API = 'https://api.chess.com/pub/user';
const USERNAME = 'crayon'; // Change this to your Chess.com username

// Fetch user profile data from Chess.com API
async function loadChessProfile() {
    try {
        // Get basic user info
        const response = await fetch(`${CHESS_COM_API}/${USERNAME}`);
        
        if (!response.ok) {
            console.error('Failed to fetch Chess.com profile');
            document.getElementById('profileName').textContent = 'User not found';
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

        // Log the full data for reference
        console.log('Chess.com Profile Data:', data);
    } catch (error) {
        console.error('Error loading Chess.com profile:', error);
        document.getElementById('profileName').textContent = 'Error loading profile';
    }
}

// Set up button click handlers
function setupButtons() {
    const buttons = document.querySelectorAll('.nav-button');
    
    buttons.forEach((button, index) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const buttonText = button.querySelector('.button-text').textContent;
            
            // Define actions for each button
            const actions = {
                'Play': () => window.open(`https://www.chess.com/member/${USERNAME}`, '_blank'),
                'Stats': () => window.open(`https://www.chess.com/stats/live/${USERNAME}`, '_blank'),
                'Puzzles': () => window.open(`https://www.chess.com/puzzles`, '_blank'),
                'Followers': () => window.open(`https://www.chess.com/member/${USERNAME}/followers`, '_blank'),
                'Settings': () => alert('Settings not implemented yet'),
            };

            // Execute the corresponding action
            if (actions[buttonText]) {
                actions[buttonText]();
            }
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadChessProfile();
    setupButtons();
});
