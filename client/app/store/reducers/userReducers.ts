import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: number;
  email: string;
  adminAccess: string;
  name: string;
  surname: string;
  phone: string;
  exp: number;
}

export interface UserInterface {
  id: number;
  email: string;
  adminAccess: string;
  name: string;
  surname: string;
  phone: string;
}

export interface UserItem {
  user: UserInterface | null;
  isAuthorize: boolean;
  isOpenLogin: boolean;
  isOpenRegister: boolean;
  isOpenForgotPass: boolean;
}

const initialState: UserItem = {
  user: null,
  isAuthorize: false,
  isOpenLogin: false,
  isOpenRegister: false,
  isOpenForgotPass: false,
};

const saveToLocalStorage = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setOpenLogin: (state, action: PayloadAction<boolean>) => {
      state.isOpenForgotPass = false;
      state.isOpenRegister = false;
      state.isOpenLogin = action.payload;
    },
    setOpenRegister: (state, action: PayloadAction<boolean>) => {
      state.isOpenForgotPass = false;
      state.isOpenRegister = action.payload;
      state.isOpenLogin = false;
    },
    setOpenForgorPassword: (state, action: PayloadAction<boolean>) => {
      state.isOpenForgotPass = action.payload;
      state.isOpenRegister = false;
      state.isOpenLogin = false;
    },
    setToken: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      const decoded = jwtDecode<DecodedToken>(token);
      const now = Date.now() / 1000; // у секундах
      if (decoded.exp < now) {
        // Токен протермінований → чистимо
        localStorage.removeItem('token');
        state.isAuthorize = false;
        state.user = null;
        return;
      }
      saveToLocalStorage(token);

      // Токен валідний → записуємо
      state.isAuthorize = true;
      state.user = {
        id: decoded.id,
        email: decoded.email,
        adminAccess: decoded.adminAccess,
        name: decoded.name,
        surname: decoded.surname,
        phone: decoded.phone,
      };
    },
    logout: (state) => {
      state.user = null;
      state.isAuthorize = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
    initialize: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode<DecodedToken>(token);
          const now = Date.now() / 1000; // у секундах

          if (decoded.exp < now) {
            // Токен протермінований → чистимо
            localStorage.removeItem('token');
            state.isAuthorize = false;
            state.user = null;
            return;
          }

          // Токен валідний → записуємо
          state.isAuthorize = true;
          state.user = {
            id: decoded.id,
            email: decoded.email,
            adminAccess: decoded.adminAccess,
            name: decoded.name,
            surname: decoded.surname,
            phone: decoded.phone,
          };
        }
      }
    },
  },
});

export const {
  setToken,
  logout,
  initialize,
  setOpenForgorPassword,
  setOpenLogin,
  setOpenRegister,
} = userSlice.actions;

export default userSlice.reducer;
