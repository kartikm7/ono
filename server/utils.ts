const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'skip', 'draw2', 'reverse']
const colours = ['red', 'yellow', 'green', 'blue']
const specials = [{ value: "draw4", type: "special" }, { value: "colorChange", type: "special" }]

export function shuffle(array: Card[]) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array
}

export function initializeDeck(): Card[] {
  // adding 4 of each special
  let deck: Card[] = []
  for (let i = 0; i < specials.length; i++) {
    for (let j = 0; j < 4; j++) deck.push(specials[i])
  }

  // populating the rest
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < colours.length; j++) {
      deck.push({ value: String(values[i]), type: colours[j] })
      deck.push({ value: String(values[i]), type: colours[j] })
    }
  }

  // shuffling the deck
  deck = shuffle(deck)
  return deck
}

export function dealCards(deck: Card[], n: number) {
  const hand = deck.splice(-n)
  return { deck, hand }
}

export function validateMove(topMostCard: Card, currentCard: Card){
  if (currentCard.type == topMostCard.type || currentCard.type == 'special') {
    return true;
  } else return false
}

export function calculateStacked(discardDeck: Card[]){
  //  calculating the number of stacked draw2 and draw4
  let numberOfCards = 1
  for(let i = discardDeck.length-1; i >= 0; i--){
    const curr = discardDeck[i]
    if(curr.type != "special" || curr.value == "colourChange") break;
    if(curr.value == "draw4") numberOfCards += 4
    if(curr.value == "draw2") numberOfCards += 2
  }
  return numberOfCards
}

// function cantPlayMove(discardDeck: Card[]){
//   const topMostCard = discardDeck.at(-1)
//   let numberOfCards = 1; // how many cards to pickup
//   switch (topMostCard?.value) {
//     case 'draw2':
//       numberOfCards = calculateStacked(discardDeck)
//       break;
//     case 'draw4':
//       numberOfCards = calculateStacked(discardDeck)
//       numberOfCards = 4;
//     default:
//       break;
//   }

//   return numberOfCards
// }