#!/usr/bin/python

import json

manual_data = file("field_descriptors.json").read()
fields = json.loads(manual_data)

fp = open("../css/icons.less", "w")
fp.write('@import "indicators.less";\n')

for n, field_id in enumerate(fields):
    f = fields[field_id]

    fp.write(
        '.indicator.%s {.border-image("%s/%s", %s, %s, %s);}\n' %
        (field_id.replace(" ", ""), f["category"], f["icon"], f.get("left", 1), f.get("right", 1), f.get("scale", "repeat"))
    )

fp.close()
