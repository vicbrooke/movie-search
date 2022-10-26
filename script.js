const movieBox = document.querySelector(".movieName");
const countryBox = document.querySelector(".country");
const movieDropDown = document.querySelector(".movieDropdown");

let cards = Array.from(movieDropDown.childNodes);



let movieArray = []
if(movieArray.length === 0){
    movieDropDown.style.display = "none";
}

movieBox.addEventListener("input", () => {
    if(movieBox.value === ""){
        movieArray = [];

    } else {
        fetch(`https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=${movieBox.value}&country=${countryBox.value}`)
        .then(response => response.json())
        .then(data =>  movieArray = data.results)
        .catch(error => console.log(error));

        while(movieArray.length > 5){
            movieArray.pop();
        }

        let count = 0;

        for(let i of movies){
            cards[count].firstChild.src = i.picture;
            cards[count].lastChild.innerText = i.name;
            count++;
        }

        for(let i = count; i < 4; i++){
            cards[i].style.display = "none";
        }

        movieDropDown.style.display = "";



    }
})

