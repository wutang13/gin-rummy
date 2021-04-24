export type GameState = {
    p1Hand: HandState
    p2Hand: HandState
    deck: Card[]
    discard: Card[]
    currentStage: string
    winner?: string
    p1GameScore: number
    p2GameScore: number
    discardMemory: number
    p1Pickup: Card[]
    p2Pickup: Card[]
    p1: Player
    p2: Player
}

export type Utility = {
    card: Card
    score: number
}

export type Card = {
    value: string
    suit: string
}

export type HandState = {
    sets: Card[][]
    runs: Card[][]
    deadwood: Card[]
}

export type Player = {
    runScore: number
    setScore: number
    trioScore: number
    discardedPenalty: number
    pickedPenalty: number
    valueBonus: number
    knockValues: number[]
}

export const SUITS = ['S', 'C', 'H', 'D']

export const CARD_VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export const STAGES = ['pickup', 'discard', 'knock', 'computer', 'endround']

export const GAME_SCORE_LIMIT = 100

export const GIN_BONUS = 25

export const UNDERCUT_BONUS = 25

export const NULL_GAME = {
    userHand: {sets: [], runs: [], deadwood: []},
    computerHand: {sets: [], runs: [], deadwood: []},
    deck: [],
    discard: [],
    currentStage: '',
    userGameScore: 0,
    computerGameScore: 0,
    discardMemory: 10,
    playerPickup: []
}
