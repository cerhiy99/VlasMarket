'use client'

import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Provider } from 'react-redux'
import { initializeFromLocalStorage } from '@/app/store/reducers/cartReducer'
import { store } from './index'

const LocalStorageInitializer = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    // Ініціалізуємо стан з localStorage при завантаженні клієнта
    dispatch(initializeFromLocalStorage())
  }, [dispatch])

  return null // Цей компонент нічого не рендерить, а лише ініціалізує стан
}

const Providers = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <Provider store={store}>
      <LocalStorageInitializer />
      {children}
    </Provider>
  )
}

export default Providers
