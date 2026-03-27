'use client';
import React, { useState, useEffect } from 'react';
import { $authHost, $host } from '@/app/http';
//import './UpdateProduct.scss';
//import from 'react-quill-new';
//import 'react-quill/dist/quill.snow.css'; // Імпортуємо стилі для редактора
import { FaChevronUp } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import './AddProduct2_0.scss';
import MyJoditEditor from '../../utils/MyJoditReact';

async function downloadImage(url: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();

  const fileName = url.split('/').pop() || 'image.jpg';

  return new File([blob], fileName, { type: blob.type });
}

async function transformVolumes(inputVolumes: any) {
  return Promise.all(
    inputVolumes.map(async (v: any) => {
      const images = await Promise.all(
        v.imgs.map(async (img: any) => {
          const fullUrl = process.env.NEXT_PUBLIC_SERVER + img.img;
          const file = await downloadImage(fullUrl);
          return {
            img: file,
            altuk: img.volumeuk,
            altru: img.volumeru,
          };
        })
      );

      return {
        id: v.id,
        volume: v.volume,
        nameVolume: v.nameVolume,
        price: v.price,
        discount: v.discount,
        priceWithDiscount: v.priceWithDiscount,
        metaTitleuk: v.metaTitleuk,
        metaDescriptionuk: v.metaDescriptionuk,
        canonicaluk: v.canonicaluk,
        metaTitleru: v.metaTitleru,
        metaDescriptionru: v.metaDescriptionru,
        canonicalru: v.canonicalru,
        images,
        sort: v.sort,
        isDelete: false,
        isAvailability: v.isAvailability,
        art: v.art,
        isFreeDelivery: v.isFreeDelivery,
      };
    })
  );
}

function parseCharacteristics<T extends string, U extends string>(
  html: string,
  key1: T,
  key2: U
): Array<Record<T | U, string>> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const items: Array<Record<T | U, string>> = [];

  const liElements = doc.querySelectorAll('ul > li');
  liElements.forEach((li) => {
    const p = li.querySelector('p');
    const span = li.querySelector('span');

    if (p && span) {
      items.push({
        [key1]: p.textContent?.trim() ?? '',
        [key2]: span.textContent?.trim() ?? '',
      } as Record<T | U, string>);
    }
  });
  return items;
}

interface Category {
  id: string;
  nameuk: string;
}

interface Subcategory {
  id: number;
  nameuk: string;
}

interface FilterCategory {
  id: number;
  nameuk: string;
  nameru: string;
}

interface FilterValue {
  filterCategoryId: number;
  valueuk: string;
  valueru: string;
}

interface Brend {
  id: string;
  name: string;
}

interface Country {
  id: string;
  nameuk: string;
  nameru: string;
}

interface VolumeItem {
  id: number | null;
  volume: string;
  nameVolume: string;
  price: string;
  discount: string;
  priceWithDiscount: string;
  metaTitleuk: string;
  metaDescriptionuk: string;
  canonicaluk: string;
  metaTitleru: string;
  metaDescriptionru: string;
  canonicalru: string;
  images: { img: File | string; altuk: string; altru: string }[];
  isDelete: boolean;
  isAvailability: 'inStock' | 'notAvailable' | 'customMade';
  sort: any;
  art: string;
  isFreeDelivery: boolean;
}

const getCategoryUrl = 'category/get';
const getSubcategoryUrl = 'subcategory/get';
const getFilterUrl = 'filterCategory/getCategoryFilter';
const getBrendUrl = 'brend/get';
const getCountryUrl = 'countryMade/getCountryMade';
const getRecognition = 'goods/getRecognitionForCategory';
const getLinia = 'goods/getLinia';

