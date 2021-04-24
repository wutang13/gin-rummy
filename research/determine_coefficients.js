"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var game_utils_1 = require("./game_utils");
function generatePopulation(n) {
    var population = [];
    for (var i = 0; i < n; i++) {
        var runScore = +Math.random().toFixed(2) * 10;
        var setScore = +Math.random().toFixed(2) * 10;
        var trioScore = +Math.random().toFixed(2) * 10;
        var discardedPenalty = +Math.random().toFixed(2) * -10;
        var pickedPenalty = +Math.random().toFixed(2) * -10;
        var valueBonus = +Math.random().toFixed(2) * 20;
        var knockValues = [3, 6, 6, 9, 9];
        population.push({ runScore: runScore, setScore: setScore, trioScore: trioScore, discardedPenalty: discardedPenalty, pickedPenalty: pickedPenalty, valueBonus: valueBonus, knockValues: knockValues });
    }
    return population;
}
function playerCrossover(p1, p2) {
    var childKnockValues = [lodash_1.default.mean([p1.knockValues[0], p2.knockValues[0]]),
        lodash_1.default.mean([p1.knockValues[1], p2.knockValues[1]]),
        lodash_1.default.mean([p1.knockValues[2], p2.knockValues[2]]),
        lodash_1.default.mean([p1.knockValues[3], p2.knockValues[3]]),
        lodash_1.default.mean([p1.knockValues[4], p2.knockValues[4]])
    ];
    var child1 = {
        runScore: Math.random() > 0.5 ? p1.runScore : p2.runScore,
        setScore: Math.random() > 0.5 ? p1.setScore : p2.setScore,
        trioScore: Math.random() > 0.5 ? p1.trioScore : p2.trioScore,
        discardedPenalty: Math.random() > 0.5 ? p1.discardedPenalty : p2.discardedPenalty,
        pickedPenalty: Math.random() > 0.5 ? p1.pickedPenalty : p2.pickedPenalty,
        valueBonus: Math.random() > 0.5 ? p1.valueBonus : p2.valueBonus,
        knockValues: childKnockValues
    };
    var child2 = {
        runScore: Math.random() > 0.5 ? p1.runScore : p2.runScore,
        setScore: Math.random() > 0.5 ? p1.setScore : p2.setScore,
        trioScore: Math.random() > 0.5 ? p1.trioScore : p2.trioScore,
        discardedPenalty: Math.random() > 0.5 ? p1.discardedPenalty : p2.discardedPenalty,
        pickedPenalty: Math.random() > 0.5 ? p1.pickedPenalty : p2.pickedPenalty,
        valueBonus: Math.random() > 0.5 ? p1.valueBonus : p2.valueBonus,
        knockValues: childKnockValues
    };
    return [child1, child2];
}
function mutatePlayer(player) {
    var mu = 0.98;
    var newPlayer = {
        runScore: Math.random() > mu ? player.runScore + Math.floor(Math.random() * (5 - (-5) + 1)) + (-5) : player.runScore,
        setScore: Math.random() > mu ? player.setScore + Math.floor(Math.random() * (5 - (-5) + 1)) + (-5) : player.setScore,
        trioScore: Math.random() > mu ? player.trioScore + Math.floor(Math.random() * (5 - (-5) + 1)) + (-5) : player.trioScore,
        discardedPenalty: Math.random() > mu ? player.discardedPenalty + Math.floor(Math.random() * (5 - (-5) + 1)) + (-5) : player.discardedPenalty,
        pickedPenalty: Math.random() > mu ? player.pickedPenalty + Math.floor(Math.random() * (5 - (-5) + 1)) + (-5) : player.pickedPenalty,
        valueBonus: Math.random() > mu ? player.valueBonus + Math.floor(Math.random() * (5 - (-5) + 1)) + (-5) : player.valueBonus,
        knockValues: player.knockValues.map(function (val) {
            var mutatedVal = val + Math.floor(Math.random() * (1 - (-1) + 1)) + (-1);
            var limitedMutatedVal = Math.min(Math.max(mutatedVal, 0), 10);
            return Math.random() > mu ? limitedMutatedVal : val;
        })
    };
    return newPlayer;
}
// Measure static fitness as the number of games won out of 100 vs default coefficients
function playerFitness(player) {
    var defaultPlayer = {
        runScore: 1,
        setScore: 1,
        trioScore: 1,
        discardedPenalty: -1,
        pickedPenalty: -1,
        valueBonus: 10,
        knockValues: [3, 6, 6, 9, 9]
    };
    var gamesWon = 0;
    for (var i = 0; i < 100; i++) {
        var won = game_utils_1.playGame(player, defaultPlayer);
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
