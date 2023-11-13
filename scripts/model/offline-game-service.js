import { Utils } from '../utils/utils.js';

export class OfflineGameService {
    static DELAY_MS = 1000;

    playerStates = {};

    resultLookup = {
        scissor: {
            scissor: 0,
            rock: 1,
            paper: -1,
            spock: 1,
            lizard: -1,
        },
        rock: {
            scissor: -1,
            rock: 0,
            paper: 1,
            spock: 1,
            lizard: -1,
        },
        paper: {
            scissor: 1,
            rock: -1,
            paper: 0,
            spock: -1,
            lizard: 1,
        },
        spock: {
            scissor: -1,
            rock: -1,
            paper: 1,
            spock: 0,
            lizard: 1,
        },
        lizard: {
            scissor: 1,
            rock: 1,
            paper: -1,
            spock: -1,
            lizard: 0,
        }
    };

    constructor() {
        this.possibleHands = Object.keys(this.resultLookup);
    }

    async getRankings() {
        const playerStateList = Object.values(this.playerStates)
        playerStateList.sort((p1, p2) => p2.win - p1.win);
        const rankings = playerStateList.reduce((ranking, player, index) => {
            if (index === 0) {
                ranking.push({
                    rank: ranking.length + 1,
                    wins: player.win,
                    players: [player.user],
                  });
            } else if (player.win !== playerStateList[index - 1].win) {
                ranking.push({
                    rank: ranking.length + 1,
                    wins: player.win,
                    players: [player.user],
                  });
            } else {
                ranking[ranking.length - 1].players.push(player.user);
            }
            return ranking;
        },[]);
        return Promise.resolve(rankings);
    }

    async evaluate(playerName, playerHand) {
        if (typeof playerName !== 'string') {
            throw new Error('playerName must be a string');
        }
        if (!this.possibleHands.includes(playerHand)) {
            throw new Error(`playerHand must be one of: ${this.possibleHands.join(', ')}`);
        }

        const systemHand = this.possibleHands[Utils.getRandomInt(5)];
        const gameEval = this.resultLookup[playerHand][systemHand];
        // if current player does not exist, create it
        if (!this.playerStates[playerName]) {
            this.playerStates[playerName] = {
                user: playerName,
                win: 0,
                lost: 0,
            };
        }
        // create result object
        const result = {
            choice: systemHand,
        }
        if (gameEval === 1) {
            result.win = true;
            this.playerStates[playerName].win += 1;
        } else if (gameEval === -1) {
            result.win = false;
            this.playerStates[playerName].lost += 1;
        }
        await Utils.wait(OfflineGameService.DELAY_MS);
        return result
    }
}
