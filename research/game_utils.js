"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardToString = exports.playGame = void 0;
var types_1 = require("./types");
// Returns true if player 1 wins
function playGame(player1, player2) {
    var gameState = initGameState(10, player1, player2, undefined);
    while (gameState.p1GameScore < types_1.GAME_SCORE_LIMIT && gameState.p2GameScore < types_1.GAME_SCORE_LIMIT) {
        //console.log(JSON.stringify(gameState, null, 4))
        var i = 0;
        while (gameState.currentStage !== 'endround' && gameState.deck.length > 2 && i < 500) {
            //console.log(JSON.stringify(gameState, null, 4))
            gameState = takeTurn(gameState);
            i++;
        }
        gameState = startNextRound(gameState);
    }
    return gameState.p1GameScore > gameState.p2GameScore;
}
exports.playGame = playGame;
function initGameState(discardMemory, p1, p2, startStage) {
    var deck = [];
    types_1.SUITS.forEach(function (suit) {
        types_1.CARD_VALUES.forEach(function (value) {
            deck.push({ value: value, suit: suit });
        });
    });
    var p1HandFlat = deck.sort(function () { return Math.random() - Math.random(); }).slice(0, 10);
    deck = deck.filter(function (card) { return !p1HandFlat.includes(card); });
    var p2HandFlat = deck.sort(function () { return Math.random() - Math.random(); }).slice(0, 10);
    deck = deck.filter(function (card) { return !p2HandFlat.includes(card); });
    var discard = [deck[0]];
    deck = deck.slice(1);
    var currentStage = startStage !== null && startStage !== void 0 ? startStage : (Math.random() > 0.5 ? 'p1' : 'p2');
    var p1Hand = buildHand(p1HandFlat);
    var p2Hand = buildHand(p2HandFlat);
    var p1GameScore = 0;
    var p2GameScore = 0;
    return { p1Hand: p1Hand, p2Hand: p2Hand, deck: deck, discard: discard, currentStage: currentStage, p1GameScore: p1GameScore, p2GameScore: p2GameScore, discardMemory: discardMemory, p1Pickup: [], p2Pickup: [], p1: p1, p2: p2 };
}
function startNextRound(gameState) {
    var p1GameScore = gameState.p1GameScore;
    var p2GameScore = gameState.p2GameScore;
    var starter = gameState.winner === 'p1' ? 'p1' : 'p2';
    return __assign(__assign({}, initGameState(gameState.discardMemory, gameState.p1, gameState.p2, starter)), { p1GameScore: p1GameScore, p2GameScore: p2GameScore });
}
function buildHand(flatHand) {
    var sortedHand = flatHand.sort(function (cardA, cardB) {
        var suitAOffset = types_1.SUITS.indexOf(cardA.suit) * 13;
        var suitBOffset = types_1.SUITS.indexOf(cardB.suit) * 13;
        var valA = types_1.CARD_VALUES.indexOf(cardA.value);
        var valB = types_1.CARD_VALUES.indexOf(cardB.value);
        return (suitAOffset + valA) - (suitBOffset + valB);
    });
    var runs = [];
    var _loop_1 = function (i) {
        var currentRun = [];
        if (makesSequence(sortedHand, sortedHand[i])) {
            currentRun.push(sortedHand[i]);
            var nextCard_1 = getCardInSequence(sortedHand[i], 1);
            while (!!nextCard_1 && sortedHand.some(function (card) { return card.value == (nextCard_1 === null || nextCard_1 === void 0 ? void 0 : nextCard_1.value) && card.suit == (nextCard_1 === null || nextCard_1 === void 0 ? void 0 : nextCard_1.suit); }) && i < sortedHand.length) {
                currentRun.push(nextCard_1);
                i++;
                nextCard_1 = getCardInSequence(sortedHand[i], 1);
            }
        }
        if (currentRun.length > 2) {
            runs.push(currentRun);
        }
        out_i_1 = i;
    };
    var out_i_1;
    for (var i = 0; i < sortedHand.length - 2; i++) {
        _loop_1(i);
        i = out_i_1;
    }
    var filteredHand = flatHand.filter(function (card) { return !runs.flat().some(function (flatCard) { return card.value === (flatCard === null || flatCard === void 0 ? void 0 : flatCard.value) && card.suit === (flatCard === null || flatCard === void 0 ? void 0 : flatCard.suit); }); });
    var sets = [];
    types_1.CARD_VALUES.forEach(function (value) {
        var set = [];
        types_1.SUITS.forEach(function (suit) {
            if (filteredHand.some(function (card) { return card.suit === suit && card.value === value; })) {
                set.push({ suit: suit, value: value });
            }
        });
        if (set.length > 2) {
            sets.push(set);
        }
    });
    var deadwood = filteredHand.filter(function (card) { return !sets.flat().some(function (flatCard) { return card.value === (flatCard === null || flatCard === void 0 ? void 0 : flatCard.value) && card.suit === (flatCard === null || flatCard === void 0 ? void 0 : flatCard.suit); }); });
    return { sets: sets, runs: runs, deadwood: deadwood };
}
function takeTurn(gameState) {
    // Decide if drawing face up or face down card
    var drawFromDeck = drawCardFromDeck(gameState);
    var drawnCard = drawFromDeck ? gameState.deck.pop() : gameState.discard.pop();
    if (!drawFromDeck && drawnCard) {
        if (gameState.currentStage === 'p1') {
            gameState.p1Pickup.push(drawnCard);
        }
        else {
            gameState.p2Pickup.push(drawnCard);
        }
    }
    var hand = gameState.currentStage === 'p1' ? getFlatHand(gameState.p1Hand) : getFlatHand(gameState.p2Hand);
    if (drawnCard) {
        hand.push(drawnCard);
        if (gameState.currentStage === 'p1') {
            gameState.p1Hand = buildHand(hand);
        }
        else {
            gameState.p2Hand = buildHand(hand);
        }
    }
    // Evaluate the card to discard that maximizes computer gain while minimizing 
    // player gain
    var possibleDiscardCard = evaluateMovesTraditional(gameState);
    var selectedDiscardCard = typeof possibleDiscardCard === "string" && drawnCard ? drawnCard : possibleDiscardCard;
    if (typeof selectedDiscardCard != 'string') {
        // Discard the card
        var discardIndex = hand.indexOf(selectedDiscardCard);
        if (discardIndex > -1) {
            var discarded = hand.splice(discardIndex, 1);
            gameState.discard.push(discarded[0]);
        }
    }
    if (gameState.currentStage === 'p1') {
        gameState.p1Hand = buildHand(hand);
    }
    else {
        gameState.p2Hand = buildHand(hand);
    }
    // Declare knocking if criteria met
    if (shouldKnock(gameState)) {
        return knock(gameState);
    }
    if (gameState.currentStage === 'p1') {
        gameState.currentStage = 'p2';
    }
    else {
        gameState.currentStage = 'p1';
    }
    return gameState;
}
function drawCardFromDeck(gameState) {
    if (gameState.discard.length > 0) {
        var faceupCard_1 = gameState.discard[gameState.discard.length - 1];
        var existingSet = gameState.currentStage === 'p1' ? gameState.p1Hand.sets.some(function (set) { return set[0].value === faceupCard_1.value; }) : gameState.p2Hand.sets.some(function (set) { return set[0].value === faceupCard_1.value; });
        var makesSet = gameState.currentStage === 'p1' ? gameState.p1Hand.deadwood.filter(function (card) { return card.value === faceupCard_1.value; }).length > 1 : gameState.p2Hand.deadwood.filter(function (card) { return card.value === faceupCard_1.value; }).length > 1;
        var existingRun = gameState.currentStage === 'p1' ? gameState.p1Hand.runs.some(function (run) { return getCardInSequence(run[run.length - 1], 1) === faceupCard_1 || getCardInSequence(run[0], -1) === faceupCard_1; }) : gameState.p2Hand.runs.some(function (run) { return getCardInSequence(run[run.length - 1], 1) === faceupCard_1 || getCardInSequence(run[0], -1) === faceupCard_1; });
        var makesRun = gameState.currentStage === 'p1' ? makesSequence(gameState.p1Hand.deadwood, faceupCard_1) : makesSequence(gameState.p2Hand.deadwood, faceupCard_1);
        if (makesSet || existingSet || existingRun || makesRun) {
            return false;
        }
    }
    return true;
}
function getValueCount(hand) {
    var valueCountMap = { 'A': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0, 'J': 0, 'Q': 0, 'K': 0 };
    hand.forEach(function (card) {
        if (card.value in valueCountMap) {
            valueCountMap[card.value] += 1;
        }
    });
    return valueCountMap;
}
function makesSequence(hand, card) {
    if (card.value !== 'A' && card.value !== '2') {
        var prev1_1 = getCardInSequence(card, -1);
        var prev2_1 = getCardInSequence(card, -2);
        if (prev1_1 && prev2_1 && hand.some(function (card1) { return cardToString(card1) === cardToString(prev1_1); }) && hand.some(function (card2) { return cardToString(card2) === cardToString(prev2_1); })) {
            return true;
        }
    }
    if (card.value !== 'K' && card.value !== 'Q') {
        var next1_1 = getCardInSequence(card, 1);
        var next2_1 = getCardInSequence(card, 2);
        if (next1_1 && next2_1 && hand.some(function (card1) { return cardToString(card1) === cardToString(next1_1); }) && hand.some(function (card2) { return cardToString(card2) === cardToString(next2_1); })) {
            return true;
        }
    }
    var prev1 = getCardInSequence(card, -1);
    var next1 = getCardInSequence(card, 1);
    if (prev1 && next1 && hand.some(function (card1) { return cardToString(card1) === cardToString(prev1); }) && hand.some(function (card1) { return cardToString(card1) === cardToString(next1); })) {
        return true;
    }
    return false;
}
function evaluateMovesTraditional(gameState) {
    var _a;
    var valueCount = gameState.currentStage === 'p1' ? getValueCount(gameState.p1Hand.deadwood) : getValueCount(gameState.p2Hand.deadwood);
    var highValueCardCount = valueCount['10'] + valueCount['J'] + valueCount['Q'] + valueCount['K'];
    // If half of deck expended start getting rid of high value cards if there are any in hand
    if (gameState.deck.length < 20 && highValueCardCount > 0) {
        var dead = gameState.currentStage === 'p1' ? gameState.p1Hand.deadwood : gameState.p2Hand.deadwood;
        var maxCard = dead.sort(function (cardA, cardB) { return types_1.CARD_VALUES.indexOf(cardA.value) - types_1.CARD_VALUES.indexOf(cardB.value); }).pop();
        return maxCard ? maxCard : 'knock';
    }
    // Ranks cards by their likelyhood to contribute to a future set/run
    // Discard lowest of these
    var rankedHand = rankCardUtility(gameState);
    var selectedCard = (_a = rankedHand.pop()) === null || _a === void 0 ? void 0 : _a.card;
    return selectedCard ? selectedCard : 'knock';
}
function shouldKnock(gameState) {
    // TODO extend for other situations
    var deadwoodScore = gameState.currentStage === 'p1' ? calculateDeadwood(gameState.p1Hand.deadwood) : calculateDeadwood(gameState.p2Hand.deadwood);
    if (deadwoodScore < 3) {
        return true;
    }
    else if (deadwoodScore < 7 && gameState.deck.length > 18) {
        return true;
    }
    else if (deadwoodScore <= 10 && gameState.deck.length > 25) {
        return true;
    }
    return false;
}
function rankCardUtility(gameState) {
    // +1 for every copy of the card
    // +1 for every card in sequence
    // +1 if part of trio
    // -1 if greater than 9
    // +1 if A or 2
    var discardMemory = gameState.discardMemory;
    var deadwood = gameState.currentStage === 'p1' ? gameState.p1Hand.deadwood : gameState.p2Hand.deadwood;
    var currentPlayer = gameState.currentStage === 'p1' ? gameState.p1 : gameState.p2;
    var cardValueCount = getValueCount(deadwood);
    var rememberDiscard = gameState.discard.length >= discardMemory ? gameState.discard.slice(gameState.discard.length - discardMemory) : [];
    var cardRanking = deadwood.map(function (card) {
        var score = 0;
        var preSet = false;
        var preRun = false;
        if (cardValueCount[card.value] > 1) {
            score += (cardValueCount[card.value] - 1) * currentPlayer.setScore;
            preSet = true;
        }
        var nextCard = getCardInSequence(card, 1);
        var prevCard = getCardInSequence(card, -1);
        if ((nextCard && deadwood.some(function (card1) { return cardToString(card1) === cardToString(nextCard); })) || (prevCard && deadwood.some(function (card1) { return cardToString(card1) === cardToString(prevCard); }))) {
            score += currentPlayer.runScore;
            preRun = true;
        }
        if (preRun && preSet) {
            score += currentPlayer.trioScore;
        }
        rememberDiscard.forEach(function (discarded) {
            var _a, _b;
            if (discarded.value === card.value) {
                score += currentPlayer.discardedPenalty;
            }
            else if (discarded.suit === card.suit && (((_a = getCardInSequence(card, 1)) === null || _a === void 0 ? void 0 : _a.value) === discarded.value || ((_b = getCardInSequence(card, -1)) === null || _b === void 0 ? void 0 : _b.value) === discarded.value)) {
                score += currentPlayer.discardedPenalty;
            }
        });
        var pickup = gameState.currentStage === 'p1' ? gameState.p2Pickup : gameState.p1Pickup;
        pickup.forEach(function (picked) {
            var _a, _b;
            if (picked.value === card.value) {
                score += currentPlayer.pickedPenalty;
            }
            else if (picked.suit === card.suit && (((_a = getCardInSequence(card, 1)) === null || _a === void 0 ? void 0 : _a.value) === picked.value || ((_b = getCardInSequence(card, -1)) === null || _b === void 0 ? void 0 : _b.value) === picked.value)) {
                score += currentPlayer.pickedPenalty;
            }
        });
        score -= (types_1.CARD_VALUES.indexOf(card.value) + 1) * currentPlayer.valueBonus;
        return { card: card, score: score };
    }).sort(function (cardUtilityA, cardUtilityB) { return cardUtilityB.score - cardUtilityA.score; });
    return cardRanking;
}
function knock(gameState) {
    var p1Score = calculateDeadwood(gameState.p1Hand.deadwood);
    var p2Score = calculateDeadwood(gameState.p2Hand.deadwood);
    if (gameState.currentStage === 'p1' && (p1Score === 0)) {
        return __assign(__assign({}, gameState), { p1GameScore: gameState.p1GameScore + p2Score + types_1.GIN_BONUS, winner: 'p1', currentStage: 'endround' });
    }
    else if (p2Score === 0) {
        return __assign(__assign({}, gameState), { p2GameScore: gameState.p2GameScore + p1Score + types_1.GIN_BONUS, winner: 'p2', currentStage: 'endround' });
    }
    var _a = layoff(gameState), updatedP1Score = _a.updatedP1Score, updatedP2Score = _a.updatedP2Score;
    if (gameState.currentStage === 'p1' && (updatedP1Score < updatedP2Score)) {
        return __assign(__assign({}, gameState), { p1GameScore: gameState.p1GameScore + updatedP2Score - updatedP1Score, winner: 'p1', currentStage: 'endround' });
    }
    else if (gameState.currentStage === 'p1' && (updatedP1Score > updatedP2Score)) {
        return __assign(__assign({}, gameState), { p2GameScore: gameState.p2GameScore + updatedP1Score - updatedP2Score + types_1.UNDERCUT_BONUS, winner: 'p2', currentStage: 'endround' });
    }
    else if ((updatedP1Score < updatedP2Score)) {
        return __assign(__assign({}, gameState), { p1GameScore: gameState.p1GameScore + updatedP2Score - updatedP1Score + types_1.UNDERCUT_BONUS, winner: 'p1', currentStage: 'endround' });
    }
    else {
        return __assign(__assign({}, gameState), { p2GameScore: gameState.p2GameScore + updatedP1Score - updatedP2Score, winner: 'p2', currentStage: 'endround' });
    }
}
function layoff(gameState) {
    if (gameState.currentStage === 'p1') {
        var tempDeadwood = gameState.p2Hand.deadwood.filter(function (card) {
            var inSet = gameState.p1Hand.sets.some(function (set) { return set[0].value === card.value; });
            var extendsRun = gameState.p1Hand.runs.some(function (run) { return makesSequence(run, card); });
            return !inSet && !extendsRun;
        });
        return { updatedP1Score: calculateDeadwood(gameState.p1Hand.deadwood), updatedP2Score: calculateDeadwood(tempDeadwood) };
    }
    else {
        var tempDeadwood = gameState.p1Hand.deadwood.filter(function (card) {
            var inSet = gameState.p2Hand.sets.some(function (set) { return set[0].value === card.value; });
            var extendsRun = gameState.p2Hand.runs.some(function (run) { return makesSequence(run, card); });
            return !inSet && !extendsRun;
        });
        return { updatedP1Score: calculateDeadwood(tempDeadwood), updatedP2Score: calculateDeadwood(gameState.p2Hand.deadwood) };
    }
}
function calculateDeadwood(deadwood) {
    var score = 0;
    deadwood.forEach(function (card) {
        var cardScore = types_1.CARD_VALUES.indexOf(card.value) + 1;
        score += (cardScore > 9 ? 10 : cardScore);
    });
    return score;
}
function getFlatHand(hand) {
    return hand.sets.flat().concat(hand.runs.flat(), hand.deadwood);
}
function getCardInSequence(card, offset) {
    if (offset === void 0) { offset = 1; }
    var nextValue = types_1.CARD_VALUES[types_1.CARD_VALUES.indexOf(card.value) + offset];
    if (!nextValue) {
        return null;
    }
    return { value: nextValue, suit: card.suit };
}
function cardToString(card) {
    return "" + card.value + card.suit;
}
exports.cardToString = cardToString;
function nameOfCard(card) {
    var suit = function () {
        switch (card.suit) {
            case 'H':
                return 'Hearts';
            case 'D':
                return 'Diamonds';
            case 'S':
                return 'Spades';
            default:
                return 'Clubs';
        }
    };
    var value = function () {
        switch (card.value) {
            case 'A':
                return 'Ace';
            case 'K':
                return 'King';
            case 'Q':
                return 'Queen';
            case 'J':
                return 'Jack';
            default:
                return card.value;
        }
    };
    return value() + " of " + suit();
}
