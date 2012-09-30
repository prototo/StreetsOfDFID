#!/usr/bin/python

import json

manual_data = file("field_descriptors.json").read()
fields = json.loads(manual_data)

fp = open("../css/icons.less", "w")
fp.write('@import "indicators.less";\n')

for n, field_id in enumerate(fields):
    f = fields[field_id]

    fp.write(
        '.indicator.%s {.border-image("%s/%s", 0, 0, repeat);}\n' %
        (field_id.replace(" ", ""), f["category"], f["icon"])
    )

fp.close()
