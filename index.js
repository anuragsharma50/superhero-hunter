let characters = [];
let favPage = false;
let searchIcon = document.getElementById("search-icon");
let cards = document.getElementById("cards");
let favButton = document.getElementById("fav");
let homeButton = document.getElementById("logo");
let homeButton2 = document.getElementById("logo-mini");
let characterClickedId = "";

if(localStorage.getItem("characters") != null){
    characters = JSON.parse(localStorage.getItem("characters"));
};

async function getCharacter() {

    const res = await fetch("https://gateway.marvel.com/v1/public/characters?limit=100&ts=1702211585300&apikey=814691c027217302e5879ecae87c28f3&hash=98f3afea17517ab83a72982038291d54");
    const jsonData = await res.json();
    const data = jsonData.data.results;

    data.forEach(element => {

        let checkImg = element.thumbnail.path.slice(-19);

        if(checkImg !== 'image_not_available' && element.thumbnail.extension !== 'gif'){
            const character = {
                id: element.id,
                name: element.name,
                img: element.thumbnail.path + "." + element.thumbnail.extension,
                fav: false
            }
    
            characters.push(character);
        }

        localStorage.setItem("characters", JSON.stringify(characters));
    });
};

async function render(characters) {

    if(characters.length == 0 ){
        await getCharacter();
    }

    let cards = document.getElementById("cards");

    cards.innerHTML = "";

    characters.map((character) => {
        let div = document.createElement("div");
    
        div.innerHTML = `
            <img src="${character.img}" alt=${character.name}>
            <p class="name">${character.name}</p>
            <i class="${character.fav ? "fa-solid" : "fa-regular"} fa-heart" data-id=${character.id}></i>
        `;

        div.className = "card";
        div.id = character.id;

        cards.append(div);

    })
};

function searchCharacter(charName) {
    const temp = characters.filter(character => {
        return character.name.toLowerCase().includes(charName);
    })

    console.log(temp);
    render(temp);
};

function updateFavs(favID) {
    characters.forEach(character => {
        if(character.id == favID) {
            character.fav = !character.fav;
        }
    })

    localStorage.setItem("characters", JSON.stringify(characters));

    if(favPage) {
        renderFavs();
    }
};

function renderFavs() {
    const temp = characters.filter(character => {
        return character.fav;
    })

    favPage = true;
    render(temp);
};

render(characters);

searchIcon.addEventListener("click", () => {
    let searchBox = document.getElementById("search-box");
    searchCharacter(searchBox.value.trim().toLowerCase());
});

cards.addEventListener('click',(event) => {
    if(event.target.classList != '' && event.target.classList[1] == "fa-heart"){
        if(event.target.classList[0] === "fa-solid") {
            event.target.className = "fa-regular fa-heart";
            updateFavs(event.target.dataset.id);
        }
        else {
            event.target.className = "fa-solid fa-heart";
            updateFavs(event.target.dataset.id);
        }
    }
    else{
        if(event.target.classList[0] == "cards"){
            return;
        }

        localStorage.setItem("characterClickedId", event.composedPath()[1].id);
        window.location.pathname = `./character.html`;
    }
});

favButton.addEventListener("click", renderFavs);
homeButton.addEventListener("click", () => {
    favPage = false;
    render(characters)
});

homeButton2.addEventListener("click", () => {
    favPage = false;
    render(characters)
});