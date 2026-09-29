"""Mapa do Brasil (@svg-maps/brazil, CC BY 4.0): caminhos absolutos com 1 casa e ponto de rótulo por estado.

Lê data/sources/svgmaps_brazil.js e grava src/data/brazil-map.json (o mapa do almanaque).
"""
import json, os, re, math

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

s = open(os.path.join(ROOT, 'data', 'sources', 'svgmaps_brazil.js'), encoding='utf8').read()
d = json.loads(s[s.index('{'):s.rindex('}') + 1])


def rings(path):
    out, cur, x, y, sx, sy, mode, buf = [], None, 0.0, 0.0, 0.0, 0.0, 'm', []
    for tok in re.findall(r'[mz]|-?\d*\.?\d+(?:e-?\d+)?', path):
        if tok == 'm':
            mode = 'm'
            continue
        if tok == 'z':
            if cur: out.append(cur)
            cur, x, y = None, sx, sy
            continue
        buf.append(float(tok))
        if len(buf) == 2:
            dx, dy = buf; buf.clear()
            x, y = x + dx, y + dy
            if mode == 'm':
                sx, sy = x, y
                cur = [(x, y)]
                mode = 'l'
            else:
                cur.append((x, y))
    if cur: out.append(cur)
    return out


def area(r):
    return sum(r[i][0] * r[i - 1][1] - r[i - 1][0] * r[i][1] for i in range(len(r))) / 2


def inside(px, py, r):
    c = False
    for i in range(len(r)):
        (x1, y1), (x2, y2) = r[i - 1], r[i]
        if (y1 > py) != (y2 > py) and px < (x2 - x1) * (py - y1) / (y2 - y1) + x1:
            c = not c
    return c


def segdist(px, py, a, b):
    (x1, y1), (x2, y2) = a, b
    dx, dy = x2 - x1, y2 - y1
    t = max(0, min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy or 1)))
    return math.hypot(px - x1 - t * dx, py - y1 - t * dy)


def pole(r):
    """ponto mais afastado da borda (busca em grade refinada)"""
    xs, ys = [p[0] for p in r], [p[1] for p in r]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    best, step = (0, (x0 + x1) / 2, (y0 + y1) / 2), max(x1 - x0, y1 - y0) / 24
    cx, cy, span = (x0 + x1) / 2, (y0 + y1) / 2, max(x1 - x0, y1 - y0)
    for _ in range(4):
        n = 24
        for i in range(n + 1):
            for j in range(n + 1):
                px, py = cx - span / 2 + span * i / n, cy - span / 2 + span * j / n
                if not inside(px, py, r): continue
                dd = min(segdist(px, py, r[k - 1], r[k]) for k in range(len(r)))
                if dd > best[0]: best = (dd, px, py)
        cx, cy, span = best[1], best[2], span / 4
    return best


states = {}
for loc in d['locations']:
    uf = loc['id'].upper()
    rs = rings(loc['path'])
    main = max(rs, key=lambda r: abs(area(r)))
    r, lx, ly = pole(main)
    dstr = ''.join('M' + ' '.join(f'{x:.1f} {y:.1f}' for x, y in ring) + 'Z' for ring in rs)
    dstr = re.sub(r'\.0\b', '', dstr)
    states[uf] = {'d': dstr, 'x': round(lx, 1), 'y': round(ly, 1), 'r': round(r, 1)}
    print(uf, len(rs), 'rings', 'r=%.1f' % r, len(dstr))

json.dump({'viewBox': d['viewBox'], 'states': states}, open(os.path.join(ROOT, 'src', 'data', 'brazil-map.json'), 'w'), separators=(',', ':'))
print('total', len(json.dumps(states)))
