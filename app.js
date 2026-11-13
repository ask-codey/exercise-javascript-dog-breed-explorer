// Connects the Dog Breed Explorer page to the functions in dogs.js.
// loadBreedList and showBreeds are ready to use: read them, they show a loading state and a fallback.
// The two TODOs are for you to finish: the checklist in README.md says what the page should do.
import { breedNames, loadRandomPhoto } from './dogs.js';
import { savedBreedList } from './saved-breeds.js';

const search = document.getElementById('breed-search');
const listStatus = document.getElementById('list-status');
const searchStatus = document.getElementById('search-status');
const breedList = document.getElementById('breed-list');
const photoStatus = document.getElementById('photo-status');
const photo = document.getElementById('dog-photo');
const tryAgain = document.getElementById('try-again');
const surpriseMe = document.getElementById('surprise-me');

// Every breed name, once the list has loaded, and the breed whose photo was asked for last.
let allBreeds = [];
let currentBreed = '';

// Ready to use: loads the live breed list. If it can't, it uses the saved copy and says so.
async function loadBreedList() {
  listStatus.textContent = 'Loading breeds...';
  try {
    const response = await fetch('https://dog.ceo/api/breeds/list/all', { signal: AbortSignal.timeout(8000) });
    if (!response.ok) {
      throw new Error(`The breed list answered with status ${response.status}`);
    }
    allBreeds = breedNames(await response.json());
    listStatus.textContent = `${allBreeds.length} breeds, live from the Dog CEO API.`;
  } catch (error) {
    console.error(error);
    allBreeds = breedNames(savedBreedList);
    listStatus.textContent = `The live breed list didn't load, so these ${allBreeds.length} breeds come from a saved copy.`;
  }
  showBreeds();
}

// Ready to use, apart from TODO 1: shows a button for every breed that matches the search box.
function showBreeds() {
  const words = search.value.trim().toLowerCase();
  const matches = allBreeds.filter((name) => name.includes(words));

  breedList.replaceChildren();
  for (const name of matches) {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = name;
    button.addEventListener('click', () => showPhoto(name));
    item.appendChild(button);
    breedList.appendChild(item);
  }

  // TODO 1, the empty state. When no breed matches, #search-status says, for the search "zebra":
  //   No breeds match "zebra". Try fewer letters.
  // (the search as it was typed, with the spaces taken off its ends). When breeds match, it's empty.
}

// TODO 2: show a random photo of the breed, using loadRandomPhoto from dogs.js.
// - Loading: #photo-status says "Fetching your beagle photo..." (with the breed's name), the photo
//   and the Try again button are hidden.
// - Success: the photo shows, its src is the address loadRandomPhoto gave back, its alt is
//   "A random beagle photo", and #photo-status says "Here's your beagle! Pick it again for another photo."
// - Error: log the error with console.error, #photo-status shows the error's message (loadRandomPhoto's
//   friendly words), and the Try again button shows.
async function showPhoto(breed) {
  currentBreed = breed;
}

search.addEventListener('input', showBreeds);
tryAgain.addEventListener('click', () => showPhoto(currentBreed));

// Stretch goal: make the Surprise me button show a photo of a breed picked at random from allBreeds.

loadBreedList();
