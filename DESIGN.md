---
name: Brasil em Shanghai
description: O álbum de figurinhas da delegação brasileira na WorldSkills Shanghai 2026.
colors:
  cover: "#0e1f47"
  cover-2: "#16306a"
  on-cover: "#f3f6fb"
  on-cover-2: "#b9c6e4"
  yellow: "#ffd21f"
  yellow-ink: "#1a1400"
  green: "#009a4e"
  table: "#10234f"
  paper: "#f7f8f5"
  paper-2: "#eceee9"
  ink: "#121826"
  ink-2: "#485064"
  ink-3: "#555d6f"
  line: "#d7dbe1"
  note-paper: "#fff4c2"
  note-ink: "#3d3100"
  s-construcao: "#c9500f"
  s-artes: "#d6246f"
  s-ti: "#0a78c2"
  s-manufatura: "#0a7a44"
  s-servicos: "#7442c2"
  s-transporte: "#d9352a"
  silver: "#c3ccd6"
  silver-2: "#eef2f6"
  bronze: "#b8743a"
  bronze-2: "#f0c99b"
  gold-rim: "#d6a520"
  sticker-white: "#ffffff"
typography:
  display:
    fontFamily: "'Big Shoulders Display', 'Arial Narrow', 'Roboto Condensed', system-ui, sans-serif"
    fontSize: "clamp(4rem, 2.2rem + 8vw, 8.5rem)"
    fontWeight: 900
    lineHeight: 0.84
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'Big Shoulders Display', 'Arial Narrow', 'Roboto Condensed', system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.3rem + 2.6vw, 3.4rem)"
    fontWeight: 900
    lineHeight: 0.9
  title:
    fontFamily: "'Big Shoulders Display', 'Arial Narrow', 'Roboto Condensed', system-ui, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 800
    lineHeight: 1
  sticker-name:
    fontFamily: "'Big Shoulders Display', 'Arial Narrow', 'Roboto Condensed', system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 800
    lineHeight: 0.95
  numeral:
    fontFamily: "'Big Shoulders Display', 'Arial Narrow', 'Roboto Condensed', system-ui, sans-serif"
    fontSize: "2.2rem"
    fontWeight: 900
    lineHeight: 1
    fontFeature: "tnum"
  body:
    fontFamily: "'Barlow', 'Segoe UI', system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "'Barlow', 'Segoe UI', system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.06em"
rounded:
  badge: "5px"
  photo: "6px"
  tile: "8px"
  sticker: "10px"
  note: "12px"
  page: "18px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 3vw, 40px)"
  sticker-inset: "6px"
  grid-row: "22px"
  grid-col: "16px"
  page-pad: "clamp(16px, 2.4vw, 30px)"
  album-gap: "28px"
components:
  button-primary:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.yellow-ink}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "48px"
  button-ghost:
    backgroundColor: "{colors.cover}"
    textColor: "{colors.on-cover}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "48px"
  chip:
    backgroundColor: "{colors.cover}"
    textColor: "{colors.on-cover-2}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "36px"
  chip-selected:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.yellow-ink}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "36px"
  field:
    backgroundColor: "{colors.cover-2}"
    textColor: "{colors.on-cover}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "42px"
  sticker:
    backgroundColor: "{colors.sticker-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sticker}"
    padding: "6px"
  sticker-number:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sticker-white}"
    typography: "{typography.sticker-name}"
    rounded: "{rounded.photo}"
    height: "26px"
  paper-page:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.page}"
    padding: "clamp(18px, 3vw, 36px)"
  note:
    backgroundColor: "{colors.note-paper}"
    textColor: "{colors.note-ink}"
    rounded: "{rounded.note}"
    padding: "12px 14px"
  icon-button:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "42px"
---

# Design System: Brasil em Shanghai

## Overview

**Creative North Star: "O Álbum de Figurinhas"**

A delegação é um álbum de figurinhas. Cada competidor é uma figurinha colada no espaço da sua ocupação, e os seis setores da WorldSkills são as seis páginas de "grupo" do álbum. Tudo o que aparece na tela é um objeto de álbum: a capa azul-marinho com amarelo, as páginas impressas em tinta de processo com retícula, as figurinhas de borda branca, as lacunas tracejadas, os selos redondos colados na página de placar e o verso da figurinha quando ela é aberta. O mundo foi escolhido pelo usuário.

