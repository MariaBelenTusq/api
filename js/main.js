'use-strict';

const content = document.querySelector('.content');
let typePoke;

const addEventListenerInDOMList = (list, event, fn) => {
    list.forEach(el => el.addEventListener(event, fn));
}

const colorPalette = {
    fire: '#eb4d4b',
    water: '#009ADE',
    electric: '#FFEA00',
    grass: '#6ab04c',
    psychic: '#BDBDBD',
    poison: '#6A1B9A',
    ground: '#5D4037',
    fighting: '#d50000',
    ghost: 'brown',
    rock: '#535c68',
    fairy: '#EC0080',
    bug: '#badc58',
    normal: '#f6e58d',
    ice: '#4FC3F7',
    dark: '#424242',
    dragon: '#f0932b',
    steel: '#474a51'
}

const getDataApi = (url, fn, container, hasEvent) => {

    fetch(url)
        .then(res => res.json())
        .then(data => fn(data, container, hasEvent))
        .catch(err => errorMessage());
}

const templateCardPoke = (pokemon, container = content, hasEvent = true) => {

    const { id, name } = pokemon;
    let color = paintCardAccordingToType(pokemon);
    let urlImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

    container.innerHTML += `
       <div class="card" data-color=${color} data-id=${id}>
        <span class="card__poke-id" data-id=${id} style="background: ${color}">${id}</span>
        <div class="card-img">
            <img src=${urlImage} data-id="${id}" alt="Sprite of ${name}" data-color=${color}>
        </div>
               <div class="card-name" style="background: ${color}"><p data-id=${id}>${name}</p></div>
       </div>
       `
    if (container == dialog) {

        let type = createTypePokeBagde(pokemon);

        container.innerHTML += `
        <div class="card-info">
        <h1 style="color: ${color}">About</h1>
        <table>
          <tbody>
            <tr>
              <td>Weight</td>
              <td>${pokemon.weight}</td>
            </tr>
            <tr>
              <td>Height</td>
              <td>${pokemon.height}</td>
            </tr>
          </tbody>
        </table>
        <div>
          ${type}
        </div>
      </div>
            `
    }

    const card = document.querySelectorAll('.card');
    paintBackgroundCardWhileFocused(card);

    if (hasEvent) {
        addEventListenerInDOMList(card, 'click', openPokemonFeatureBoard);
    }
}

const createTypePokeBagde = pokemon => {
    let types = pokemon.types.map((el, i) => {
        return `<span style="background: ${colorPalette[el.type.name]}">${el.type.name}</span>`
    });

    return types.join().replace(',', '');
}

const paintCardAccordingToType = pokemon => {

    const nameColor = pokemon.types[0].type.name;
    return colorPalette[nameColor];
}

const openPokemonFeatureBoard = e => {

    const dialog = document.getElementById('dialog');
    dialog.innerHTML = '';

    let posPageYoffset = window.pageYOffset;
    dialog.style.top = `${posPageYoffset}px`;
    const id = e.target.dataset.id;

    configDialog('auto', 'block', 'flex');
    callPokeApi(id, 1, templateCardPoke, dialog, false);
}

const closePokemonFeatureBoard = () => {
    //overflow, overlayDisplay, dialogDisplay;
    configDialog('auto', 'none', 'none');
}

const configDialog = (overflow, overlayDisplay, dialogDisplay) => {
    const overlay = document.getElementById('overlay');

    document.body.style.overflow = overflow;
    overlay.style.display = overlayDisplay
    dialog.style.display = dialogDisplay;

    overlayDisplay === 'block' ? overlay.addEventListener('click', closePokemonFeatureBoard) : true;
}

const errorMessage = () => {

    return content.innerHTML = 'Nada Encontrado!';
}

const clearContent = () => {

    return content.innerHTML = '';
}

const paintBackgroundCardWhileFocused = cards => {

    ['mouseout', 'mouseover'].forEach((ev, i) => {
        [...cards].forEach(card => {
            card.addEventListener(ev, (e) => {
                i == 1 ? card.style.background = e.target.dataset.color :
                    card.style.background = '#fff'
            });
        });
    });
}

const callPokeApi = (id = 1, amountOfPokemon = 20, fn = templateCardPoke, container, hasEvent) => {
    //max 807 pokemons

    new Array(amountOfPokemon).fill('').forEach((el, i) => {

        amountOfPokemon == 1 ? i = '' : true;

        let baseUrl = (`https://pokeapi.co/api/v2/pokemon/${i + id}`);
        getDataApi(baseUrl, fn, container, hasEvent);
    });
}

const searchPokemon = e => {

    let valuePoke = e.target.value;
    clearContent();

    console.log(valuePoke)
    if (valuePoke == '') {
        callPokeApi();

    } else {
        callPokeApi(valuePoke, 1);
    }
    removePaintAllOptions();
    e.target.value = '';
}

const loadCardPokemonFromTo = e => {
    e.preventDefault();

    removePaintAllOptions();
    const fromNumber = document.getElementById('fromNumber').value;
    const toNumber = document.getElementById('toNumber').value;

    if (isNaN(fromNumber) || isNaN(toNumber)) {
        isNaN(fromNumber) ? document.getElementById('fromNumber').value = 1 : true;
        isNaN(toNumber) ? document.getElementById('toNumber').value = 20 : true;

    } else if (toNumber > 807) {
        document.getElementById('toNumber').value = 807;

    } else if (parseInt(fromNumber) > parseInt(toNumber) || parseInt(fromNumber) === 0) {
        document.getElementById('fromNumber').value = 1;

    } else {
        let limit = toNumber - fromNumber + 1;
        clearContent();
        callPokeApi(parseInt(fromNumber), parseInt(limit));
    }
}

const loadOptionByTypeFilter = () => {

    const barFilterByType = document.querySelector('.bar-filter-by-type');

    for (let color in colorPalette) {
        barFilterByType.innerHTML += `
              <span style="background: ${colorPalette[color]}" class="optionByType">${color}</span>
    `;
    }

    const optionByType = document.querySelectorAll('.optionByType');
    addEventListenerInDOMList([...optionByType], 'click', filterPokeByType);
}

const filterPokeByType = e => {

    typePoke = e.target.innerHTML;
    paintOptionSelected(e);
    clearContent();
    callPokeApi(1, 807, loadFilteredPokemon);
}

const loadFilteredPokemon = pokemon => {

    pokemon.types.forEach(el => el.type.name == typePoke ?
        templateCardPoke(pokemon) : false);
}

const paintOptionSelected = e => {

    removePaintAllOptions();
    e.target.classList.add('active');
}

const removePaintAllOptions = () => {

    const optionByType = document.querySelectorAll('.optionByType');
    [...optionByType].forEach(el => el.classList.remove('active'));
}

const bar_search = document.querySelector('.bar-search__input');
const btn_load = document.querySelector('.btn-load');
bar_search.addEventListener('change', searchPokemon);
btn_load.addEventListener('click', loadCardPokemonFromTo);

callPokeApi();
loadOptionByTypeFilter();
