code = {
    'A': '.-',
    'B': '-...',
    'C': '-.-.',
    'D': '-..',
    'E': '.',
    'F': '..-.',
    'G': '--.',
    'H': '....',
    'I': '..',
    'J': '.---',
    'K': '-.-',
    'L': '.-..',
    'M': '--',
    'N': '-.',
    'O': '---',
    'P': '.--.',
    'Q': '--.-',
    'R': '.-.',
    'S': '...',
    'T': '-',
    'U': '..-',
    'V': '...-',
    'W': '.--',
    'X': '-..-',
    'Y': '-.--',
    'Z': '--..',
    '_': '..--',
    '.': '---.',
    ',': '.-.-',
    '?': '----'
}

character = dict()

for k, v in code.items():
    character[v] = k

n = int(input())

for i in range(n):
    encoded = input()
    intermediate = ""
    decoded = ""
    lengths = []

    for c in encoded:
        intermediate += code[c]
        lengths.append(len(code[c]))

    lengths.reverse()

    j = 0

    for l in lengths:
        decoded += character[intermediate[j:j+l]]
        j += l

    print(f"{i + 1}: {decoded}")

