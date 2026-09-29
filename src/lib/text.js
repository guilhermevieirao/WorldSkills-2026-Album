export const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const COMPOUND = ['maria', 'joao', 'luiz', 'juan', 'ana', 'caio', 'marcus', 'jose'];

// "Maria Luiza Silva Alves" -> "Maria Luiza Alves"
export const shortName = full => {
  const t = full.split(/\s+/).filter(w => !/^(de|da|do|dos|das|e)$/i.test(w));
  if (t.length <= 2) return t.join(' ');
  const first = COMPOUND.includes(norm(t[0])) ? t[0] + ' ' + t[1] : t[0];
  return first + ' ' + t[t.length - 1];
};

export const ord = n => n + 'º';
export const n2 = n => String(n).padStart(2, '0');
