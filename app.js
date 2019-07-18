const play_area = {};
const player = {};
let game_obj;

play_area.stats = document.querySelector('.stats');
play_area.main = document.querySelector('.main');
play_area.game = document.querySelector('.game');
play_area.btns = Array.from(document.querySelectorAll('.btn'));
play_area.page = Array.from(document.querySelectorAll('.page'));

player.score = 0;
player.items = 3;

// Making sure that the DOM is loaded before loading the game
document.addEventListener('DOMContentLoaded', getData);

play_area.btns.forEach(item => item.addEventListener('click', handleBtn));

function getData() {
    play_area.main.classList.add('visible');
    fetch('https://api.myjson.com/bins/gungm')
        .then(response => response.json())
        .then(data => {
            game_obj = data.data;
            console.log(game_obj);
            buildBoard();
        });
}

function updateScore() {
    play_area.scorer.innerHTML = `Score: ${player.score} Lives: ${player.items}`;
}

function buildBoard() {
    play_area.scorer = document.createElement('span');
    play_area.scorer.innerHTML = 'Press Button to Start';
    play_area.stats.appendChild(play_area.scorer);
    let rows = 4;
    let cols = 4;
    let cnt = 0;
    play_area.game.style.width = cols * 100 + (cols * 2);
    for (let y = 0; y < rows; y++) {
        let div_main = document.createElement('div');
        div_main.style.width = cols * 100 + (cols * 2);
        for (let x = 0; x < cols; x++) {
            let div = document.createElement('div');
            div.setAttribute('class', 'pop');
            cnt++;
            div.innerText = cnt;
            div.cnt = cnt;
            div_main.appendChild(div);
        }
        play_area.game.appendChild(div_main);
    }
}

function handleBtn(event) {
    if (event.target.classList.contains('new-game')) {
        startGame();
    }
}

function startGame() {
    player.score = 0;
    player.items = 3;
    play_area.main.classList.remove('visible');
    play_area.game.classList.add('visible');
    console.log('start');
    player.gameOver = false;
    startPop();
    updateScore();
}

function randomPop() {
    const pops = document.querySelectorAll('.pop');
    const index = Math.floor(Math.random() * pops.length);

    if (pops[index].cnt == play_area.last) {
        return randomPop();
    }
    play_area.last = pops[index].cnt;
    return pops[index];
}

function startPop() {
    let new_pop = randomPop();
    console.log(new_pop);
    new_pop.classList.add('active');
    new_pop.addEventListener('click', hitPop);
    const time = Math.round(Math.random() * (1500) + 750);
    const val = Math.floor(Math.random() * game_obj.length);

    new_pop.old = new_pop.innerText;
    new_pop.v = game_obj[val].value;
    new_pop.innerHTML = `${game_obj[val].icon}<br>${game_obj[val].value}`;
    play_area.inPlay = setTimeout(function () {
        new_pop.classList.remove('active');
        new_pop.removeEventListener('click', hitPop);
        new_pop.innerText = new_pop.old;

        if (!player.gameOver) {
            startPop();
        }
    }, time);
}

function hitPop(event) {
    console.log(event.target.cnt);
    console.log(event.target.v);
    let new_pop = event.target;
    player.score = player.score + new_pop.v;
    updateScore();
    new_pop.classList.remove('active');
    new_pop.removeEventListener('click', hitPop);
    new_pop.innerText = new_pop.old;
    clearTimeout(play_area.inPlay);
    
    if(!player.gameOver) {
        startPop();
    }
}
















