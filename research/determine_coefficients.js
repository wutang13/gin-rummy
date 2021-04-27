"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var game_utils_1 = require("./game_utils");
var types_1 = require("./types");
function generateRandomCoefficient() {
    var runScore = +Math.random().toFixed(2) * 10;
    var setScore = +Math.random().toFixed(2) * 10;
    var trioScore = +Math.random().toFixed(2) * 10;
    var discardedPenalty = +Math.random().toFixed(2) * -10;
    var pickedPenalty = +Math.random().toFixed(2) * -10;
    var valueBonus = +Math.random().toFixed(2) * 20;
    return { runScore: runScore, setScore: setScore, trioScore: trioScore, discardedPenalty: discardedPenalty, pickedPenalty: pickedPenalty, valueBonus: valueBonus };
}
function generatePopulation(n) {
    var population = [];
    for (var i = 0; i < n; i++) {
        var knockValues = [3, 5, 7, 9, 9];
        population.push({ knockValues: knockValues, earlyGame: generateRandomCoefficient(),
            midGame: generateRandomCoefficient(),
            lateGame: generateRandomCoefficient() });
    }
    return population;
}
function crossoverCoefficients(p1Coefficients, p2Coefficients) {
    return {
        runScore: Math.random() > 0.5 ? p1Coefficients.runScore : p2Coefficients.runScore,
        setScore: Math.random() > 0.5 ? p1Coefficients.setScore : p2Coefficients.setScore,
        trioScore: Math.random() > 0.5 ? p1Coefficients.trioScore : p2Coefficients.trioScore,
        discardedPenalty: Math.random() > 0.5 ? p1Coefficients.discardedPenalty : p2Coefficients.discardedPenalty,
        pickedPenalty: Math.random() > 0.5 ? p1Coefficients.pickedPenalty : p2Coefficients.pickedPenalty,
        valueBonus: Math.random() > 0.5 ? p1Coefficients.valueBonus : p2Coefficients.valueBonus,
    };
}
function playerCrossover(p1, p2) {
    var childKnockValues = [
        Math.round(lodash_1.default.mean([p1.knockValues[0], p2.knockValues[0]])),
        Math.round(lodash_1.default.mean([p1.knockValues[1], p2.knockValues[1]])),
        Math.round(lodash_1.default.mean([p1.knockValues[2], p2.knockValues[2]])),
        Math.round(lodash_1.default.mean([p1.knockValues[3], p2.knockValues[3]])),
        Math.round(lodash_1.default.mean([p1.knockValues[4], p2.knockValues[4]]))
    ];
    var child1 = {
        earlyGame: crossoverCoefficients(p1.earlyGame, p2.earlyGame),
        midGame: crossoverCoefficients(p1.midGame, p2.midGame),
        lateGame: crossoverCoefficients(p1.lateGame, p2.lateGame),
        knockValues: childKnockValues
    };
    var child2 = {
        earlyGame: crossoverCoefficients(p1.earlyGame, p2.earlyGame),
        midGame: crossoverCoefficients(p1.midGame, p2.midGame),
        lateGame: crossoverCoefficients(p1.lateGame, p2.lateGame),
        knockValues: childKnockValues
    };
    return [child1, child2];
}
function mutateCoefficients(player) {
    return {
        runScore: Math.random() > types_1.MU ? player.runScore + Math.floor(Math.random() * (5 - (-5) + 1)) + (-5) : player.runScore,
        setScore: Math.random() > types_1.MU ? player.setScore + Math.floor(Math.random() * (5 - (-5) + 1)) + (-5) : player.setScore,
        trioScore: Math.random() > types_1.MU ? player.trioScore + Math.floor(Math.random() * (5 - (-5) + 1)) + (-5) : player.trioScore,
        discardedPenalty: Math.random() > types_1.MU ? player.discardedPenalty + Math.floor(Math.random() * (5 - (-5) + 1)) + (-5) : player.discardedPenalty,
        pickedPenalty: Math.random() > types_1.MU ? player.pickedPenalty + Math.floor(Math.random() * (5 - (-5) + 1)) + (-5) : player.pickedPenalty,
        valueBonus: Math.random() > types_1.MU ? player.valueBonus + Math.floor(Math.random() * (5 - (-5) + 1)) + (-5) : player.valueBonus
    };
}
function mutatePlayer(player) {
    var newPlayer = {
        earlyGame: mutateCoefficients(player.earlyGame),
        midGame: mutateCoefficients(player.midGame),
        lateGame: mutateCoefficients(player.lateGame),
        knockValues: player.knockValues.map(function (val) {
            var mutatedVal = val + Math.floor(Math.random() * (1 - (-1) + 1)) + (-1);
            var limitedMutatedVal = Math.min(Math.max(mutatedVal, 0), 10);
            return Math.random() > types_1.MU ? limitedMutatedVal : val;
        })
    };
    return newPlayer;
}
// Measure static fitness as the number of games won out of 100 vs default coefficients
function playerFitness(player) {
    var gamesWon = 0;
    for (var i = 0; i < 100; i++) {
        var won = game_utils_1.playGame(player, types_1.DEFAULT_PLAYER);
        if (won) {
            gamesWon++;
        }
    }
    return gamesWon;
}
function playTournament(player1, player2) {
    var p1Wins = 0;
    var p2Wins = 0;
    for (var i = 0; i < 100; i++) {
        var win = game_utils_1.playGame(player1, player2);
        win ? p1Wins++ : p2Wins++;
    }
    return p1Wins > p2Wins;
}
function determineCoefficients(generations, populationSize) {
    var GeneticAlgorithmConstructor = require('geneticalgorithm');
    var population = generatePopulation(populationSize);
    var config = {
        mutationFunction: mutatePlayer,
        crossoverFunction: playerCrossover,
        fitnessFunction: playerFitness,
        doesABeatBFunction: playTournament,
        population: population,
        populationSize: populationSize
    };
    var geneticalgorithm = GeneticAlgorithmConstructor(config);
    var today = new Date();
    var startTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log("Starting evolution at " + startTime);
    for (var i = 0; i < generations; i++) {
        geneticalgorithm.evolve();
        var newT = new Date();
        var time = newT.getHours() + ":" + newT.getMinutes() + ":" + newT.getSeconds();
        console.log("Generation " + (i + 1) + " done at " + time);
    }
    return geneticalgorithm.scoredPopulation();
}
var scoredPop = determineCoefficients(100, 1000);
var sortedPop = scoredPop.sort(function (indvA, indvB) { return indvB.score - indvA.score; });
var fs = require('fs');
var sortedPopJson = JSON.stringify(sortedPop, null, 4);
fs.writeFileSync('scoredPop.json', sortedPopJson);
var today = new Date();
var endTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
console.log("Finished at " + endTime);
