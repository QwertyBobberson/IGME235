class Circle extends PIXI.Graphics
{
	constructor(radius, color=0xff0000, x=0, y=0)
	{
		super();
		this.beginFill(color);
		this.drawCircle(0, 0, radius);
		this.endFill();
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.fwd = getRandomUnitVector();
		this.speed = 50;
		this.isAlive = true;
	}

	move(dt=1/60)
	{
		this.x += this.fwd.x * this.speed * dt;
		this.y += this.fwd.y * this.speed * dt;
	}

	reflectX()
	{
		this.fwd.x *= -1;
	}
	reflectY()
	{
		this.fwd.y *= -1;
	}
}

class Sheep extends Circle
{

}

class Wolf extends Circle
{

}
