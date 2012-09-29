#!/usr/bin/python

import csv
import json

ROOT="../DFID/World Bank/"
LEX="WDI data lexicon.csv"

fields = {}
for n, line in enumerate(csv.reader(open("fields.csv"))):
    if n == 0:  # skip header line
        continue
    official_name, name = line
    fields[official_name] = {
        "name": name,
        "official_name": official_name,
        "icon": name.replace(" ", "_")+".png",
    }

lex = {}
for line in csv.reader(open(ROOT+LEX)):
    idx = line[0]
    data = line[1:]

    if idx in fields:
        fields[idx]["description"] = str(data[0])

fp = open("../data/fields.json", "w")
fp.write("var fields = " + json.dumps(fields, indent=4) + ";\n")
fp.close()
