#!/usr/bin/python

import csv
import json
try:
    import progressbar
except:
    progressbar = False

ROOT="./source/"
LEX="WDI data lexicon.csv"
DATA="WDI datasets.csv"

if progressbar: pbar = progressbar.ProgressBar().start()

manual_data = file("field_descriptors.json").read()
fields = json.loads(manual_data)

for n, line in enumerate(csv.reader(open(ROOT+LEX))):
    if progressbar: pbar.update(n/216.0*100)

    idx = line[0]
    data = line[1:]

    if idx in fields:
        fields[idx]["description"] = str(data[0])

indicators = []
for n, line in enumerate(csv.reader(open(ROOT+DATA))):
    if progressbar: pbar.update(n/194.0*100)

    if n == 0:
        indicators = line[2:]
        continue

    country_area = line[0]
    country_name = line[1]
    for col, indicator_name in enumerate(indicators, 2):
        for field_id in fields:
            if indicator_name in fields[field_id]["source"]:
                if "data" not in fields[field_id]:
                    fields[field_id]["data"] = {}
                if line[col]:
                    fields[field_id]["data"][country_name] = float(line[col].replace(",", ""))
                else:
                    fields[field_id]["data"][country_name] = float(-1)

for n, field_id in enumerate(fields):
    if progressbar: pbar.update(n/float(len(fields))*100)

    if "data" in fields[field_id]:
        in_min = min(fields[field_id]["data"].values())
        in_max = max(fields[field_id]["data"].values())
        in_range = in_max - in_min

        for country in fields[field_id]["data"]:
            orig = fields[field_id]["data"][country]
            fields[field_id]["data"][country] = (orig - in_min) / in_range

            if fields[field_id].get("scale") == "inverted":
                fields[field_id]["data"][country] = 1 - fields[field_id]["data"][country]

if progressbar: pbar.finish()

fp = open("../data/fields.json", "w")
#fp.write("var fields = " + json.dumps(fields, indent=4) + ";\n")
fp.write(json.dumps(fields, indent=4))
fp.close()
