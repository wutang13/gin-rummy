import _ from "lodash"
import { playGame } from "./game_utils"
import { Player } from "./types"

function generatePopulation(n: number): Player[]{
    const population: Player[] = []

    for(let i = 0; i < n; i++){
        const runScore = +Math.random().toFixed(2) * 10
        const setScore = +Math.random().toFixed(2) * 10
        const trioScore = +Math.random().toFixed(2) * 10
        const discardedPenalty = +Math.random().toFixed(2) * -10
        const pickedPenalty = +Math.random().toFixed(2) * -10
        const valueBonus = +Math.random().toFixed(2) * 20
        const knockValues = [3,5,7,9,9]

        population.push({runScore, setScore, trioScore, discardedPenalty, pickedPenalty, valueBonus, knockValues})
    }

    return population
}

function playerCrossover(p1: Player, p2: Player): Player[]{

    const childKnockValues = [ _.mean([p1.knockValues[0],p2.knockValues[0]]),
                               _.mean([p1.knockValues[1],p2.knockValues[1]]),
                               _.mean([p1.knockValues[2],p2.knockValues[2]]),
                               _.mean([p1.knockValues[3],p2.knockValues[3]]),
                               _.mean([p1.knockValues[4],p2.knockValues[4]])
                            ]
    const child1 = {
        runScore: Math.random() > 0.5 ? p1.runScore : p2.runScore,
        setScore: Math.random() > 0.5 ? p1.setScore : p2.setScore,
        trioScore: Math.random() > 0.5 ? p1.trioScore : p2.trioScore,
        discardedPenalty: Math.random() > 0.5 ? p1.discardedPenalty : p2.discardedPenalty,
        pickedPenalty: Math.random() > 0.5 ? p1.pickedPenalty : p2.pickedPenalty,
        valueBonus: Math.random() > 0.5 ? p1.valueBonus : p2.valueBonus,
        knockValues: childKnockValues
    }

    const child2 = {
        runScore: Math.random() > 0.5 ? p1.runScore : p2.runScore,
        setScore: Math.random() > 0.5 ? p1.setScore : p2.setScore,
        trioScore: Math.random() > 0.5 ? p1.trioScore : p2.trioScore,
        discardedPenalty: Math.random() > 0.5 ? p1.discardedPenalty : p2.discardedPenalty,
        pickedPenalty: Math.random() > 0.5 ? p1.pickedPenalty : p2.pickedPenalty,
        valueBonus: Math.random() > 0.5 ? p1.valueBonus : p2.valueBonus,
        knockValues: childKnockValues
    }

    return [child1, child2]
}

function mutatePlayer(player: Player): Player{
    const mu = 0.98

    const newPlayer = {
        runScore: Math.random() > mu ? player.runScore + Math.floor(Math.random() * (5 - (-5) + 1)) + (-5) : player.runScore,
        setScore: Math.random() > mu ? player.setScore + Math.floor(Math.random() * (5 - (-5) + 1)) + (-5) : player.setScore,
        trioScore: Math.random() > mu ? player.trioScore + Math.floor(Math.random() * (5 - (-5) + 1)) + (-5) : player.trioScore,
        discardedPenalty: Math.random() > mu ? player.discardedPenalty + Math.floor(Math.random() * (5 - (-5) + 1)) + (-5) : player.discardedPenalty,
        pickedPenalty: Math.random() > mu ? player.pickedPenalty + Math.floor(Math.random() * (5 - (-5) + 1)) + (-5) : player.pickedPenalty,
        valueBonus: Math.random() > mu ? player.valueBonus + Math.floor(Math.random() * (5 - (-5) + 1)) + (-5) : player.valueBonus,
        knockValues: player.knockValues.map((val) => { 
            const mutatedVal =  val + Math.floor(Math.random() * (1 - (-1) + 1)) + (-1)
            const limitedMutatedVal = Math.min(Math.max(mutatedVal, 0), 10)
            return Math.random() > mu ? limitedMutatedVal : val
        })
    }

    return newPlayer
}

// Measure static fitness as the number of games won out of 100 vs default coefficients
function playerFitness(player: Player): number{
    const defaultPlayer = {
        runScore: 1,
        setScore: 1,
        trioScore: 1,
        discardedPenalty: -1,
        pickedPenalty: -1,
        valueBonus: 10,
        knockValues: [3,5,7,9,9]
    }

    let gamesWon = 0

    for(let i = 0; i < 100; i++){
        const won = playGame(player, defaultPlayer)
        if(won){
            gamesWon++
        }
    }

    return gamesWon
}

function playTournament(player1: Player, player2: Player): boolean{
    let p1Wins = 0
    let p2Wins = 0

    for(let i = 0; i < 100; i++){
        const win = playGame(player1, player2)

        win ? p1Wins++ : p2Wins++
    }

    return p1Wins > p2Wins
}

function determineCoefficients(generations: number, populationSize: number): any[]{
    const GeneticAlgorithmConstructor = require('geneticalgorithm')

    const population = generatePopulation(populationSize)

    const config = {
        mutationFunction: mutatePlayer,
        crossoverFunction: playerCrossover,
        fitnessFunction: playerFitness,
        doesABeatBFunction: playTournament,
        population: population,
        populationSize: populationSize
    }

    let geneticalgorithm = GeneticAlgorithmConstructor( config )

    const today = new Date()
    const startTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()

    console.log(`Starting evolution at ${startTime}`)

    for(let i = 0; i < generations; i++){
        geneticalgorithm.evolve()
        const newT = new Date()
        const time = newT.getHours() + ":" + newT.getMinutes() + ":" + newT.getSeconds() 
        console.log(`Generation ${i+1} done at ${time}`)
    }

    return geneticalgorithm.scoredPopulation()
}

const scoredPop = determineCoefficients(100, 1000)
const sortedPop = scoredPop.sort((indvA, indvB) => indvB.score - indvA.score)
const fs = require('fs')

const sortedPopJson = JSON.stringify(sortedPop, null, 4)
fs.writeFileSync('scoredPop.json', sortedPopJson)
