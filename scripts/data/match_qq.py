"""Cruza o álbum com o "Quem é Quem" da etapa nacional. Só quem já está no álbum.

Lê public/data.json e o pessoas.json do repositório da seletiva (worldskills-br-2025-dashboard, ao lado deste).
Grava data/sources/qq_matches.json.
"""
import json, re, unicodedata, collections, difflib, hashlib, os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
QQ = os.path.relpath(os.path.join(ROOT, '..', 'worldskills-br-2025-dashboard', 'data'))
STOP = {'de', 'da', 'do', 'dos', 'das', 'e'}


def norm(s):
    return ''.join(c for c in unicodedata.normalize('NFD', (s or '').lower()) if unicodedata.category(c) != 'Mn').strip()


def toks(s):
    return [t for t in re.split(r'[^a-z]+', norm(s)) if t and t not in STOP]


def close(a, b):
    return a == b or difflib.SequenceMatcher(None, a, b).ratio() >= 0.8


def strict(a, b):
    """mesmo primeiro nome, mesmo último sobrenome, e o nome curto contido no longo"""
    A, B = toks(a), toks(b)
    if not A or not B or not close(A[0], B[0]) or A[-1] != B[-1]:
        return False
    short, long_ = (A, B) if len(A) <= len(B) else (B, A)
    return all(any(close(t, u) for u in long_) for t in short)


Q = json.load(open(QQ + '/pessoas.json', encoding='utf8'))
D = json.load(open(os.path.join(ROOT, 'public', 'data.json'), encoding='utf8'))
key = lambda u: hashlib.sha1(u.encode()).hexdigest()[:16]

ours = ([('comp', p['id'], p['name'], p['n'], p.get('official')) for p in D['people']]
        + [('occ', i, t['name'], t['n'], None) for i, t in enumerate(D['teamOcc'])]
        + [('gen', i, g['name'], None, None) for i, g in enumerate(D['general'])])

out, stats, unmatched = {}, collections.Counter(), []
for kind, i, name, n, off in ours:
    sn = f'{n:02d}' if n else None
    def sub(q):  # nome nacional abreviado ("Marcus Vinicius") contido no nosso, mesma ocupação
        A, B = toks(q['nome']), toks(name)
        return len(A) >= 2 and close(A[0], B[0]) and all(any(close(t, u) for u in B) for t in A)
    if kind == 'comp':
        # competidor: registro de competidor; a ocupação nacional pode ser outra (ex.: Erick)
        hits = [q for q in Q if q['perfil'].startswith('Competidor') and (strict(name, q['nome']) or (off and strict(off, q['nome'])) or (q['skillNumber'] == sn and sub(q)))]
        if len({norm(q['nome']) for q in hits}) > 1:
            hits = [q for q in hits if q['skillNumber'] == sn] or hits
    else:
        hits = [q for q in Q if strict(name, q['nome'])]
    # nomes iguais de pessoas diferentes: se houver registro na mesma ocupação, fica só ele
    if n and any(q['skillNumber'] == sn for q in hits) and kind == 'occ':
        same = [q for q in hits if q['skillNumber'] == sn]
        other_people = {norm(q['nome']) for q in hits} - {norm(q['nome']) for q in same}
        hits = same + [q for q in hits if norm(q['nome']) not in other_people and q not in same]
    names = {norm(q['nome']) for q in hits}
    if len(names) > 1:
        stats[kind + ':ambiguo'] += 1
        unmatched.append((kind, name, n, 'AMBIGUO', sorted(names)))
        continue
    if not hits:
        stats[kind + ':sem'] += 1
        unmatched.append((kind, name, n, '', []))
        continue
    stats[kind + ':ok'] += 1
    recs = []
    for q in hits:
        raw = f"{QQ}/raw/{key(q['foto'])}.bin" if q['foto'] else None
        recs.append({
            'nome': q['nome'], 'perfil': q['perfil'], 'ocupacao': q['ocupacao'], 'skillNumber': q['skillNumber'],
            'instituicao': q['instituicao'], 'local': q['local'], 'grupo': q['grupo'],
            'empresa': q['empresa'] if q['empresa'] and not re.fullmatch(r'\d{4}-\d{2}-\d{2}', q['empresa']) else '',
            'empresa_suspeita': bool(re.fullmatch(r'\d{4}-\d{2}-\d{2}', q['empresa'] or '')),
            'foto_raw': raw if raw and os.path.exists(raw) else None,
        })
    out[f'{kind}:{i}'] = {'name': name, 'n': n, 'recs': recs}

json.dump(out, open(os.path.join(ROOT, 'data', 'sources', 'qq_matches.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print(dict(stats))
print('com foto:', sum(1 for v in out.values() if any(r['foto_raw'] for r in v['recs'])))
print('empresa com data (descartada):', sum(1 for v in out.values() for r in v['recs'] if r['empresa_suspeita']))
print('com empresa real:', [(v['name'], r['empresa']) for v in out.values() for r in v['recs'] if r['empresa']])
print('\nSEM CORRESPONDÊNCIA / AMBÍGUOS')
for u in unmatched:
    print(u)
print('\nVÁRIOS PAPÉIS NA ETAPA NACIONAL')
for k, v in out.items():
    if len(v['recs']) > 1:
        print(k, v['name'], [(r['perfil'], r['ocupacao']) for r in v['recs']])
print('\nAMOSTRA OCC')
for k, v in list(out.items()):
    if k.startswith('occ'):
        print(v['name'], v['n'], [(r['perfil'], r['ocupacao'], r['skillNumber'], r['instituicao']) for r in v['recs']])
