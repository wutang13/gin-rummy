import json
import pprint

data = None

with open('../scoredPop.json') as f:
    data = json.load(f)

player_values = {
            "runScore": {},
            "setScore": {},
            "trioScore": {},
            "discardedPenalty": {},
            "pickedPenalty": {},
            "valueBonus": {},
            }

for player in data:
    phenotype = player['phenotype']

    for k, v in phenotype.items():
        if k == 'knockValues':
            continue
        if player_values[k].get(v):
            player_values[k][v] += 1
        else:
            player_values[k][v] = 1

pprint.pprint(player_values)
