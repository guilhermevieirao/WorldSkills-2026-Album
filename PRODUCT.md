# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated. The product is a static site on GitHub Pages only (skillex.com.br). It is a Vite project in vanilla JS and CSS, with no framework: index.html plus ES modules in src/ (components and sections) and one CSS file per component. The data, photos and link-preview images live in public/. After `vite build`, scripts/generate-pages.mjs writes the per-sticker link-preview pages, the 404, the sitemap, robots.txt and llms.txt, and a GitHub Actions workflow publishes dist/ on every push to main. scripts/points-table.mjs refreshes the points table from the WorldSkills API. The earlier standalone HTML file and Claude artifact are retired.

## Users

The general public and fans (torcida), confirmed by the user. These are Brazilians following the Brazilian delegation at WorldSkills Shanghai 2026: family, friends, SENAI/Senac students, and people curious about technical careers. They browse on phones and laptops after the results are out. They want to find "their" competitor, see how Brazil did, and explore by state and result.

## Product Purpose

The page shows the whole Brazilian delegation at WorldSkills Shanghai 2026 (23–26 Sep 2026, 70 countries, 64 occupations) in one place:

- **Competitors:** all 71, with official results (position, score, medal, field size), their photos, and their home city, state and story.
- **Occupation teams:** everyone else who traveled with each occupation. Each occupation shows a box labeled "Equipe · <ocupação>" listing its people. The WorldSkills role (Expert or Intérprete) appears in the expanded card. The roles come from the user: a one-person team is the Expert, a named list gives more Experts, and in a two-person team with one Expert the other person is the Intérprete. Anyone the rules don't cover shows no role.
- **General team:** people not tied to any occupation, kept separate.

Success means someone can find a person, understand the result in context, and filter by state, region, result and sector.

## Positioning

It is the only view that joins four sources:

- the official WorldSkills results API (scores, positions, field sizes, the event medal table);
- the worldskills2026.com skill pages (portraits, skill descriptions);
- the Portal da Indústria delegation feature (region, city, UF, stories, photos);
- the CNI Flickr album (delegation portraits of competitors, occupation teams and general staff).

## Operating Context

Data was collected on 2026-09-27, after the competition ended.

Brazil's results:
- 18th in the medal table;
- 0 gold, 2 silver, 6 bronze, 29 Medals for Excellence;
- 27 without a medal.

The Medal for Excellence goes to scores of 700 and above.

Team occupations with 2 competitors: #04, #23, #37, #46, #48, #54, #63.

## Capabilities and Constraints

- Collected data lives in `data.json`, with images in `.ref/img/`.
- Filters: state (UF), region, result (gold/silver/bronze/excellence/participation), sector, text search.
- **#15 Instalações Hidráulicas:** o competidor é Matteo Victor Barbosa, único nome usado na página e nos dados.
- **Etapa nacional (fonte "Quem é Quem"):** só enriquece quem já está no álbum, com foto de credenciamento, instituição, função e ocupação nacional. Quando a ocupação nacional é outra, ela aparece numa caixa à parte, marcada como da etapa nacional. Local da prova e o campo "empresa" (que traz datas que parecem de nascimento) não são usados.
- Photos must not be recompressed (user instruction). They ship at the size the sources serve them.
- Skill descriptions were translated to pt-BR from the English originals.

## Brand Commitments

None imposed. This is an independent fan and data page. It must not impersonate WorldSkills, SENAI, Senac or CNI, and must not use their logos as its own identity. Photo credits go to the sources: "Foto: Gabriel Pinheiro / SENAI" for Flickr, WorldSkills for portraits, and Portal da Indústria for the feature photos.

## Evidence on Hand

All data is real and collected, and nothing is invented. There are no quotes beyond the published stories.

## Product Principles

1. The person comes first: every competitor is a face and a story, not just a row.
2. Results are shown in context: always "8º de 15", never a bare number.
3. The data stays honest: sources are cited.
4. Every filter is reachable in one tap on a phone.

## Accessibility & Inclusion

The page must meet:
- WCAG AA contrast;
- keyboard-operable filters;
- alt text for every portrait (the person's name);
- reduced-motion support;
- pt-BR language.
