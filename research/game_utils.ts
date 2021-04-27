import { GameState, Utility, Card, HandState, CARD_VALUES, SUITS, GIN_BONUS, UNDERCUT_BONUS, Player, GAME_SCORE_LIMIT } from "./types"

// Returns true if player 1 wins
export function playGame(player1: Player, player2: Player): boolean{
    let gameState = initGameState(10, player1, player2, undefined)
    while(gameState.p1GameScore < GAME_SCORE_LIMIT && gameState.p2GameScore < GAME_SCORE_LIMIT ){
        //console.log(JSON.stringify(gameState, null, 4))
        let i = 0
        while(gameState.currentStage !== 'endround' && gameState.deck.length > 2 && i < 500){
            //console.log(JSON.stringify(gameState, null, 4))
            gameState = takeTurn(gameState)
            i++
        }
        gameState = startNextRound(gameState)
    }

    return gameState.p1GameScore > gameState.p2GameScore
}

function initGameState(discardMemory: number, p1: Player, p2: Player, startStage?: string): GameState{
    let deck: Card[] = []

    SUITS.forEach((suit) => {
        CARD_VALUES.forEach((value) => {
            deck.push({value, suit})
        })
    })

    const p1HandFlat = deck.sort(() => Math.random() - Math.random()).slice(0, 10)

    deck = deck.filter((card) => !p1HandFlat.includes(card))

    const p2HandFlat = deck.sort(() => Math.random() - Math.random()).slice(0, 10)

    deck = deck.filter((card) => !p2HandFlat.includes(card))

    const discard = [deck[0]]
    deck = deck.slice(1)

    const currentStage = startStage ?? (Math.random() > 0.5 ? 'p1' : 'p2') 

    const p1Hand = buildHand(p1HandFlat)
    const p2Hand = buildHand(p2HandFlat)

    const p1GameScore = 0
    const p2GameScore = 0

    return { p1Hand, p2Hand, deck, discard, currentStage, p1GameScore, p2GameScore, discardMemory, p1Pickup: [], p2Pickup: [], p1, p2}
}

function startNextRound(gameState: GameState): GameState {
    const p1GameScore = gameState.p1GameScore
    const p2GameScore = gameState.p2GameScore

    const starter = gameState.winner === 'p1' ? 'p1' : 'p2'

    return {...initGameState(gameState.discardMemory,  gameState.p1, gameState.p2, starter), p1GameScore, p2GameScore}
}

function buildHand(flatHand: Card[]): HandState{
    const sortedHand = flatHand.sort((cardA, cardB) => {

        const suitAOffset = SUITS.indexOf(cardA.suit) * 13
        const suitBOffset = SUITS.indexOf(cardB.suit) * 13

        const valA = CARD_VALUES.indexOf(cardA.value)
        const valB = CARD_VALUES.indexOf(cardB.value)

        return (suitAOffset+valA) - (suitBOffset+valB)
    })

    const runs: Card[][] = []

    for(let i = 0; i < sortedHand.length-2; i++){
        const currentRun: Card[] = []

        if(makesSequence(sortedHand, sortedHand[i])){
            currentRun.push(sortedHand[i])

            let nextCard = getCardInSequence(sortedHand[i], 1)
            while(!!nextCard && sortedHand.some(card => card.value == nextCard?.value && card.suit == nextCard?.suit) && i < sortedHand.length){
                currentRun.push(nextCard)
                i++

                nextCard = getCardInSequence(sortedHand[i], 1)
            }
        }

        if(currentRun.length > 2){
            runs.push(currentRun)
        }
    }

    const filteredHand = flatHand.filter((card) => !runs.flat().some(flatCard => card.value === flatCard?.value && card.suit === flatCard?.suit))

    const sets: Card[][] = []
    
    CARD_VALUES.forEach((value) => {
        const set: Card[] = []
        SUITS.forEach((suit) => {
            if(filteredHand.some(card => card.suit === suit && card.value === value)){
                set.push({suit, value})
            }
        })  
        
        if(set.length > 2){
            sets.push(set)
        }
    })

    const deadwood = filteredHand.filter((card) => !sets.flat().some(flatCard => card.value === flatCard?.value && card.suit === flatCard?.suit))
    
    return {sets, runs, deadwood}
}

