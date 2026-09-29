# Brasil em Shanghai

Álbum de figurinhas da delegação brasileira na WorldSkills Shanghai 2026 (23 a 26 de setembro de 2026). Mostra os 71 competidores com o resultado oficial de cada ocupação, as equipes que viajaram com cada uma, a comissão, o placar do Brasil no quadro de pontos e um almanaque com os números da campanha.

**https://skillex.com.br/**

Cada figurinha tem um endereço próprio, por exemplo `f/12-bruno-souza/`. Quando esse link é enviado no WhatsApp, Discord ou Instagram, aparece uma prévia com a foto, o nome, a ocupação e o resultado. Quem abre o link cai no álbum com a figurinha já aberta.

## Como rodar

Pré-requisito: Node.js 24.

```bash
npm install
npm run dev       # servidor de desenvolvimento em http://localhost:5173
npm run build     # gera o site em dist/
npm run preview   # serve o dist/ para conferir o build
```

## Publicação

Cada push na `main` dispara o workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), que roda `npm run build` e publica `dist/` no GitHub Pages. Nada gerado fica no repositório, exceto as imagens de prévia (ver abaixo).

## Estrutura

```
index.html                 página: cabeçalho (meta tags, prévia de link, dados estruturados) e a marcação fixa
src/
  main.js                  ponto de entrada: carrega data.json e monta as seções
  store.js                 dados carregados e estado dos filtros
  filters.js               busca e filtros do álbum
  lib/                     utilitários (DOM, texto, constantes, ícones)
  components/              figurinha, equipe, verso (diálogo), compartilhar, foto ampliada, brilho, voltar ao topo
  sections/                capa, barra de busca, placar, álbum, almanaque, comissão, rodapé
  styles/                  um CSS por parte da página, reunidos em index.css
  data/brazil-map.json     contornos dos estados para o mapa do almanaque
public/                    vai para o ar como está
  data.json                competidores, resultados, equipes, comissão, quadros de medalhas e de pontos e histórico
  img/                     fotos, todas originais, sem recompressão
    ws/                      retratos oficiais da WorldSkills Shanghai 2026
    news/                    fotos das notícias do Portal da Indústria
    c/                       fotos dos competidores no Flickr da CNI
    equipes/, comissao/      fotos das equipes de cada ocupação e da comissão (Flickr da CNI)
    seletiva/                fotos de credenciamento da seletiva nacional
    best-of-nation.jpg, delegacao.jpg, autor.jpg
  og/                      imagens de prévia de link (1200×630) e cards de stories (1080×1920 e 720×1280)
  favicon.png
scripts/
  generate-pages.mjs       depois do build: páginas de cada figurinha (f/), 404, robots.txt, sitemap.xml, llms.txt
  generate-og.mjs          desenha as imagens de public/og/ a partir de og/card.html
  points-table.mjs         recalcula o quadro de pontos (soma das notas de cada país) pela API da WorldSkills
  data/                    scripts em Python que montaram os dados (cruzamento com a seletiva nacional e mapa)
data/sources/              coletas brutas de onde saíram os dados: resultados da API da WorldSkills, histórico do Brasil,
                           páginas das ocupações, matérias do Portal da Indústria, álbum da CNI no Flickr (com as fotos
                           originais em flickr/), o cruzamento com a seletiva nacional e o mapa do Brasil
.github/workflows/         deploy no GitHub Pages
PRODUCT.md, DESIGN.md      contexto do produto e sistema visual
```

## Imagens de prévia

As imagens de `public/og/` são desenhadas com o Chrome do computador e ficam no repositório, para o deploy não precisar de navegador. Quando os dados de um competidor mudarem, gere de novo:

```bash
npm run og                         # álbum e todos os competidores
npm run og -- 31-myllena-nogueira  # só uma figurinha
```

## Quadro de pontos

O placar ordena os países pela soma das notas em todas as ocupações que disputaram (nas duplas, a nota conta uma vez), o critério do comparativo oficial da WorldSkills por total de pontos. Para recalcular a partir da API pública da WorldSkills:

```bash
npm run points
```

## Fontes

- Resultados: [results.worldskills.org](https://results.worldskills.org/) (API pública da WorldSkills).
- Retratos: [worldskills2026.com](https://worldskills2026.com/skills).
- Delegação (cidade, estado e histórias): Portal da Indústria.
- Fotos da delegação: álbum da CNI no Flickr (Gabriel Pinheiro / SENAI).
- Etapa nacional: [Participantes Seletiva WorldSkills Brasil 2025](https://guilhermevieirao.github.io/worldskills-br-2025-dashboard/).
- Marcos históricos: [Histórico do Brasil na WorldSkills](https://www.portaldaindustria.com.br/senai/canais/brasilnaworldskills/historico/) (Portal da Indústria).
- Contornos dos estados: [@svg-maps/brazil](https://github.com/VictorCazanave/svg-maps/tree/master/packages/brazil), de Victor Cazanave (CC BY 4.0).

Página independente de torcida, sem vínculo oficial com a WorldSkills, o SENAI, o Senac ou a CNI. As fotos pertencem aos seus autores e são usadas com crédito.

Feito por [Guilherme Vieira](https://github.com/guilhermevieirao), competidor WorldSkills Minas Gerais.
