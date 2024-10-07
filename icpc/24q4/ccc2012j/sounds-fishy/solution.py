def _main():
    readings = [int(input()) for _ in range(4)]
    if _is_stricly_increasing(readings):
        print("Fish Rising")
    elif _is_strictly_decreasing(readings):
        print("Fish Diving")
    elif _is_identical(readings):
        print("Fish At Constant Depth")
    else:
        print("No Fish")

def _is_stricly_increasing(readings):
    for a, b in _pairs(readings):
        if a >= b:
            return False
    return True

def _is_strictly_decreasing(readings):
    for a, b in _pairs(readings):
        if a <= b:
            return False
    return True

def _is_identical(readings):
    for a, b in _pairs(readings):
        if a != b:
            return False
    return True

def _pairs(readings):
    return [(a, b) for a, b in zip(readings, readings[1:])]

_main()
