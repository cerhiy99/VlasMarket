export interface ImgInterface {
  id: number;
  img: string;
  volumeuk: string;
  volumeru: string;
  createdAt: string; // або Date, якщо парсиш в Date
  updatedAt: string;
  volumeId: number;
}

export interface VolumeInterface {
  id: number;
  nameVolume: string;
  volume: string;
  price: number;
  discount: number;
  priceWithDiscount: number;
  metaTitleuk: string | null;
  metaDescriptionuk: string | null;
  canonicaluk: string | null;
  metaTitleru: string | null;
  metaDescriptionru: string | null;
  canonicalru: string | null;
  createdAt: string;
  updatedAt: string;
  goodId: number;
  imgs: ImgInterface[];
  isAvailability: 'inStock' | 'notAvailable' | 'customMade';
  url: string;
  isFreeDelivery: boolean;
  art: string;
}

export interface BrendInterface {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CountryMadeInterface {
  id: number;
  nameuk: string;
  nameru: string;
  createdAt: string;
  updatedAt: string;
}

interface SubcategoryInterface {
  id: number;
  nameuk: string;
  nameru: string;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
}

export interface GoodInterface {
  id: number;
  nameuk: string;
  nameru: string;
  descriptionuk: string;
  descriptionru: string;
  art: string;
  characteristicuk: string;
  characteristicru: string;
  video: string | null;
  createdAt: string;
  updatedAt: string;
  brendId: number;
  categoryId: number;
  countryMadeId: number;
  subcategoryId: number;
  volumes: VolumeInterface[];
  brend: BrendInterface;
  countryMade: CountryMadeInterface;
  subcategory: SubcategoryInterface;
  isDiscount: boolean;
  isBestseller: boolean;
  isNovetly: boolean;
  isHit: boolean;
  isFreeDelivery: boolean;
  reviews: [{ id: number }];
  averageRating: string;
  isForMan: true | false | null;
  linium: any;
  views: number;
  nameTypeuk: string;
  nameTyperu: string;
}
