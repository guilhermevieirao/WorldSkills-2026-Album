"""Integra a etapa nacional (Quem é Quem) ao álbum, só para quem já está nele.

Registro de como os dados nacionais entraram no álbum, quando as fotos iam em pacotes (bundles).
Não faz parte do build atual: hoje as fotos ficam soltas em public/img.

- Fotos da equipe (Flickr) e de credenciamento vão em pacotes binários: os JPEGs originais
  concatenados, sem recompressão; data.json guarda "pacote:início:tamanho" de cada foto.
- Local da prova e o campo "empresa" ficam de fora.
"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
APP = os.path.join(ROOT, 'public')
FL = os.path.join(ROOT, 'data', 'sources', 'flickr')
LIMIT = 14_000_000  # cada pacote abaixo do teto de 15 MB por arquivo binário

D = json.load(open(f'{APP}/data.json', encoding='utf8'))
M = json.load(open(os.path.join(ROOT, 'data', 'sources', 'qq_matches.json'), encoding='utf8'))

bundles, cur, cur_size = [], [], 0
refs = {}


def add(path):
    """registra o arquivo num pacote e devolve a referência"""
    global cur, cur_size
    if path in refs:
        return refs[path]
    data = open(path, 'rb').read()
    kind = 'j' if data[:2] == b'\xff\xd8' else 'p' if data[:4] == b'\x89PNG' else None
    assert kind, path  # só JPEG ou PNG
    if cur_size + len(data) > LIMIT and cur:
        bundles.append(cur)
        cur, cur_size = [], 0
    cur.append((path, data))
    refs[path] = (len(bundles), cur_size, len(data), kind)
    cur_size += len(data)
    return refs[path]


def national(key, own_n=None):
    v = M.get(key)
    if not v:
        return None, None
    recs, photo = [], None
    for r in v['recs']:
        if r['foto_raw'] and not photo:
            photo = add(r['foto_raw'])
        rec = {'perfil': r['perfil'], 'instituicao': r['instituicao']}
        if r['ocupacao']:
            rec['ocupacao'] = r['ocupacao']
            rec['n'] = int(r['skillNumber']) if r['skillNumber'] else None
        if rec not in recs:
            recs.append(rec)
    return recs, photo


# comissão e equipes: primeiro as fotos do Flickr, na ordem em que aparecem
for i, t in enumerate(D['teamOcc']):
    t['img'] = add(f"{FL}/{t.pop('fid')}.jpg")
    t.pop('pack', None)
    t['national'], t['natImg'] = national(f'occ:{i}', t['n'])
for i, g in enumerate(D['general']):
    g['img'] = add(f"{FL}/{g.pop('fid')}.jpg")
    g.pop('pack', None)
    g['national'], g['natImg'] = national(f'gen:{i}')
for g in D['groups']:
    g['img'] = add(f"{FL}/{g.pop('fid')}.jpg")
    g.pop('pack', None)

# competidores
for p in D['people']:
    p['national'], p['natImg'] = national(f"comp:{p['id']}", p['n'])
    if p.get('note'):
        p['note'] = None
        p['official'] = p['name']

if cur:
    bundles.append(cur)

# grava os pacotes e troca as tuplas por "b<n>:<início>:<tamanho>"
os.makedirs(f'{APP}/bundles', exist_ok=True)
names = []
for k, b in enumerate(bundles):
    name = f'bundles/fotos-{k + 1}.jpg'
    with open(f'{APP}/{name}', 'wb') as f:
        for _, data in b:
            f.write(data)
    names.append(name)
    print(name, len(b), 'fotos', round(sum(len(d) for _, d in b) / 1e6, 2), 'MB')


def ref(t):
    return f'{t[0]}:{t[1]}:{t[2]}:{t[3]}' if t else None


for coll in (D['teamOcc'], D['general'], D['groups'], D['people']):
    for x in coll:
        for k in ('img', 'natImg'):
            if k in x:
                x[k] = ref(x[k])
D['bundles'] = names
D['credits']['national'] = 'Foto de credenciamento da etapa nacional (WorldSkills Brasil)'
D['sources'].append({'label': 'Quem é Quem da etapa nacional — WorldSkills Brasil (relatório público de credenciamento)',
                     'url': None})

json.dump(D, open(f'{APP}/data.json', 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))

print('competidores com dados nacionais:', sum(1 for p in D['people'] if p['national']))
print('equipe:', sum(1 for t in D['teamOcc'] if t['national']), '| comissão:', sum(1 for g in D['general'] if g['national']))
print('ocupação nacional diferente:', [(p['name'], p['n'], [r.get('n') for r in p['national']]) for p in D['people']
                                       if p['national'] and any(r.get('n') and r['n'] != p['n'] for r in p['national'])])
