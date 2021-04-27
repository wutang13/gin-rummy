export const SUITS = ['S', 'C', 'H', 'D']

export const CARD_VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export const STAGES = ['pickup', 'discard', 'knock', 'computer', 'endround']

const colors = ["e63946","f1faee","a8dadc","457b9d","1d3557"]

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
    playerPickup: [],
    ginBonus: GIN_BONUS,
    undercutBonus: UNDERCUT_BONUS
} 

export const EARLY_GAME_COEFFICIENTS = {
    runScore: 7.800000000000001,
    setScore: 7.5,
    trioScore: 12.8,
    discardedPenalty: -5.5,
    pickedPenalty: -4.6000000000000005,
    valueBonus: 1.4000000000000001
}

export const MID_GAME_COEFFICIENTS =  {
    runScore: 1.5,
    setScore: 0,
    trioScore: 4.699999999999999,
    discardedPenalty: -7.9,
    pickedPenalty: -8.6,
    valueBonus: 5.199999999999999
}

export const LATE_GAME_COEFFICIENTS =  {
    runScore: 0.6,
    setScore: 6.2,
    trioScore: 4.5,
    discardedPenalty: -0.09999999999999964,
    pickedPenalty: -2.1,
    valueBonus: 12.6
}