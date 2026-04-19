module.exports = function EngToUkr(slug) {
  const reverseMap = {
    shch: 'щ',
    zh: 'ж',
    kh: 'х',
    ts: 'ц',
    ch: 'ч',
    sh: 'ш',
    yu: 'ю',
    ya: 'я',
    yo: 'ё',
    a: 'а',
    b: 'б',
    v: 'в',
    g: 'г',
    d: 'д',
    e: 'е',
    i: 'и',
    y: 'ы',
    k: 'к',
    l: 'л',
    m: 'м',
    n: 'н',
    o: 'о',
    p: 'п',
    r: 'р',
    s: 'с',
    t: 'т',
    u: 'у',
    f: 'ф',
    z: 'з',
  };

  const parts = slug.split('-');

  const nameParts = parts.map((part) => {
    let i = 0;
    let result = '';
    while (i < part.length) {
      const three = part.slice(i, i + 3).toLowerCase();
      const two = part.slice(i, i + 2).toLowerCase();
      const one = part[i].toLowerCase();

      if (reverseMap[three]) {
        result += reverseMap[three];
        i += 3;
      } else if (reverseMap[two]) {
        result += reverseMap[two];
        i += 2;
      } else if (reverseMap[one]) {
        result += reverseMap[one];
        i += 1;
      } else {
        result += part[i];
        i += 1;
      }
    }
    return result;
  });

  // Капіталізуємо першу букву кожного слова
  return nameParts.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
};
