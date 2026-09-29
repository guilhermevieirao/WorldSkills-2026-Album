"""Auditoria completa: todas as pessoas do álbum × todas as 943 da etapa nacional, com regra relaxada.

Lê public/data.json e o pessoas.json do repositório da seletiva (worldskills-br-2025-dashboard, ao lado deste).
"""
import json, os, re, unicodedata, difflib, collections

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

STOP = {'de', 'da', 'do', 'dos', 'das', 'e'}


def norm(s):
    return ''.join(c for c in unicodedata.normalize('NFD', (s or '').lower()) if unicodedata.category(c) != 'Mn').strip()


def toks(s):
    return [t for t in re.split(r'[^a-z]+', norm(s)) if t and t not in STOP]


def close(a, b):
    return a == b or (len(a) > 3 and len(b) > 3 and difflib.SequenceMatcher(None, a, b).ratio() >= 0.8)


Q = json.load(open(os.path.join(ROOT, '..', 'worldskills-br-2025-dashboard', 'data', 'pessoas.json'), encoding='utf8'))
D = json.load(open(os.path.join(ROOT, 'public', 'data.json'), encoding='utf8'))
UFRE = re.compile(r'BR_([A-Z]{2})')

ours = ([('comp', p['id'], p['name'], p['n'], p['uf'], p.get('national')) for p in D['people']]
        + [('occ', i, t['name'], t['n'], t['uf'], t.get('national')) for i, t in enumerate(D['teamOcc'])]
        + [('gen', i, g['name'], None, g.get('uf'), g.get('national')) for i, g in enumerate(D['general'])])

rows = []
for kind, i, name, n, uf, have in ours:
    A = toks(name)
    sn = f'{n:02d}' if n else None
    cands = []
    for q in Q:
        B = toks(q['nome'])
        if not B or not close(A[0], B[0]):
            continue
        shared = [t for t in B[1:] if any(close(t, u) for u in A[1:])]
        short, long_ = (A, B) if len(A) <= len(B) else (B, A)
        contained = len(short) >= 2 and all(any(close(t, u) for u in long_) for t in short)
        qs = q['skillNumber']
        m = UFRE.search(q['grupo'] or '')
        quf = m.group(1) if m else None
        same_occ = bool(sn and qs == sn)
        same_uf = bool(uf and quf == uf)
        if contained or (shared and (same_occ or same_uf)):
            cands.append({'nome': q['nome'], 'perfil': q['perfil'], 'ocup': q['ocupacao'], 'sn': qs, 'uf': quf,
                          'inst': q['instituicao'], 'contained': contained, 'shared': len(shared),
                          'same_occ': same_occ, 'same_uf': same_uf})
    have_keys = {(r.get('perfil'), r.get('n')) for r in (have or [])}
    new = [c for c in cands if (c['perfil'], int(c['sn']) if c['sn'] else None) not in have_keys]
    if new:
        rows.append({'kind': kind, 'i': i, 'name': name, 'n': n, 'uf': uf, 'have': have, 'new': new})

json.dump(rows, open(os.path.join(ROOT, 'data', 'sources', 'audit_qq.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print(len(rows), 'pessoas com candidatos novos')
for r in rows:
    print(f"\n[{r['kind']}:{r['i']}] {r['name']} #{r['n']} {r['uf']} | já tem: {[(h['perfil'], h.get('n')) for h in (r['have'] or [])]}")
    for c in r['new']:
        flag = ('OCUP ' if c['same_occ'] else '') + ('UF ' if c['same_uf'] else '') + ('CONTIDO' if c['contained'] else f"sobren.{c['shared']}")
        print(f"   -> {c['nome']} | {c['perfil']} | {c['sn']} {c['ocup']} | {c['uf']} | {c['inst']} | {flag}")
