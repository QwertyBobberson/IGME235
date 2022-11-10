var urlBase="https://opentdb.com/api.php?amount=1&type=multiple"
var categories = [9, 10, 11, 12, 13];
var questions = new Array;
var loadedData = 0;

window.onload = (e) =>
{
    const body = document.querySelector("body");
    for(let y = 0; y < 6; y++)
    {
        for(let x = 0; x < 5; x++)
        {
            let div = document.createElement("div");
            div.innerHTML = "<p>Div (" + x + ", " + y + ") </p>"
            div.id = "b" + x + "" + y;
            div.classList.add("box");
            body.appendChild(div);
        }
    }

    GetQuestions();
    PopulateBoxes();
    console.log(categories);
};

function PopulateBoxes()
{
    for(let i = 0; i < 5; i++)
    {
        document.querySelector("#b" + i + "0").innerHTML = "<p>Loading</p>";
    }

    for(let y = 1; y < 6; y++)
    {
        for(let x = 0; x < 5; x++)
        {
            document.querySelector("#b" + x + "" + y).innerHTML = "<p>" + (y * 100) + "</p>";
        }
    }

}

function GetQuestions()
{
    for(let i = 0; i < 5; i++)
    {
        let category = Math.floor(Math.random() * 23) + 9;
        while(categories.includes(category))
        {
            category = Math.floor(Math.random() * 23) + 9;
        }
        categories[i] = category;
    }

    for(let y = 0; y < 5; y++)
    {
        for(let x = 0; x < 5; x++)
        {
            let apiUrl = urlBase + "&category=" + categories[x];
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
    questions.push(object.results[0]);
    let url = e.target.responseURL;
    let categoryNumber = Number(url.substring(url.indexOf("category=") + 9));
    let index = categories.indexOf(categoryNumber);
    document.querySelector("#b" + index + "0").innerHTML = "<p>" + object.results[0].category + "</p>";
}

function dataError(e)
{
    console.log("An error occured");
}
