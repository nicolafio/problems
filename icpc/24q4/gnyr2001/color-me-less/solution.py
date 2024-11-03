import math

def _main():
    target_colors = [_get_color() for _ in range(16)]

    while True:
        color = _get_color()
        if color == [-1, -1, -1]:
            break

        min_distance = math.inf
        best_color = None

        for target_color in target_colors:
            distance = _get_color_distance(color, target_color)
            if distance < min_distance:
                best_color = target_color
                min_distance = distance

        print(f"{_color_str(color)} maps to {_color_str(best_color)}")

def _color_str(c):
    r = c[0]
    g = c[1]
    b = c[2]
    return f"({r},{g},{b})"

def _get_color_distance(a, b):
    r1 = a[0]
    g1 = a[1]
    b1 = a[2]
    r2 = b[0]
    g2 = b[1]
    b2 = b[2]
    d = (r2 - r1) ** 2 + (g2 - g1) ** 2 + (b2 - b1) ** 2

    return d

def _get_color():
    line = input()
    return [int(s) for s in line.split()]

_main()