A densidade é alta e alegre: muitas figurinhas por página, cada uma levemente torta, como coladas à mão. A cor mora nas páginas de setor, não em detalhes; o papel claro fica para as páginas de leitura (placar, comissão, verso). A página recusa o padrão da categoria, o painel branco de resultados com cards de foto e blocos de KPI.

O álbum é publicado só no GitHub Pages. As fontes vêm do Google Fonts, e as fotos vão junto com o site, sem depender de hosts externos. As fotos são publicadas no tamanho em que as fontes as servem e nunca são recomprimidas (pedido do usuário). Só os cartões de prévia de link e de stories são imagens geradas e comprimidas.

**Key Characteristics:**
- Mesa azul-marinho com retícula ao redor de tudo; as páginas do álbum ficam por cima.
- Uma tinta de processo saturada por setor, sempre com retícula branca.
- Figurinhas brancas de 10px de raio, foto sobre painel tingido, faixa de nome em caixa-alta condensada, número no canto.
- Prata e bronze são figurinhas "brilhantes" com reflexo que segue o ponteiro; Excelência tem aro dourado fino.
- O filtro descola figurinhas e deixa a lacuna impressa com número e nome.
- Big Shoulders Display para nomes, números e títulos; Barlow para texto e dados.

## Colors

Capa azul-marinho com amarelo Brasil, seis tintas de processo por setor, papel couché claro para leitura e metais só nas medalhas.

### Primary
- **Azul-Marinho da Capa** (cover): fundo da capa, da barra de busca fixa, da faixa do crachá da comissão e do verso quando não há setor. É a cor da "encadernação".
- **Azul da Capa Claro** (cover-2): gradiente da capa e fundo dos campos de busca.
- **Mesa Noturna** (table): o fundo da página inteira, com retícula branca a 7%, onde o álbum está apoiado.

### Secondary
- **Amarelo Brasil** (yellow): o único acento sobre o azul. Botão principal, chip ativo, contorno de foco, filtro ativo, contagem da barra, faixa de contagem da capa, links do rodapé, seleção de texto. Sempre com **Tinta do Amarelo** (yellow-ink) por cima.
- **Verde Brasil** (green): só a posição no quadro de pontos (2º). Uso raro de propósito.

### Tertiary
- **As seis tintas de setor** (s-construcao, s-artes, s-ti, s-manufatura, s-servicos, s-transporte): cada página de setor tem uma, aplicada como fundo cheio com retícula, como tinta da faixa de nome e do painel da foto (misturada com branco), da faixa e da coluna de mídia do verso. O mapa de estados não usa essas tintas: ele é o contorno real do Brasil, com o verde da marca em quatro tons pelo número de competidores (1 · 2 a 4 · 5 a 9 · 10 ou mais). Texto sobre elas é sempre branco.
- **Metais** (silver, silver-2, bronze, bronze-2, gold-rim): só para resultados. Prata e bronze em gradiente de 135 graus na figurinha brilhante e no selo; o aro dourado marca a Excelência e a linha de 700 pontos.

### Neutral
- **Papel Couché** (paper) e **Papel Couché Sombra** (paper-2): fundo das páginas de leitura (placar, comissão, verso) e das peças internas (blocos de estado, caixa de equipe, botões de ícone).
- **Tinta** (ink), **Tinta 2** (ink-2), **Tinta 3** (ink-3): texto sobre papel, do principal ao secundário e às legendas. Tinta também é o fundo do número da figurinha.
- **Filete** (line): linhas de tabela, trilhos de barra, separadores tracejados.
- **Texto da Capa** (on-cover) e **Texto da Capa 2** (on-cover-2): texto sobre o azul.
- **Papel de Recado** (note-paper) com **Tinta de Recado** (note-ink): a linha do Brasil na tabela de medalhas.

### Named Rules
**A Regra da Tinta por Grupo.** Cada setor tem uma tinta, e ela vale para tudo que pertence ao setor: página, faixa da figurinha, painel da foto, verso. Nunca misture tintas de setores numa mesma figurinha.

**A Regra do Amarelo Único.** Sobre o azul, o amarelo é o único acento e marca o que está ativo ou é a ação principal. Não crie um segundo acento na capa.

