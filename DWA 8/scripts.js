import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

// Initialize page and set up initial state
let page = 1; // Current page
let matches = books; // Array of matched books

// Function to create a button element for book preview
const createButtonElement = (id, image, title, author) => {
  const element = document.createElement('button');
  element.classList = 'preview';
  element.setAttribute('data-preview', id);

  const imageElement = document.createElement('img');
  imageElement.classList = 'preview__image';
  imageElement.src = image;

  const infoElement = document.createElement('div');
  infoElement.classList = 'preview__info';

  const titleElement = document.createElement('h3');
  titleElement.classList = 'preview__title';
  titleElement.innerText = title;

  const authorElement = document.createElement('div');
  authorElement.classList = 'preview__author';
  authorElement.innerText = authors[author];

  infoElement.appendChild(titleElement);
  infoElement.appendChild(authorElement);

  element.appendChild(imageElement);
  element.appendChild(infoElement);


  return element;
};

// Function to create an option element for genre or author selection
const createOptionElement = (value, name) => {
  const element = document.createElement('option');
  element.value = value;
  element.innerText = name;
  return element;
};

// Function to initialize the page with initial data and event listeners
const initializePage = () => {
  const starting = document.createDocumentFragment();
  const genreHtml = document.createDocumentFragment();
  const authorsHtml = document.createDocumentFragment();


  // Create button elements for the first set of books to display
  for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
    const element = createButtonElement(id, image, title, author);
    starting.appendChild(element);
  }

  // Append the button elements to the list items container
  document.querySelector('[data-list-items]').appendChild(starting);

  // Create option elements for genres and append them to the genre selection dropdown
  const firstGenreElement = createOptionElement('any', 'All Genres');
  genreHtml.appendChild(firstGenreElement);
  for (const [id, name] of Object.entries(genres)) {
    const element = createOptionElement(id, name);
    genreHtml.appendChild(element);
  }
  document.querySelector('[data-search-genres]').appendChild(genreHtml);

  // Create option elements for authors and append them to the author selection dropdown
  const firstAuthorElement = createOptionElement('any', 'All Authors');
  authorsHtml.appendChild(firstAuthorElement);
  for (const [id, name] of Object.entries(authors)) {
    const element = createOptionElement(id, name);
    authorsHtml.appendChild(element);
  }
  document.querySelector('[data-search-authors]').appendChild(authorsHtml);

  // Determine the color scheme based on the user's preference or default to 'day'
  const colorScheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'night'
    : 'day';

  // Set the selected value of the theme selection dropdown
  document.querySelector('[data-settings-theme]').value = colorScheme;

  // Set the CSS variables for the color scheme
  const darkColor = colorScheme === 'night' ? '255, 255, 255' : '10, 10, 20';
  const lightColor = colorScheme === 'night' ? '10, 10, 20' : '255, 255, 255';
  document.documentElement.style.setProperty('--color-dark', darkColor);
  document.documentElement.style.setProperty('--color-light', lightColor);

  // Add event listeners for search and settings forms, search overlay, and settings overlay
  document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = false;
  });

  document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false;
  });

  document.querySelector('[data-header-search]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = true;
    document.querySelector('[data-search-title]').focus();
  });

  document.querySelector('[data-header-settings]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = true;
  });

  // Add event listeners for closing the book details and handling form submissions
  document.querySelector('[data-list-close]').addEventListener('click', () => {
    document.querySelector('[data-list-active]').open = false;
  });

  document.querySelector('[data-settings-form]').addEventListener('submit', handleSettingsFormSubmit);

  document.querySelector('[data-search-form]').addEventListener('submit', handleSearchFormSubmit);

  document.querySelector('[data-list-button]').addEventListener('click', handleListButtonClick);

  document.querySelector('[data-list-items]').addEventListener('click', handleBookItemClick);

  // Set the initial remaining count and update the "Show more" button text
  const remainingCount = Math.max(0, matches.length - (page * BOOKS_PER_PAGE));
  document.querySelector('[data-list-button]').innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${remainingCount})</span>
  `;

  // Scroll to the top of the page
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Close the search overlay
  document.querySelector('[data-search-overlay]').open = false;
};

// Function to handle settings form submission
const handleSettingsFormSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);
  const darkColor = theme === 'night' ? '255, 255, 255' : '10, 10, 20';
  const lightColor = theme === 'night' ? '10, 10, 20' : '255, 255, 255';
  document.documentElement.style.setProperty('--color-dark', darkColor);
  document.documentElement.style.setProperty('--color-light', lightColor);
  document.querySelector('[data-settings-overlay]').open = false;
};

// Function to handle search form submission
const handleSearchFormSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  const result = [];

  // Filter books based on the search criteria
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

  // Reset page and update the matches with the filtered results
  page = 1;
  matches = result;

  // Update the UI with the filtered results
  const listMessage = document.querySelector('[data-list-message]');
  listMessage.classList.toggle('list__message_show', result.length < 1);

  const listItems = document.querySelector('[data-list-items]');
  listItems.innerHTML = '';
  const newItems = document.createDocumentFragment();

  for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
    const element = createButtonElement(id, image, title, author);
    newItems.appendChild(element);
  }

  listItems.appendChild(newItems);
  document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1;
  const remainingCount = Math.max(0, matches.length - (page * BOOKS_PER_PAGE));
  document.querySelector('[data-list-button]').innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${remainingCount})</span>
  `;

  // Scroll to the top of the page
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Close the search overlay
  document.querySelector('[data-search-overlay]').open = false;
};

// Function to handle "Show more" button click
const handleListButtonClick = () => {
  const fragment = document.createDocumentFragment();

  for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
    const element = createButtonElement(id, image, title, author);
    fragment.appendChild(element);
  }

  document.querySelector('[data-list-items]').appendChild(fragment);
  page += 1;
};

// Function to handle book item click
const handleBookItemClick = (event) => {
  const target = event.target.closest('[data-preview]');
  if (target) {
    const active = books.find((book) => book.id === target.dataset.preview);
    if (active) {
      showBookDetails(active);
    }
  }
};

// Function to create a button element
const createButtonElement2 = (id, image, title, author) => {
  const element = document.createElement('button');
  element.classList = 'preview';
  element.setAttribute('data-preview', id);

  element.innerHTML = `
    <img
      class="preview__image"
      src="${image}"
    />
    
    <div class="preview__info">
      <h3 class="preview__title">${title}</h3>
      <div class="preview__author">${authors[author]}</div>
    </div>
  `;

  return element;
};

// Function to show book details
const showBookDetails = (book) => {
  const listActive = document.querySelector('[data-list-active]');
  listActive.open = true;
  document.querySelector('[data-list-blur]').src = book.image;
  document.querySelector('[data-list-image]').src = book.image;
  document.querySelector('[data-list-title]').innerText = book.title;
  document.querySelector('[data-list-subtitle]').innerText = `${authors[book.author]} (${new Date(book.published).getFullYear()})`;
  document.querySelector('[data-list-description]').innerText = book.description;
};

// Call the initializePage function to set up the initial state of the page
initializePage();