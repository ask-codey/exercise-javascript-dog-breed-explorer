# Exercise: Dog Breed Explorer

Exercise code for the lesson **Exercise: Dog Breed Explorer** in the JavaScript in Depth course on [ask-codey.com](https://www.ask-codey.com).

Riverbend Animal Shelter wants a page where people thinking about adopting can look up a breed and see what it looks like. The page is built and loads its breed list from the free Dog CEO API. You'll write the functions that work with the API in `dogs.js` (the breed names, a photo's address, and loading a photo with friendly errors), then finish the page's photo panel and its empty state in `app.js`. Tests check `dogs.js` without the internet, and a checklist covers the page.

## What's here

- `index.html` and `styles.css`: the page and its look. Ready to use.
- `saved-breeds.js`: a saved copy of the API's breed list, for when the live list can't load, and for the tests. Ready to use.
- `dogs.js`: three functions that work with the Dog CEO API, with no page involved. For you to finish.
- `app.js`: connects the page to `dogs.js`. Loading the breed list and drawing the breed buttons are ready to use; the empty state (TODO 1) and the photo panel (TODO 2) are for you to finish.
- `dogs.test.js`: tests for `dogs.js`. You don't need to change this file.
- `package.json`: tells Node.js that this folder's files are modules, and how to run the tests. Ready to use.

The requirements are in the comment at the top of `dogs.js`, and beside each TODO in `app.js`, with examples.

## What to do

Open the folder in VS Code, then open its terminal with **Terminal > New Terminal**.

1. Finish `dogs.js`, running the tests as you go.
2. Finish TODO 1 and TODO 2 in `app.js`. Open the page with Live Preview (right-click `index.html` and choose **Show Preview**, or **Live Preview: Show Preview (External Browser)** from the Command Palette to use the browser's DevTools), and go through the checklist below. The page must be opened with Live Preview, not straight from its file: a page opened from a file (an address starting `file://`) can't load modules.
3. Stretch goal: make the **Surprise me** button show a photo of a random breed.

## Check your work

```bash
node --test
```

At first every test fails: that is expected. Each function you finish turns its tests green. The tests never use the internet: they hand `loadRandomPhoto` a fake fetch that answers the way the Dog CEO API would, so a failing test's message says what that answer was and what your function should have done, for example *A 404 is still an answer, so fetch doesn't reject: check response.ok, then response.status.*

## Checklist for the page

- [ ] When the page opens, it says *Loading breeds...* for a moment, then about 108 breed buttons appear, with a line saying how many there are, live from the Dog CEO API.
- [ ] Type `terr` in the search box: only *bullterrier* and *terrier* are left.
- [ ] Type `zebra`: no buttons, and it says *No breeds match "zebra". Try fewer letters.* Clear the search box: every breed comes back and the message is gone.
- [ ] Click *beagle*: it says *Fetching your beagle photo...*, then a beagle appears and it says *Here's your beagle! Pick it again for another photo.* Click *beagle* again for a different one.
- [ ] Right-click the photo, choose **Inspect**: its `alt` is *A random beagle photo*.
- [ ] The breed buttons work from the keyboard: press **Tab** until one is focused, then **Enter**.
- [ ] In DevTools' **Network** tab, change **No throttling** to **Offline** and click *pug*: the old photo is gone, it says *We couldn't reach the dog photo service. Check your internet connection.*, and **Try again** shows. Set it back to **No throttling** and click **Try again**: a pug appears, and **Try again** is hidden.
- [ ] In `app.js`, change the breed list's address from `breeds/list/all` to `breeds/list/al` and reload: the page says the live list didn't load and shows the 108 breeds from the saved copy. Change it back.
- [ ] The Console shows no errors, apart from the ones you caused on purpose in the last two steps.
- [ ] Stretch goal: **Surprise me** shows a photo of a different random breed each time.

## Tips

- `Object.keys` gives an object's keys as an array, and arrays have a method that puts them in order.
- In `loadRandomPhoto`, put `try`/`catch` around the `fetchFn` call only. If the `throw` for a bad status were inside the same `try`, your own error would land in the `catch` and be reported as "couldn't reach".
- Check the status before you read the body: `response.ok` first, then `response.status` to tell a 404 from the rest.
- `error.name` tells a timeout (`'TimeoutError'`) from a network error (`'TypeError'`).
- In `showPhoto`, the photo element has a `hidden` property, and `try`/`catch` around `await loadRandomPhoto(breed)` gives you the success and error branches.

## Hand it in

When it works, put your solution in a public repo of your own on GitHub, then paste that repo's address into **Submit your exercise** on the lesson page at [ask-codey.com](https://www.ask-codey.com). That's what completes the lesson. You don't need Git: create the repo on GitHub, choose **Add file**, then **Upload files**, and upload everything in this folder. The lesson page shows each step, and the lesson *Put Your Code on GitHub* walks through every screen.
