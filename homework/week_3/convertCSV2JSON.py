'''
 Bas Kuiken
	10776990
	UvA, minor Programmeren
	Opdracht Dataprocessing, week 3
	
	Deze file converteert csv's naar json bestanden
'''


import csv
import json

csvFile = 'bitcoinprice.csv'
jsonFile = 'bitcoinprice.json'

with open(csvFile, 'r') as f:
	reader = csv.DictReader(f)
	rows = list(reader)

with open(jsonFile, 'w') as f:
	f.write(json.dumps(rows, sort_keys = True, indent = 4, separators = (',', 
		': ')))