'use client'
import React, { useEffect, useState } from 'react'
import './Category.scss'
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

const AddTitleCategory = () => {
  const [categories, setCategories] = useState<CategoryInterface[]>([])
  const [nameua, setnameua] = useState('')
  const [nameru, setnameru] = useState('')
  const [idCategory, setIdCategory] = useState('')
  const [error, setError] = useState<null | string>()
  const [success, setSuccess] = useState<null | string>()

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await $authHost.get('category/get')
        if (res.status === 200) {
          setCategories(res.data.res)
        } else {
          setError('Помилка завантаження категорій.')
        }
      } catch (err) {
        setError('Помилка сервера.')
      }
    }
    getCategories()
  }, [])

  const add = async () => {
    if (!nameua || !nameru || !idCategory) {
      setError('Всі поля повинні бути заповнені.')
      setSuccess(null)
      return
    }

    try {
      const res = await $authHost.post('category/addTitlteCategory', {
        nameua,
        nameru,
        idCategory
      })

      setSuccess('Титул категорії успішно додано.')
      setError(null)
    } catch (err) {
      console.log(err)
      setSuccess(null)
    }
  }

  return (
    <div className='admin-category'>
      <div className='add-category'>
        <h1>Додати титул до категорії</h1>
        {error && <Alert severity='error'>{error}</Alert>}
        {success && <Alert severity='success'>{success}</Alert>}
        <div className='text-with-input'>
          <label htmlFor='nameua'>Назва українською</label>
          <input
            id='nameua'
            type='text'
            value={nameua}
            onChange={e => setnameua(e.target.value)}
          />
        </div>
        <div className='text-with-input'>
          <label htmlFor='nameru'>Назва російською</label>
          <input
            id='nameru'
            type='text'
            value={nameru}
            onChange={e => setnameru(e.target.value)}
          />
        </div>
        <div className='text-with-input'>
          <FormControl fullWidth>
            <InputLabel id='category-select-label'>Категорія</InputLabel>
            <Select
              labelId='category-select-label'
              id='category-select'
              value={idCategory}
              onChange={e => setIdCategory(e.target.value)}
            >
              {categories.map(category => (
                <MenuItem key={category.id} value={category.id}>
                  {category.nameuk}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <Button variant='contained' color='primary' onClick={add}>
          Додати
        </Button>
      </div>
    </div>
  )
}

export default AddTitleCategory
