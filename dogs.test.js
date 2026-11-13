// Tests for dogs.js. Run them with: node --test
// They never touch the internet: each test hands loadRandomPhoto a fake fetch, a small function that
// answers the way the Dog CEO API would, so the tests run the same on a plane as in a coffee shop.
// You don't need to change this file.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { breedNames, imageUrlFor, loadRandomPhoto } from './dogs.js';
import { savedBreedList } from './saved-breeds.js';

// A fake fetch that answers every request with this status and this JSON body. It remembers each
// call, so a test can check which address and options it was given.
function fakeFetch(status, body) {
  const calls = [];
  async function fetchFn(url, options) {
    calls.push({ url, options });
    return { status, ok: status >= 200 && status <= 299, json: async () => body };
  }
  fetchFn.calls = calls;
  return fetchFn;
}

// A fake fetch that never gets an answer: it rejects with this error, the way the real fetch does.
function failingFetch(error) {
  return async () => {
    throw error;
  };
}

const beaglePhoto = 'https://images.dog.ceo/breeds/beagle/n02088364_852.jpg';

test('breedNames: the keys of message, in alphabetical order', () => {
  const apiData = { message: { pug: [], husky: [], beagle: [], akita: [] }, status: 'success' };
  assert.deepEqual(breedNames(apiData), ['akita', 'beagle', 'husky', 'pug'],
    'The names are the keys of apiData.message, sorted from a to z.');
});

test('breedNames: a breed with sub-breeds appears once, by its own name', () => {
  const apiData = { message: { pug: [], bulldog: ['boston', 'english', 'french'], beagle: [] }, status: 'success' };
  assert.deepEqual(breedNames(apiData), ['beagle', 'bulldog', 'pug'],
    'bulldog has three sub-breeds, but the list holds the breed names only: the keys, not the arrays.');
});

test('breedNames: the saved breed list gives all 108 breeds', () => {
  const names = breedNames(savedBreedList);
  assert.equal(names.length, 108, 'The saved list has 108 breeds.');
  assert.equal(names[0], 'affenpinscher');
  assert.equal(names.at(-1), 'wolfhound');
  assert.ok(names.includes('beagle'), 'beagle is one of the breeds.');
});

test('imageUrlFor: the random-photo address for a breed', () => {
  assert.equal(imageUrlFor('beagle'), 'https://dog.ceo/api/breed/beagle/images/random');
  assert.equal(imageUrlFor('pug'), 'https://dog.ceo/api/breed/pug/images/random');
});

test('imageUrlFor: tidies the name first', () => {
  assert.equal(imageUrlFor(' Husky '), 'https://dog.ceo/api/breed/husky/images/random',
    'Take the spaces off both ends and make the name lowercase.');
  assert.equal(imageUrlFor('BEAGLE'), 'https://dog.ceo/api/breed/beagle/images/random');
});

test('loadRandomPhoto: asks for the breed\'s address and returns the photo', async () => {
  const fetchFn = fakeFetch(200, { message: beaglePhoto, status: 'success' });
  const photo = await loadRandomPhoto('beagle', fetchFn);
  assert.equal(fetchFn.calls.length, 1, 'Call fetchFn once.');
  assert.equal(fetchFn.calls[0].url, 'https://dog.ceo/api/breed/beagle/images/random',
    'Call fetchFn with imageUrlFor(breed).');
  assert.equal(photo, beaglePhoto, 'Return the message from the JSON answer: the photo\'s address.');
});

test('loadRandomPhoto: gives the request a timeout signal', async () => {
  const fetchFn = fakeFetch(200, { message: beaglePhoto, status: 'success' });
  await loadRandomPhoto('beagle', fetchFn);
  const options = fetchFn.calls[0]?.options;
  assert.ok(options?.signal instanceof AbortSignal,
    'Call fetchFn with a second argument, { signal: AbortSignal.timeout(8000) }.');
  assert.equal(options.signal.aborted, false, 'The signal should give up after 8 seconds, not straight away.');
});

test('loadRandomPhoto: a 404 says there are no photos of that breed', async () => {
  const fetchFn = fakeFetch(404, { status: 'error', message: 'Breed not found (main breed does not exist)', code: 404 });
  await assert.rejects(loadRandomPhoto('unicorn', fetchFn),
    { message: 'We couldn\'t find any photos of unicorn. Check the breed\'s spelling.' },
    'A 404 is still an answer, so fetch doesn\'t reject: check response.ok, then response.status.');
  await assert.rejects(loadRandomPhoto(' Unicorn ', fetchFn),
    { message: 'We couldn\'t find any photos of unicorn. Check the breed\'s spelling.' },
    'Use the tidied breed name in the message.');
});

test('loadRandomPhoto: another failing status says the service had a problem', async () => {
  await assert.rejects(loadRandomPhoto('beagle', fakeFetch(500, {})),
    { message: 'The dog photo service had a problem (status 500). Try again in a minute.' });
  await assert.rejects(loadRandomPhoto('beagle', fakeFetch(503, {})),
    { message: 'The dog photo service had a problem (status 503). Try again in a minute.' },
    'Put the real status code in the message.');
});

test('loadRandomPhoto: a timeout says the service took too long', async () => {
  const timeout = new DOMException('The operation was aborted due to timeout', 'TimeoutError');
  await assert.rejects(loadRandomPhoto('beagle', failingFetch(timeout)),
    { message: 'The dog photo service took too long to answer. Try again.' },
    'When fetchFn rejects, check the error\'s name: TimeoutError means the 8 seconds ran out.');
});

test('loadRandomPhoto: no answer at all says the service couldn\'t be reached', async () => {
  await assert.rejects(loadRandomPhoto('beagle', failingFetch(new TypeError('fetch failed'))),
    { message: 'We couldn\'t reach the dog photo service. Check your internet connection.' },
    'When fetchFn rejects with any other error, there was no answer at all.');
});