**A Regra do Metal Merecido.** Prata, bronze e dourado aparecem só onde há resultado correspondente. Nunca como decoração.

## Typography

**Display Font:** Big Shoulders Display (com 'Arial Narrow', 'Roboto Condensed', system-ui)
**Body Font:** Barlow (com 'Segoe UI', system-ui)

**Character:** A condensada pesada é a letra impressa de álbum e placar esportivo; a Barlow é a legenda limpa e legível embaixo. Nomes, números e títulos são sempre em caixa-alta condensada.

### Hierarchy
- **Display** (900, clamp(4rem, 2.2rem + 8vw, 8.5rem), 0.84): só os títulos da capa ("Brasil em Shanghai" e "Best of Nation"), em caixa-alta, com a segunda linha em amarelo.
- **Headline** (900, clamp(2rem, 1.3rem + 2.6vw, 3.4rem), 0.9): títulos de página de setor, placar e comissão, em caixa-alta.
- **Title** (800, 1.35rem, 1): títulos de seção impressos na página (quadro de pontos, por estado), em caixa-alta.
- **Sticker Name** (800, 1.2rem, 0.95): nome na faixa da figurinha, em caixa-alta, uma linha.
- **Numeral** (900, 2.2rem, 1, números tabulares): contagens, posições, pontos, números de figurinha e de lacuna. Os números grandes vivem em Big Shoulders; o "de 15" ao lado vive em Barlow.
- **Body** (400, 16px, 1.55): texto corrido; introduções limitadas a 46-62ch.
- **Label** (700, 12px, 0.06em, caixa-alta): cabeçalhos de tabela e rótulos dos selos de medalha.

### Named Rules
**A Regra do Contexto.** Todo resultado com medalha é "8º de 15": o ordinal em Big Shoulders, o total em Barlow ao lado. Nunca um número solto. Quem ficou na participação não mostra a colocação: a faixa de baixo da figurinha fica em branco (com a mesma altura), e o verso, o card para stories, a prévia de link e o texto de compartilhar mostram só os pontos, sem selo de "Participação".

**A Regra da Caixa-Alta Condensada.** Caixa-alta só em Big Shoulders (nomes, títulos, números) e nos rótulos de 12px. Texto em Barlow fica em caixa normal.

## Layout

Uma coluna de até 1320px com margem lateral fluida (gutter). A ordem é capa, barra de busca fixa, página de placar, seis páginas de setor, página da comissão, rodapé de fontes. As páginas ficam empilhadas com 28px entre elas, como folhas do álbum sobre a mesa.

- **Capa:** carrossel de dois destaques, que desliza com o dedo, pelas setas e pelas bolinhas e passa sozinho a cada 3,5s. Ele pausa com o mouse ou o foco na capa, para de vez quando a pessoa mexe e não se move com "reduzir movimento". Os dois destaques têm duas colunas (1.1fr texto, 1fr imagem), que viram uma coluna abaixo de 860px; aí os botões descem para baixo das figurinhas (ou da foto do Best of Nation).
  - **1º, Best of Nation:** o estado da dupla em cima, "Best of Nation" como título e o texto da maior nota. Tem botões para as figurinhas do estado, a figurinha do Best of Nation e o ranking dos estados. A foto da dupla (`bonPhoto` no data.json) vai impressa como figurinha especial, com a faixa azul estrelada, e amplia ao toque. No celular ela vira quadrada. O slide depende dos dados: até eles chegarem fica vazio, e se não chegarem ele sai e o do Brasil fica sozinho.
  - **2º, Brasil:** título, faixa de contagem, botões e o leque de cinco figurinhas brilhantes giradas de -12 a 12 graus.
- **Páginas de setor:** grade auto-fill de colunas de 178px no mínimo, com 22px entre linhas e 16px entre colunas; ocupações em dupla ocupam duas colunas. Abaixo de 480px, sempre 2 colunas com 16px por 10px.
- **Placar:** grade de 12 colunas com painéis de 6, 4, 8 e 12; uma coluna abaixo de 960px.
- **Barra de busca:** fixa no topo. Abaixo de 720px, o título some, os seletores ficam atrás de um chip "Filtros" com contador, e os chips de resultado rolam na horizontal.
- **Verso (diálogo):** até 1060px, duas colunas (mídia 0.9fr, texto 1.1fr); uma coluna rolável abaixo de 820px.
- **Celular:** a faixa de contagem da capa vira 3 blocos empilhados; a faixa de pontos rola na horizontal, abre centrada no grupo perto de 700 e mostra a dica "Arraste para os lados"; a linha de resultado do verso quebra em duas linhas; as tabelas mais largas que a tela rolam de lado, com o nome fixo à esquerda e a borda direita esmaecida enquanto há colunas escondidas.

