console.log("========== CHEER BEER APP ==========");

// API URL
const baseBeersUrl = `https://api.punkapi.com/v2/beers`
let randomBeerUrl = `${baseBeersUrl}/random`

// ELEMENTS
const [cheerBeerBtn, beersBtn, randomBeerBtn, , searchBtn] = document.querySelectorAll('.nav');
const mainDisplay = document.getElementById('main-display');
const beersDisplay = document.getElementById('beers-display');
const showOneBeerDisplay = document.getElementById('one-beer-show-hide');
const showBeersElement = document.getElementById('show-beers')
const showErrorMsg = document.getElementById('show-search-error')

const pageSizeBtn = document.getElementById('page-size')
const sortByBtn = document.getElementById('sort-by')

const prevPageBtn = document.getElementById('prev-page')
const nextPageBtn = document.getElementById('next-page')
const paginationElement = document.getElementById('paggination')

const [oneBeerImg, oneBeerText] = document.getElementsByClassName('one-beer');


// FUNCTIONS

let callBeerApi = async (url) => {
    try {
        return await fetch(url).then(response => response.json());
    }
    catch (error) {
        console.log(error);
    }
}

let showOneBeer = (beer) => {
    const { image_url, id, name, tagline, description, first_brewed, abv, ibu, food_pairing } = beer
    oneBeerImg.setAttribute('src', `${image_url}`);
    oneBeerText.innerHTML = `
        <h3 class="one-beer name">
            ${id}. ${name}
            <span class="one-beer tagline">${tagline}</span>
        </h3>

        <p class="one-beer description">
            ${description}
        </p>

        <ul class="one-beer first-ul">
            <li class="one-beer brewed-date">
                 Brewed:  ${first_brewed}
            </li>
            <li class="one-beer alcohol">
                 Alcohol:  ${abv}%
            </li>
            <li class="one-beer bitterness">
                 Bitterness:  ${ibu} IBU
            </li>
        </ul>

        <h4>Food Pairing</h4>

        <ul class="one-beer food-pairing-ul">
            <li>${food_pairing[0]}</li>
            <li>${food_pairing[1]}</li>
            <li>${food_pairing[2]}</li>         
        </ul>`
}

let showBeers = (beer) => {
    showBeersElement.innerHTML = "";
    for (let i = 0; i < beer.length; i++) {
        showBeersElement.innerHTML += `
        <div class="card" style="width: 20%;">
             <img src=${beer[i].image_url} class="card-img-top" alt="beer-image">
             <div class="card-body">
                 <h5 class="card-title">
                    ${beer[i].id}. ${beer[i].name}
                 </h5>
                 <p class="card-text">
                    ${beer[i].description}
                 </p>
                 <button type="button" id="show-details-btn" name='${beer[i].id}' class="btn btn-outline-danger">
                     Show details
                 </button>
             </div>
         </div>`
    }
}

let sortBeers = (value, beer) => {
    switch (value) {
        case "default":
            showBeers(beer.sort((b1, b2) => b1.id - b2.id))
            break;
        case "name-asc":
            showBeers(beer.sort((b1, b2) => b1.name.localeCompare(b2.name)))
            break;
        case "name-desc":
            showBeers(beer.sort((b1, b2) => b2.name.localeCompare(b1.name)))
            break;
        case "abv-asc":
            showBeers(beer.sort((b1, b2) => b1.abv - b2.abv))
            break;
        case "abv-desc":
            showBeers(beer.sort((b1, b2) => b2.abv - b1.abv))
            break;
        case "ibu-asc":
            showBeers(beer.sort((b1, b2) => b1.ibu - b2.ibu))
            break;
        case "ibu-desc":
            showBeers(beer.sort((b1, b2) => b2.ibu - b1.ibu))
            break;
        case "bdate-asc":
            showBeers(beer.sort((b1, b2) => {
                let firstDate = new Date(b1.first_brewed.split('/').reverse().join(','))
                let secondDate = new Date(b2.first_brewed.split('/').reverse().join(','))
                return firstDate.valueOf() - secondDate.valueOf()
            }))
            break;
        case "bdate-desc":
            showBeers(beer.sort((b1, b2) => {
                let firstDate = new Date(b2.first_brewed.split('/').reverse().join(','))
                let secondDate = new Date(b1.first_brewed.split('/').reverse().join(','))
                return firstDate.valueOf() - secondDate.valueOf()
            }))
            break;
    }
}

