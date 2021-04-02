import React, { useEffect, useState } from "react";
import { CARD_VALUES, SUITS, STAGES } from "./Constants";
import _ from 'lodash';
import { CardHand, getFlatHand, getCardInSequence, HandState, Card, cardToString } from "./CardHand";
import Button from 'react-bootstrap/Button'
import Icon from '@mdi/react'
import { mdiCog, mdiMenu } from '@mdi/js'
import { Dropdown } from "react-bootstrap";

export type GameState = {
    userHand: HandState
    computerHand: HandState
    deck: Card[]
    discard: Card[]
    currentStage: string
    knocker?: string
    winner?: string
}

type Utility = {
    card: Card
    score: number
}

export function GameManager(){

    const [gameState, setGameState] = useState(initGameState())

    useEffect(()=> console.log(gameState))

    const turnText = () => {
        switch(gameState.currentStage){
            case 'discard':
                return 'It is your turn to discard a card'
            case 'pickup':
                return 'It is your turn to pickup a card'
            default:
                return 'It is the computer\'s turn'
        }
    }

    return(
        <div style={{margin: '30px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div></div>
                <CardHand hand={gameState.computerHand} gameState={gameState} faceUp={false}/>
                <Dropdown>
                    <Dropdown.Toggle className='menu-button'>
                        <Icon path={mdiMenu} size={2} color={"gray"}/>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className='in-game-menu'>
                        <Dropdown.Item className='menu-item' onClick={() => setGameState(initGameState())}>Reset Game</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly'}}>
                    <p className='game-text'>Discard Pile</p>
                    { gameState.discard.length > 0 ?
                        <img 
                            src={`${process.env.PUBLIC_URL}/cards/${cardToString(gameState.discard[gameState.discard.length-1])}.jpg`} 
                            onClick={() => setGameState({...pickupCard(true, gameState)})}
                            alt={cardToString(gameState.discard[gameState.discard.length-1])} 
                            style={{maxHeight: 200, margin: 10}}/>
                        : <p style={{margin: 20}}>Empty</p>
                    }
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', margin: '10px 100px 10px 100px'}}>
                    <p className='game-text'>{turnText()}</p>
                    <button className="game-button" onClick={
                        () => {
                            setGameState({...computerPlayerTurn(gameState)})
                        }
                    }>End Turn</button>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly'}}>
                    <p className='game-text'>Deck</p>
                    <p className='game-text' style ={{fontSize: '20px'}}>{`Cards Left: ${gameState.deck.length}`}</p>
                    { gameState.deck.length > 0 ?
                        <img 
                            src={`${process.env.PUBLIC_URL}/cards/${cardToString(gameState.deck[gameState.deck.length-1])}.jpg`} 
                            onClick={() => setGameState({...pickupCard(false, gameState)})}
                            alt={cardToString(gameState.deck[gameState.deck.length-1])} 
                            style={{maxHeight: 200, margin: 10}}/>
                        : <p style={{margin: 20}}>Empty</p>
                    }
                </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <CardHand hand={gameState.userHand} onCardSelect={discardCard} gameState={gameState} setGameState={setGameState} faceUp={true}/>
            </div>    
        </div>
    )
}

function initGameState(): GameState{
    let deck: Card[] = []

    SUITS.forEach((suit) => {
        CARD_VALUES.forEach((value) => {
            deck.push({value, suit})
        })
    })

    const userHandFlat = deck.sort(() => Math.random() - Math.random()).slice(0, 10)

    deck = deck.filter((card) => !userHandFlat.includes(card))

    const computerHandFlat = deck.sort(() => Math.random() - Math.random()).slice(0, 10)

    deck = deck.filter((card) => !computerHandFlat.includes(card))

    const discard = [deck[0]]
    deck = deck.slice(1)

    const currentStage = STAGES[0] // TODO Should randomly select between computer and player

    const userHand = buildHand(userHandFlat)
    const computerHand = buildHand(computerHandFlat)

    return { userHand, computerHand, deck, discard, currentStage }
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

function discardCard(selectedCard: Card, gameState: GameState): GameState{

    if(gameState.currentStage === 'discard'){
        const hand = getFlatHand(gameState.userHand)
        const newHand = buildHand(hand.filter((card) => (card.value !== selectedCard.value) || (card.suit !== selectedCard.suit)))
    
        gameState.discard.push(selectedCard)
        gameState.userHand = newHand
        gameState.currentStage = "computer"
    }

    return gameState
}

function pickupCard(faceUp: boolean, gameState: GameState): GameState{

    if(gameState.currentStage === "pickup"){
        const selectedCard = faceUp ? gameState.discard.pop() : gameState.deck.pop()

        if(selectedCard){
            const hand = getFlatHand(gameState.userHand)
            hand.push(selectedCard)
    
            const handState = buildHand(hand)
            gameState.userHand = handState
            gameState.currentStage = "discard"
        }
    }

    return gameState
}

function computerPlayerTurn(gameState: GameState){

    // Decide if drawing face up or face down card
    const drawFromDeck = computerDrawCardFromDeck(gameState)

    console.log(`Starting state for computer`)
    console.log(gameState)


    drawFromDeck ? console.log('Computer Drawing from deck') : console.log('Computer Drawing from discard')

    const drawnCard = drawFromDeck ? gameState.deck.pop() : gameState.discard.pop()


    const hand = getFlatHand(gameState.computerHand)

    if(drawnCard){
        console.log(`Drawn Card: ${cardToString(drawnCard)}`)

        hand.push(drawnCard)

        gameState.computerHand = buildHand(hand)   
    }

    // Evaluate the card to discard that maximizes computer gain while minimizing 
    // player gain
    const selectedDiscardCard = evaluateMovesTraditional(gameState)

    if(typeof selectedDiscardCard === "string"){
        console.log('Computer Knocks')
        return {...gameState, knocker: 'computer'}
    }

    console.log(`Computer discarding: ${cardToString(selectedDiscardCard)}`)

    // Discard the card
    const discardIndex = hand.indexOf(selectedDiscardCard);
    if (discardIndex > -1) {
       const discarded = hand.splice(discardIndex, 1);
       gameState.discard.push(discarded[0])
    }

    gameState.computerHand = buildHand(hand)  

    // Declare knocking if criteria met
    if(shouldKnock(gameState)){
        console.log('Computer Knocks')
        return {...gameState, knocker: 'computer'}
    }
    gameState.currentStage = "pickup"

    return gameState
}

function computerDrawCardFromDeck(gameState: GameState): boolean {

    if(gameState.discard.length > 0){
        const faceupCard = gameState.discard[gameState.discard.length - 1]
    
        const existingSet = gameState.computerHand.sets.some((set) => set[0].value=== faceupCard.value)

        const makesSet = gameState.computerHand.deadwood.filter((card) => card.value === faceupCard.value).length > 1

        const existingRun = gameState.computerHand.runs.some((run) => getCardInSequence(run[run.length-1], 1) === faceupCard || getCardInSequence(run[0], -1) === faceupCard)
    
        if(makesSet || existingSet || existingRun || makesSequence(gameState.computerHand.deadwood, faceupCard)){
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

    const valueCount = getValueCount(gameState.computerHand.deadwood)
    const highValueCardCount = valueCount['10'] + valueCount['J'] + valueCount['Q'] + valueCount['K']

    // If half of deck expended start getting rid of high value cards if there are any in hand
    if(gameState.deck.length < 16 && highValueCardCount > 0){
        const maxCard = gameState.computerHand.deadwood.sort((cardA, cardB) =>  CARD_VALUES.indexOf(cardA.value) - CARD_VALUES.indexOf(cardB.value)).pop()

        return maxCard ? maxCard : 'knock'
    } 

    // Ranks cards by their likelyhood to contribute to a future set/run
    // Discard lowest of these
    const rankedHand = rankCardUtility(gameState.computerHand.deadwood)

    const selectedCard = rankedHand.pop()?.card

    return selectedCard ? selectedCard : 'knock'
}

function shouldKnock(gameState: GameState): boolean {
    // TODO extend for other situations
    if(gameState.computerHand.deadwood.length === 1){
        return true
    }

    return false
}

function rankCardUtility(deadwood: Card[]): Utility[]{

    // +1 for every copy of the card
    // +1 for every card in sequence
    // +1 if part of trio
    // -1 if greater than 9
    // +1 if A or 2

    const cardValueCount = getValueCount(deadwood)

    const cardRanking = deadwood.map((card) =>{
        let score = 0
        let preSet = false
        let preRun = false

        if(cardValueCount[card.value] > 1){
            score += (cardValueCount[card.value] - 1)
            preSet = true
        }

        const nextCard = getCardInSequence(card, 1)
        const prevCard = getCardInSequence(card, -1)

        if((nextCard && deadwood.some(card1 => cardToString(card1) === cardToString(nextCard))) || (prevCard && deadwood.some(card1 => cardToString(card1) === cardToString(prevCard)))){
            score += 1
            preRun = true
        }

        if(preRun && preSet){
            score += 1
        }

        if(CARD_VALUES.indexOf(card.value) > 8){
            score--
        } else if(CARD_VALUES.indexOf(card.value) < 2){
            score++
        }

        return {card, score}
    }).sort((cardUtilityA, cardUtilityB) => cardUtilityB.score - cardUtilityA.score)

    console.log(cardRanking)

    return cardRanking
}

// TODO different heuristic 