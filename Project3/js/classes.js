class Sprite extends PIXI.Sprite
{
	constructor(x, y, img)
	{
		let texture = app.loader.resources[img].texture;
        super(texture);
        this.anchor.set(.5, .5);
        this.scale.set(0.1);
		this.x = x;
		this.y = y;
	}
}

//Handles movement and displaying scores
//X and Y: start positions (numbers)
//Img: path to the img for this agent (string)
//hasScore: Weather or not the agent has a score to display (bool)
//Title: title to display infront of score (string)
//ScoreX: X coordinate of score for this agent (number)
class Agent
{
	constructor(x = 300, y = 300, img, hasScore = false, title = "", scoreX = 0)
	{
		this.sprite = new Sprite(x, y, img);
		this.title = title;
		//
		if(hasScore)
		{
			this.score = 0;
			this.scoreText = new PIXI.Text(title + " Score: 0");
			this.scoreText.style = new PIXI.TextStyle({
				fill: 0xffffff,
				fontSize: 24,
				fontFamily: "Futura",
				stroke: 0x0000ff,
				strokeThickness: 1
			});
			this.scoreText.x = scoreX;
			this.scoreText.anchor.set(scoreX/600, 0);
		}
		this.speed = 100;
		this.fwd = {x: 0, y: 0};
	}

	//Add amount to score and update textbox
	increaseScore(amount = 1)
	{
		this.score += amount;
		this.scoreText.text = this.title + " Score: " + this.score;
	}

	//Move forwards at a speed of speed * speedModifier
	move(dt=1/60, speedModifier = 1)
	{
		this.sprite.x += this.fwd.x * this.speed * speedModifier * dt;
		this.sprite.y += this.fwd.y * this.speed * speedModifier * dt;
	}

	//Gets the direction towards a passed in agent
	//Sets fwd to that direction
	setFwdTowards(target)
	{
		let dir = {x: target.x - this.sprite.x, y: target.y - this.sprite.y};
		let mag = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
		this.fwd = {x: dir.x/mag, y: dir.y/mag};
	}

	//Set forwards towards an agent and move
	//Ensures the agent stays in bounds
	moveTowards(target, dt=1/60, speedModifier = 1)
	{
		this.setFwdTowards(target);

		if(
			this.sprite.x + (this.fwd.x * this.speed * speedModifier * dt) > 0 &&
			this.sprite.x + (this.fwd.x * this.speed * speedModifier * dt) < 600 &&
			this.sprite.y + (this.fwd.y * this.speed * speedModifier * dt) > 0 &&
			this.sprite.y + (this.fwd.y * this.speed * speedModifier * dt) < 600 )
		{
			this.move(dt, speedModifier);
		}
	}

}