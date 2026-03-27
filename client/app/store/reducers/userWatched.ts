import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface watcedItem {
  id: number;
  nameuk: string;
  nameru: string;
  volumes: {
    id: number;
    img: string[];
    price: number;
    volume: string;
    discount: number;
    priceWithDiscount: number;
    url: string;
  }[];
}

interface userWatchedState {
  watched: watcedItem[];
}

const initialState: userWatchedState = {
  watched: [],
};

const saveToLocalStorage = (value: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('watched', JSON.stringify(value));
  }
};

const userWatched = createSlice({
  name: 'watched',
  initialState,
  reducers: {
    initializedFromUserWatched: (state) => {
      if (typeof window !== 'undefined') {
        const watched = JSON.parse(localStorage.getItem('watched') || '[]');
        state.watched = watched;
      }
    },
    addToWatched: (state, action: PayloadAction<watcedItem>) => {
      const newItem = action.payload;

      // 1. Перевіряємо, чи товар уже є у списку
      const existingItemIndex = state.watched.findIndex(
        (item) => item.id === newItem.id,
      );

      if (existingItemIndex !== -1) {
        // 2. Якщо є, видаляємо його з поточного місця
        state.watched.splice(existingItemIndex, 1);
      }

      // 3. Додаємо новий (або переміщений) товар на початок списку
      state.watched.unshift(newItem);

      // 4. Перевіряємо, чи не більше 50 товарів
      if (state.watched.length > 50) {
        // Якщо більше, видаляємо останній товар
        state.watched.pop();
      }

      // 5. Зберігаємо оновлений список у localStorage
      saveToLocalStorage(state.watched);
    },
  },
});

// Експортуємо action creator для використання в компонентах
export const { initializedFromUserWatched, addToWatched } = userWatched.actions;

export default userWatched.reducer;