const AddGoodsPage = () => {
  const [nameTypeuk, setNameTypeuk] = useState('');
  const [nameTyperu, setNameTyperu] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filters, setFilters] = useState<FilterCategory[]>([]);
  const [brends, setBrends] = useState<Brend[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [recognition, setRecognition] = useState([]);
  const [linia, setLinia] = useState<any[]>([]);
  const [nameuk, setNameuk] = useState('');
  const [nameru, setNameru] = useState('');
  const [art, setArt] = useState('');
  const [descriptionuk, setDescriptionuk] = useState('');
  const [descriptionru, setDescriptionru] = useState('');
  const [characteristicsuk, setCharacteristicsuk] = useState<
    { ukTitle: string; ukDescription: string }[]
  >([]);

  const [characteristicsru, setCharacteristicsru] = useState<
    { ruTitle: string; ruDescription: string }[]
  >([]);

  const [productRecognitions, setProductRecognitions] = useState<{ recognitionId: number }[]>([]);

  useEffect(() => {}, [productRecognitions]);

  const updateCharacteristik = () => {
    const newCharacteristicsuk = characteristicsuk.filter((x) => x.ukTitle != 'Призначення');
    const newCharacteristicsru = characteristicsru.filter((x) => x.ruTitle != 'Назначення');
    let newUkDescription = '';
    let newRuDescription = '';
    productRecognitions.forEach((x, index) => {
      const selectRecognitions: any = recognition.find((j: any) => j.id == x.recognitionId);
      newUkDescription += (index == 0 ? '' : ', ') + selectRecognitions.nameuk;
      newRuDescription += (index == 0 ? '' : ', ') + selectRecognitions.nameru;
    });
    newCharacteristicsuk.push({
      ukTitle: 'Призначення',
      ukDescription: newUkDescription,
    });
    newCharacteristicsru.push({
      ruTitle: 'Назначение',
      ruDescription: newRuDescription,
    });
    setCharacteristicsuk(newCharacteristicsuk);
    setCharacteristicsru(newCharacteristicsru);
  };

  const addProductRecognitions = async (recognitionId: number) => {
    if (productRecognitions.findIndex((x) => x.recognitionId == recognitionId) == -1) {
      setProductRecognitions([...productRecognitions, { recognitionId: recognitionId }]);
    } else {
      setProductRecognitions(productRecognitions.filter((x) => x.recognitionId != recognitionId));
    }
  };
  useEffect(() => {
    if (productRecognitions.length > 0) updateCharacteristik();
  }, [productRecognitions]);
  const [selectedBrend, setSelectedBrend] = useState('');
  const [selectLinia, setSelectLinia] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isForMan, setIsForMan] = useState<null | true | false | undefined>(null);
  const [subcategoryId, setSubcategoryId] = useState<number>(0);
  const [volume, setVolume] = useState<VolumeItem[]>([
    {
      id: null,
      volume: '',
      nameVolume: '',
      price: '',
      discount: '',
      priceWithDiscount: '',
      metaTitleuk: '',
      metaDescriptionuk: '',
      canonicaluk: '',
      metaTitleru: '',
      metaDescriptionru: '',
      canonicalru: '',
      images: [], // Замінили null на порожній масив
      isDelete: false,
      isAvailability: 'inStock',
      sort: null,
      art: '',
      isFreeDelivery: false,
    },
  ]); // Стан для volume
  const [isDiscount, setIsDiscount] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isNovetly, setIsNovetly] = useState(false);
  const [isHit, setIsHit] = useState(false);
  const [isFreeDelivery, setIsFreeDelivery] = useState(false);
  const [createdAt, setCreatedAt] = useState<string>('');
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [views, setViews] = useState<number>(0);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isFeed, setIsFeed] = useState<boolean>(false);

  const [isPruznacheniaOpen, setIsPruznacheniaOpen] = useState(false);

  const [video, setVideo] = useState<string>('');
  const [selectedFilters, setSelectedFilters] = useState<FilterValue[]>(
    filters.map((filter) => ({
      filterCategoryId: filter.id,
      valueuk: '', // Початково порожній рядок
      valueru: '', // Початково порожній рядок
    }))
  );
  function mapToFilterValues(data: any[], filters: FilterCategory[]): FilterValue[] {
    const res = filters.map((item) => {
      if (data.find((x) => item.id == x.filterCategoryId)) {
        return {
          filterCategoryId: item.id,
          valueuk: data.find((x) => item.id == x.filterCategoryId).valueuk,
          valueru: data.find((x) => item.id == x.filterCategoryId).valueru,
        };
      } else {
        return {
          filterCategoryId: item.id,
          valueuk: '',
          valueru: '',
        };
      }
    });
    return res;
  }
  /*
({
          filterCategoryId: item.filterCategoryId,
          valueuk: item.valueuk,
          valueru: item.valueru
        })
*/
  const handleFilterChange = (categoryId: number, value: string, lang: 'uk' | 'ru') => {
    setSelectedFilters((prevFilters) => {
      const newFilters = [...prevFilters];
      const filter = newFilters.find((f) => f.filterCategoryId === categoryId);

      if (filter) {
        if (lang === 'uk') {
          filter.valueuk = value;
        } else {
          filter.valueru = value;
        }
      }
      return newFilters;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, brendsRes, countriesRes, linia]: any = await Promise.all([
          $authHost.get(getCategoryUrl),
          $authHost.get(getBrendUrl),
          $authHost.get(getCountryUrl),
          $authHost.get(getLinia),
        ]);
        setCategories(
          categoriesRes.data.res.sort((a: any, b: any) => a.nameuk.localeCompare(b.nameuk, 'uk'))
        );

        setBrends(brendsRes.data.sort((a: any, b: any) => a.name.localeCompare(b.name)));
        setCountries(
          countriesRes.data.res.sort((a: any, b: any) => a.nameuk.localeCompare(b.nameuk, 'uk'))
        );
        if (linia) setLinia(linia.data.sort((a: any, b: any) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const fetchSubcategoriesAndFilters = async (categoryId: string) => {
    try {
      const [subcategoriesRes, filtersRes, recognition]: any = await Promise.all([
        $authHost.get(`${getSubcategoryUrl}?categoryId=${categoryId}`),
        $authHost.get(`${getFilterUrl}?categoryId=${categoryId}`),
        $authHost.get(`${getRecognition}?categoryId=${categoryId}`),
      ]);
      setFilters(filtersRes.data.res);
      setSubcategories(
        subcategoriesRes.data.res.sort((a: any, b: any) => a.nameuk.localeCompare(b.nameuk, 'uk'))
      );
      setRecognition(
        recognition.data.sort((a: any, b: any) => a.nameuk.localeCompare(b.nameuk, 'uk'))
      );

      // ініціалізація filterValues з правильними індексами
      setSelectedFilters(
        filtersRes.data.res.map((filter: FilterCategory) => ({
          filterCategoryId: filter.id,
          valueuk: '',
          valueru: '',
        }))
      );
    } catch (error) {
      console.error('Error fetching subcategories or filters:', error);
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value) fetchSubcategoriesAndFilters(value);
  };

  const handleVolumeChange = (
    index: number,
    key: keyof VolumeItem | 'volumeuk' | 'volumeru',
    value: any
  ) => {
    const newVolume = [...volume];
    const current = newVolume[index];

    if (key === 'discount') {
      current.discount = value;
      const price = parseFloat(current.price);
      const discount = parseFloat(value);

      if (!isNaN(price) && !isNaN(discount)) {
        current.priceWithDiscount = (price - (price * discount) / 100).toFixed(2);
      }
    } else if (key === 'priceWithDiscount') {
      current.priceWithDiscount = value;
      const price = parseFloat(current.price);
      const priceWithDiscount = parseFloat(value);

      if (!isNaN(price) && price !== 0 && !isNaN(priceWithDiscount)) {
        current.discount = (100 - (priceWithDiscount * 100) / price).toFixed(2);
      }
    } else if (key == 'volumeuk' || key == 'volumeru') {
      if (current.volume.includes('||')) {
        let [volumeuk, volumeru] = current.volume.split('||');
        if (key == 'volumeuk') {
          current.volume = value + '||' + volumeru;
        } else current.volume = volumeuk + '||' + value;
      } else if (key == 'volumeuk') {
        current.volume = value + '||' + ' ';
      } else {
        current.volume = ' ' + '||' + value;
      }
    } else {
      (current as any)[key] = value; // <-- типізація через any тут вирішує помилку
    }

    setVolume(newVolume);
  };

  const addVolumeField = () => {
    setVolume([
      ...volume,
      {
        id: null,
        volume: '',
        nameVolume: '',
        price: '',
        discount: '',
        priceWithDiscount: '',
        metaTitleuk: '',
        metaDescriptionuk: '',
        canonicaluk: '',
        metaTitleru: '',
        metaDescriptionru: '',
        canonicalru: '',
        images: [], // Замінили null на порожній масив
        isDelete: false,
        isAvailability: 'inStock',
        sort: null,
        art: '',
        isFreeDelivery: false,
      },
    ]);
  };

  const handleImageChange = (index: number, files: FileList) => {
    const newVolume = [...volume];
    const fileArray = Array.from(files); // Перетворюємо FileList на масив

    // Перезаписуємо зображення для конкретної варіації
    fileArray.forEach((x) => newVolume[index].images.push({ img: x, altru: '', altuk: '' })); // Перезаписуємо, а не додаємо

    setVolume(newVolume); // Оновлюємо стейт
  };

  const handleCharacteristicChange = (
    index: number,
    value: string,
    lang: 'uk' | 'ru',
    field: 'title' | 'description'
  ) => {
    if (lang === 'uk') {
      const newCharacteristicsuk = [...characteristicsuk];
      if (field === 'title') {
        newCharacteristicsuk[index].ukTitle = value;
      } else {
        newCharacteristicsuk[index].ukDescription = value;
      }
      setCharacteristicsuk(newCharacteristicsuk);
    } else {
      const newCharacteristicsru = [...characteristicsru];
      if (field === 'title') {
        newCharacteristicsru[index].ruTitle = value;
      } else {
        newCharacteristicsru[index].ruDescription = value;
      }
      setCharacteristicsru(newCharacteristicsru);
    }
  };

  const generateCharacteristicHTMLuk = () => {
    return (
      '<ul>' +
      characteristicsuk
        .map((char) => `<li><p>${char.ukTitle}</p><span>${char.ukDescription}</span></li>`)
        .join('') +
      '</ul>'
    );
  };

  const generateCharacteristicHTMLru = () => {
    return (
      '<ul>' +
      characteristicsru
        .map((char) => `<li><p>${char.ruTitle}</p><span>${char.ruDescription}</span></li>`)
        .join('') +
      '</ul>'
    );
  };
  const router = useRouter();
  console.log(43434, productRecognitions);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let isImgs = true;
    volume.forEach((x) => {
      if (x.images.length == 0) isImgs = false;
    });
    if (!isImgs) {
      alert('Нема всіх фото!');
      return;
    }

    const formData = new FormData();
    formData.append('nameuk', nameuk);
    formData.append('nameru', nameru);
    formData.append('nameTypeuk', nameTypeuk);
    formData.append('nameTyperu', nameTyperu);
    formData.append('art', art);
    formData.append('descriptionuk', descriptionuk.replaceAll(`<p><br></p>`, ''));
    formData.append('descriptionru', descriptionru.replaceAll(`<p><br></p>`, ''));
    if (generateCharacteristicHTMLuk())
      formData.append('characteristicuk', generateCharacteristicHTMLuk());
    if (generateCharacteristicHTMLru())
      formData.append('characteristicru', generateCharacteristicHTMLru());
    console.log(43434, productRecognitions, JSON.stringify(productRecognitions));
    formData.append('brendId', selectedBrend);
    formData.append('categoryId', selectedCategory);
    formData.append('countryMadeId', selectedCountry);
    formData.append('subcategoryId', subcategoryId.toString());
    formData.append('isFeed', isFeed.toString());
    formData.append('isDiscount', isDiscount.toString());
    formData.append('isBestseller', isBestseller.toString());
    formData.append('isNovetly', isNovetly.toString());
    formData.append('isHit', isHit.toString());
    formData.append('isFreeDelivery', isFreeDelivery.toString());
    formData.append('isShow', isShow.toString());
    formData.append('liniaId', selectLinia);
    formData.append('productRecognitions', JSON.stringify(productRecognitions));
    formData.append(
      'isForMan',
      isForMan == null || isForMan == undefined ? 'null' : isForMan.toString()
    );
    // Масив всіх зображень
    let allImages: any = [];

    // Перебір варіацій і додавання зображень у загальний масив
    volume.forEach((vol) => {
      vol.images.forEach((img) => {
        allImages.push(img.img); // Додаємо зображення в загальний масив
      });
    });

    // Формуємо новий volume з індексами зображень, скидаючи індекси на 0, 1, 2...
    const updatedVolume = volume.map((vol) => {
      const imageIndexes: any = [];

      // Просто присвоюємо індекси від 0 для кожного зображення в масиві
      vol.images.forEach((img, index) => {
        imageIndexes.push(index); // Додаємо індекс як просто порядковий номер
      });
      const volumeInfo: any = [];
      vol.images.forEach((img, index) => {
        volumeInfo.push({ index, altuk: img.altuk, altru: img.altru });
      });
      return {
        ...vol,
        images: imageIndexes, // Замість зображень, передаємо їх індекси від 0, 1, 2...
        volumeInfo,
      };
    });

    formData.append('volume', JSON.stringify(updatedVolume));

    formData.append('filters', JSON.stringify(selectedFilters));

    if (video) formData.append('video', video);
    // Додаємо файли для кожної варіації
    volume.forEach((vol, index) => {
      vol.images.forEach((img, i) => {
        if (typeof img.img != 'string') formData.append(`imgs[${index}][${i}]`, img.img);
      });
    });

    try {
      const res = await $authHost.post('goods/add', formData);
      if (res.status == 283) alert('Артикул зайнятий');
      else router.replace(`/goods/${res.data.product.volumes[0].url}`);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Сталася помилка при добавлені товару (скоріш за все пропущені якісь поля).');
    }
  };

  useEffect(() => {}, [volume]);

  const setVolumeImages = (
    indexVolume: number,
    indexImg: number,
    key: 'altuk' | 'altru',
    value: string
  ) => {
    const updatedVolume = [...volume]; // копія всього volume
    const updatedImages = [...updatedVolume[indexVolume].images]; // копія images масиву
    const updatedImage = { ...updatedImages[indexImg], [key]: value }; // копія одного зображення з оновленим alt
    updatedImages[indexImg] = updatedImage;

    updatedVolume[indexVolume] = {
      ...updatedVolume[indexVolume],
      images: updatedImages,
    };

    setVolume(updatedVolume);
  };

  const delImg = (indexVolume: number, indexImage: number) => {
    const updatedVolume = [...volume]; // створюємо копію масиву
    const updatedImages = [...updatedVolume[indexVolume].images]; // копія зображень
    updatedImages.splice(indexImage, 1); // видаляємо потрібне зображення
    updatedVolume[indexVolume] = {
      ...updatedVolume[indexVolume],
      images: updatedImages,
    };
    setVolume(updatedVolume);
  };
  const deleteVolume = (index: number) => {
    setVolume((prev) => prev.filter((_, i) => i !== index));
  };

  const setIsForMan2 = (value: null | undefined | true | false) => {
    setIsForMan(value);
    if (value === undefined) {
      const newCharacteristicsuk = characteristicsuk.filter((x) => x.ukTitle != 'Стать');
      const newCharacteristicsru = characteristicsru.filter((x) => x.ruTitle != 'Пол');
      setCharacteristicsuk(newCharacteristicsuk);
      setCharacteristicsru(newCharacteristicsru);
    } else {
      const newCharacteristicsuk = characteristicsuk.filter((x) => x.ukTitle != 'Стать');
      const newCharacteristicsru = characteristicsru.filter((x) => x.ruTitle != 'Пол');
      let newUkDescription =
        value == null ? 'Унісекс' : value == true ? 'Для чоловіків' : 'Для жінок';

      let newRUDescription =
        value == null ? 'Унисекс' : value == true ? 'Для мужчин' : 'Для женщин';
      newCharacteristicsuk.push({
        ukTitle: 'Стать',
        ukDescription: newUkDescription,
      });
      newCharacteristicsru.push({
        ruTitle: 'Пол',
        ruDescription: newRUDescription,
      });
      setCharacteristicsuk(newCharacteristicsuk);
      setCharacteristicsru(newCharacteristicsru);
    }
  };
  const setSelectedCountry2 = (value: string) => {
    setSelectedCountry(value);
    const newCharacteristicsuk = characteristicsuk.filter(
      (x) => x.ukTitle != 'Країна виробника' && x.ukTitle != 'Країна виробника:'
    );
    const newCharacteristicsru = characteristicsru.filter(
      (x) => x.ruTitle != 'Страна производитель' && x.ruTitle != 'Страна производитель:'
    );
    let newUkDescription = countries.find((x) => x.id == value)?.nameuk as string;

    let newRUDescription = countries.find((x) => x.id == value)?.nameru as string;

    newCharacteristicsuk.push({
      ukTitle: 'Країна виробника',
      ukDescription: newUkDescription,
    });
    newCharacteristicsru.push({
      ruTitle: 'Страна производитель',
      ruDescription: newRUDescription,
    });
    setCharacteristicsuk(newCharacteristicsuk);
    setCharacteristicsru(newCharacteristicsru);
  };
  const setSelectedBrend2 = (value: string) => {
    setSelectedBrend(value);
    const newCharacteristicsuk = characteristicsuk.filter(
      (x) => x.ukTitle != 'Виробник' && x.ukTitle != 'Виробник:'
    );
    const newCharacteristicsru = characteristicsru.filter(
      (x) => x.ruTitle != 'Производитель' && x.ruTitle != 'Производитель:'
    );
    let newUkDescription = brends.find((x) => x.id == value)?.name as string;

    let newRUDescription = brends.find((x) => x.id == value)?.name as string;

    newCharacteristicsuk.push({
      ukTitle: 'Виробник',
      ukDescription: newUkDescription,
    });
    newCharacteristicsru.push({
      ruTitle: 'Производитель',
      ruDescription: newRUDescription,
    });
    setCharacteristicsuk(newCharacteristicsuk);
    setCharacteristicsru(newCharacteristicsru);
  };

  const [searchLinia, setSearchLinia] = useState('');
  const [isOpenLiniaSearch, setIsOpenLiniaSearch] = useState(false);

  const setSelectedLinia2 = (value: string) => {
    setSelectLinia(value);
    if (value) {
      const newCharacteristicsuk = characteristicsuk.filter((x: any) => x.ukTitle != 'Лінія');
      const newCharacteristicsru = characteristicsru.filter((x: any) => x.ruTitle != 'Линия');

      let newUkDescription = linia.find((x: any) => x.id == value).name;

      let newRUDescription = linia.find((x: any) => x.id == value).name;

      newCharacteristicsuk.push({
        ukTitle: 'Лінія',
        ukDescription: newUkDescription,
      });
      newCharacteristicsru.push({
        ruTitle: 'Линия',
        ruDescription: newRUDescription,
      });
      setCharacteristicsuk(newCharacteristicsuk);
      setCharacteristicsru(newCharacteristicsru);
    }
  };

  const [searchBrend, setSearchBrend] = useState('');
  const [isOpenBrendSearch, setIsOpenBrendSearch] = useState(false);

  return (
    <div className="update-product-form">
      <h2 className="add-product-title">Добавити товар</h2>
      <form onSubmit={handleSubmit} className="form">
        <p className="title">Назва товару (укр)</p>
        <input
          type="text"
          placeholder="Назва товару (укр)"
          value={nameuk}
          onChange={(e) => setNameuk(e.target.value)}
          className="input"
          required
        />

        <p className="title">Назва товару (рос)</p>
        <input
          type="text"
          placeholder="Назва товару (рос)"
          value={nameru}
          onChange={(e) => setNameru(e.target.value)}
          className="input"
          required
        />
        <div style={{ fontSize: '16px', fontWeight: '500' }} className="row checkbox">
          У фід?{' '}
          <input type="checkbox" checked={isFeed} onChange={(e) => setIsFeed(e.target.checked)} />
        </div>
        <br />
        <p className="title">Посилання на відео з ютубу.</p>
        <input
          type="text"
          placeholder="Посилання на відео з ютубу."
          value={video}
          onChange={(e) => setVideo(e.target.value)}
          className="input"
        />
        <p className="title">Опис товару (укр)</p>
        {/*<ReactQuill
          value={descriptionuk} // Відображаємо введений текст
          onChange={(value) => setDescriptionuk(value)} // Функція для обробки змін
          modules={{
            toolbar: [
              [{ header: '1' }, { header: '2' }, { font: [] }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ align: [] }],
              ['bold', 'italic', 'underline'],
              ['link', 'image'],
              ['clean'],
            ],
          }} // Параметри панелі інструментів (вибір шрифтів, товщина, кольори, вставка зображень)
          formats={[
            'header',
            'font',
            'size',
            'bold',
            'italic',
            'underline',
            'align',
            'list',
            'bullet',
            'link',
            'image',
          ]}
          placeholder="Опис товару (укр)"
          className="quill-editor" // Якщо хочете додатково стилізувати через клас
        />*/}
        <MyJoditEditor
          value={descriptionuk}
          setValue={setDescriptionuk}
          placeholder=">Опис товару (укр)"
          name={'descriptionuk'}
        />
        <br />

        <p className="title">Опис товару (рос)</p>

        <MyJoditEditor
          value={descriptionru}
          setValue={setDescriptionru}
          placeholder=">Опис товару (ru)"
          name={'descriptionru'}
        />

        <h3 className="sub-title">Характеристики (укр)</h3>
        {characteristicsuk.map((_, index) => (
          <div key={index} className="characteristics">
            <input
              type="text"
              placeholder="Заголовок (укр)"
              value={characteristicsuk[index].ukTitle}
              onChange={(e) => handleCharacteristicChange(index, e.target.value, 'uk', 'title')}
              className="input"
              required
            />
            <input
              type="text"
              placeholder="Опис (укр)"
              value={characteristicsuk[index].ukDescription}
              onChange={(e) =>
                handleCharacteristicChange(index, e.target.value, 'uk', 'description')
              }
              className="input"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setCharacteristicsuk([...characteristicsuk, { ukTitle: '', ukDescription: '' }])
          }
        >
          Додати характеристику (укр)
        </button>
        <h3 className="sub-title">Характеристики (рос)</h3>
        {characteristicsru.map((_, index) => (
          <div key={index} className="characteristics">
            <input
              type="text"
              placeholder="Заголовок (рос)"
              value={characteristicsru[index].ruTitle}
              onChange={(e) => handleCharacteristicChange(index, e.target.value, 'ru', 'title')}
              className="input"
              required
            />
            <input
              type="text"
              placeholder="Опис (рос)"
              value={characteristicsru[index].ruDescription}
              onChange={(e) =>
                handleCharacteristicChange(index, e.target.value, 'ru', 'description')
              }
              className="input"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setCharacteristicsru([...characteristicsru, { ruTitle: '', ruDescription: '' }])
          }
        >
          Додати характеристику (рос)
        </button>
        <br />
        <br />

        {/* Поля для вибору категорій, брендів і т. д. */}

        <p className="title">Категорія</p>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="input"
        >
          <option value="">Виберіть категорію</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nameuk}
            </option>
          ))}
        </select>
        <p className="title">Підкатегорія</p>
        {subcategories.length > 0 && (
          <select
            value={subcategoryId}
            onChange={(e) => setSubcategoryId(Number(e.target.value))}
            className="input"
          >
            <option value="">Виберіть підкатегорію</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.nameuk}
              </option>
            ))}
          </select>
        )}
        <p className="title">Лінія</p>
        <div className="dropdown-container">
          <input
            placeholder="Пошук лінії"
            type="text"
            className="input"
            value={searchLinia}
            onChange={(e) => setSearchLinia(e.target.value)}
            onFocus={() => setIsOpenLiniaSearch(true)}
          />
          <div className="dropdown">
            {isOpenLiniaSearch && (
              <ul className="input">
                <li
                  onClick={() => {
                    setSelectedLinia2('');
                    setSearchLinia('');
                    setIsOpenLiniaSearch(false);
                  }}
                >
                  Виберіть лінію
                </li>
                {linia
                  .filter((line: any) =>
                    line.name.toLowerCase().includes(searchLinia.toLowerCase())
                  )
                  .map((line: any) => (
                    <li
                      onClick={() => {
                        setSelectedLinia2(line.id);
                        setSearchLinia(line.name);
                        setIsOpenLiniaSearch(false);
                      }}
                      className={line.id == selectLinia ? 'active' : ''}
                      key={line.id}
                    >
                      <p>{line.name}</p>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
        <p className="title">Бренд</p>
        <div className="dropdown-container">
          <input
            placeholder="Пошук Бренда"
            type="text"
            className="input"
            value={searchBrend}
            onChange={(e) => setSearchBrend(e.target.value)}
            onFocus={() => setIsOpenBrendSearch(true)}
          />
          <div className="dropdown">
            {isOpenBrendSearch && (
              <ul className="input">
                <li
                  onClick={() => {
                    setSearchBrend('');
                    setSearchBrend('');
                    setIsOpenBrendSearch(false);
                  }}
                >
                  Виберіть бренд
                </li>
                {brends
                  .filter((line: any) =>
                    line.name.toLowerCase().includes(searchBrend.toLowerCase())
                  )
                  .map((line: any) => (
                    <li
                      onClick={() => {
                        setSelectedBrend2(line.id);
                        setSearchBrend(line.name);
                        setIsOpenBrendSearch(false);
                      }}
                      className={line.id == selectedBrend ? 'active' : ''}
                      key={line.id}
                    >
                      <p>{line.name}</p>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
        <p className="title">Країна виробник</p>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry2(e.target.value)}
          className="input"
        >
          <option value="">Виберіть країну виробника</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.nameuk}
            </option>
          ))}
        </select>
        <div className="pruznachenia">
          <h4 className="title">
            Призначення{' '}
            <div onClick={() => setIsPruznacheniaOpen(!isPruznacheniaOpen)}>
              {!isPruznacheniaOpen ? (
                <span>
                  <FaChevronDown size={15} />
                </span>
              ) : (
                <span>
                  <FaChevronUp size={15} />
                </span>
              )}
            </div>
          </h4>
          {isPruznacheniaOpen && (
            <ul>
              {[...recognition]
                .sort((a: any, b: any) => a.nameru.localeCompare(b.nameru, 'ru'))
                .map((x: any) => (
                  <li key={x.id} onClick={() => addProductRecognitions(x.id)}>
                    <input
                      type="checkbox"
                      readOnly
                      checked={
                        productRecognitions.findIndex((pr) => pr.recognitionId === x.id) !== -1
                      }
                    />
                    <p>{x.nameru}</p>
                  </li>
                ))}
            </ul>
          )}
        </div>
        <br />
        <div className="radio-button">
          <h2>Пол</h2>
          <p onClick={() => setIsForMan2(undefined)}>
            <input readOnly type="radio" checked={isForMan === undefined} /> Не вказано
          </p>
          <p onClick={() => setIsForMan2(null)}>
            <input readOnly type="radio" checked={isForMan === null} /> Унісекс
          </p>
          <p onClick={() => setIsForMan2(true)}>
            <input readOnly type="radio" checked={isForMan == true} /> Для чоловіків
          </p>
          <p onClick={() => setIsForMan2(false)}>
            <input readOnly type="radio" checked={isForMan == false} /> Для жінок
          </p>
        </div>
        <br />
        <div className="row check">
          <p style={{ fontSize: '18px', fontWeight: 500 }}>Показать на сайте</p>
          <input
            style={{ width: '20px' }}
            type="checkbox"
            checked={isShow}
            onChange={(e) => setIsShow(e.target.checked)}
          />
        </div>
        <br />
        <div className="row check">
          <p> Акция</p>
          <input
            type="checkbox"
            checked={isDiscount}
            onChange={(e) => setIsDiscount(e.target.checked)}
          />
        </div>
        <div className="row check">
          <p> Топ</p>
          <input type="checkbox" checked={isHit} onChange={(e) => setIsHit(e.target.checked)} />
        </div>
        <div className="row check">
          <p> Новинка</p>
          <input
            type="checkbox"
            checked={isNovetly}
            onChange={(e) => setIsNovetly(e.target.checked)}
          />
        </div>
        {/*<div className='row check'>
          <p> Це хіт?</p>
          <input
            type='checkbox'
            checked={isHit}
            onChange={e => setIsHit(e.target.checked)}
          />
        </div>*/}

        {filters.map((filter) => (
          <div key={filter.id}>
            <h3>{filter.nameuk}</h3>
            <div>
              <input
                type="text"
                placeholder={`Значення для ${filter.nameuk}`}
                value={selectedFilters.find((f) => f.filterCategoryId === filter.id)?.valueuk || ''}
                onChange={(e) => handleFilterChange(filter.id, e.target.value, 'uk')}
              />
              <input
                type="text"
                placeholder={`Значення для ${filter.nameru}`}
                value={selectedFilters.find((f) => f.filterCategoryId === filter.id)?.valueru || ''}
                onChange={(e) => handleFilterChange(filter.id, e.target.value, 'ru')}
              />
            </div>
          </div>
        ))}
        <br />
        <br />
        <p className="title">
          Назва величини вимірювання, (наприклад: {"Об'єм"}, розмір) українською
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '7.5px',
            cursor: 'pointer',
            marginBottom: '3px',
          }}
          className="row"
        >
          <div
            onClick={() => {
              setNameTypeuk("Об'єм");
              setNameTyperu('Объем');
            }}
          >
            {"об'єм"}
          </div>
          <div
            onClick={() => {
              setNameTypeuk('Розмір');
              setNameTyperu('Размер');
            }}
          >
            розмір
          </div>{' '}
          <div
            onClick={() => {
              setNameTypeuk('Колір');
              setNameTyperu('Цвет');
            }}
          >
            колір
          </div>
        </div>
        <input
          type="text"
          placeholder="Назва товару (укр)"
          value={nameTypeuk}
          onChange={(e) => setNameTypeuk(e.target.value)}
          className="input"
        />
        <p className="title">
          Назва величини вимірювання (наприклад: {"Об'єм"}, розмір) російською
        </p>
        <input
          type="text"
          placeholder="Назва товару (укр)"
          value={nameTyperu}
          onChange={(e) => setNameTyperu(e.target.value)}
          className="input"
        />

        {/* Volume */}
        {volume.map((_, index) =>
          volume[index].isDelete ? null : (
            <div key={index}>
              <div>
                <p className="title">Обсяг (мл) укр</p>
                <input
                  type="text"
                  placeholder="Обсяг (мл)"
                  value={volume[index].volume.split('||')[0] || ''}
                  onChange={(e) => handleVolumeChange(index, 'volumeuk', e.target.value)}
                  className="input"
                  required
                />
                <p className="title">Обсяг (мл) рос</p>
                <input
                  type="text"
                  placeholder="Обсяг (мл)"
                  value={volume[index].volume.split('||')[1] || ''}
                  onChange={(e) => handleVolumeChange(index, 'volumeru', e.target.value)}
                  className="input"
                  required
                />
                <div className="avability">
                  <div className="row">
                    <p>Показувати</p>
                    <input
                      type="string"
                      value={volume[index].sort ? volume[index].sort : ''}
                      onChange={(e) => {
                        handleVolumeChange(index, 'sort', Number(e.target.value));
                      }}
                    />
                  </div>
                </div>
                <div className="avability">
                  <div className="row">
                    <p>В наявності:</p>
                    <input
                      type="radio"
                      checked={volume[index].isAvailability == 'inStock'}
                      onClick={() => handleVolumeChange(index, 'isAvailability', 'inStock')}
                      readOnly
                    />
                  </div>
                  <div className="row">
                    <p>Під замовлення:</p>
                    <input
                      type="radio"
                      checked={volume[index].isAvailability == 'customMade'}
                      onClick={() => handleVolumeChange(index, 'isAvailability', 'customMade')}
                      readOnly
                    />
                  </div>
                  <div className="row">
                    <p>Нема в наявності:</p>
                    <input
                      type="radio"
                      checked={volume[index].isAvailability == 'notAvailable'}
                      readOnly
                      onClick={() => handleVolumeChange(index, 'isAvailability', 'notAvailable')}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }} className="row">
                  Безкоштовна доставка
                  <input
                    type="checkbox"
                    checked={volume[index].isFreeDelivery}
                    onChange={(e) => handleVolumeChange(index, 'isFreeDelivery', e.target.checked)}
                  />
                </div>
                <br />
                <p className="title">Артикул</p>
                <input
                  type="text"
                  placeholder="art"
                  value={volume[index].art}
                  onChange={(e) => handleVolumeChange(index, 'art', e.target.value)}
                  className="input"
                  required
                />
                <p className="title">metaTitle uk</p>
                <input
                  type="text"
                  placeholder="metaTitle uk"
                  value={volume[index].metaTitleuk}
                  onChange={(e) => handleVolumeChange(index, 'metaTitleuk', e.target.value)}
                  className="input"
                />
                <p className="title">metaTitle ru</p>
                <input
                  type="text"
                  placeholder="metaTitle ru"
                  value={volume[index].metaTitleru}
                  onChange={(e) => handleVolumeChange(index, 'metaTitleru', e.target.value)}
                  className="input"
                />
                <p className="title">metaDescription uk</p>
                <input
                  type="text"
                  placeholder="metaDescription uk"
                  value={volume[index].metaDescriptionuk}
                  onChange={(e) => handleVolumeChange(index, 'metaDescriptionuk', e.target.value)}
                  className="input"
                />
                <p className="title">metaDescription ru</p>
                <input
                  type="text"
                  placeholder="metaDescription ru"
                  value={volume[index].metaDescriptionru}
                  onChange={(e) => handleVolumeChange(index, 'metaDescriptionru', e.target.value)}
                  className="input"
                />
                <p className="title">canonical uk</p>
                <input
                  type="text"
                  placeholder="canonical uk"
                  value={volume[index].canonicaluk}
                  onChange={(e) => handleVolumeChange(index, 'canonicaluk', e.target.value)}
                  className="input"
                />
                <p className="title">canonical ru</p>
                <input
                  type="text"
                  placeholder="canonical ru"
                  value={volume[index].canonicalru}
                  onChange={(e) => handleVolumeChange(index, 'canonicalru', e.target.value)}
                  className="input"
                />
                <p className="title">Ціна</p>
                <input
                  type="text"
                  placeholder="Ціна"
                  value={volume[index].price}
                  onChange={(e) => handleVolumeChange(index, 'price', e.target.value)}
                  className="input"
                  required
                />
                <p className="title">Знижка</p>
                <input
                  type="text"
                  placeholder="Знижка"
                  value={volume[index].discount}
                  onChange={(e) => handleVolumeChange(index, 'discount', e.target.value)}
                  className="input"
                />
                <p className="title">Ціна зі знижкою</p>
                <input
                  type="text"
                  placeholder="Ціна зі знижкою"
                  value={volume[index].priceWithDiscount}
                  onChange={(e) => handleVolumeChange(index, 'priceWithDiscount', e.target.value)}
                  className="input"
                  required
                />
                <input
                  type="file"
                  multiple // дозволяє вибирати кілька файлів
                  onChange={(e) => handleImageChange(index, e.target.files!)}
                  className="input"
                />
                {volume[index].images.map((x, indexVolume: number) => (
                  <div
                    key={indexVolume}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      marginBottom: '15px',
                    }}
                  >
                    {typeof x.img === 'string' ? (
                      <img
                        width={100}
                        src={process.env.NEXT_PUBLIC_SERVER + x.img}
                        alt="preview"
                        className="h-24 w-24 rounded object-cover"
                      />
                    ) : Array.isArray(x.img) ? (
                      x.img.map((file, index) => {
                        if (file instanceof Uint8Array) {
                          const blob = new Blob([file] as any, {
                            type: 'image/png',
                          });
                          const url = URL.createObjectURL(blob);
                          return (
                            <img
                              key={index}
                              width={50}
                              src={url}
                              alt={`preview-${index}`}
                              className="h-24 w-24 rounded object-cover"
                            />
                          );
                        } else if (file instanceof Blob) {
                          const url = URL.createObjectURL(file);
                          return (
                            <img
                              key={index}
                              width={50}
                              src={url}
                              alt={`preview-${index}`}
                              className="h-24 w-24 rounded object-cover"
                            />
                          );
                        }
                        return null;
                      })
                    ) : x.img instanceof Uint8Array ? (
                      (() => {
                        const blob = new Blob([x.img], { type: 'image/png' });
                        const url = URL.createObjectURL(blob);
                        return (
                          <img
                            width={100}
                            src={url}
                            alt="preview"
                            className="h-24 w-24 rounded object-cover"
                          />
                        );
                      })()
                    ) : x.img instanceof Blob ? (
                      (() => {
                        const url = URL.createObjectURL(x.img);
                        return (
                          <img
                            width={100}
                            src={url}
                            alt="preview"
                            className="h-24 w-24 rounded object-cover"
                          />
                        );
                      })()
                    ) : null}

                    <label>alt ua</label>
                    <input
                      onChange={(e) => setVolumeImages(index, indexVolume, 'altuk', e.target.value)}
                      value={volume[index].images[indexVolume].altuk}
                      type="text"
                    />
                    <label>alt ru</label>
                    <input
                      onChange={(e) => setVolumeImages(index, indexVolume, 'altru', e.target.value)}
                      type="text"
                      value={volume[index].images[indexVolume].altru}
                    />
                    <button
                      style={{ alignItems: 'center', margin: '0' }}
                      type="button"
                      onClick={() => delImg(index, indexVolume)}
                    >
                      del
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => deleteVolume(index)}
                  style={{ backgroundColor: 'red', marginBottom: '20px' }}
                >
                  Удалить товар
                </button>
              </div>
            </div>
          )
        )}

        <button type="button" onClick={addVolumeField}>
          Добавить товар
        </button>

        {/* Submit button */}
        <button style={{ marginLeft: '40px' }} type="submit">
          Сохранить товар
        </button>
      </form>
    </div>
  );
};

