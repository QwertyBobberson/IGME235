const urlBase="https://opentdb.com/api.php?amount=1&type=multiple"
var categories = [0, 1, 2, 3, 4];
var questions = new Array;
var numPlayers;
var board;
var currentQuestion;
var scores = new Array;

window.onload = (e) =>
{
    //Create wrapper with game title, instructions, an input field, and a start button
    let wrapper = document.createElement("div");
    wrapper.classList.add("box");
    wrapper.style.flexDirection = "column"
    wrapper.style.height = "99vh";

    let title = document.createElement("h1");
    title.innerHTML = "Jeapordy!";
    title.style.fontSize = "100pt";

    let p = document.createElement("p");
    p.innerHTML = "Enter an amount of players!";
    p.style.fontSize = "25pt";

    let textBox = document.createElement("p");
    textBox.classList.add("textbox");
    textBox.contentEditable = true;
    textBox.style.fontSize = "25pt";
    textBox.innerHTML = "2";

    let button = document.createElement("button");
    button.innerHTML = "Start!";
    button.style.fontSize = "25pt";
    button.onclick = LoadGame;


    wrapper.appendChild(title);
    wrapper.appendChild(p);
    wrapper.appendChild(textBox);
    wrapper.appendChild(button);

    document.body.appendChild(wrapper);
};

function LoadGame()
{
    //Get the amount of players entered
    numPlayers = parseInt(document.querySelector(".textbox").innerHTML);

    //If number of players entered was invalid, send the user back to the start screen
    if(isNaN(numPlayers) || numPlayers < 1)
    {
        console.log("in here");
        let p = document.createElement("p");
        p.innerHTML = "Please enter a valid number";
        p.style.color = "#ff0000";
        document.querySelector(".box").appendChild(p);
        return;
    }

    //Initialize scores for each player
    for(let i = 0; i < numPlayers; i++)
    {
        scores[i] = 0;
    }

    //Remove start screen
    document.body.removeChild(document.querySelector(".box"));

    //Create wrapper and assign class to store game board
    let wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");

    //Query the API for categories and questions
    GetQuestions();

    //Loop over each square
    for(let y = 0; y < 6; y++)
    {
        for(let x = 0; x < 5; x++)
        {
            //Set id as b + coordinates and add class for formatting
            let div = document.createElement("div");
            div.id = "b" + x + "" + y;
            div.classList.add("box");

            //Set initial value for each square, either a price or in the case of the top row, "loading" until the categories can be loaded
            div.appendChild(y == 0 ? document.createTextNode("loading") : div.appendChild(document.createTextNode(y * 100)));
            if(y != 0)
            {
                //Add the ShowQuestion function to all squares representing a question
                div.onclick = e => ShowQuestion(e);
                div.style.fontSize = "25pt";
            }

            //Add the box to the wrapper
            wrapper.appendChild(div);
        }
    }

    //Display the wrapper and store a refrence to it for later
    document.body.appendChild(wrapper);
    board = wrapper;
}

function ShowQuestion(e)
{
    //Hide the gameboard
    document.body.removeChild(board);

    //Get the coordinates of the box clicked from its id, storing it in a global variable for convenience
    let x = parseInt(e.originalTarget.id.substring(1, 2));
    let y = parseInt(e.originalTarget.id.substring(2)) - 1;
    currentQuestion = {x, y};

    //Question pages use a flexbox layout
    //Create a wrapper div and set classes
    let div = document.createElement("div");
    div.classList.add("box");
    div.style.flexDirection = "column";

    //Display the question from the list of question
    let question = document.createElement("h2");
    question.innerHTML = questions[x][y].question;

    //Create an element to display the answer, it is empty for now
    let answer = document.createElement("p");

    //Create a button to show the answer and set its onclick to RevealAnswer
    let showAnswer = document.createElement("button");
    showAnswer.innerHTML = "Reveal Answer";
    showAnswer.onclick = RevealAnswer;

    //Create boxes for indicating who got the question right or wrong
    //The score controls are in a box with a horizontal flexbox display
    //Each player's controls are in another div with a vertical flexbox display
    //The top button gives points, the score is between the two buttons, and the bottom button takes points
    let scoringDiv = document.createElement("div");
    scoringDiv.classList.add("box");

    for(let i = 0; i < numPlayers; i++)
    {
        let playerScoreDiv = document.createElement("div");
        let scoreButton = document.createElement("button");
        scoreButton.innerHTML = "Give Points";
        scoreButton.id = i;
        scoreButton.onclick = e => GivePoints(e);

        let descoreButton = document.createElement("button");
        descoreButton.innerHTML = "Take Points";
        descoreButton.id = i;
        descoreButton.onclick = e => TakePoints(e);

        let score = document.createElement("p");
        score.innerHTML = scores[i];

        playerScoreDiv.appendChild(scoreButton);
        playerScoreDiv.appendChild(score);
        playerScoreDiv.appendChild(descoreButton);
        scoringDiv.appendChild(playerScoreDiv);
    }

    //Display all created divs
    div.appendChild(question);
    div.appendChild(answer);
    div.appendChild(showAnswer);
    div.appendChild(scoringDiv);
    document.body.appendChild(div);
}

