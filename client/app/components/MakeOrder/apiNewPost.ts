import axios from 'axios';

export type CityDataNewPost = {
  AddressDeliveryAllowed: boolean;
  Area: string;
  AreaDescription: string;
  AreaDescriptionRu: string;
  AreaDescriptionTranslit: string;
  Delivery1: string;
  Delivery2: string;
  Delivery3: string;
  Delivery4: string;
  Delivery5: string;
  Delivery6: string;
  Delivery7: string;
  Description: string;
  DescriptionRu: string;
  DescriptionTranslit: string;
  Index1: string;
  Index2: string;
  IndexCOATSU1: string;
  Latitude: string;
  Longitude: string;
  RadiusDrop: string;
  RadiusExpressPickUp: string;
  RadiusHomeDelivery: string;
  Ref: string;
  Region: string;
  RegionsDescription: string;
  RegionsDescriptionRu: string;
  RegionsDescriptionTranslit: string;
  SettlementType: string;
  SettlementTypeDescription: string;
  SettlementTypeDescriptionRu: string;
  SettlementTypeDescriptionTranslit: string;
  SpecialCashCheck: number;
  Warehouse: string;
};

export const getCitiesDefault = async (): Promise<CityDataNewPost[]> => {
  const apiKey = process.env.NEXT_PUBLIC_NP_API_KEY;
  const apiUrl = 'https://api.novaposhta.ua/v2.0/json/';

  const cityNames = [
    'Київ',
    'Львів',
    'Одеса',
    'Дніпро',
    'Харків',
    'Запоріжжя',
    'Кривий Ріг',
    'Миколаїв',
    'Вінниця',
    'Полтава',
    'Хмельницький',
    'Черкаси',
    'Суми',
    'Чернівці',
    'Житомир',
    'Чернігів',
    'Кропивницький',
    'Рівне',
    'Івано-Франківськ',
    'Тернопіль',
  ];

  const results: CityDataNewPost[] = [];

  for (const cityName of cityNames) {
    try {
      const requestBody = {
        apiKey,
        modelName: 'AddressGeneral',
        calledMethod: 'getCities',
        methodProperties: {
          FindByString: cityName,
        },
      };

      const response = await axios.post(apiUrl, requestBody);

      if (response.data.success && response.data.data.length > 0) {
        // Беремо перший збіг
        const cityData = response.data.data[0];
        results.push(cityData);
      } else {
        console.error(`City not found: ${cityName}`);
      }
    } catch (error) {
      console.error(`Error fetching data for city: ${cityName}`, error);
    }
  }

  return results;
};

export const searchCity = async (query: string): Promise<CityDataNewPost[]> => {
  const apiKey = process.env.NEXT_PUBLIC_NP_API_KEY;
  const apiUrl = 'https://api.novaposhta.ua/v2.0/json/';

  try {
    const requestBody = {
      apiKey,
      modelName: 'Address',
      calledMethod: 'getCities',
      methodProperties: {
        FindByString: query, // без Page і Limit!
      },
    };

    const response = await axios.post(apiUrl, requestBody);

    if (response.data.success && response.data.data.length > 0) {
      const cities: CityDataNewPost[] = response.data.data;

      // Сортування — залишаємо для зручності
      const sortedCities = cities.sort((a, b) => {
        const aExact = a.Description.toLowerCase() === query.toLowerCase();
        const bExact = b.Description.toLowerCase() === query.toLowerCase();
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return a.Description.localeCompare(b.Description);
      });

      return sortedCities;
    } else {
      console.warn('No results for query:', query, response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching data from Nova Poshta API:', error);
    return [];
  }
};

export type WarehouseData = {
  Description: string; // Назва відділення або поштомату
  DescriptionRu: string; // Назва відділення або поштомату
  SettlementDescription: string; // Назва населеного пункту
  TypeOfWarehouse: string; // Тип об'єкта ("Поштомат" чи інше)
  Ref: string; // Унікальний ідентифікатор
};

export const fetchBranchesByCityRef = async (
  cityRef: string,
  typeDelivery: 'department' | 'post',
): Promise<WarehouseData[]> => {
  try {
    const response = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
      apiKey: process.env.NEXT_PUBLIC_NP_API_KEY,
      modelName: 'AddressGeneral',
      calledMethod: 'getWarehouses',
      methodProperties: {
        CityRef: cityRef,
      },
    });

    if (response.data.success) {
      if (typeDelivery == 'department') {
        return response.data.data.filter(
          (x: any) => x.CategoryOfWarehouse != 'Postomat',
        );
      } else
        return response.data.data.filter(
          (x: any) => x.CategoryOfWarehouse == 'Postomat',
        );
      //return response.data.data // Масив відділень
    } else {
      console.error('Помилка отримання відділень:', response.data.errors);
      return [];
    }
  } catch (error) {
    console.error('Помилка запиту до API:', error);
    return [];
  }
};
