export class OnlineGameService {
    //TODO make this local
    resultLookup = {
        scissor: {},
        rock: {},
        paper: {},
        spock: {},
        lizard: {}
    };

    //map to other language because no one informed us which language to use >:(
    translateToServerLanguage(englishWord) {
        const translations = {
            'scissor': 'Schere',
            'rock': 'Stein',
            'paper': 'Papier',
            'spock': 'Spock',
            'lizard': 'Echse'
        };
    
        // Convert the word to lowercase for case-insensitive matching
        const lowerCaseWord = englishWord.toLowerCase();
    
        // Use the translations object to get the equivalent word in the server's language
        const translatedWord = translations[lowerCaseWord];
    
        if (translatedWord) {
            return translatedWord;
        } else {
            // If the word is not found in the translations, return the original word
            return englishWord;
        }
    }

    //TODO error handling where?
    async getRankings() {
        const url = 'https://stone.sifs0005.infs.ch/ranking';
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching rankings:', error);
            throw error; // Propagate the error to the caller
        }
    }

    // TODO error handling? where?
    async evaluate(playerName, playerHand) {
        const translatedPlayerHand = this.translateToServerLanguage(playerHand)
        const url = `https://stone.sifs0005.infs.ch/play?playerName=${playerName}&playerHand=${translatedPlayerHand}&mode=spock`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error; // Propagate the error to the caller
        }
    }

    constructor() {
        this.possibleHands = Object.keys(this.resultLookup);
    }
}
