const movieBox = document.querySelector(".movieName");
const countryBox = document.querySelector(".country");
const movieDropDown = document.querySelector(".movieDropdown");
const movieTitle = document.querySelector(".movieTitle");
const movieImage = document.querySelector(".movieImage");
const streamingPlatforms = document.querySelector(".streamingPlatforms");
const watchlistButton = document.querySelector(".watchlistButton");
const chosenMovies = document.querySelector(".chosenMovies");
const description2 = document.querySelector(".description2");
const featured = document.querySelector(".featured");
const featuredContainer = document.querySelector(".featuredContainer");
const viewWatchlist = document.querySelector(".openWatchlist")
const movieInfo = document.querySelector(".movieInfo");
let watchlistArr = [];
let typingTimer;
let a;
let li;
let img;
let currentMovie;
let selection;

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "f74b8d2cb4msh1f5ccdfbfb6549ap1df05cjsn81230e4fdec8",
    "X-RapidAPI-Host":
      "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
  },
};

function addMovieDetails(movie) {
  while (streamingPlatforms.firstChild) {
    streamingPlatforms.removeChild(streamingPlatforms.lastChild);
  }

  currentMovie = movie;

  movieTitle.innerText = movie.name;
  movieImage.src = movie.picture;

  for (let i of movie.locations) {
    a = document.createElement("a");
    li = document.createElement("li");
    img = document.createElement("img");

    a.href = i.url;
    a.target = "_blank";

    img.src = i.icon;
    img.classList.add("streamingIcon");

    a.append(img);
    a.classList.add("streamingServices");

    li.append(a);
    streamingPlatforms.append(li);
  }

  movieDropDown.style.display = "none";
  movieInfo.style.display = "flex";
  watchlistButton.style.display = "inline";
  description2.style.display = "inline";
  featuredContainer.style.display = "none";

}

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

async function gather(searchTerm) {
  const response = await fetch(
    `https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=${searchTerm}&country=${countryBox.value}`,
    options
  );
  const data = await response.json();
  console.log(data.results);
  return data.results.length > 0 ? data.results : [];
}

async function search() {
  if (movieBox.value === "") {
    movieArray = [];
    for (let i of cards) {
      i.style.display = "none";
      i.firstChild.src = "";
      i.lastChild.innerText = "";
    }
  } else {
    await gather(movieBox.value)
      .then((result) => (movieArray = result))
      .catch((error) => console.log(error));

    console.log(movieArray);

    while (movieArray.length > 5) {
      movieArray.pop();
    }

    if (movieArray.length === 0) {
      movieDropDown.style.display = "none";
      return;
    }

    let count = 0;

    for (let i of movieArray) {
        if(cards[count].firstChild.src === i.picture){
            count++;
            continue;
        }
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

async function mergeMovies() {
    mergedArray = [];
    await gather("a")
      .then((result) => (mergedArray = result))
      .catch((error) => console.log(error));
    await gather("t")
      .then((result) => (mergedArray = mergedArray.concat(result)))
      .catch((error) => console.log(error));
    console.log(mergedArray);
  
    mergedArray.forEach((film) => {
      const filmDiv = document.createElement("div");
      const filmImage = document.createElement("img");
      const filmTag = document.createElement("p");
      filmDiv.className = "featuredDiv";
      filmImage.className = "featuredImage";
      filmTag.className = "featuredTag";
      filmImage.setAttribute("src", film.picture);
      filmTag.innerText = film.name;
      filmDiv.append(filmImage);
      filmDiv.append(filmTag);
      featured.append(filmDiv);
    });
  }

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
  typingTimer = setTimeout(search, 250);
});

document.addEventListener("click", (e) => {
  if (e.target.matches(".movieSuggestions,.dropdownImage, .dropdownTag")) {
    const card = e.target.closest(".movieSuggestions");
    selection =
      movieArray[
        cards.findIndex((element) => {
          return element === card;
        })
      ];
      addMovieDetails(selection);
  } else if (e.target.matches(".watchlistMovie")) {
    const list = e.target.closest("li");
    const container = e.target.closest(".chosenMovies")
    let watchlist = Array.from(container.childNodes);
    console.log(watchlist);
    selection =
      watchlistArr[
        watchlist.findIndex((element) => {
          return element === list;
        })
      ];
    console.log(selection);
    addMovieDetails(selection);

    
  } else if (e.target.matches(".featuredDiv,.featuredImage,.featuredTag")){
    let featuredMovie = e.target.closest(".featuredDiv");
    clean(featured);
    featuredArray = Array.from(featured.childNodes);
    selection = mergedArray[featuredArray.findIndex((element) => { return element === featuredMovie;})]
    console.log(selection);
    addMovieDetails(selection);
  }

  
});

movieBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (movieArray.length > 0) {
      addMovieDetails(movieArray[0]);
      currentMovie = movieArray[0];
      movieDropDown.style.display = "none";
    } else {
      return;
    }
  }
});

watchlistButton.addEventListener("click", () => {
  if (!watchlistArr.includes(currentMovie)) {
    watchlistArr.push(currentMovie);
    a = document.createElement("p");
    li = document.createElement("li");
    a.innerHTML = currentMovie.name;
    a.classList.add("watchlistMovie");
    li.append(a);
    chosenMovies.append(li);

  }
});

function openNav() {
    document.querySelector(".watchlist").style.width = "250px";
    console.log(document.querySelector(".watchlist").style.width);
    return false;
};

function closeNav() {
    console.log(document.querySelector(".watchlist").style.width);
    document.querySelector(".watchlist").style.width = "0";
    return false;
    
}

navButton = document.querySelector('.navButton')
navItems = document.querySelector('.nav-items')

navButton.addEventListener('click', () =>{

  let navDisplay = navItems.style.display;
  if(navDisplay === "none"){
    navItems.style.display = 'flex'
  } else{
     navItems.style.display = 'none'
  }
})


mergeMovies();
