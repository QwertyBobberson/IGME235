const lifeworld =
{
    init(numCols, numRows)
    {
        this.numCols = numCols;
        this.numRows = numRows;
        this.world = this.BuildArray();
        this.worldBuffer = this.BuildArray();
        this.RandomSetup();
    },

    BuildArray()
    {
        let outerArray = [];
        for(let row = 0; row < this.numRows; row++)
        {
            let innerArray = [];
            for(let col = 0; col < this.numCols; col++)
            {
                innerArray.push(0);
            }
            outerArray.push(innerArray);
        }
        return outerArray;
    },

    RandomSetup()
    {
        for(let row = 0; row < this.numRows; row++)
        {
            for(let col = 0; col < this.numCols; col++)
            {
                this.world[row][col] = 0;
                if(Math.random() < .1)
                {
                    this.world[row][col] = 1;
                }
            }
        }
    },

    GetLivingNeighbors(row, col)
    {
        let numNeighbors = 0;
        for(let y = -1; y < 2; y++)
        {
            for(let x = -1; x < 2; x++)
            {
                let neighborX = x + col;
                let neighborY = y + row;
                if((y != 0 || x != 0) && neighborX >= 0 && neighborX < this.numCols && neighborY >= 0 && neighborY < numRows)
                {
                    numNeighbors += this.world[row + y][col + x];
                }
            }
        }

        return numNeighbors
    },

    Step()
    {
        for(let y = 0; y < this.numRows; y++)
        {
            for(let x = 0; x < this.numCols; x++)
            {
                let numNeighbors = this.GetLivingNeighbors(y, x);

                if(this.world[y][x] == 1 && numNeighbors < 2)
                {
                    this.worldBuffer[y][x] = 0;
                }
                else if(this.world[y][x] == 1 && numNeighbors < 4)
                {
                    this.worldBuffer[y][x] = 1;
                }
                else if(this.world[y][x] == 1 && numNeighbors > 3)
                {
                    this.worldBuffer[y][x] = 0;
                }
                else if(this.world[y][x] == 0 && numNeighbors == 3)
                {
                    this.worldBuffer[y][x] = 1;
                }
            }
        }

        this.world = this.worldBuffer;
    }
}