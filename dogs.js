// Working with the Dog CEO API: the breed names, a photo's address, and loading a photo.
// These functions only work with data and requests, with no page involved, so the tests can check them.
// For you to finish.
//
// Requirements:
//
// - breedNames(apiData) takes the whole answer from https://dog.ceo/api/breeds/list/all, an object like
//     { message: { pug: [], bulldog: ['boston', 'english', 'french'], beagle: [] }, status: 'success' }
//   and returns the breed names (the keys of message) as an array in alphabetical order. A breed with
//   sub-breeds, such as bulldog, appears once, by its own name.
//     breedNames({ message: { pug: [], bulldog: ['boston', 'english', 'french'], beagle: [] }, status: 'success' })
//       ->  ['beagle', 'bulldog', 'pug']
//     breedNames(savedBreedList)  ->  108 names, from 'affenpinscher' to 'wolfhound'
//
// - imageUrlFor(breed) returns the address of the endpoint that answers with a random photo of that
//   breed. Tidy the name first: no spaces at either end, and all lowercase.
//     imageUrlFor('beagle')   ->  'https://dog.ceo/api/breed/beagle/images/random'
//     imageUrlFor(' Husky ')  ->  'https://dog.ceo/api/breed/husky/images/random'
//
// - loadRandomPhoto(breed, fetchFn = fetch) is async. It calls fetchFn with two arguments:
//   imageUrlFor(breed), and an options object with a signal that gives up after 8 seconds,
//   { signal: AbortSignal.timeout(8000) }. It returns the photo's address: the message in the JSON
//   answer. The page calls it with one argument, so fetchFn is the real fetch; the tests hand in a
//   fake fetch instead, so they run without the internet.
//   When something goes wrong, it throws an Error with one of these messages, word for word
//   (unicorn stands for the breed, tidied as in imageUrlFor):
//     the answer's status is 404:
//       We couldn't find any photos of unicorn. Check the breed's spelling.
//     any other status that isn't ok (500 here):
//       The dog photo service had a problem (status 500). Try again in a minute.
//     fetchFn rejects with an error named TimeoutError (the 8 seconds ran out):
//       The dog photo service took too long to answer. Try again.
//     fetchFn rejects with any other error (no answer at all):
//       We couldn't reach the dog photo service. Check your internet connection.
//     loadRandomPhoto('beagle')   ->  'https://images.dog.ceo/breeds/beagle/n02088364_852.jpg' (a random one)
//     loadRandomPhoto('unicorn')  ->  throws: We couldn't find any photos of unicorn. Check the breed's spelling.

export function breedNames(apiData) {
  return [];
}

export function imageUrlFor(breed) {
  return '';
}

export async function loadRandomPhoto(breed, fetchFn = fetch) {
  return '';
}
