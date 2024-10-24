const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'skip', 'draw2', 'reverse']
const colours = ['red', 'yellow', 'green', 'blue']
const specials = [{ value: "draw4", type: "special" },
  // { value: "colorChange", type: "special" }
]

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

export function validateMove(topMostCard: Card, currentCard: Card) {
  if (topMostCard.value == 'draw2' && (currentCard.value != "draw2" && currentCard.value != "draw4")) return false
  if (currentCard.value == topMostCard.value || currentCard.type == topMostCard.type || currentCard.type == 'special' || topMostCard.type == 'blank') {
    return true;
  } else return false
}

export function updatePlayerTurn(length: number, current: number, direction: number, cardValue?: string) {
  let turn = current;
  if (cardValue == "reverse") {
    direction = direction * -1
  }
  else if (cardValue == "skip") {
    current = ((current + 2)*direction + length**length) % (length); // Skip the next player
  } else {
    current = ((current + 1) *direction + length**length) % (length); // Regular move
  }
  turn = current
  return {turn, direction} 
}

export function validateWin(playerHand: Card[]) {
  if (playerHand.length == 1) return true
  else return false
}

export function calculateStacked(discardDeck: Card[]) {
  //  calculating the number of stacked draw2 and draw4
  let numberOfCards = 0
  for (let i = discardDeck.length - 1; i >= 0; i--) {
    const curr = discardDeck[i]
    if (curr.value == "draw4") numberOfCards += 4
    else if (curr.value == "draw2") numberOfCards += 2
    else {
      if (i == discardDeck.length - 1) numberOfCards++ // this fixes an off by one error jab uthana padta hai
      break;
    }
  }
  return numberOfCards
}
