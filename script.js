
const movieBox = document.querySelector(".movieName");
const countryBox = document.querySelector(".country");
const movieDropDown = document.querySelector(".movieDropdown");

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'f74b8d2cb4msh1f5ccdfbfb6549ap1df05cjsn81230e4fdec8',
		'X-RapidAPI-Host': 'utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com'
	}
};


clean(movieDropDown);
let cards = Array.from(movieDropDown.childNodes);




let movieArray = []
if(movieArray.length === 0){
    movieDropDown.style.display = "none";
}

let inputDisabled = false;
let registeredInput = false

movieBox.addEventListener("input", () => {
    if(!inputDisabled){
        inputDisabled = true;
        setTimeout(function(){inputDisabled = false;
        search()}, 1000);
        search()
       


    }
})


function clean(node)
{
  for(let n = 0; n < node.childNodes.length; n ++)
  {
    let child = node.childNodes[n];
    if
    (
      child.nodeType === 8 
      || 
      (child.nodeType === 3 && !/\S/.test(child.nodeValue))
    )
    {
      node.removeChild(child);
      n --;
    }
    else if(child.nodeType === 1)
    {
      clean(child);
    }
  }
}

async function gather(){
    const response = await fetch(`https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=${movieBox.value}&country=${countryBox.value}`,options);
    const data = await response.json();
    return data.results;

}

function search(){
    if(movieBox.value === ""){
        movieArray = [];
        for(let i of cards){
            i.firstChild.src = "";
            i.lastChild.innerText = "";
        }

    } else {

        gather().then(result => movieArray = result).catch(error => console.log(error));

        console.log(movieArray);

        while(movieArray.length > 5){
            movieArray.pop();
        }

        let count = 0;


        for(let i of movieArray){
            try{
                cards[count].firstChild.src = i.picture;
            } catch{
                cards[count].firstChild.src = "https://w7.pngwing.com/pngs/807/819/png-transparent-http-404-computer-icons-world-wide-web-text-trademark-computer-thumbnail.png";
            }
            
            cards[count].style.display = "";
            cards[count].lastChild.innerText = i.name;
            count++;

        }
        console.log(count);

        for(let i = count; i <= 4; i++){
            console.log(cards[i]);
            cards[i].style.display = "none";
        }

        movieDropDown.style.display = "";
    }

}