// PAGINATION
let totalPages = (perPage) => {
    let totalApiBeers = 325
    return Math.ceil(totalApiBeers / perPage)
}
let pageNum = 1;
let beersPerPage = 25;


//  EVENTS

// MAIN NAV BUTTON EVENTS

cheerBeerBtn.addEventListener('click', async () => {
    mainDisplay.removeAttribute('hidden');
    beersDisplay.setAttribute('hidden', 'hidden');
    showOneBeerDisplay.setAttribute('hidden', 'hidden');
    showErrorMsg.setAttribute('hidden', 'hidden')
})

randomBeerBtn.addEventListener('click', async () => {
    showOneBeerDisplay.removeAttribute('hidden');
    mainDisplay.setAttribute('hidden', 'hidden');
    beersDisplay.setAttribute('hidden', 'hidden');
    showErrorMsg.setAttribute('hidden', 'hidden')

    let beerInfo = await callBeerApi(randomBeerUrl);
    console.log(beerInfo);
    showOneBeer(beerInfo[0])
})

beersBtn.addEventListener('click', async () => {
    beersDisplay.removeAttribute('hidden');
    mainDisplay.setAttribute('hidden', 'hidden');
    showOneBeerDisplay.setAttribute('hidden', 'hidden');
    paginationElement.innerText = `page ${pageNum} / ${totalPages(beersPerPage)}`
    showErrorMsg.setAttribute('hidden', 'hidden')

    let beerInfo = await callBeerApi(`${baseBeersUrl}?page=${pageNum}&per_page=${beersPerPage}`)
    showBeers(beerInfo)
})

// PAGGINATION EVENTS

pageSizeBtn.addEventListener('change', async (e) => {
    e.preventDefault()
    beersPerPage = e.target.value
    pageNum = 1;
    paginationElement.innerText = `page ${pageNum} / ${totalPages(beersPerPage)}`

    let beerInfo = await callBeerApi(`${baseBeersUrl}?page=${pageNum}&per_page=${beersPerPage}`)
    showBeers(beerInfo)
})

prevPageBtn.addEventListener('click', async () => {
    if (pageNum === 1) {
        return
    }
    pageNum--
    paginationElement.innerText = `page ${pageNum} / ${totalPages(beersPerPage)}`

    let beerInfo = await callBeerApi(`${baseBeersUrl}?page=${pageNum}&per_page=${beersPerPage}`)
    showBeers(beerInfo)
})

nextPageBtn.addEventListener('click', async () => {
    if (pageNum === totalPages(beersPerPage)) {
        return
    }
    pageNum++
    paginationElement.innerText = `page ${pageNum} / ${totalPages(beersPerPage)}`

    let beerInfo = await callBeerApi(`${baseBeersUrl}?page=${pageNum}&per_page=${beersPerPage}`)
    showBeers(beerInfo)
})

// SORTING 

sortByBtn.addEventListener('change', async (e) => {
    e.preventDefault()
    let beerInfo = await callBeerApi(`${baseBeersUrl}?page=${pageNum}&per_page=${beersPerPage}`)
    sortBeers(e.target.value, beerInfo)
})

// SHOW DETAILS 

showBeersElement.addEventListener('click', async (e) => {
    e.preventDefault()
    if (e.target.id === "show-details-btn") {
        let beerId = e.target.name
        let beerInfo = await callBeerApi(`${baseBeersUrl}/${beerId}`)
        showOneBeer(beerInfo[0])
        showOneBeerDisplay.removeAttribute('hidden');
        beersDisplay.setAttribute('hidden', 'hidden');
    }
})

// SEARCH 

searchBtn.addEventListener('click', async () => {
    let searchBeerValue = document.getElementById('search-beers').value;
    if (!searchBeerValue) return

    try {
        let beerInfo = await fetch(`${baseBeersUrl}?beer_name=${searchBeerValue}`).then(response => response.json());
        showOneBeer(beerInfo[0])

        showErrorMsg.setAttribute('hidden', 'hidden')
        showOneBeerDisplay.removeAttribute('hidden');
        mainDisplay.setAttribute('hidden', 'hidden');
        beersDisplay.setAttribute('hidden', 'hidden');
    }
    catch (error) {
        console.log(error);
        if (error) {
            showErrorMsg.removeAttribute('hidden')
            setTimeout(() => {
                showErrorMsg.setAttribute('hidden', 'hidden')
            }, 5800);
        }
    }

    document.getElementById('search-beers').value = "";
})


