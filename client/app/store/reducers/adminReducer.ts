import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AdminState {
  adminKey: string | null
}

// Початковий стан як пустий ключ
const initialState: AdminState = {
  adminKey: null
}

const saveToLocalStorage = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value)
  }
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    initializeFromLocalStorage: state => {
      if (typeof window !== 'undefined') {
        const adminKey = localStorage.getItem('adminKey')
        state.adminKey = adminKey ? JSON.parse(adminKey) : null
      }
    },
    setAdminKey: (state, action: PayloadAction<string>) => {
      state.adminKey = action.payload
      saveToLocalStorage('adminKey', action.payload)
    },
    clearAdminKey: state => {
      state.adminKey = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminKey')
      }
    }
  }
})

export const { initializeFromLocalStorage, setAdminKey, clearAdminKey } =
  adminSlice.actions

export default adminSlice.reducer
