import { CARD_VALUES } from "./Constants"
import { GameState } from "./GameManager"

export type Card = {
    value: string
    suit: string
}

export type HandState = {
    sets: Card[][]
    runs: Card[][]
    deadwood: Card[]
}

export function CardHand(props: {hand: HandState,
                                 onCardSelect?: (selectedCard: Card, gameState: GameState) => GameState,
                                 gameState: GameState,
                                 setGameState?: any,
                                 faceUp: boolean}){
    const {gameState, setGameState, onCardSelect, hand, faceUp} = props
    return (
        <div>
            <div>
                {getFlatHand(props.hand).map((card) => {
                    return <img 
                            onClick={() => onCardSelect && setGameState ? setGameState({...onCardSelect(card, gameState)}) : console.log("You cannot discard an opponent's card")} 
                            src={faceUp ? `${process.env.PUBLIC_URL}/cards/${cardToString(card)}.jpg` : `${process.env.PUBLIC_URL}/cards/blue_back.jpg`} 
                            alt={cardToString(card)} 
                            style={{maxHeight: 180, margin: 10}} 
                            key={cardToString(card)}/>
                })}
            </div>
            {faceUp ? <p className='game-text' style={{marginLeft: '20px'}}>Score: {calculateDeadwood(hand.deadwood)}</p> : undefined}
        </div>
    )
}

function calculateDeadwood(deadwood: Card[]){
    let score = 0

    deadwood.forEach((card) => {
        const cardScore = CARD_VALUES.indexOf(card.value) + 1
        score += (cardScore > 9 ? 10 : cardScore)
    })

    return score
}

export function getFlatHand(hand: HandState): Card[]{
    return hand.sets.flat().concat(hand.runs.flat(), hand.deadwood)
}

export function getCardInSequence(card: Card, offset = 1): Card | null {
    const nextValue = CARD_VALUES[CARD_VALUES.indexOf(card.value) + offset]
    if(!nextValue){
        return null
    }

    return {value: nextValue, suit: card.suit}
}

export function cardToString(card: Card): string{
    return `${card.value}${card.suit}`
}