function takeTurn(gameState: GameState){

    // Decide if drawing face up or face down card
    const drawFromDeck = drawCardFromDeck(gameState)

    const drawnCard = drawFromDeck ? gameState.deck.pop() : gameState.discard.pop()

    if(!drawFromDeck && drawnCard){
        if(gameState.currentStage === 'p1'){
            gameState.p1Pickup.push(drawnCard)
        } else {
            gameState.p2Pickup.push(drawnCard)
        }
    }

    const hand = gameState.currentStage === 'p1' ? getFlatHand(gameState.p1Hand) : getFlatHand(gameState.p2Hand)

    if(drawnCard){
        hand.push(drawnCard)

        if(gameState.currentStage === 'p1'){
            gameState.p1Hand = buildHand(hand)   
        } else {
            gameState.p2Hand = buildHand(hand)   
        }
    }

    // Evaluate the card to discard that maximizes computer gain while minimizing 
    // player gain
    const possibleDiscardCard = evaluateMovesTraditional(gameState)
    const selectedDiscardCard  = typeof possibleDiscardCard === "string" && drawnCard ? drawnCard : possibleDiscardCard

    if(typeof selectedDiscardCard != 'string'){
        // Discard the card
        const discardIndex = hand.indexOf(selectedDiscardCard);
        if (discardIndex > -1) {
            const discarded = hand.splice(discardIndex, 1);
            gameState.discard.push(discarded[0])
        }
    }

    if(gameState.currentStage === 'p1'){
        gameState.p1Hand = buildHand(hand)   
    } else {
        gameState.p2Hand = buildHand(hand)   
    }

    // Declare knocking if criteria met
    if(shouldKnock(gameState)){
        return knock(gameState)
    }

    if(gameState.currentStage === 'p1'){
        gameState.currentStage = 'p2' 
    } else {
        gameState.currentStage = 'p1' 
    }

    return gameState
}

function drawCardFromDeck(gameState: GameState): boolean {

    if(gameState.discard.length > 0){
        const faceupCard = gameState.discard[gameState.discard.length - 1]
    
        const existingSet = gameState.currentStage === 'p1' ? gameState.p1Hand.sets.some((set) => set[0].value=== faceupCard.value) : gameState.p2Hand.sets.some((set) => set[0].value=== faceupCard.value)

        const makesSet = gameState.currentStage === 'p1' ? gameState.p1Hand.deadwood.filter((card) => card.value === faceupCard.value).length > 1 : gameState.p2Hand.deadwood.filter((card) => card.value === faceupCard.value).length > 1

        const existingRun = gameState.currentStage === 'p1' ? gameState.p1Hand.runs.some((run) => getCardInSequence(run[run.length-1], 1) === faceupCard || getCardInSequence(run[0], -1) === faceupCard) : gameState.p2Hand.runs.some((run) => getCardInSequence(run[run.length-1], 1) === faceupCard || getCardInSequence(run[0], -1) === faceupCard)
    
        const makesRun = gameState.currentStage === 'p1' ? makesSequence(gameState.p1Hand.deadwood, faceupCard) : makesSequence(gameState.p2Hand.deadwood, faceupCard)

        if(makesSet || existingSet || existingRun || makesRun){
            return false
        }
    }

    return true
}

function getValueCount(hand: Card[]): any {

    const valueCountMap: any = {'A': 0, '2': 0, '3': 0, '4': 0, '5' : 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0, 'J': 0, 'Q': 0, 'K': 0}

    hand.forEach((card) => {
        if(card.value in valueCountMap){
            valueCountMap[card.value] += 1 
        }
    })

    return valueCountMap
}

function makesSequence(hand: Card[], card: Card): boolean{

    if(card.value !== 'A' && card.value !== '2'){
        const prev1 = getCardInSequence(card, -1)
        const prev2 =  getCardInSequence(card, -2)

        if(prev1 && prev2 && hand.some(card1 => cardToString(card1) === cardToString(prev1)) &&  hand.some(card2 => cardToString(card2) === cardToString(prev2))){
            return true
        }
    }

    if(card.value !== 'K' && card.value !== 'Q'){
        const next1 = getCardInSequence(card, 1)
        const next2 =  getCardInSequence(card, 2)

        if(next1 && next2 && hand.some(card1 => cardToString(card1) === cardToString(next1)) && hand.some(card2 => cardToString(card2) === cardToString(next2))){
            return true
        }
    }

    const prev1 = getCardInSequence(card, -1)
    const next1 = getCardInSequence(card, 1)

    if(prev1 && next1 && hand.some(card1 => cardToString(card1) === cardToString(prev1)) && hand.some(card1 => cardToString(card1) === cardToString(next1))){
        return true
    }

    return false
}

