/**
 * The main list of books page.
 * @module BookList
 */

import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

let page = 1; // Current page number
let matches = books; // List of books that match the search filters

/**
 * Creates a button element for a book.
 * @param {Object} book - The book object.
 * @param {string} book.author - The author of the book.
 * @param {string} book.id - The ID of the book.
 * @param {string} book.image - The URL of the book's image.
 * @param {string} book.title - The title of the book.
 * @returns {HTMLButtonElement} The created button element.
 */
const createButtonElement = ({ author, id, image, title }) => {
  const element = document.createElement('button');
  element.classList = 'preview';
  element.setAttribute('data-preview', id);

  element.innerHTML = `
    <img class="preview__image" src="${image}" />
    <div class="preview__info">
      <h3 class="preview__title">${title}</h3>
      <div class="preview__author">${authors[author]}</div>
    </div>
  `;

  return element;
};


  //Initializes the starting list of book items.
 
const initializeList = () => {
  const starting = document.createDocumentFragment();
  matches.slice(0, BOOKS_PER_PAGE).forEach((book) => {
    const element = createButtonElement(book);
    starting.appendChild(element);
  });

  document.querySelector('[data-list-items]').appendChild(starting);
};

/**
 * Creates an option element for a select dropdown.
 * @param {string} value - The value of the option.
 * @param {string} text - The text of the option.
 * @returns {HTMLOptionElement} The created option element.
 */
const createOptionElement = (value, text) => {
  const element = document.createElement('option');
  element.value = value;
  element.innerText = text;
  return element;
};

/**
 * Creates the options for the genre or author select dropdown.
 * @param {Object} data - The data object containing genres or authors.
 * @param {string} container - The name of the container (genres or authors).
 */
const createOptions = (data, container) => {
  const fragment = document.createDocumentFragment();
  fragment.appendChild(createOptionElement('any', `All ${container}`));
  Object.entries(data).forEach(([id, name]) => {
    fragment.appendChild(createOptionElement(id, name));
  });
  document.querySelector(`[data-search-${container}]`).appendChild(fragment);
};

createOptions(genres, 'genres');
createOptions(authors, 'authors');

const settingsTheme = document.querySelector('[data-settings-theme]');
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
settingsTheme.value = prefersDarkMode ? 'night' : 'day';
document.documentElement.style.setProperty('--color-dark', prefersDarkMode ? '255, 255, 255' : '10, 10, 20');
document.documentElement.style.setProperty('--color-light', prefersDarkMode ? '10, 10, 20' : '255, 255, 255');

// Updates the "Show more" button text and remaining book count. 
const updateListButton = () => {
  const remaining = Math.max(matches.length - page * BOOKS_PER_PAGE, 0);
  const listButton = document.querySelector('[data-list-button]');
  listButton.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${remaining})</span>
  `;
};

// Event handler for the search cancel button click.
 const handleSearchCancel = () => {
  document.querySelector('[data-search-overlay]').open = false;
};

 //Event handler for the settings cancel button click.
 const handleSettingsCancel = () => {
  document.querySelector('[data-settings-overlay]').open = false;
};


// Event handler for the header search button click.
const handleHeaderSearchClick = () => {
  document.querySelector('[data-search-overlay]').open = true;
  document.querySelector('[data-search-title]').focus();
};

 //Event handler for the header settings button click.
const handleHeaderSettingsClick = () => {
  document.querySelector('[data-settings-overlay]').open = true;
};

//Event handler for the close list button click.
 const handleCloseListClick = () => {
  document.querySelector('[data-list-active]').open = false;
};

/**
 * Event handler for the settings form submit.
 * @param {Event} event - The form submit event.
 */
const handleSettingsFormSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);

  if (theme === 'night') {
    document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
    document.documentElement.style.setProperty('--color-light', '10, 10, 20');
  } else {
    document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', '255, 255, 255');
  }

  document.querySelector('[data-settings-overlay]').open = false;
};

/**
 * Event handler for the search form submit.
 * @param {Event} event - The form submit event.
 */
const handleSearchFormSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  const result = [];

  for (const book of books) {
    let genreMatch = filters.genre === 'any';

    for (const singleGenre of book.genres) {
      if (genreMatch) break;
      if (singleGenre === filters.genre) {
        genreMatch = true;
      }
    }

    if (
      (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (filters.author === 'any' || book.author === filters.author) &&
      genreMatch
    ) {
      result.push(book);
    }
  }

  page = 1;
  matches = result;

  const listMessage = document.querySelector('[data-list-message]');
  listMessage.classList.toggle('list__message_show', result.length < 1);

  document.querySelector('[data-list-items]').innerHTML = '';
  const newItems = document.createDocumentFragment();

  result.slice(0, BOOKS_PER_PAGE).forEach((book) => {
    const element = createButtonElement(book);
    newItems.appendChild(element);
  });

  document.querySelector('[data-list-items]').appendChild(newItems);
  document.querySelector('[data-list-button]').disabled = (matches.length - page * BOOKS_PER_PAGE) < 1;

  updateListButton();

  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.querySelector('[data-search-overlay]').open = false;
};

 //Event handler for the "Show more" button click.
 const handleListButtonClick = () => {
  const fragment = document.createDocumentFragment();

  matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE).forEach((book) => {
    const element = createButtonElement(book);
    fragment.appendChild(element);
  });

  document.querySelector('[data-list-items]').appendChild(fragment);
  page += 1;
  updateListButton();
};

/**
 * Event handler for the list items click.
 * @param {Event} event - The click event.
 */
const handleListItemsClick = (event) => {
  const pathArray = Array.from(event.path || event.composedPath());
  let active = null;

  for (const node of pathArray) {
    if (active) break;

    if (node?.dataset?.preview) {
      active = books.find((book) => book.id === node.dataset.preview);
    }
  }

  if (active) {
    const listActive = document.querySelector('[data-list-active]');
    listActive.open = true;
    document.querySelector('[data-list-blur]').src = active.image;
    document.querySelector('[data-list-image]').src = active.image;
    document.querySelector('[data-list-title]').innerText = active.title;
    document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
    document.querySelector('[data-list-description]').innerText = active.description;
  }
};

document.querySelector('[data-search-cancel]').addEventListener('click', handleSearchCancel);
document.querySelector('[data-settings-cancel]').addEventListener('click', handleSettingsCancel);
document.querySelector('[data-header-search]').addEventListener('click', handleHeaderSearchClick);
document.querySelector('[data-header-settings]').addEventListener('click', handleHeaderSettingsClick);
document.querySelector('[data-list-close]').addEventListener('click', handleCloseListClick);
document.querySelector('[data-settings-form]').addEventListener('submit', handleSettingsFormSubmit);
document.querySelector('[data-search-form]').addEventListener('submit', handleSearchFormSubmit);
document.querySelector('[data-list-button]').addEventListener('click', handleListButtonClick);
document.querySelector('[data-list-items]').addEventListener('click', handleListItemsClick);

initializeList();
updateListButton();
