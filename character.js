let characterId = localStorage.getItem("characterClickedId");
let characterDetails = {};
let characterName = document.getElementById("name");
let validationText = "ts=1702211585300&apikey=814691c027217302e5879ecae87c28f3&hash=98f3afea17517ab83a72982038291d54"

async function getCharacterDetails(characterId) {
    const res = await fetch(`https://gateway.marvel.com/v1/public/characters/${characterId}?${validationText}`);
    const jsonData = await res.json();

    const data = jsonData.data.results;

    console.log(data);
    characterDetails = data[0];

    renderDetails();
}

function renderComics(comics) {

    let comicsElement = document.getElementById("comics");

    comics.map((comic,i) => {

        console.log(i);

        console.log(comic)
        
        let img = document.createElement("img");
        img.src = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
        img.alt = comic.title;
        img.className = "comic-img"

        let smallDiv = document.createElement("div");
        smallDiv.className = "comic-text";
        let h3 = document.createElement("h3");
        h3.innerHTML = comic.title;
        h3.className = "comic-title";

        let description = document.createElement("p");
        if(comic.textObjects.length > 0){
            description.innerHTML = comic.textObjects[0].text;
        }
        else{
            description.innerHTML = comic.description;
        }
        description.className = "comic-description";

        smallDiv.append(h3);
        smallDiv.append(description);
        
        let div = document.createElement("div");
        div.className = "comic";
        div.append(img);
        div.append(smallDiv);
        comicsElement.append(div);
    })

}

async function getComics(url) {
    const res = await fetch(`${url}?${validationText}`);
    const jsonData = await res.json();
    const data = jsonData.data.results;
    let comics = data;

    renderComics(comics);
}

function renderDetails() {
    console.log(characterDetails);

    characterName.innerHTML = characterDetails.name;

    // thumbnail
    let thumbnail = document.getElementById("thumbnail");
    thumbnail.src = `${characterDetails.thumbnail.path}.${characterDetails.thumbnail.extension}`;
    thumbnail.alt = characterDetails.name;

    let description = document.getElementById("description");

    if(characterDetails.description) {
        description.innerHTML = characterDetails.description;
    }

    if(characterDetails.comics.available > 0) {
        getComics(characterDetails.comics.collectionURI);
    }




}

getCharacterDetails(characterId);