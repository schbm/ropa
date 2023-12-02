import { gameService } from './model/game-service.js';

const inputName = document.querySelector('#game-controls-player-name');
const btnStart = document.querySelector('#game-controls-start');
const gameField = document.querySelector('#game-field');
const gameFieldTitle = document.querySelector('#game-field-title');
const gameOutput = document.querySelector('#game-field-output');
const gameFieldCtrls = document.querySelector('#game-field-controls');
const gameCtrls = document.querySelector('#game-controls');
const gameHistory = document.querySelector('#game-history');
const leaderboardTable = document.querySelector('#leaderboard-table');
const btnGameExit = document.querySelector('#game-exit')

function gotError(err){
    //TODO
}

function writeToHistory(resultStr, playerMoveStr, opponentMoveStr){
    gameHistory.innerHTML += `
        <tr>
            <td>${result}</td>
            <td>${player}</td>
            <td>${opponent}</td>
        </tr>
    `;
}

function populateLeaderboard(list){
    if (!Array.isArray(list)){
        //TODO
        gotError("Invalid list");
        return;
    }
    list.forEach((element, index) => {
        leaderboardTable.innerHTML = ''
        leaderboardTable.innerHTML += `
            <tr>
                <td>${index+1}</td>
                <td>${element.wins}</td>
                <td>${element.players}</td>
            </tr>
        `;
    });
}

function writeOutputDraw(){
    console.log("draw");
    gameOutput.innerHTML = `
        <h2>Draw!</h2>
    `;
}

function writeOutputLoose(){
    console.log("loose");
    gameOutput.innerHTML = `
        <h2>You loose!</h2>
    `;
}

function writeOutputWin(){
    console.log("win");
    gameOutput.innerHTML = `
        <h2>You win!</h2>
    `;
}

// event bubbling on the game controls (rock, paper...)
function makeMove(event){
    //skip if the target is not a button
    if (event.target.tagName !== 'BUTTON') {return}
    //skip if the cooldwon is active
    if (cooldown) {return}
    cooldown = true;

    //get the move from the event data
    const playerHand = event.target.dataset.move
    if(!gameService.possibleHands.includes(playerHand)){
        //TODO something else
        gotError("Invalid hand");
        return;
    }
    //let the game service evaluate the move
    gameService.evaluate(playerName, playerHand).then((result) => {
        let resultstr = "";
        if ('win' in result){
            if (result.win){
                writeOutputWin();
                resultstr = "win";
            } else {
                writeOutputLoose();
                resultstr = "loose";
            }
        } else {
            writeOutputdraw();
            resultstr = "draw";
        }
        writeToHistory(resultstr, playerHand, result.choice);
        
    }).then(()=>{
        gameService.getRankings().then((rankings) => {
            populateLeaderboard(rankings);
        });
    }).catch(gotError).finally(setTimeout(() => {
        cooldown = false;
    }, 1000));
}

function toggleGame(name){
    gameField.classList.toggle('hidden');
    gameFieldTitle.innerHTML = `Playing as: ${name}`
    gameCtrls.classList.toggle('hidden');
}

function exitGame(){
    toggleGame();
}

function startGame(){
    if (inputName.value === "") {
        // Display alert popup
        window.alert('Please enter a name to start a game');
        return
    }
    const name = inputName.value;
    // set global var
    playerName = name
    //show game
    toggleGame(name)
}

//default playername
let playerName = "Anon";
//cooldown state
let cooldown = false;

//set event listeners
//set game controls, only visible when startGame is called
//set event bubbling on the container which has the game controls
gameFieldCtrls.addEventListener('click', makeMove);

btnGameExit.addEventListener('click', exitGame);

//start game, sets the game field visible, does what the name implies
btnStart.addEventListener('click', startGame);