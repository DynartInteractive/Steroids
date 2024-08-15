export class ScoreBoard {
    constructor(apiUrl, userId, appId) {
        this.apiUrl = apiUrl;
        this.userId = userId;
        this.appId = appId;
    }

    async sendScore(score) {
        const scoreData = {
            userId: this.userId,
            appId: this.appId,
            score: score,
            timestamp: new Date().toISOString(),
        };

        try {
            const response = await fetch(`${this.apiUrl}/scoreboard`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scoreData),
            });

            if (response.ok) {
                console.log('Score submitted successfully');
            } else {
                console.error('Failed to submit score');
            }
        } catch (error) {
            console.error('Error while sending score:', error);
        }
    }

    async getScores() {
        try {
            const response = await fetch(`${this.apiUrl}/scoreboard?appId=${this.appId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const scores = await response.json();
                return scores;
            } else {
                console.error('Failed to retrieve scores');
                return null;
            }
        } catch (error) {
            console.error('Error while retrieving scores:', error);
            return null;
        }
    }
}