export default AddGoodsPage;

/*'use client';
import React, { useState, useEffect } from 'react';
import { $authHost } from '@/app/http';
import './AddProduct.scss';
import ReactQuill from 'react-quill'; // Імпортуємо ReactQuill
import 'react-quill/dist/quill.snow.css'; // Імпортуємо стилі для редактора

interface Category {
  id: string;
  nameuk: string;
}

interface Subcategory {
  id: number;
  nameuk: string;
}

interface FilterCategory {
  id: number;
  nameuk: string;
  nameru: string;
}

interface FilterValue {
  filterCategoryId: number;
  valueuk: string;
  valueru: string;
}

interface Brend {
  id: string;
  name: string;
}

interface Country {
  id: string;
  nameuk: string;
}

interface VolumeItem {
  volume: string;
  nameVolume: string;
  price: string;
  discount: string;
  priceWithDiscount: string;
  metaTitleuk: string;
  metaDescriptionuk: string;
  canonicaluk: string;
  metaTitleru: string;
  metaDescriptionru: string;
  canonicalru: string;
  images: { img: File; altuk: string; altru: string }[];
  isAvailability: 'inStock' | 'notAvailable' | 'customMade';
  isFreeDelivery: boolean;
  art: string;
}

const getCategoryUrl = 'category/get';
const getSubcategoryUrl = 'subcategory/get';
const getFilterUrl = 'filterCategory/getCategoryFilter';
const getBrendUrl = 'brend/get';
const getCountryUrl = 'countryMade/getCountryMade';

const AddGoodsPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filters, setFilters] = useState<FilterCategory[]>([]);
  const [brends, setBrends] = useState<Brend[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [nameuk, setNameuk] = useState('');
  const [nameru, setNameru] = useState('');
  const [descriptionuk, setDescriptionuk] = useState('');
  const [descriptionru, setDescriptionru] = useState('');
  const [characteristicsuk, setCharacteristicsuk] = useState<
    { ukTitle: string; ukDescription: string }[]
  >([
    {
      ukTitle: 'Виробник:',
      ukDescription: '',
    },
    {
      ukTitle: 'Країна виробник:',
      ukDescription: '',
    },
  ]);

  const [characteristicsru, setCharacteristicsru] = useState<
    { ruTitle: string; ruDescription: string }[]
  >([
    {
      ruTitle: 'Производитель:',
      ruDescription: '',
    },
    {
      ruTitle: 'Страна производитель:',
      ruDescription: '',
    },
  ]);

  const [selectedBrend, setSelectedBrend] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [subcategoryId, setSubcategoryId] = useState<number>(0);
  const [volume, setVolume] = useState<VolumeItem[]>([]); // Стан для volume
  const [isDiscount, setIsDiscount] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isNovetly, setIsNovetly] = useState(false);
  const [isHit, setIsHit] = useState(false);
  const [isFreeDelivery, setIsFreeDelivery] = useState(false);

  const [video, setVideo] = useState<string>('');
  const [images, setImages] = useState<FileList | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<FilterValue[]>(
    filters.map((filter) => ({
      filterCategoryId: filter.id,
      valueuk: '', // Початково порожній рядок
      valueru: '', // Початково порожній рядок
    })),
  );
  const handleFilterChange = (
    categoryId: number,
    value: string,
    lang: 'uk' | 'ru',
  ) => {
    setSelectedFilters((prevFilters) => {
      const newFilters = [...prevFilters];
      const filter = newFilters.find((f) => f.filterCategoryId === categoryId);
      if (filter) {
        if (lang === 'uk') {
          filter.valueuk = value;
        } else {
          filter.valueru = value;
        }
      }
      return newFilters;
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, brendsRes, countriesRes]: any = await Promise.all(
          [
            $authHost.get(getCategoryUrl),
            $authHost.get(getBrendUrl),
            $authHost.get(getCountryUrl),
          ],
        );
        setCategories(categoriesRes.data.res);
        setBrends(brendsRes.data);
        setCountries(countriesRes.data.res);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const fetchSubcategoriesAndFilters = async (categoryId: string) => {
    try {
      const [subcategoriesRes, filtersRes]: any = await Promise.all([
        $authHost.get(`${getSubcategoryUrl}?categoryId=${categoryId}`),
        $authHost.get(`${getFilterUrl}?categoryId=${categoryId}`),
      ]);
      setSubcategories(subcategoriesRes.data.res);
      setFilters(filtersRes.data.res);

      // ініціалізація filterValues з правильними індексами
      setSelectedFilters(
        filtersRes.data.res.map((filter: FilterCategory) => ({
          filterCategoryId: filter.id,
          valueuk: '',
          valueru: '',
        })),
      );
    } catch (error) {
      console.error('Error fetching subcategories or filters:', error);
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value) fetchSubcategoriesAndFilters(value);
  };

  const handleVolumeChange = (
    index: number,
    key: keyof VolumeItem,
    value: any,
  ) => {
    const newVolume = [...volume];
    const current = newVolume[index];

    if (key === 'discount') {
      current.discount = value;
      const price = parseFloat(current.price);
      const discount = parseFloat(value);

      if (!isNaN(price) && !isNaN(discount)) {
        current.priceWithDiscount = (price - (price * discount) / 100).toFixed(
          2,
        );
      }
    } else if (key === 'priceWithDiscount') {
      current.priceWithDiscount = value;
      const price = parseFloat(current.price);
      const priceWithDiscount = parseFloat(value);

      if (!isNaN(price) && price !== 0 && !isNaN(priceWithDiscount)) {
        current.discount = (100 - (priceWithDiscount * 100) / price).toFixed(2);
      }
    } else {
      (current as any)[key] = value; // <-- типізація через any тут вирішує помилку
    }

    setVolume(newVolume);
  };

  const addVolumeField = () => {
    setVolume([
      ...volume,
      {
        volume: '',
        nameVolume: '',
        price: '',
        discount: '',
        priceWithDiscount: '',
        metaTitleuk: '',
        metaDescriptionuk: '',
        canonicaluk: '',
        metaTitleru: '',
        metaDescriptionru: '',
        canonicalru: '',
        images: [], // Замінили null на порожній масив
        isAvailability: 'inStock',
        art: '',
        isFreeDelivery: false,
      },
    ]);
  };

  const handleImageChange = (index: number, files: FileList) => {
    const newVolume = [...volume];
    const fileArray = Array.from(files); // Перетворюємо FileList на масив

    // Перезаписуємо зображення для конкретної варіації
    fileArray.forEach((x) =>
      newVolume[index].images.push({ img: x, altru: '', altuk: '' }),
    ); // Перезаписуємо, а не додаємо

    setVolume(newVolume); // Оновлюємо стейт
  };

  const handleCharacteristicChange = (
    index: number,
    value: string,
    lang: 'uk' | 'ru',
    field: 'title' | 'description',
  ) => {
    if (lang === 'uk') {
      const newCharacteristicsuk = [...characteristicsuk];
      if (field === 'title') {
        newCharacteristicsuk[index].ukTitle = value;
      } else {
        newCharacteristicsuk[index].ukDescription = value;
      }
      setCharacteristicsuk(newCharacteristicsuk);
    } else {
      const newCharacteristicsru = [...characteristicsru];
      if (field === 'title') {
        newCharacteristicsru[index].ruTitle = value;
      } else {
        newCharacteristicsru[index].ruDescription = value;
      }
      setCharacteristicsru(newCharacteristicsru);
    }
  };

  const generateCharacteristicHTMLuk = () => {
    return (
      '<ul>' +
      characteristicsuk
        .map(
          (char) =>
            `<li><p>${char.ukTitle}</p><span>${char.ukDescription}</span></li>`,
        )
        .join('') +
      '</ul>'
    );
  };

  const generateCharacteristicHTMLru = () => {
    return (
      '<ul>' +
      characteristicsru
        .map(
          (char) =>
            `<li><p>${char.ruTitle}</p><span>${char.ruDescription}</span></li>`,
        )
        .join('') +
      '</ul>'
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (volume.length == 0) {
      alert('не можна додати товар без обсягу');
      return;
    }
    const formData = new FormData();
    formData.append('nameuk', nameuk);
    formData.append('nameru', nameru);
    formData.append('descriptionuk', descriptionuk);
    formData.append('descriptionru', descriptionru);
    formData.append('characteristicuk', generateCharacteristicHTMLuk());
    formData.append('characteristicru', generateCharacteristicHTMLru());

    formData.append('brendId', selectedBrend);
    formData.append('categoryId', selectedCategory);
    formData.append('countryMadeId', selectedCountry);
    formData.append('subcategoryId', subcategoryId.toString());

    formData.append('isDiscount', isDiscount.toString());
    formData.append('isBestseller', isBestseller.toString());
    formData.append('isNovetly', isNovetly.toString());
    formData.append('isHit', isHit.toString());
    formData.append('isFreeDelivery', isFreeDelivery.toString());
    // Масив всіх зображень
    let allImages: any = [];

    // Перебір варіацій і додавання зображень у загальний масив
    volume.forEach((vol) => {
      vol.images.forEach((img) => {
        allImages.push(img.img); // Додаємо зображення в загальний масив
      });
    });

    // Формуємо новий volume з індексами зображень, скидаючи індекси на 0, 1, 2...
    const updatedVolume = volume.map((vol) => {
      const imageIndexes: any = [];

      // Просто присвоюємо індекси від 0 для кожного зображення в масиві
      vol.images.forEach((img, index) => {
        imageIndexes.push(index); // Додаємо індекс як просто порядковий номер
      });
      const volumeInfo: any = [];
      vol.images.forEach((img, index) => {
        volumeInfo.push({ index, altuk: img.altuk, altru: img.altru });
      });
      return {
        ...vol,
        images: imageIndexes, // Замість зображень, передаємо їх індекси від 0, 1, 2...
        volumeInfo,
      };
    });

    formData.append('volume', JSON.stringify(updatedVolume));

    formData.append('filters', JSON.stringify(selectedFilters));

    if (video) formData.append('video', video);
    // Додаємо файли для кожної варіації
    volume.forEach((vol, index) => {
      vol.images.forEach((img, i) => {
        formData.append(`imgs[${index}][${i}]`, img.img);
      });
    });

    try {
      await $authHost.post('goods/add', formData);
      alert('Товар додано успішно!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Сталася помилка при додаванні товару.');
    }
  };

  useEffect(() => {}, [volume]);

  const setVolumeImages = (
    indexVolume: number,
    indexImg: number,
    key: 'altuk' | 'altru',
    value: string,
  ) => {
    const updatedVolume = [...volume]; // копія всього volume
    const updatedImages = [...updatedVolume[indexVolume].images]; // копія images масиву
    const updatedImage = { ...updatedImages[indexImg], [key]: value }; // копія одного зображення з оновленим alt
    updatedImages[indexImg] = updatedImage;

    updatedVolume[indexVolume] = {
      ...updatedVolume[indexVolume],
      images: updatedImages,
    };

    setVolume(updatedVolume);
  };

  const delImg = (indexVolume: number, indexImage: number) => {
    const updatedVolume = [...volume]; // створюємо копію масиву
    const updatedImages = [...updatedVolume[indexVolume].images]; // копія зображень
    updatedImages.splice(indexImage, 1); // видаляємо потрібне зображення
    updatedVolume[indexVolume] = {
      ...updatedVolume[indexVolume],
      images: updatedImages,
    };
    setVolume(updatedVolume);
  };

  return (
    <div className="add-product-form">
      <h2 className="add-product-title">Додати товар</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Назва товару (укр)"
          value={nameuk}
          onChange={(e) => setNameuk(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="Назва товару (рос)"
          value={nameru}
          onChange={(e) => setNameru(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="На ютубі поділитися, вставити, копіювати. Або залишити пустим."
          value={video}
          onChange={(e) => setVideo(e.target.value)}
          className="input"
        />

        <ReactQuill
          value={descriptionuk} // Відображаємо введений текст
          onChange={(value) => setDescriptionuk(value)} // Функція для обробки змін
          modules={{
            toolbar: [
              [{ header: '1' }, { header: '2' }, { font: [] }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ align: [] }],
              ['bold', 'italic', 'underline'],
              ['link', 'image'],
              ['clean'],
            ],
          }} // Параметри панелі інструментів (вибір шрифтів, товщина, кольори, вставка зображень)
          formats={[
            'header',
            'font',
            'size',
            'bold',
            'italic',
            'underline',
            'align',
            'list',
            'bullet',
            'link',
            'image',
          ]}
          placeholder="Опис товару (укр)"
          className="quill-editor" // Якщо хочете додатково стилізувати через клас
        />
        <br />
        <ReactQuill
          value={descriptionru} // Відображаємо введений текст
          onChange={(value) => setDescriptionru(value)} // Функція для обробки змін
          modules={{
            toolbar: [
              [{ header: '1' }, { header: '2' }, { font: [] }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ align: [] }],
              ['bold', 'italic', 'underline'],
              ['link', 'image'],
              ['clean'],
            ],
          }} // Параметри панелі інструментів (вибір шрифтів, товщина, кольори, вставка зображень)
          formats={[
            'header',
            'font',
            'size',
            'bold',
            'italic',
            'underline',
            'align',
            'list',
            'bullet',
            'link',
            'image',
          ]}
          placeholder="Опис товару (рос)"
          className="quill-editor" // Якщо хочете додатково стилізувати через клас
        />

        <h3 className="sub-title">Характеристики (укр)</h3>
        {characteristicsuk.map((_, index) => (
          <div key={index} className="characteristics">
            <input
              type="text"
              placeholder="Заголовок (укр)"
              value={characteristicsuk[index].ukTitle}
              onChange={(e) =>
                handleCharacteristicChange(index, e.target.value, 'uk', 'title')
              }
              className="input"
            />
            <input
              type="text"
              placeholder="Опис (укр)"
              value={characteristicsuk[index].ukDescription}
              onChange={(e) =>
                handleCharacteristicChange(
                  index,
                  e.target.value,
                  'uk',
                  'description',
                )
              }
              className="input"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setCharacteristicsuk([
              ...characteristicsuk,
              { ukTitle: '', ukDescription: '' },
            ])
          }
        >
          Додати характеристику (укр)
        </button>

        <h3 className="sub-title">Характеристики (рос)</h3>
        {characteristicsru.map((_, index) => (
          <div key={index} className="characteristics">
            <input
              type="text"
              placeholder="Заголовок (рос)"
              value={characteristicsru[index].ruTitle}
              onChange={(e) =>
                handleCharacteristicChange(index, e.target.value, 'ru', 'title')
              }
              className="input"
            />
            <input
              type="text"
              placeholder="Опис (рос)"
              value={characteristicsru[index].ruDescription}
              onChange={(e) =>
                handleCharacteristicChange(
                  index,
                  e.target.value,
                  'ru',
                  'description',
                )
              }
              className="input"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setCharacteristicsru([
              ...characteristicsru,
              { ruTitle: '', ruDescription: '' },
            ])
          }
        >
          Додати характеристику (рос)
        </button>
        <br />
        <br />

        {/* Поля для вибору категорій, брендів і т. д. */ /*}
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="input"
        >
          <option value="">Виберіть категорію</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nameuk}
            </option>
          ))}
        </select>
        <select
          value={subcategoryId}
          onChange={(e) => setSubcategoryId(Number(e.target.value))}
          className="input"
        >
          <option value="">Виберіть підкатегорію</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.nameuk}
            </option>
          ))}
        </select>

        <select
          value={selectedBrend}
          onChange={(e) => setSelectedBrend(e.target.value)}
          className="input"
        >
          <option value="">Виберіть бренд</option>
          {brends.map((brend) => (
            <option key={brend.id} value={brend.id}>
              {brend.name}
            </option>
          ))}
        </select>

        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="input"
        >
          <option value="">Виберіть країну виробника</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.nameuk}
            </option>
          ))}
        </select>
        <div className="row check">
          <p>Зі знижкою?</p>
          <input
            type="checkbox"
            checked={isDiscount}
            onChange={(e) => setIsDiscount(e.target.checked)}
          />
        </div>
        <div className="row check">
          <p> Топ продажів?</p>
          <input
            type="checkbox"
            checked={isHit}
            onChange={(e) => setIsHit(e.target.checked)}
          />
        </div>
        <div className="row check">
          <p> Новина?</p>
          <input
            type="checkbox"
            checked={isNovetly}
            onChange={(e) => setIsNovetly(e.target.checked)}
          />
        </div>*/
{
  /*<div className='row check'>
          <p> Це хіт?</p>
          <input
            type='checkbox'
            checked={isHit}
            onChange={e => setIsHit(e.target.checked)}
          />
        </div>*/
}
/*<div className="row check">
          <p> Безкоштовна доставка?</p>
          <input
            type="checkbox"
            checked={isFreeDelivery}
            onChange={(e) => setIsFreeDelivery(e.target.checked)}
          />
        </div>

        {filters.map((filter) => (
          <div key={filter.id}>
            <h3>{filter.nameuk}</h3>
            <div>
              <input
                type="text"
                placeholder={`Значення для ${filter.nameuk}`}
                value={
                  selectedFilters.find((f) => f.filterCategoryId === filter.id)
                    ?.valueuk || ''
                }
                onChange={(e) =>
                  handleFilterChange(filter.id, e.target.value, 'uk')
                }
              />
              <input
                type="text"
                placeholder={`Значення для ${filter.nameru}`}
                value={
                  selectedFilters.find((f) => f.filterCategoryId === filter.id)
                    ?.valueru || ''
                }
                onChange={(e) =>
                  handleFilterChange(filter.id, e.target.value, 'ru')
                }
              />
            </div>
          </div>
        ))}
        <br />
        <br />

        {/* Volume */ /*}
        {volume.map((_, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Обсяг (мл)"
              value={volume[index].volume}
              onChange={(e) =>
                handleVolumeChange(index, 'volume', e.target.value)
              }
              className="input"
            />
            <input
              type="text"
              placeholder="назва обсяну, до прикладу мл чи кг"
              value={volume[index].nameVolume}
              onChange={(e) =>
                handleVolumeChange(index, 'nameVolume', e.target.value)
              }
              className="input"
            />
            <div className="avability">
              <div className="row">
                <p>В наявності:</p>
                <input
                  type="radio"
                  checked={volume[index].isAvailability == 'inStock'}
                  onClick={() =>
                    handleVolumeChange(index, 'isAvailability', 'inStock')
                  }
                />
              </div>
              <div className="row">
                <p>Під замовлення:</p>
                <input
                  type="radio"
                  checked={volume[index].isAvailability == 'customMade'}
                  onClick={() =>
                    handleVolumeChange(index, 'isAvailability', 'customMade')
                  }
                />
              </div>
              <div className="row">
                <p>Нема в наявності:</p>
                <input
                  type="radio"
                  checked={volume[index].isAvailability == 'notAvailable'}
                  onClick={() =>
                    handleVolumeChange(index, 'isAvailability', 'notAvailable')
                  }
                />
              </div>
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}
              className="row"
            >
              <p>Безкоштовна доставка?</p>
              <input
                type="checkbox"
                checked={volume[index].isFreeDelivery}
                onChange={(e) =>
                  handleVolumeChange(index, 'isFreeDelivery', e.target.checked)
                }
              />
            </div>
            <input
              type="text"
              placeholder="артикул"
              value={volume[index].art}
              onChange={(e) => handleVolumeChange(index, 'art', e.target.value)}
              className="input"
            />
            <input
              type="text"
              placeholder="metaTitle uk"
              value={volume[index].metaTitleuk}
              onChange={(e) =>
                handleVolumeChange(index, 'metaTitleuk', e.target.value)
              }
              className="input"
            />
            <input
              type="text"
              placeholder="metaTitle ru"
              value={volume[index].metaTitleru}
              onChange={(e) =>
                handleVolumeChange(index, 'metaTitleru', e.target.value)
              }
              className="input"
            />
            <input
              type="text"
              placeholder="metaDescription uk"
              value={volume[index].metaDescriptionuk}
              onChange={(e) =>
                handleVolumeChange(index, 'metaDescriptionuk', e.target.value)
              }
              className="input"
            />
            <input
              type="text"
              placeholder="metaDescription ru"
              value={volume[index].metaDescriptionru}
              onChange={(e) =>
                handleVolumeChange(index, 'metaDescriptionru', e.target.value)
              }
              className="input"
            />
            <input
              type="text"
              placeholder="canonical uk"
              value={volume[index].canonicaluk}
              onChange={(e) =>
                handleVolumeChange(index, 'canonicaluk', e.target.value)
              }
              className="input"
            />
            <input
              type="text"
              placeholder="canonical ru"
              value={volume[index].canonicalru}
              onChange={(e) =>
                handleVolumeChange(index, 'canonicalru', e.target.value)
              }
              className="input"
            />
            <input
              type="text"
              placeholder="Ціна"
              value={volume[index].price}
              onChange={(e) =>
                handleVolumeChange(index, 'price', e.target.value)
              }
              className="input"
            />
            <input
              type="text"
              placeholder="Знижка"
              value={volume[index].discount}
              onChange={(e) =>
                handleVolumeChange(index, 'discount', e.target.value)
              }
              className="input"
            />
            <input
              type="text"
              placeholder="Ціна зі знижкою"
              value={volume[index].priceWithDiscount}
              onChange={(e) =>
                handleVolumeChange(index, 'priceWithDiscount', e.target.value)
              }
              className="input"
            />
            <input
              type="file"
              multiple // дозволяє вибирати кілька файлів
              onChange={(e) => handleImageChange(index, e.target.files!)}
              className="input"
            />
            {volume[index].images.map((x, indexVolume: number) => (
              <div
                key={indexVolume}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  marginBottom: '15px',
                }}
              >
                {Array.isArray(x.img) ? (
                  x.img.map((file, index) => (
                    <img
                      key={index}
                      width={50}
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      className="h-24 w-24 rounded object-cover"
                    />
                  ))
                ) : (
                  <img
                    width={100}
                    src={URL.createObjectURL(x.img)}
                    alt="preview"
                    className="h-24 w-24 rounded object-cover"
                  />
                )}{' '}
                <label>alt ua</label>
                <input
                  onChange={(e) =>
                    setVolumeImages(index, indexVolume, 'altuk', e.target.value)
                  }
                  type="text"
                />
                <label>alt ru</label>
                <input
                  onChange={(e) =>
                    setVolumeImages(index, indexVolume, 'altru', e.target.value)
                  }
                  type="text"
                />
                <button
                  style={{ alignItems: 'center', margin: '0' }}
                  type="button"
                  onClick={() => delImg(index, indexVolume)}
                >
                  del
                </button>
              </div>
            ))}
          </div>
        ))}

        <button type="button" onClick={addVolumeField}>
          Додати обсяг
        </button>

        {/* Submit button */ /*}
        <button style={{ marginLeft: '40px' }} type="submit">
          Додати товар
        </button>
      </form>
    </div>
  );
};

export default AddGoodsPage;*/