### Named Rules
**A Regra da Lacuna Impressa.** Uma figurinha filtrada nunca some sem deixar rastro: no lugar fica a lacuna tracejada com número e nome. Só o chip "Esconder lacunas" recolhe as ocupações vazias.

## Elevation & Depth

A profundidade é física e suave: papel sobre mesa. Figurinhas, páginas e selos projetam sombras difusas e baixas; nada flutua. Não há sombras duras deslocadas. A textura de retícula (pontos de 1.2 a 1.5px em grade de 12 a 14px) é o que dá a sensação de impresso.

### Shadow Vocabulary
- **Figurinha colada** (`box-shadow: 0 1px 1px rgb(0 0 0 / 0.12), 0 8px 18px -10px rgb(0 0 0 / 0.45)`): figurinhas, crachás, fotos de grupo, selos de medalha.
- **Figurinha levantada** (`box-shadow: 0 2px 2px rgb(0 0 0 / 0.12), 0 16px 26px -12px rgb(0 0 0 / 0.55)`): hover da figurinha, só com ponteiro fino.
- **Página sobre a mesa** (`box-shadow: 0 24px 50px -30px rgb(0 0 0 / 0.9)`): páginas de setor, placar e comissão.
- **Verso aberto** (`box-shadow: 0 40px 80px -30px rgb(0 0 0 / 0.9)`): o diálogo, sobre fundo rgb(6 13 31 / 0.78).

### Named Rules
**A Regra do Papel Colado.** Tudo que é figurinha ou selo usa a sombra de figurinha colada e uma rotação pequena. Sombra mais alta só em resposta a ponteiro.

## Shapes

Cantos arredondados de papel cortado, nunca retos e nunca pílula nos objetos de álbum. A figurinha tem 10px; a foto dentro dela tem 6px só em cima; os selos de número e UF têm 5-6px; os blocos de estado têm 8px; as páginas têm 18px. Controles da barra (botões, chips, campos) são pílulas de 999px. Os selos de medalha e o número da ocupação são círculos.

Três marcas formais se repetem: a **retícula** sobre páginas e capa; o **tracejado** para o que está vazio ou inativo (lacunas, chips e campos inativos, separadores da faixa de contagem e da linha de resultado); e o **filete grosso** de 3px em tinta que abre cada seção impressa no papel.

### Named Rules
**A Regra do Tracejado.** Tracejado quer dizer vazio ou inativo; traço sólido amarelo quer dizer ativo. Não use tracejado como enfeite.

## Components

### Buttons
Pílulas firmes, com toque que afunda.
- **Shape:** pílula (999px), altura mínima de 48px.
- **Primário:** amarelo com tinta do amarelo, peso 700. Hover (ponteiro fino) clareia para #ffe066.
- **Fantasma:** transparente com anel interno branco de 2px a 28%; hover com fundo branco a 8%.
- **Pressionado:** scale(0.97) em 140ms.
- **Botão de ícone:** círculo de 42px em papel sombra, ícone SVG de 18px; no verso, fica branco a 18% sobre a faixa do setor.

### Chips
- **Estilo:** pílula de 36px, texto em azul claro da capa, contorno tracejado branco a 28%.
- **Ativo:** amarelo cheio com tinta do amarelo, sem contorno.

### Inputs / Fields
- **Estilo:** pílula de 42px em azul da capa claro, com anel interno branco a 14%; ícone de busca SVG de 16px.
- **Foco:** anel interno amarelo de 2px.
- **Filtro ativo / inativo:** ativo com anel amarelo sólido; inativo com contorno tracejado.

### Navigation
A barra "Procurar figurinha" é a navegação: fixa, no azul da capa, com o contador "N de 71 figurinhas" em amarelo. No celular os seletores abrem por um chip "Filtros" com um contador amarelo redondo.