function evaluateMovesTraditional(gameState: GameState): Card | string{

    const valueCount = gameState.currentStage === 'p1' ? getValueCount(gameState.p1Hand.deadwood) : getValueCount(gameState.p2Hand.deadwood)
    const highValueCardCount = valueCount['10'] + valueCount['J'] + valueCount['Q'] + valueCount['K']

    // If half of deck expended start getting rid of high value cards if there are any in hand
    if(gameState.deck.length < 20 && highValueCardCount > 0){
        const dead = gameState.currentStage === 'p1' ? gameState.p1Hand.deadwood : gameState.p2Hand.deadwood
        const maxCard = dead.sort((cardA, cardB) =>  CARD_VALUES.indexOf(cardA.value) - CARD_VALUES.indexOf(cardB.value)).pop()

        return maxCard ? maxCard : 'knock'
    } 

    // Ranks cards by their likelyhood to contribute to a future set/run
    // Discard lowest of these
    const rankedHand = rankCardUtility(gameState)

    const selectedCard = rankedHand.pop()?.card

    return selectedCard ? selectedCard : 'knock'
}

function shouldKnock(gameState: GameState): boolean {
    // TODO extend for other situations
    const deadwoodScore = gameState.currentStage === 'p1' ? calculateDeadwood(gameState.p1Hand.deadwood) : calculateDeadwood(gameState.p2Hand.deadwood)
    const knockThresholds = gameState.currentStage === 'p1' ? gameState.p1.knockValues : gameState.p2.knockValues

    if(deadwoodScore < knockThresholds[0]){
        return true
    } else if(deadwoodScore < knockThresholds[1] && gameState.deck.length > 6){
        return true
    } else if(deadwoodScore <= knockThresholds[2] && gameState.deck.length > 12){
        return true
    } else if(deadwoodScore <= knockThresholds[3] && gameState.deck.length > 18){
        return true
    } else if(deadwoodScore <= knockThresholds[4] && gameState.deck.length > 24){
        return true
    }

    return false
}

function rankCardUtility(gameState: GameState): Utility[]{

    // +1 for every copy of the card
    // +1 for every card in sequence
    // +1 if part of trio
    // -1 if greater than 9
    // +1 if A or 2

    const {discardMemory} = gameState

    const deadwood = gameState.currentStage === 'p1' ? gameState.p1Hand.deadwood : gameState.p2Hand.deadwood

    const currentPlayer = gameState.currentStage === 'p1' ? gameState.p1 : gameState.p2

    let currentPlayerStrategy = currentPlayer.earlyGame
    
    if(gameState.deck.length < 10){
        currentPlayerStrategy = currentPlayer.lateGame
    } else if(gameState.deck.length < 20){
        currentPlayerStrategy = currentPlayer.midGame
    } 

    const cardValueCount = getValueCount(deadwood)

    const rememberDiscard = gameState.discard.length >= discardMemory ? gameState.discard.slice(gameState.discard.length-discardMemory) : []

    const cardRanking = deadwood.map((card) =>{
        let score = 0
        let preSet = false
        let preRun = false

        if(cardValueCount[card.value] > 1){
            score += currentPlayerStrategy.setScore
            preSet = true
        }

        const nextCard = getCardInSequence(card, 1)
        const prevCard = getCardInSequence(card, -1)

        if((nextCard && deadwood.some(card1 => cardToString(card1) === cardToString(nextCard))) || (prevCard && deadwood.some(card1 => cardToString(card1) === cardToString(prevCard)))){
            score += currentPlayerStrategy.runScore
            preRun = true
        }

        if(preRun && preSet){
            score += currentPlayerStrategy.trioScore
        }

        rememberDiscard.forEach((discarded) => {
            if(discarded.value === card.value){
                score += currentPlayerStrategy.discardedPenalty
            } else if(discarded.suit === card.suit && (getCardInSequence(card, 1)?.value === discarded.value || getCardInSequence(card, -1)?.value === discarded.value)){
                score += currentPlayerStrategy.discardedPenalty
            }
        })

        const pickup =  gameState.currentStage === 'p1' ? gameState.p2Pickup : gameState.p1Pickup

        pickup.forEach((picked) => {
            if(picked.value === card.value){
                score += currentPlayerStrategy.pickedPenalty
            } else if(picked.suit === card.suit && (getCardInSequence(card, 1)?.value === picked.value || getCardInSequence(card, -1)?.value === picked.value)){
                score += currentPlayerStrategy.pickedPenalty
            }
        })

        score -= (CARD_VALUES.indexOf(card.value) + 1)*currentPlayerStrategy.valueBonus

        return {card, score}
    }).sort((cardUtilityA, cardUtilityB) => cardUtilityB.score - cardUtilityA.score)

    return cardRanking
}

