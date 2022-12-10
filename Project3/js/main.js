"use strict";
const app = new PIXI.Application({
    width: 600,
    height: 600,
    backgroundColor: 0x114411
});
document.body.appendChild(app.view);

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

app.loader.
    add([
        "images/wolf.png",
        "images/sheep.png",
        "images/shepherd.png"
    ]);
app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();

let stage;

const speed = 3;

let gameScene, menuScene;
let wolf;
let sheep;
let player;

let sheepTarget;

let wolfScore;
let wolfScoreText;

let playerScore;
let playerScoreText;

let chompNoise = new Howl({
    src: ['audio/chomp.wav']
});
let baaNoise = new Howl({
    src: ['audio/baa.wav']
});

function setup()
{
    stage = app.stage;
    createMenuScene();
}

function createMenuScene()
{
    menuScene = new PIXI.Container();
    let title = new PIXI.Text("Shepherd!");
    title.style = new PIXI.TextStyle({
        fill: 0xffffff,
        fontSize: 96,
        fontFamily: "Futura",
        stroke: 0x0000ff,
        strokeThickness: 6
    });

    title.x = 50;
    title.y = 120;

    let instructions = new PIXI.Text("Save the sheep from the evil wolf!");
    instructions.style = new PIXI.TextStyle({
        fill: 0xffffff,
        fontSize: 36,
        fontFamily: "Futura",
        stroke: 0x0000ff,
        strokeThickness: 3
    });

    instructions.x = 5;
    instructions.y = 300;

    let startButton = new PIXI.Text("TO THE SHEEP!");
    startButton.style = new PIXI.TextStyle({
        fill: 0x00dddd,
        fontSize: 48,
        fontFamily: "Futura"
    });;
    startButton.x = 300;
    startButton.y = sceneHeight - 100;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup", startGame);
    startButton.on("pointerover", e => e.target.alpha = 0.7);
    startButton.on("pointerout", e => e.currentTarget.alpha = 1.0);
    startButton.anchor.set(0.5, 0.5)



    menuScene.addChild(title);
    menuScene.addChild(instructions);
    menuScene.addChild(startButton);
    stage.addChild(menuScene);
}

function gameLoop()
{
    let dt = 1/app.ticker.FPS;
	if (dt > 1/12) dt=1/12;

    //Check if either the wolf or player is touching the sheep
    //Award the point to whichever one is
    //Move the sheep
    if(rectsIntersect(wolf.sprite, sheep.sprite))
    {
        SetupSheep();
        wolf.increaseScore();
        chompNoise.play();
    }
    if(rectsIntersect(player.sprite, sheep.sprite))
    {
        SetupSheep();
        player.increaseScore();
        baaNoise.play();
    }

    //Allow the player to move more quickly when losing
    //Player must be faster than wold to compensate for reaction times
    let speedModifier = (wolf.score/player.score) + 0.5;
    if(isNaN(speedModifier) || speedModifier < 1.1)
    {
        speedModifier = 1.1;
    }

    if(!isFinite(speedModifier))
    {
        speedModifier = 1.5;
    }

	let mousePosition = app.renderer.plugins.interaction.mouse.global;

    //Player moves towards mouse
    //Wolf moves towards sheep
    //Sheep moves towards random position

    player.moveTowards(mousePosition, dt, speedModifier);
    wolf.moveTowards(sheep.sprite, dt);
    sheep.moveTowards(sheepTarget, dt, 0.5);

}

function SetupSheep()
{
    //Randomize the sheep's position and target position
    sheep.sprite.x =  getRandom(0, 500);
    sheep.sprite.y = getRandom(0, 500);
    sheepTarget = {x: getRandom(0, 500), y: getRandom(0, 500)};
}

function startGame()
{
    gameScene = new PIXI.Container();
    //Create objects for the player, wolf, and sheep
    sheep = new Agent(500, 500, "images/sheep.png");
    SetupSheep();
    wolf = new Agent(100, 100, "images/wolf.png", true, "Wolf", 600);
    player = new Agent(300, 300, "images/shepherd.png", true, "Shepherd", 0);

    //Show all agents and hide the menu
    gameScene.addChild(player.scoreText);
    gameScene.addChild(player.sprite);
    gameScene.addChild(wolf.scoreText);
    gameScene.addChild(wolf.sprite);
    gameScene.addChild(sheep.sprite);
    stage.addChild(gameScene);
    menuScene.visible = false;


    app.ticker.add(gameLoop);
}