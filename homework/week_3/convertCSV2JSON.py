import csv
import json

with open('avgtemp2015.csv', 'r') as f:
	reader = csv.DictReader(f)
	rows = list(reader)

with open('avgtemp2015.json', 'w') as f:
	f.write(json.dumps(rows, sort_keys = True, indent = 4, separators = (',', 
		': ')))