import _ from "lodash"
import { playGame } from "./game_utils"
import { DEFAULT_PLAYER, MU, Player, PlayerCoefficients } from "./types"

function generateRandomCoefficient(): PlayerCoefficients {
    const runScore = +Math.random().toFixed(2) * 10
    const setScore = +Math.random().toFixed(2) * 10
    const trioScore = +Math.random().toFixed(2) * 10
    const discardedPenalty = +Math.random().toFixed(2) * -10
    const pickedPenalty = +Math.random().toFixed(2) * -10
    const valueBonus = +Math.random().toFixed(2) * 20

    return {runScore, setScore, trioScore, discardedPenalty, pickedPenalty, valueBonus}
}

function generatePopulation(n: number): Player[]{
    const population: Player[] = []

    for(let i = 0; i < n; i++){
        
        const knockValues = [3,5,7,9,9]

        population.push({knockValues,
                        earlyGame: generateRandomCoefficient(),
                        midGame: generateRandomCoefficient(),
                        lateGame: generateRandomCoefficient()})
    }

    return population
}

function crossoverCoefficients(p1Coefficients: PlayerCoefficients, p2Coefficients: PlayerCoefficients): PlayerCoefficients{
    return {
        runScore: Math.random() > 0.5 ? p1Coefficients.runScore : p2Coefficients.runScore,
        setScore: Math.random() > 0.5 ? p1Coefficients.setScore : p2Coefficients.setScore,
        trioScore: Math.random() > 0.5 ? p1Coefficients.trioScore : p2Coefficients.trioScore,
        discardedPenalty: Math.random() > 0.5 ? p1Coefficients.discardedPenalty : p2Coefficients.discardedPenalty,
        pickedPenalty: Math.random() > 0.5 ? p1Coefficients.pickedPenalty : p2Coefficients.pickedPenalty,
        valueBonus: Math.random() > 0.5 ? p1Coefficients.valueBonus : p2Coefficients.valueBonus,
    }
}



function playerCrossover(p1: Player, p2: Player): Player[]{

    const childKnockValues = [ 
                                Math.round(_.mean([p1.knockValues[0],p2.knockValues[0]])),
                                Math.round( _.mean([p1.knockValues[1],p2.knockValues[1]])),
                                Math.round(_.mean([p1.knockValues[2],p2.knockValues[2]])),
                                Math.round(_.mean([p1.knockValues[3],p2.knockValues[3]])),
                                Math.round(_.mean([p1.knockValues[4],p2.knockValues[4]]))
                            ]
    const child1 = {
        earlyGame: crossoverCoefficients(p1.earlyGame, p2.earlyGame),
        midGame: crossoverCoefficients(p1.midGame, p2.midGame),
        lateGame: crossoverCoefficients(p1.lateGame, p2.lateGame),
        knockValues: childKnockValues
    }

    const child2 = {
        earlyGame: crossoverCoefficients(p1.earlyGame, p2.earlyGame),
        midGame: crossoverCoefficients(p1.midGame, p2.midGame),
        lateGame: crossoverCoefficients(p1.lateGame, p2.lateGame),
        knockValues: childKnockValues
    }

    return [child1, child2]
}

function mutateCoefficients(player: PlayerCoefficients): PlayerCoefficients{
    return {
        runScore: Math.random() > MU ? player.runScore + Math.floor(Math.random() * (5 - (-5) + 1)) + (-5) : player.runScore,
        setScore: Math.random() > MU ? player.setScore + Math.floor(Math.random() * (5 - (-5) + 1)) + (-5) : player.setScore,
        trioScore: Math.random() > MU ? player.trioScore + Math.floor(Math.random() * (5 - (-5) + 1)) + (-5) : player.trioScore,
        discardedPenalty: Math.random() > MU ? player.discardedPenalty + Math.floor(Math.random() * (5 - (-5) + 1)) + (-5) : player.discardedPenalty,
        pickedPenalty: Math.random() > MU ? player.pickedPenalty + Math.floor(Math.random() * (5 - (-5) + 1)) + (-5) : player.pickedPenalty,
        valueBonus: Math.random() > MU ? player.valueBonus + Math.floor(Math.random() * (5 - (-5) + 1)) + (-5) : player.valueBonus
    }
}

function mutatePlayer(player: Player): Player{
    const newPlayer = {
        earlyGame: mutateCoefficients(player.earlyGame),
        midGame: mutateCoefficients(player.midGame),
        lateGame: mutateCoefficients(player.lateGame),
        knockValues: player.knockValues.map((val) => { 
            const mutatedVal =  val + Math.floor(Math.random() * (1 - (-1) + 1)) + (-1)
            const limitedMutatedVal = Math.min(Math.max(mutatedVal, 0), 10)
            return Math.random() > MU ? limitedMutatedVal : val
        })
    }

    return newPlayer
}

// Measure static fitness as the number of games won out of 100 vs default coefficients
function playerFitness(player: Player): number{
    let gamesWon = 0

    for(let i = 0; i < 100; i++){
        const won = playGame(player, DEFAULT_PLAYER)
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
const today = new Date()
const endTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()

console.log(`Finished at ${endTime}`)