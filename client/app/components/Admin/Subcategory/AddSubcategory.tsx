'use client'
import React, { useEffect, useState } from 'react'
import './Subcategory.scss'
import {
  Button,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material'
import { $authHost } from '@/app/http'
import { CategoryInterface } from '@/app/interfaces/Category'

const AddSubcategory = () => {
  const [categories, setCategories] = useState<CategoryInterface[]>([])
  const [categoryId, setCategoryId] = useState<string | ''>('')
  const [nameua, setNameua] = useState<string>('')
  const [nameru, setNameru] = useState<string>('')
  const [image, setImage] = useState<File | null>(null)
  const [error, setError] = useState<null | string>(null)
  const [success, setSuccess] = useState<null | string>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await $authHost.get('category/get')
        if (res.status === 200) {
          setCategories(res.data.res)
        } else {
          setError('Помилка завантаження категорій.')
        }
      } catch (err) {
        setError('Помилка сервера при завантаженні категорій.')
      }
    }
    fetchCategories()
  }, [])

  const addSubcategory = async () => {
    if (!nameua || !nameru || !categoryId || !image) {
      setError('Всі поля, включно із зображенням, повинні бути заповнені.')
      setSuccess(null)
      return
    }

    const formData = new FormData()
    formData.append('nameua', nameua)
    formData.append('nameru', nameru)
    formData.append('categoryId', categoryId)
    formData.append('image', image)

    try {
      const res = await $authHost.post('subcategory/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setSuccess('Підкатегорія успішно додана.')
      setError(null)
      setNameua('')
      setNameru('')
      setCategoryId('')
      setImage(null)
    } catch (err) {
      setError('Помилка сервера при додаванні підкатегорії.')
      setSuccess(null)
    }
  }

  return (
    <div className='admin-category'>
      <div className='add-category'>
        <h1>Додати підкатегорію</h1>
        {error && <Alert severity='error'>{error}</Alert>}
        {success && <Alert severity='success'>{success}</Alert>}
        <div className='text-with-input'>
          <FormControl fullWidth>
            <InputLabel id='category-select-label'>Категорія</InputLabel>
            <Select
              labelId='category-select-label'
              id='category-select'
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
            >
              {categories.map(category => (
                <MenuItem key={category.id} value={category.id}>
                  {category.nameuk}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className='text-with-input'>
          <label htmlFor='nameua'>Назва українською</label>
          <input
            id='nameua'
            type='text'
            value={nameua}
            onChange={e => setNameua(e.target.value)}
          />
        </div>
        <div className='text-with-input'>
          <label htmlFor='nameru'>Назва російською</label>
          <input
            id='nameru'
            type='text'
            value={nameru}
            onChange={e => setNameru(e.target.value)}
          />
        </div>
        <div className='text-with-input'>
          <label htmlFor='image'>Зображення</label>
          <input
            id='image'
            type='file'
            accept='image/*'
            onChange={e => {
              const file = e.target.files?.[0] || null
              setImage(file)
            }}
          />
        </div>
        <Button variant='contained' color='primary' onClick={addSubcategory}>
          Додати
        </Button>
      </div>
    </div>
  )
}

export default AddSubcategory
