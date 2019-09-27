// Card variables
let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'],
    values = ['Ace', 'King', 'Queen', 'Jack', 'Ten', 'Nine', 'Eight',
            'Seven', 'Six', 'Five', 'Four', 'Three', 'Two'];

// DOM variables
let textArea = document.querySelector('.text-area'),
    newGameButton = document.querySelector('.new-game-button'),
    hitButton = document.querySelector('.hit-button'),
    stayButton = document.querySelector('.stay-button');


//Game variables
let gameStarted = false,
    gameOver = false,
    playerWon = false,
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [];

//FUNCTIONALITY

hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();

newGameButton.addEventListener('click', () => {
    gameStarted = true;
    gameOver = false;
    playerWon = false;

    deck = createDeck();
    shuffleDeck(deck);
    dealerCards = [ getNextCard(), getNextCard() ];
    playerCards = [ getNextCard(), getNextCard() ];
    newGameButton.style.display = 'none';
    hitButton.style.display = 'inline';
    stayButton.style.display = 'inline';
    showStatus();
});

hitButton.addEventListener('click', () => {
    playerCards.push(getNextCard());
    checkForEndOfGame();
    showStatus();
});

stayButton.addEventListener('click', () => {
    gameOver = true;
    checkForEndOfGame();
    showStatus();
});

function createDeck() {
    let deck = [];

    for (suit of suits) {
        for (value of values) {
            let card = {
                suit,
                value
            }
            deck.push(card)
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (card of deck) {
        let swappedCardIndex = Math.trunc(Math.random() * deck.length);
        let temp = deck[swappedCardIndex]; // temporarily hold the card that will be swapped
        deck[swappedCardIndex] = card;
        card = temp;
    }
}

function getCard(card) {
    return `${card.value} of ${card.suit}`
}

function getNextCard() {
    return deck.shift();
}

function getCardNumericValue(card) {
    switch(card.value) {
        case 'Ace':
            return 1;
        case 'Two':
            return 2;
        case 'Three':
            return 3;
        case 'Four':
            return 4;
        case 'Five':
            return 5;
        case 'Six':
            return 6;
        case 'Seven':
            return 7
        case 'Eight':
            return 8;
        case '9':
            return 9;
        default:
            return 10;
    }
}

function getScore(cardArray) {
    let score = 0;
    let hasAce = false;
    for(card of cardArray) {
        score += getCardNumericValue(card);
        if (card.value === 'Ace') {
            hasAce = true;
        }
    }
    if(hasAce && score + 10 <= 21) {
        return score + 10;
    }
    return score;
}

function updateScores() {
    dealerScore = getScore(dealerCards);
    playerScore = getScore(playerCards);
}

function checkForEndOfGame() {
    updateScores()

    if(gameOver) {
        //let dealer take cards
        while(dealerScore <= playerScore
            && playerScore <= 21
            && dealerScore <= 21) {
                dealerCards.push(getNextCard());
                updateScores()
        }
    }

    if(playerScore > 21) {
        playerWon = false;
        gameOver = true;
    } else if(dealerScore > 21) {
        playerWon = true;
        gameOver = true;
    } else if(gameOver) {
        if(playerScore > dealerScore) {
            playerWon = true;
        } else {
            playerWon = false;
        }
    }
}

function showStatus() {
    if (!gameStarted) {
        textArea.innerText = 'Welcome to Blackjack!';
        return;
    }

    let dealerCard = '';
    for(card of dealerCards) {
        dealerCard +=  `${getCard(card)}
                        `
    }

    let playerCard = '';
    for(card of playerCards) {
        playerCard +=  `${getCard(card)}
                        `
    }
    updateScores();

    textArea.innerText =
        'Dealer has: \n' +
        dealerCard +
        '(score: '+ dealerScore + ')\n\n' +

        'Player has:\n' +
        playerCard +
        '(score: '+ playerScore + ')\n\n';

    if(playerScore === 21) {
        playerWon = true;
        gameOver = true;
    } else if (dealerScore === 21) {
        playerWon = false;
        gameOver = true;
    }

    if(gameOver) {
        if(playerScore === 21) {
            if(playerScore === dealerScore) {
                textArea.innerText += "DRAW!";
            }
            playerWon = true;
        }
        if(dealerScore === 21) {
            playerWon = false;
        }
        if(playerWon) {
            textArea.innerText += "YOU WIN!";
        } else {
            textArea.innerText += "DEALER WINS!";
        }
        newGameButton.style.display = 'inline';
        hitButton.style.display = 'none';
        stayButton.style.display = 'none';
    }
}

//GAME