function knock(gameState: GameState): GameState{
    const p1Score = calculateDeadwood(gameState.p1Hand.deadwood)
    const p2Score = calculateDeadwood(gameState.p2Hand.deadwood)

    if(gameState.currentStage === 'p1' && (p1Score === 0)){
        return {...gameState, p1GameScore: gameState.p1GameScore + p2Score + GIN_BONUS, winner: 'p1', currentStage: 'endround'}
    } else if(p2Score === 0){
        return {...gameState, p2GameScore:  gameState.p2GameScore + p1Score + GIN_BONUS, winner: 'p2', currentStage: 'endround'}
    }

    const {updatedP1Score, updatedP2Score} = layoff(gameState)

    if(gameState.currentStage === 'p1' && (updatedP1Score < updatedP2Score)){
        return {...gameState, p1GameScore: gameState.p1GameScore + updatedP2Score - updatedP1Score, winner: 'p1', currentStage: 'endround'}
    } else if(gameState.currentStage === 'p1' && (updatedP1Score > updatedP2Score)){
        return {...gameState, p2GameScore: gameState.p2GameScore + updatedP1Score - updatedP2Score + UNDERCUT_BONUS, winner: 'p2', currentStage: 'endround'}
    } else if((updatedP1Score < updatedP2Score)){
        return {...gameState, p1GameScore:   gameState.p1GameScore + updatedP2Score - updatedP1Score + UNDERCUT_BONUS, winner: 'p1', currentStage: 'endround'}
    } else {
        return {...gameState, p2GameScore:  gameState.p2GameScore + updatedP1Score - updatedP2Score, winner: 'p2', currentStage: 'endround'}
    }
}

function layoff(gameState: GameState): {updatedP1Score: number, updatedP2Score: number}{

    if(gameState.currentStage === 'p1'){
        const tempDeadwood = gameState.p2Hand.deadwood.filter((card) => {
            const inSet = gameState.p1Hand.sets.some((set) => set[0].value === card.value)
            const extendsRun = gameState.p1Hand.runs.some((run) => makesSequence(run, card))
            return !inSet && !extendsRun
        })

        return {updatedP1Score: calculateDeadwood(gameState.p1Hand.deadwood), updatedP2Score: calculateDeadwood(tempDeadwood)}
    } else {
        const tempDeadwood = gameState.p1Hand.deadwood.filter((card) => {
            const inSet = gameState.p2Hand.sets.some((set) => set[0].value === card.value)
            const extendsRun = gameState.p2Hand.runs.some((run) => makesSequence(run, card))
            return !inSet && !extendsRun
        })

        return {updatedP1Score: calculateDeadwood(tempDeadwood), updatedP2Score: calculateDeadwood(gameState.p2Hand.deadwood)}
    }
}

function calculateDeadwood(deadwood: Card[]): number{
    let score = 0

    deadwood.forEach((card) => {
        const cardScore = CARD_VALUES.indexOf(card.value) + 1
        score += (cardScore > 9 ? 10 : cardScore)
    })

    return score
}

function getFlatHand(hand: HandState): Card[]{
    return hand.sets.flat().concat(hand.runs.flat(), hand.deadwood)
}

function getCardInSequence(card: Card, offset = 1): Card | null {
    const nextValue = CARD_VALUES[CARD_VALUES.indexOf(card.value) + offset]
    if(!nextValue){
        return null
    }

    return {value: nextValue, suit: card.suit}
}

export function cardToString(card: Card): string{
    return `${card.value}${card.suit}`
}