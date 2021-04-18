"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NULL_GAME = exports.UNDERCUT_BONUS = exports.GIN_BONUS = exports.GAME_SCORE_LIMIT = exports.STAGES = exports.CARD_VALUES = exports.SUITS = void 0;
exports.SUITS = ['S', 'C', 'H', 'D'];
exports.CARD_VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
exports.STAGES = ['pickup', 'discard', 'knock', 'computer', 'endround'];
exports.GAME_SCORE_LIMIT = 100;
exports.GIN_BONUS = 25;
exports.UNDERCUT_BONUS = 25;
exports.NULL_GAME = {
    userHand: { sets: [], runs: [], deadwood: [] },
    computerHand: { sets: [], runs: [], deadwood: [] },
    deck: [],
    discard: [],
    currentStage: '',
    userGameScore: 0,
    computerGameScore: 0,
    discardMemory: 10,
    playerPickup: []
};
