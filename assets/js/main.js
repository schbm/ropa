import { gameService } from './model/game-service.js';

const inputPlayername = document.querySelector('#game-controls-player-name');
const btnGameStart = document.querySelector('#game-controls-start');
const btnGameExit = document.querySelector('#game-exit');
const btnSwitchMode = document.querySelector('#game-controls-mode');

const gameField = document.querySelector('#game-field');
const gameFieldTitle = document.querySelector('#game-field-title');
const gameOutput = document.querySelector('#game-field-output');
const gameFieldCtrls = document.querySelector('#game-field-controls');
const gameCtrls = document.querySelector('#game-controls');
const gameHistory = document.querySelector('#game-history');

const leaderboard = document.querySelector('#leaderboard');
const leaderboardTable = document.querySelector('#leaderboard-table');


// default playername
// shared variable :C
let playerName = "Anon";
// cooldown state
// shared :C
let cooldown = false;
// game mode state
// also shared :C
let isGameModeServer = false;
// cooldown time
const cooldownTime = 1000;

// TODO error handling :(
function gotError(err) {
    window.alert(`An error occured: ${err}`)
}

// sanitize because of ganz funny people setting very very funny usernames >:C
function sanitizeHtml(html) {
    const tempElement = document.createElement('div');
    tempElement.textContent = html;
    return tempElement.innerHTML;
}

// populate leaderboard
// TODO limit on 10
function populateLeaderboard(gameServiceRankings) {
    const rankingsArr = Object.values(gameServiceRankings)
    // convert to arr
    rankingsArr.sort((p1, p2) => p2.win - p1.win);
    // sort the array on wins
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
    }, []);
    // TODO ?
    if (!Array.isArray(rankings)) {
        gotError("Invalid list");
        return;
    }
    // readd headers because im lazy and pragmatic
    leaderboardTable.innerHTML = `
    <tr>
        <th>Rank</th>
        <th>Wins</th>
        <th>Names</th>
    </tr>
    `;
    rankings.forEach((element, index) => {
        const sanitizedPlayer = sanitizeHtml(element.players);
        const sanitizedWins = sanitizeHtml(element.wins);
        leaderboardTable.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${sanitizedWins}</td>
                <td>${sanitizedPlayer}</td>
            </tr>
        `;
    });
}

function writeToHistory(didWinStr, playerHandStr, opponentHandStr) {
    gameHistory.innerHTML += `
        <tr>
            <td>${didWinStr}</td>
            <td>${playerHandStr}</td>
            <td>${opponentHandStr}</td>
        </tr>
    `;
}

function clearHistory() {
    gameHistory.innerHTML = `
        <tr>
            <th>Result</th>
            <th>Player</th>
            <th>Opponent</th>
        </tr>
    `;
}

function writeGameOutputResult(didWinStr, playerHandStr, opponentHandStr) {
    gameOutput.innerHTML = `<strong>${didWinStr}</strong>, You took: ${playerHandStr} Your opponent took: ${opponentHandStr}`;
}

function writeGameOutput(str) {
    gameOutput.innerHTML = str;
}

// event bubbling on the game controls (rock, paper...)
// TODO error handling
function makeMove(event) {
    // skip if the target is not a button
    // skip if the cooldown is active

    if (event.target.tagName !== 'BUTTON' || cooldown) { return }
    cooldown = true;

    // get the move from the event data
    const playerHand = event.target.dataset.move
    if (!gameService.possibleHands.includes(playerHand)) {
        gotError("Invalid hand");
        return;
    }
    writeGameOutput("Waiting for opponent")
    // let the game service evaluate the move
    gameService.evaluate(playerName, playerHand)
        .then((result) => {
            const didWin = result.win;
            const playerHandStr = playerHand
            const opponentHandStr = result.choice;
            let didWinStr = '';

            // TODO enum?
            if (didWin === undefined) {
                didWinStr = 'Draw'
            } else if (didWin) {
                didWinStr = 'Win'
            } else {
                didWinStr = 'Loose'
            }
            writeGameOutputResult(didWinStr, playerHandStr, opponentHandStr);
            writeToHistory(didWinStr, playerHandStr, opponentHandStr);
        })
        .then(() => {
            gameService.getRankings()
                .then((gameServiceRankings) => { populateLeaderboard(gameServiceRankings); })
        })
        .finally(setTimeout(() => { cooldown = false; }, cooldownTime));
}

function toggleGame(name) {
    gameField.classList.toggle('hidden');
    gameFieldTitle.innerHTML = `Playing as: ${name}`
    gameCtrls.classList.toggle('hidden');
    leaderboard.classList.toggle('hidden');
}

function exitGame() {
    toggleGame();
    clearHistory();
}

function startGame() {
    if (inputPlayername.value === "") {
        // Display alert popup
        window.alert('Please enter a name to start a game');
        return
    }
    const name = inputPlayername.value;
    playerName = name;
    toggleGame(name);
}

function switchGameMode() {
    if (isGameModeServer) {
        gameService.isOnline = false;
        isGameModeServer = false;
        btnSwitchMode.innerHTML = 'Switch to Server';
    } else {
        gameService.isOnline = true;
        isGameModeServer = true;
        btnSwitchMode.innerHTML = 'Switch to Local';
    }
    gameService.getRankings()
    .then((rankings) => {populateLeaderboard(rankings)});
}

// TODO state handling: no clue.

// set event listeners
// set game controls, only visible when startGame is called
// set event bubbling on the container which has the game controls
gameFieldCtrls.addEventListener('click', makeMove);
// button for switching between main and game
btnGameExit.addEventListener('click', exitGame);
// button to switch server/localmode
btnSwitchMode.addEventListener('click', switchGameMode);
// start game, sets the game field visible, does what the name implies
btnGameStart.addEventListener('click', startGame);