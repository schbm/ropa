import { gameService } from './model/game-service.js';

// Dummy Code
console.log('isOnline:', gameService.isOnline);

const rankings = await gameService.getRankings();

rankings.forEach((rankingEntry) => {
    console.log(`Rank ${rankingEntry.rank} (${rankingEntry.wins} wins): ${rankingEntry.players}`);
});

console.log(await gameService.evaluate('Michael', gameService.possibleHands[0]));
