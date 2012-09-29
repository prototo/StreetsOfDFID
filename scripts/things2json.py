#!/usr/bin/python

import csv
import json

ROOT="../DFID/World Bank/"
LEX="WDI data lexicon.csv"


lex = {}

for line in csv.reader(open(ROOT+LEX)):
    idx = line[0]
    data = line[1:]

    lex[str(idx)] = str(data[0])

fp = open("../json/lexicon.json", "w")
fp.write("var lexicon = " + json.dumps(lex, indent=4) + ";\n")
fp.close()
