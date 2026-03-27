'use client'
import { $authHost } from '@/app/http'
import React, { useState } from 'react'
import './AddCategory.scss'

const AddCountryMade = () => {
  const [nameua, setNameua] = useState('')
  const [nameru, setNameru] = useState('')
  const [loading, setLoading] = useState(false)

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameua.trim() || !nameru.trim()) {
      alert('Будь ласка, заповніть всі поля')
      return
    }

    try {
      setLoading(true)
      const res = await $authHost.post('countryMade/addCountryMade', {
        nameuk: nameua,
        nameru
      })
      console.log(res)
      alert('Країну виробника додано успішно!')
      setNameua('')
      setNameru('')
    } catch (error) {
      console.error('Помилка додавання Країну виробника:', error)
      alert('Не вдалося додати Країну виробника')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='add-category'>
      <h1>Добавити Країну виробника</h1>
      <form onSubmit={add}>
        <label>Назва Країну виробника ua</label>
        <input
          type='text'
          value={nameua}
          onChange={e => setNameua(e.target.value)}
        />
        <label>Назва Країну виробника ru</label>
        <input
          type='text'
          value={nameru}
          onChange={e => setNameru(e.target.value)}
        />
        <button type='submit' disabled={loading}>
          {loading ? 'Завантаження...' : 'Добавити'}
        </button>
      </form>
    </div>
  )
}

export default AddCountryMade
