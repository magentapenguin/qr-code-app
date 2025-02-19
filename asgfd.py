import re
d = """--sl-color-neutral-0: rgb(255 255 255);
--sl-color-neutral-50: rgb(249 249 250);
--sl-color-neutral-100: rgb(235 236 239);
--sl-color-neutral-200: rgb(220 222 227);
--sl-color-neutral-300: rgb(204 206 214);
--sl-color-neutral-400: rgb(182 186 197);
--sl-color-neutral-500: rgb(154 160 175);
--sl-color-neutral-600: rgb(124 132 152);
--sl-color-neutral-700: rgb(99 108 132);
--sl-color-neutral-800: rgb(79 89 116);
--sl-color-neutral-900: rgb(51 62 94);
--sl-color-neutral-950: rgb(24 37 73);
--sl-color-neutral-1000: rgb(8 16 36);"""
# extract colors
colors = re.findall(r"rgb\((\d+)\s(\d+)\s(\d+)\)", d)
colors = [tuple(map(int, color)) for color in colors]

colors.reverse()

for i, (color, line) in enumerate(zip(colors, d.splitlines())):
    # find ":"
    idx = line.index(":")
    # replace with new color
    line = line[:idx + 1] + f" rgb{color}".replace(',','') + ";"
    print(line)