### Figurinha (componente assinatura)
- **Anatomia:** fundo branco, 6px de margem, foto 3:4 sobre painel com gradiente da tinta do setor misturada com branco (30% a 65%), número em tinta no canto superior esquerdo, UF em branco no direito, faixa do nome na tinta do setor, linha de resultado embaixo (medalha e "Nº de N"). Todas do mesmo tamanho: o nome fica numa linha de altura fixa e, se não couber, a letra encolhe até caber (até 60%, depois reticências); a dupla usa o mesmo vão da grade, então cada figurinha dela tem a largura de uma individual.
- **Rotação:** cada figurinha tem uma rotação fixa entre -0.9 e 0.9 grau, derivada do seu id.
- **Brilhante (prata, bronze):** fundo metálico em gradiente, moldura holográfica em overlay mascarada só na borda, reflexo radial que segue o ponteiro (no toque, segue a rolagem) e atravessa a faixa do nome.
- **Excelência:** aro interno dourado de 2px.
- **Movimento:** ao voltar, cola com scale(1.06) rotate(-2deg) para o repouso em 360ms; a lacuna aparece descolando em 260ms. Tudo desligado com movimento reduzido.

### Lacuna
Contorno tracejado branco a 55% com 10px de raio, número grande em Big Shoulders 900 e o nome em Barlow 12px. Mínimo de 118px de altura.

### Página de papel (placar e comissão)
Papel couché com retícula azul a 7%, 18px de raio, sombra de página. As seções são impressas direto na página, abertas por filete de 3px em tinta, sem caixas internas. As medalhas são selos redondos colados (borda branca de 5px, levemente girados); estados, barras e selos são botões de filtro, com contorno de 3px em tinta quando ativos. As tabelas têm os nomes das colunas por extenso e linhas alternadas em papel sombra. O ranking dos estados segue o quadro de medalhas oficial: cada ocupação vale um resultado (a dupla leva uma medalha só) e a ordem é a olímpica, pratas, depois bronzes, depois excelências. Nas 64 notas, cada ocupação é uma plaquinha com a foto de quem competiu e a moldura na cor do resultado; a dupla divide uma plaquinha dupla, com as duas fotos.

### Verso da figurinha (diálogo)
Abre com um giro em Y a partir da figurinha clicada (520ms, cubic-bezier(0.23, 1, 0.32, 1)). Coluna de mídia na tinta do setor com foto principal 4:5, crédito sobre degradê e miniaturas; coluna de texto em papel, aberta por uma faixa na tinta do setor com retícula, número grande em tinta e os botões anterior, próximo e fechar. A linha de resultado fica entre filetes de 3px, com separadores tracejados; logo abaixo vêm o ouro da ocupação e a dupla, sem o gráfico com as notas de todos os países.

### Crachá da comissão
A mesma anatomia da figurinha, com foto 4:5 e faixa no azul da capa. 150px de largura; no celular, metade da tela. Nome e função numa linha cada, que encolhem até caber, para todos os crachás terem o mesmo tamanho.

## Do's and Don'ts

### Do:
- **Do** dar a cada setor uma tinta de processo cheia com retícula branca, e repetir essa tinta na faixa e no painel de todas as suas figurinhas.
- **Do** montar pessoas como figurinhas: borda branca de 6px, raio de 10px, número no canto, nome em Big Shoulders caixa-alta.
- **Do** deixar a lacuna tracejada com número e nome no lugar de toda figurinha filtrada.
- **Do** mostrar todo resultado como "Nº de N".
- **Do** creditar a fonte de cada foto e publicar as fotos sem recomprimir.
- **Do** desligar colar, descolar, giro e reflexo com prefers-reduced-motion.

### Don't:
- **Don't** fazer um painel branco de resultados com cards de foto e blocos de KPI.
- **Don't** usar metais (prata, bronze, dourado) fora dos resultados correspondentes.
- **Don't** colocar um segundo acento ao lado do amarelo sobre o azul da capa.
- **Don't** usar logos da WorldSkills, SENAI, Senac, CNI ou Panini como identidade.
- **Don't** carregar fontes fora do Google Fonts ou imagens de hosts externos: as fotos são publicadas junto com o site.
- **Don't** usar sombras duras deslocadas; a sombra é de papel colado.
- **Don't** pôr sobretítulos (eyebrows) acima dos títulos; o título de página começa direto, com a letra do grupo quando for página de setor.
