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


function gotError(err){
    if (err instanceof Error) {
        console.error(err);
    }
    console.error(`got err: ${err}`);
}

function writeToHistory(result, player, opponent){
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

function draw(){
    console.log("draw");
    gameOutput.innerHTML = `
        <h2>Draw!</h2>
    `;
}

function loose(){
    console.log("loose");
    gameOutput.innerHTML = `
        <h2>You loose!</h2>
    `;
}

function win(){
    console.log("win");
    gameOutput.innerHTML = `
        <h2>You win!</h2>
    `;
}

function makeMove(event){
    if (event.target.tagName !== 'BUTTON') {return}
    if (cooldown) {return}
    cooldown = true;

    const playerHand = event.target.dataset.move
    console.log("making a move: " + playerName + " " + playerHand);
    if(!gameService.possibleHands.includes(playerHand)){
        gotError("Invalid hand");
        return;
    }
    gameService.evaluate(playerName, playerHand).then((result) => {
        console.log(result);
        let resultstr = "";
        if ('win' in result){
            if (result.win){
                win();
                resultstr = "win";
            } else {
                loose();
                resultstr = "loose";
            }
        } else {
            draw();
            resultstr = "draw";
        }
        writeToHistory(resultstr, playerHand, result.choice);
        
    }).then(()=>{
        gameService.getRankings().then((rankings) => {
            console.log(rankings);
            populateLeaderboard(rankings);
        });
    }).catch(gotError).finally(setTimeout(() => {
        cooldown = false;
    }, 1000));
}

function startGame(){
    if (inputName.value === "") {
        gotError("Invalid name");
        return
    }
    
    playerName = inputName.value;
    gameField.classList.toggle('hidden');
    gameFieldTitle.innerHTML = `Playing as: ${playerName}`
    gameCtrls.classList.toggle('hidden');
}

let playerName = "Anon";
let cooldown = false;
gameFieldCtrls.addEventListener('click', makeMove);
btnStart.addEventListener('click', startGame);