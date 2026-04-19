const { Goods, Volume } = require('../models/models');

class SetUrlToVolume {
  static getUrl = (name) => {
    // Розширений slugify
    const slugify = (str) => {
      const map = {
        а: 'a',
        б: 'b',
        в: 'v',
        г: 'h',
        ґ: 'g',
        д: 'd',
        е: 'e',
        є: 'ye',
        ж: 'zh',
        з: 'z',
        и: 'y',
        і: 'i',
        ї: 'yi',
        й: 'i',
        к: 'k',
        л: 'l',
        м: 'm',
        н: 'n',
        о: 'o',
        п: 'p',
        р: 'r',
        с: 's',
        т: 't',
        у: 'u',
        ф: 'f',
        х: 'kh',
        ц: 'ts',
        ч: 'ch',
        ш: 'sh',
        щ: 'shch',
        ь: '',
        ю: 'yu',
        я: 'ya',
        '’': '',
        ' ': '-',
        '-': '-',
        ё: 'yo',
        э: 'e',
        ы: 'y',
        ъ: '',
      };

      return str
        .toLowerCase()
        .split('')
        .map((c) => map[c] || c)
        .join('')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    // Прибираємо маркер мови
    let cleanName = name;
    if (cleanName.startsWith('[UA]') || cleanName.startsWith('[RU]')) {
      cleanName = cleanName.slice(5).trim();
    }

    // Повертаємо slugified рядок
    return slugify(cleanName);
  };
  static SetOneGoods = async (goodId) => {
    try {
      const good = await Goods.findOne({
        where: { id: goodId },
        attributes: ['nameuk', 'nameru'],
      });

      if (!good) return;

      // беремо українську назву, якщо немає, беремо російську
      let nameGood = good.nameuk || good.nameru;

      // прибираємо [UA] або [RU] якщо є
      if (nameGood.startsWith('[UA]') || nameGood.startsWith('[RU]')) {
        nameGood = nameGood.slice(5);
      }

      // універсальний slugify для укр + рос
      const slugify = (str) => {
        const map = {
          // українські
          а: 'a',
          б: 'b',
          в: 'v',
          г: 'h',
          ґ: 'g',
          д: 'd',
          е: 'e',
          є: 'ye',
          ж: 'zh',
          з: 'z',
          и: 'y',
          і: 'i',
          ї: 'i',
          й: 'i',
          к: 'k',
          л: 'l',
          м: 'm',
          н: 'n',
          о: 'o',
          п: 'p',
          р: 'r',
          с: 's',
          т: 't',
          у: 'u',
          ф: 'f',
          х: 'kh',
          ц: 'ts',
          ч: 'ch',
          ш: 'sh',
          щ: 'shch',
          ь: '',
          '’': '',
          ' ': '-',
          ю: 'yu',
          я: 'ya',
          // російські
          ё: 'yo',
          э: 'e',
          ы: 'y',
          ъ: '',
          й: 'i',
        };
        return str
          .toLowerCase()
          .split('')
          .map((c) => map[c] ?? c)
          .join('')
          .replace(/[^a-z0-9-]/g, '')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
      };

      const urlVolume = slugify(nameGood);
      Volume.update({ url: urlVolume }, { where: { goodId } });
    } catch (err) {
      console.log('Помилка задати товар з id ' + goodId + ' ' + err);
    }
  };
  static SetAllGoods = async () => {
    const goods = await Goods.findAll({ attributes: ['id'] });
    goods.forEach((x) => this.SetOneGoods(x.id));
  };
}

module.exports = SetUrlToVolume;
