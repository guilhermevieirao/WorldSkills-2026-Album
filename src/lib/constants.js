export const SITE_URL = 'https://skillex.com.br/';

export const SECTORS = [
  { name: 'Construção e Edificações', key: 'construcao' },
  { name: 'Artes Criativas e Moda', key: 'artes' },
  { name: 'Tecnologia da Informação', key: 'ti' },
  { name: 'Manufatura e Engenharia', key: 'manufatura' },
  { name: 'Serviços Sociais e Pessoais', key: 'servicos' },
  { name: 'Transporte e Logística', key: 'transporte' },
];
export const SECTOR_EN = { 'Artes Criativas e Moda': 'Creative Arts and Fashion', 'Construção e Edificações': 'Construction and Building Technology', 'Manufatura e Engenharia': 'Manufacturing and Engineering Technology', 'Serviços Sociais e Pessoais': 'Social and Personal Services', 'Tecnologia da Informação': 'Information and Communication Technology', 'Transporte e Logística': 'Transportation and Logistics' };
export const secVar = name => `var(--s-${SECTORS.find(s => s.name === name).key})`;

export const MEDAL = { prata: 'Medalha de Prata', bronze: 'Medalha de Bronze', excelencia: 'Medalha de Excelência', participacao: 'Participação', ouro: 'Medalha de Ouro' };
export const MEDAL_SHORT = { prata: 'Prata', bronze: 'Bronze', excelencia: 'Excelência', participacao: 'Participação', ouro: 'Ouro' };
// cor de cada resultado nas barras, nas notas e no histórico
export const TONE = { ouro: 'var(--yellow)', prata: '#8f9aa6', bronze: 'var(--bronze)', excelencia: 'var(--gold-rim)', participacao: 'var(--line)' };

export const UF = { AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás', MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais', PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina', SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins' };
export const REGIONS = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'];

// medalha: prata, bronze ou excelência; quem ficou só na participação não mostra a colocação
export const medaled = sk => sk.medal !== 'participacao';
