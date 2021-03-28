import { CARD_VALUES } from "./Constants"

export type Card = {
    value: string
    suit: string
}

export type HandState = {
    sets: Card[][]
    runs: Card[][]
    deadwood: Card[]
}

export function CardHand(props: {hand: HandState}){
    return (
        <div>
            <div>
                {getFlatHand(props.hand).map((card) => {
                    return <img src={`${process.env.PUBLIC_URL}/cards/${cardToString(card)}.jpg`} alt={cardToString(card)} style={{maxHeight: 200, margin: 10}} key={cardToString(card)}/>
                })}
            </div>
            <p>Score: {calculateDeadwood(props.hand.deadwood)}</p>
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