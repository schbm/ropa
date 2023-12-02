import { gameService } from './model/game-service.js';

const inputPlayername = document.querySelector('#game-controls-player-name');
const btnGameStart = document.querySelector('#game-controls-start');
const btnGameExit = document.querySelector('#game-exit')

const gameField = document.querySelector('#game-field');
const gameFieldTitle = document.querySelector('#game-field-title');
const gameOutput = document.querySelector('#game-field-output');
const gameFieldCtrls = document.querySelector('#game-field-controls');
const gameCtrls = document.querySelector('#game-controls');
const gameHistory = document.querySelector('#game-history');

const leaderboard = document.querySelector('#leaderboard');
const leaderboardTable = document.querySelector('#leaderboard-table');


function gotError(err){
    window.alert(`An error occured: ${err}`)
}

function populateLeaderboard(gameServiceRankings){
    const rankingsArr = Object.values(gameServiceRankings)
    rankingsArr.sort((p1, p2) => p2.win - p1.win);
    const rankings = rankingsArr.reduce((ranking, player, index) => {
        if (index === 0) {
            ranking.push({
                rank: ranking.length + 1,
                wins: player.win,
                players: [player.user],
              });
        } else if (player.win !== rankingsArr[index - 1].win) {
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

    if (!Array.isArray(rankings)){
        gotError("Invalid list");
        return;
    }
    leaderboardTable.innerHTML = `
    <tr>
        <th>Rank</th>
        <th>Wins</th>
        <th>Names</th>
    </tr>
    `;
    rankings.forEach((element, index) => {
        leaderboardTable.innerHTML += `
            <tr>
                <td>${index+1}</td>
                <td>${element.wins}</td>
                <td>${element.players}</td>
            </tr>
        `;
    });
}

function writeToHistory(didWinStr, playerHandStr, opponentHandStr){
    gameHistory.innerHTML += `
        <tr>
            <td>${didWinStr}</td>
            <td>${playerHandStr}</td>
            <td>${opponentHandStr}</td>
        </tr>
    `;
}

function clearHistory(){
    gameHistory.innerHTML = '';
}

function writeGameOutput(didWinStr, playerHandStr, opponentHandStr){
    gameOutput.innerHTML = `${didWinStr}, You took: ${playerHandStr} Your opponent took: ${opponentHandStr}`;
}

// event bubbling on the game controls (rock, paper...)
function makeMove(event){
    //skip if the target is not a button
    //skip if the cooldwon is active
    if (event.target.tagName !== 'BUTTON' || cooldown) {return}
    cooldown = true;

    //get the move from the event data
    const playerHand = event.target.dataset.move
    if(!gameService.possibleHands.includes(playerHand)){
        gotError("Invalid hand");
        return;
    }
    //let the game service evaluate the move
    gameService.evaluate(playerName, playerHand)
        .then((result) => {
            const didWin = result.win;
            const playerHandStr = playerHand
            const opponentHandStr = result.choice;
            let didWinStr = '';

            if (didWin === undefined) {
                didWinStr = 'Draw'
            } else if (didWin) {
                didWinStr = 'Win'
            } else {
                didWinStr = 'Loose'
            }
            writeGameOutput(didWinStr, playerHandStr, opponentHandStr);
            writeToHistory(didWinStr, playerHandStr, opponentHandStr);
        })
        .then(()=>{ gameService.getRankings()
            .then((gameServiceRankings) => {populateLeaderboard(gameServiceRankings);});
        })
        .finally(setTimeout(() => {cooldown = false;}, cooldownTime))
        .catch(gotError);
}

function toggleGame(name){
    gameField.classList.toggle('hidden');
    gameFieldTitle.innerHTML = `Playing as: ${name}`
    gameCtrls.classList.toggle('hidden');
    leaderboard.classList.toggle('hidden');
}

function exitGame(){
    toggleGame();
    clearHistory();
}

function startGame(){
    if (inputPlayername.value === "") {
        // Display alert popup
        window.alert('Please enter a name to start a game');
        return
    }
    const name = inputPlayername.value;
    // set global var
    playerName = name
    //show game
    toggleGame(name)
}

//default playername
let playerName = "Anon";
//cooldown state
let cooldown = false;
//cooldown time
const cooldownTime = 1000;

//set event listeners
//set game controls, only visible when startGame is called
//set event bubbling on the container which has the game controls
gameFieldCtrls.addEventListener('click', makeMove);
//button for switching between main and game
btnGameExit.addEventListener('click', exitGame);
//start game, sets the game field visible, does what the name implies
btnGameStart.addEventListener('click', startGame);