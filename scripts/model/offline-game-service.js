import { Utils } from '../utils/utils.js';

export class OfflineGameService {
    static DELAY_MS = 1000;

    constructor() {
        this.possibleHands = Object.keys(this.#resultLookup);
    }

    // same data structure as server
    #playerState = {
        Markus: {
            user: 'Markus',
            win: 3,
            lost: 6,
        },
        Michael: {
            user: 'Michael',
            win: 4,
            lost: 5,
        },
        Lisa: {
            user: 'Lisa',
            win: 4,
            lost: 5,
        },
    };

    // Can be used to check if the selected hand wins/loses
    // TODO : complete structure
    #resultLookup = {
        scissors: {
            scissors: 0,
            stone: 1,
            paper: -1,
        },
        stone: {
            scissors: 0,
            stone: 0,
            paper: 0,
        },
        paper: {
            scissors: 0,
            stone: 0,
            paper: 0,
        },
    };

    async getRankings() {
        // TODO transform playerState structure to following data structure
        return Promise.resolve([
            {
                rank: 1,
                wins: 4,
                players: ['Michael', 'Lisa'],
            },
            {
                rank: 2,
                wins: 3,
                players: ['Markus'],
            },
        ]);
    }

    // TODO
    async evaluate(playerName, playerHand) {
        const systemHand = this.possibleHands[0];
        const gameEval = 0;

        console.log(playerName, playerHand, systemHand, gameEval);

        await Utils.wait(OfflineGameService.DELAY_MS); // emulate async

        return gameEval;
    }
}
