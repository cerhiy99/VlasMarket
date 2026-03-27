import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers'

// Налаштовуємо store
export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat() // Можна додати свої middleware тут
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
