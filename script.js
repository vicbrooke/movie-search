const movieBox = document.querySelector(".movieName");
const countryBox = document.querySelector(".country");
const movieDropDown = document.querySelector(".movieDropdown");
const movieTitle = document.querySelector(".movieTitle");
const movieImage = document.querySelector(".movieImage");
const streamingPlatforms = document.querySelector(".streamingPlatforms");
let typingTimer;

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "f74b8d2cb4msh1f5ccdfbfb6549ap1df05cjsn81230e4fdec8",
    "X-RapidAPI-Host":
      "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
  },
};

clean(movieDropDown);
let cards = Array.from(movieDropDown.childNodes);

let movieArray = [];
if (movieArray.length === 0) {
  movieDropDown.style.display = "none";
}

let inputDisabled = false;
let registeredInput = false;

movieBox.addEventListener("input", () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(search, 200);
})


function clean(node) {
  for (let n = 0; n < node.childNodes.length; n++) {
    let child = node.childNodes[n];
    if (
      child.nodeType === 8 ||
      (child.nodeType === 3 && !/\S/.test(child.nodeValue))
    ) {
      node.removeChild(child);
      n--;
    } else if (child.nodeType === 1) {
      clean(child);
    }
  }
}

async function gather(){
    const response = await fetch(`https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=${movieBox.value}&country=${countryBox.value}`,options);
    const data = await response.json();
    console.log(data.results);
    return data.results;

}

async function search(){
    if(movieBox.value === ""){
        movieArray = [];
        for(let i of cards){
            i.style.display = "none";
            i.firstChild.src = "";
            i.lastChild.innerText = "";
        }

    } else {

        await gather().then(result => movieArray = result).catch(error => console.log(error));

        console.log(movieArray);

        while(movieArray.length > 5){
            movieArray.pop();
        }


    console.log(movieArray);

    while (movieArray.length > 5) {
      movieArray.pop();
    }

    let count = 0;

    for (let i of movieArray) {
      try {
        cards[count].firstChild.src = i.picture;
      } catch {
        cards[count].firstChild.src =
          "https://w7.pngwing.com/pngs/807/819/png-transparent-http-404-computer-icons-world-wide-web-text-trademark-computer-thumbnail.png";
      }

      cards[count].style.display = "";
      cards[count].lastChild.innerText = i.name;
      count++;
    }
    console.log(count);

    for (let i = count; i <= 4; i++) {
      console.log(cards[i]);
      cards[i].style.display = "none";
    }

    movieDropDown.style.display = "";
  }
}

document.addEventListener("click",(e) => {
    if(e.target.matches(".movieSuggestions,.dropdownImage, dropdownTag")){

        let a;
        const card = e.target.closest(".movieSuggestions");
        console.log(card);
        console.log(cards);
        let selection = movieArray[cards.findIndex((element) => {return element === card})];



        addMovieDetails(selection);

        movieDropDown.style.display = "none";


    }
})

movieBox.addEventListener("keypress", (e) => {
    if(e.key === "Enter"){
        e.preventDefault();
        if(movieArray.length > 0){

            addMovieDetails(movieArray[0]);
            movieDropDown.style.display = "none";

        } else { return; }

    }
})

function addMovieDetails(movie){

    movieTitle.innerText = movie.name;
    movieImage.src = movie.picture;

    for(let i of movie.locations){
        a = document.createElement("a");
        a.href = i.url;
        a.innerHTML = i.display_name;
        streamingPlatforms.append(a);
    }

}

