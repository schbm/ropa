import { gameService } from './model/game-service.js';

const input_name = document.querySelector('#game-controls-player-name');
const button_start = document.querySelector('#game-controls-start');
const game_field = document.querySelector('#game-field');
const game_field_title = document.querySelector('#game-field-title');
const game_output = document.querySelector('#game-field-output');
const game_field_controls = document.querySelector('#game-field-controls');
const game_controls = document.querySelector('#game-controls');
const game_history = document.querySelector('#game-history');
const leaderboard_table = document.querySelector('#leaderboard-table');


function writeToHistory(result, player, opponent){
    game_history.innerHTML += `
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
        leaderboard_table.innerHTML = ''
        leaderboard_table.innerHTML += `
            <tr>
                <td>${index+1}</td>
                <td>${element.wins}</td>
                <td>${element.players}</td>
            </tr>
        `;
    });
}

function gotError(err){
    if (err instanceof Error) {
        console.error(err);
    }
    console.error("got err: "+ err);
}

function draw(){
    console.log("draw");
    game_output.innerHTML = `
        <h2>Draw!</h2>
    `;
}

function loose(){
    console.log("loose");
    game_output.innerHTML = `
        <h2>You loose!</h2>
    `;
}

function win(){
    console.log("win");
    game_output.innerHTML = `
        <h2>You win!</h2>
    `;
}

function makeMove(event){
    if (event.target.tagName !== 'BUTTON') {return}
    if (cooldown) {return}
    cooldown = true;

    let playerHand = event.target.dataset.move
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

function startGame(event){
    if (input_name.value === "") {
        gotError("Invalid name");
        return
    }
    
    playerName = input_name.value;
    game_field.classList.toggle('hidden');
    game_field_title.innerHTML = `Playing as: ${playerName}`
    game_controls.classList.toggle('hidden');
}

let playerName = "Anon";
let cooldown = false;
game_field_controls.addEventListener('click', makeMove);
button_start.addEventListener('click', startGame);