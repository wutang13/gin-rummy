import json

import matplotlib.pyplot as plt
import numpy as np

data = None

with open('../scoredPop.json') as f:
    data = json.load(f)

x = [np.empty(100) for i in range(5)]
y = np.array([player['score'] for player in data])

for feature in range(5):
    for i, player in enumerate(data):
        x[feature][i] = list(player['phenotype'].values())[feature]

for x_i in x:
    plt.plot(x_i, y, 'o', color='black')
    plt.show()
