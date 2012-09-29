#!/usr/bin/python

import csv
import json

ROOT="../DFID/World Bank/"
LEX="WDI data lexicon.csv"

fields = [l.strip() for l in file("fields.txt")]

lex = {}

for line in csv.reader(open(ROOT+LEX)):
    idx = line[0]
    data = line[1:]

    if idx in fields:
        lex[str(idx)] = str(data[0])

fp = open("../data/lexicon.json", "w")
fp.write("var lexicon = " + json.dumps(lex, indent=4) + ";\n")
fp.close()
