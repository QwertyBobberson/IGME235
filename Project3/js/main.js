"use strict";
const app = new PIXI.Application({
    width: 600,
    height: 600
});
document.body.appendChild(app.view);

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

app.loader.
    add([
        "images/spaceship.png",
        "images/explosions.png"
    ]);
app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();

let stage;

const speed = 3;

let gameScene;
let wolf;
let sheep;
let player;

let sheepTarget;

let score;

function setup()
{
    stage = app.stage;
    gameScene = new PIXI.Container();

    app.ticker.add(gameLoop);
    startGame();
}

function gameLoop()
{
    let dt = 1/app.ticker.FPS;
	if (dt > 1/12) dt=1/12;

    if(rectsIntersect(wolf, sheep))
    {
        SetupSheep();
        score -= 10;
    }
    if(rectsIntersect(player, sheep))
    {
        SetupSheep();
        score += 5;
    }

	let mousePosition = app.renderer.plugins.interaction.mouse.global;
    player.fwd = GetFwd(player, mousePosition, speed * 1.2);
    player.move(dt);

    wolf.fwd = GetFwd(wolf, sheep, speed);
    wolf.move(dt);

    sheep.fwd = GetFwd(sheep, sheepTarget, speed/2);
    sheep.move(dt);

}

function SetupSheep()
{
    sheep.x =  getRandom(0, 600);
    sheep.y = getRandom(0, 600);
    sheepTarget = {x: getRandom(0, 600), y: getRandom(0, 600)};
}

function GetFwd(agent, target, speed)
{
    let dir = {x: target.x - agent.x, y: target.y - agent.y};
    let mag = Math.sqrt(dir.x * dir.x + dir.y * dir.y)/speed;
    if(isNaN(mag))
    {
        return {x: 0, y: 0};
    }
    return {x: dir.x/mag, y: dir.y/mag};
}

function startGame()
{
    score = 0;
    wolf = gameScene.addChild(new Wolf(10, 0xff0000, 100, 100));
    sheep = gameScene.addChild(new Sheep(10, 0x0000ff, 500, 500));
    SetupSheep();
    player = gameScene.addChild(new Circle(10, 0xffffff, 300, 300));
    stage.addChild(gameScene);
}