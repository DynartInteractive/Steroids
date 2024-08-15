export class LeaderBoard {
    constructor(apiUrl, appId) {
        this.apiUrl = apiUrl;
        this.appId = appId;
    }

    async fetchLeaderBoard() {
        try {
            const response = await fetch(`${this.apiUrl}/scoreboard?appId=${this.appId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const leaderboardData = await response.json();
                return leaderboardData;
            } else {
                console.error('Failed to retrieve leaderboard data');
                return [];
            }
        } catch (error) {
            console.error('Error while fetching leaderboard:', error);
            return [];
        }
    }

    async displayLeaderBoard() {
        const leaderboardData = await this.fetchLeaderBoard();

        // Create a container for the leaderboard
        const leaderboardContainer = document.createElement('div');
        leaderboardContainer.id = 'leaderboardContainer';
        leaderboardContainer.style.position = 'absolute';
        leaderboardContainer.style.top = '50%';
        leaderboardContainer.style.left = '50%';
        leaderboardContainer.style.transform = 'translate(-50%, -50%)';
        leaderboardContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        leaderboardContainer.style.color = 'white';
        leaderboardContainer.style.padding = '20px';
        leaderboardContainer.style.textAlign = 'center';
        leaderboardContainer.style.zIndex = '1000';

        const title = document.createElement('h2');
        title.textContent = 'Leaderboard';
        leaderboardContainer.appendChild(title);

        // Populate the leaderboard
        const list = document.createElement('ol');
        leaderboardData.forEach((entry) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${entry.userId}: ${entry.score}`;
            list.appendChild(listItem);
        });
        leaderboardContainer.appendChild(list);

        // Create buttons for restart and title screen
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart';
        restartButton.style.marginRight = '10px';
        restartButton.addEventListener('click', () => {
            this.restartGame();
        });

        const titleScreenButton = document.createElement('button');
        titleScreenButton.textContent = 'Exit';
        titleScreenButton.addEventListener('click', () => {
            this.exit();
        });

        leaderboardContainer.appendChild(restartButton);
        leaderboardContainer.appendChild(titleScreenButton);

        document.body.appendChild(leaderboardContainer);
    }

    restartGame() {
        document.location.reload();
    }
    exit() {
        window.close();
    }
}
