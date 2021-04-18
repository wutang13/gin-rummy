# Gin Rummy and Game Theory

Playable at [https://wutang13.github.io/gin-rummy/](https://https://wutang13.github.io/gin-rummy/)

### Introduction to Gin Rummy

Gin rummy is a [rummy](https://en.wikipedia.org/wiki/Rummy) type game played by two players who are each competing to be the first to reach a predefined score limit (usually 100 points). The flow of the game follows a series of rounds which are individually composed of turns between the two players. On their turn a player will first draw a card from either the top of the discard pile or the face down deck. After drawing a card the player will discard a card of their choosing and place it face up on the table. A player wins the round by "knocking" or declaring that they have less than 10 deadwood points. The deadwood of a player's hand is calculated as the sum of the value of each card in their hand which is not a part of a run (3+ consecutive cards in the same suit) or a set (3+ cards of the same value).


|   | Ace | 2 - 9 | 10 - K |
| - | - | - | - |
| Value | 1 | Face Value | 10 |

Once one of the players knocks both players lay out all the cards. If the knocking player has not gone "gin", i.e. they have zero deadwood, then the non-knocking player can 'layoff' their remaining deadwood. To lay off a player is able to use their own deadwood to add to their opponents sets and runs which lowers their own deadwood score. Once the layoff is complete the player with the lowest amount of remaining deadwood wins the round. The winner's score for the round is the value of the losing player's deadwood count minus their own. There are also additional bonuses added if the knocking player went gin or the player that didn't knock won (both usually 25 points). This process continues with a new round and the winner of the preceding round getting the ability to go first.

### Game Theory in Gin Rummy

Game Theory provides concise language and models to describe games and other decision making scenarios. Gin rummy can be classified as a zero-sum imperfect information game, sharing this description are other card games such as poker. A zero-sum game is one where the goals by which one player defines their success depends on the other players likewise failing to accomplish their goal, i.e. the winner takes all. Gin rummy also qualifies as an imperfect information game which is one where players have some amount of uncertainty surrounding the complete game state. In this case the players do not know all the cards in each other's hands or the order of the cards in the deck. This makes finding an optimal solution to such a game very complex compared to a perfect information game like checkers or connect four. As a result the goal of this project is not to provide an AI that can play perfectly but one that has a strong performance providing a competitive test environment for a human player.

### The Gin Rummy Algorithm

The computer player uses a custom made algorithm to play gin rummy. It must make three decisions each round according to certain criteria: which card to pick up, which card to discard, and when to knock.

To determine which card to pick up, face up or face down, the computer will look to see if the face up card completes any sets or runs in its hand. If it doesn't then it will draw from the deck. Future improvements will add additional parameters such as if the computer isn't close to building a set or a run and the game is just starting then it may be worth picking the face up card.

When determining which card to discard the computer applies a heuristic which calculates the general utility of each card, discarding the card with the lowest utility. This utility is a sum of constants assigned if a card meets certain criteria which are:

* More than one card of a matching value
* A card of consecutive value in the same suit
* A bonus if there is a card of matching value and a card of consecutive value
* Penalty deducted if if a card of matching value or a card of consecutive value has already been discarded
* Penalty deducted if if a card of matching value or a card of consecutive value has been picked up from the discard by the opponent
* Penalty proportional to the value of the card (higher penalty for high cards)

Each of these criteria have an associated constant value penalty or bonus that is added to the cards utility score. The values for these were determined algorithmically through the use of a [genetic algorithm](https://en.wikipedia.org/wiki/Genetic_algorithm), specifically using the library [geneticalgorithm](https://www.npmjs.com/package/geneticalgorithm) (Further explanation below).

Once the computer player has discarded their card of choice it may knock if the correct conditions are met. These conditions were determined through research done on the [Rummy Talk](http://rummytalk.com/keeping-under-count/) blog and set as specific thresholds on the score of the hand and the number of cards left in the deck.

### The Genetic Algorithm

A genetic algorithm is a variety of machine learning algorithm which uses mechanics based on real world evolution to find an optimal answer. It does so through taking a population of individuals, each representing a mix of values for the variables to be optimized, and putting them through a cycle of competition and reproduction. An optimized answer is achieved as over time the strongest individuals, as defined by using a fitness function, become more and more prevalent throughout the population since only the winner of each competition is allowed to pass on their information to the next generation. A similar algorithm called Counterfactual Regret Minimization (CFR) has been used to successfully approximate the solution to other imperfect information games, notably a simplified version of hold 'em poker.

To determine the optimized coefficients for the card utility heuristic a population of 100 individuals are run through 100 generations of competition. The competition between individuals is determined by playing a 1000 games with the winner of the most games getting to pass their genetic information on the next generation. The number of generations and individuals in the population in this case were arbitrarily selected in order to fit within time constraints (~9 hr calculation time), running the `determine_coefficients` script with more individuals and more generations could provide more optimized results. Once all generations have been simulated a final score is attached to each individual to determine the player's overall fitness. This score is calculated as the number of games won by the player out of 1000 against a default player where each constant in the heuristic is either 1 for bonuses or -1 for penalties.

The result of the 100 generation/100 population genetic algorithm run can be found in `scoredPop.json` with scores ranging between 621-560. This gives the best scoring individual, i.e. the coefficients used in the AI player algorithm, an over 20% improvement in performance over the unweighted coefficients. Visual representations of the value ranges for each of the heuristic attributes are available to view by running the `build_visuals.py` script.

### Future Improvements and Impact

There are a number of improvements that future versions of this program will likely include. Some of these are UX additions such as the ability to drag and drop cards around in their hand, allowing them to choose their own sets and runs. Others are algorithmic improvements such as running the genetic algorithm with a larger population for more generations.

Imperfect information games are still a relatively unexplored part of game theory, despite their widespread prevalence in the real world. The importance of this implementation of gin rummy is that it acts as a framework for the experimentation of different algorithms to approach imperfect information games. This can work either from the user side or the computer algorithm side. As a human player having a flexible and competitive AI opponent to play against provides an easily accessible environment for experimenting with different strategies and ideas. Likewise having a game developed that would allow for a relatively easy process of applying and switching different algorithms out for the computer's decision making process could help speed further research. As more efficient algorithms are found to play imperfect information card games like this one they will hopefully be able to likewise be applied to other real world situations.
