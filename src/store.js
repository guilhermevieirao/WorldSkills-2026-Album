// dados de data.json e estado dos filtros, compartilhados por todos os módulos
export const store = {
  D: null,
  bySkill: {},
  people: {},
  lastSticker: null, // última figurinha clicada: o verso abre girando a partir dela
};

export const state = { q: '', uf: '', city: '', reg: '', sec: '', gender: '', ent: '', fmt: '', res: '', compact: false, order: 'setor' };
export const FILTERS = ['q', 'uf', 'city', 'reg', 'sec', 'gender', 'ent', 'fmt', 'res'];
