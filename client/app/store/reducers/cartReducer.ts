import { ImgInterface } from '@/app/interfaces/goods';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LikeItem {
  id: number;
  nameUA: string;
  nameRU: string;
  volume: {
    id: number;
    img: string;
    price: number;
    volume: string;
    discount: number;
    priceWithDiscount: number;
    url: string;
  };
}

export interface BasketItem {
  id: number;
  nameUA: string;
  nameRU: string;
  volume: {
    id: number;
    img: string;
    price: number;
    volume: string;
    discount: number;
    priceWithDiscount: number;
    url: string;
  };
  count: number;
}

interface CartState {
  basket: BasketItem[];
  like: LikeItem[];
  isCartVisible: boolean; // Стан для керування видимістю кошика
  isLikeVisible: boolean; // Стан для керування видимістю "подобаних"
  isOpenBasket: boolean;
}

// Початковий стан як пусті масиви та невидимі кошик і "подобані"
const initialState: CartState = {
  basket: [],
  like: [],
  isCartVisible: false,
  isLikeVisible: false,
  isOpenBasket: false,
};

const saveToLocalStorage = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initializeFromLocalStorage: (state) => {
      if (typeof window !== 'undefined') {
        const basket = JSON.parse(localStorage.getItem('basket') || '[]');
        const like = JSON.parse(localStorage.getItem('like') || '[]');
        state.basket = basket;
        state.like = like;
      }
    },
    addToBasket: (state, action: PayloadAction<BasketItem>) => {
      const itemIndex = state.basket.findIndex((item) => item.id === action.payload.id);
      if (itemIndex >= 0) {
        state.basket[itemIndex].count += action.payload.count;
      } else {
        state.basket.push(action.payload);
      }
      saveToLocalStorage('basket', state.basket);
      state.isOpenBasket = true;
    },
    removeFromBasket: (state, action: PayloadAction<number>) => {
      const itemIndex = state.basket.findIndex((item) => item.id === action.payload);

      if (itemIndex >= 0) {
        state.basket.splice(itemIndex, 1);
      }
      saveToLocalStorage('basket', state.basket);
    },
    incrementItemCount: (state, action: PayloadAction<number>) => {
      const itemIndex = state.basket.findIndex((item) => item.id === action.payload);
      if (itemIndex >= 0) {
        state.basket[itemIndex].count += 1;
        saveToLocalStorage('basket', state.basket);
      }
    },
    decrementItemCount: (state, action: PayloadAction<number>) => {
      const itemIndex = state.basket.findIndex((item) => item.id === action.payload);
      if (itemIndex >= 0 && state.basket[itemIndex].count > 1) {
        state.basket[itemIndex].count -= 1;
        saveToLocalStorage('basket', state.basket);
      }
    },
    addToLike: (state, action: PayloadAction<LikeItem>) => {
      const itemIndex = state.like.findIndex((item) => item.id === action.payload.id);
      if (itemIndex === -1) {
        state.like.push(action.payload);
      }
      saveToLocalStorage('like', state.like);
    },
    removeFromLike: (state, action: PayloadAction<number>) => {
      state.like = state.like.filter((item) => item.id !== action.payload);
      saveToLocalStorage('like', state.like);
    },
    setBasket: (state, action: PayloadAction<BasketItem[]>) => {
      state.basket = action.payload;
      saveToLocalStorage('basket', state.basket);
    },
    openCart: (state) => {
      state.isCartVisible = true;
    },
    closeCart: (state) => {
      state.isCartVisible = false;
    },
    openLike: (state) => {
      state.isLikeVisible = true;
    },
    closeLike: (state) => {
      state.isLikeVisible = false;
    },
    setIsOpenBasket: (state, action: PayloadAction<boolean>) => {
      state.isOpenBasket = action.payload;
    },
    /*    isInLike: (state, action: PayloadAction<number>) => {
      return state.like.findIndex(x => x.id == action.payload) != -1
    }*/
  },
});

export const {
  initializeFromLocalStorage,
  addToBasket,
  removeFromBasket,
  incrementItemCount,
  decrementItemCount,
  addToLike,
  removeFromLike,
  openCart,
  closeCart,
  openLike,
  closeLike,
  setBasket,
  setIsOpenBasket,
} = cartSlice.actions;

export default cartSlice.reducer;
