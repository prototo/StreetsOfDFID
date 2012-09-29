#!/usr/bin/python

import csv
import json

ROOT="./source/"
LEX="WDI data lexicon.csv"
DATA="WDI_GDF_Data.csv"

manual_data = file("field_descriptors.json").read()
fields = json.loads(manual_data)

#for fieldname in fields:
#    official_name, name = line
#    fields[official_name] = {
#        "name": name,
#        "official_name": official_name,
#        "icon": name.replace(" ", "_")+".png",
#    }

for line in csv.reader(open(ROOT+LEX)):
    idx = line[0]
    data = line[1:]

    if idx in fields:
        fields[idx]["description"] = str(data[0])

for line in csv.reader(open(ROOT+DATA)):
    country_name = line[0]
    country_code = line[1]
    indicator_name = line[2]
    indicator_code = line[3]
    data = []
    for year in line[4:]:
        if year:
            data.append(float(year))

    if indicator_name in fields:
        if "data" not in fields[indicator_name]:
            fields[indicator_name]["data"] = {}

        if len(data):
            fields[indicator_name]["data"][country_name] = sum(data) / len(data)
        else:
            fields[indicator_name]["data"][country_name] = 0

fp = open("../data/fields.json", "w")
#fp.write("var fields = " + json.dumps(fields, indent=4) + ";\n")
fp.write(json.dumps(fields, indent=4))
fp.close()