function GivePoints(e)
{
    //Add points to the proper player and show the board
    let player = parseInt(e.originalTarget.id);
    scores[player] += (currentQuestion.y + 1) * 100;
    ReturnToBoard();
}

function TakePoints(e)
{
    //Take points from the proper player and show the board
    let player = parseInt(e.originalTarget.id);
    scores[player] -= (currentQuestion.y + 1) * 100;
    ReturnToBoard();
}

function RevealAnswer()
{
    //Reveal the answer in the empty p element created in ShowQuestion
    let answer = document.querySelector(".box p");
    answer.innerHTML = questions[currentQuestion.x][currentQuestion.y].correct_answer;
}

function ReturnToBoard()
{
    //Hide the current question page and reshow the board
    document.body.removeChild(document.querySelector(".box"));
    document.body.appendChild(board);
    //Remove the onclick event from the question just left
    document.querySelector("#b" + currentQuestion.x + "" + (currentQuestion.y + 1)).onclick = null;
}

function GetQuestions()
{
    //Generate 5 random (non repeating) values for the categories
    for(let i = 0; i < 5; i++)
    {
        let category = Math.floor(Math.random() * 23) + 9;
        while(categories.includes(category))
        {
            category = Math.floor(Math.random() * 23) + 9;
        }
        categories[i] = category;
    }

    //Get a question from the API for each box
    //100-200 point boxes are easy
    //300 point boxes are medium
    //400-500 point boxes are hard
    //Since two of the requests get 2 questions, only 3 calls to the api need to be made
    for(let y = 0; y < 3; y++)
    {
        for(let x = 0; x < 5; x++)
        {
            let difficulty;
            let amount;

            if(y < 2)
            {
                difficulty = "easy";
                amount = 2;
            }
            else if(y > 2)
            {
                difficulty = "hard";
                amount = 1;
            }
            else
            {
                difficulty = "medium"
                amount = 2;
            }
            let apiUrl = urlBase + "&amount=" + amount + "&difficulty=" + difficulty + "&category=" + categories[x];
            GetData(apiUrl);
        }
    }
}

function GetData(apiUrl)
{
    let xhr = new XMLHttpRequest();
    xhr.onload = dataLoaded;
    xhr.onerror = dataError;
    xhr.open("GET", apiUrl);
    xhr.send();
}

function dataLoaded(e)
{
    let xhr = e.target;

    let object = JSON.parse(xhr.responseText);

    //Get the column number by checking which column has the same category as the returned question
    let url = e.target.responseURL;
    let categoryNumber = Number(url.substring(url.indexOf("category=") + 9));
    let index = categories.indexOf(categoryNumber);

    //Set the category title at the top of the row once the first question in it's column has been generated
    document.querySelector("#b" + index + "0").innerHTML = "<h2>" + object.results[0].category + "</h2>";

    //If a question has not been generated for this column, create the array for this column
    if(!questions[index])
    {
        questions[index] = new Array;
    }

    //Get the difficulty (and consequently row(s)) from the URL
    let difficulty = url.substring(url.indexOf("difficulty=") + 11, url.indexOf("&category="));

    //Set the questions to the correct rows based on difficulty
    if(difficulty == "hard")
    {
        questions[index][3] = object.results[0];
        questions[index][4] = object.results[1];
    }
    else if(difficulty == "medium")
    {
        questions[index][2] = object.results[0];
    }
    else
    {
        questions[index][0] = object.results[0];
        questions[index][1] = object.results[1];
    }
}

function dataError(e)
{
    console.log("An error occured");
}
