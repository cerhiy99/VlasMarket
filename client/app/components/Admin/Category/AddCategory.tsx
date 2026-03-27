'use client'
import { $authHost } from '@/app/http'
import React, { useState } from 'react'
import { Button, Alert } from '@mui/material'
import './AddCategory.scss'

const AddCategory = () => {
  const [nameUA, setNameUA] = useState<string>('')
  const [nameRU, setNameRU] = useState<string>('')
  const [svg, setSvg] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const addCategory = async () => {
    if (!nameUA || !nameRU || !svg) {
      setError('Всі поля повинні бути заповнені.')
      setSuccess(null)
      return
    }

    try {
      const formData = new FormData()
      formData.append('nameua', nameUA)
      formData.append('nameru', nameRU)
      formData.append('image', svg)

      const res = await $authHost.post('category/add', formData)
      if (res.status == 200) {
        setSuccess('Категорія успішно додана.')
        setError(null)
      } else {
        setError('щось пішло не так')
      }
    } catch (err: any) {
      setError('Щось пішло не так.')
      console.log(err)
      setSuccess(null)
    }
  }
  return (
    <div className='add-category'>
      <h1>Додати категорію</h1>
      {error && <Alert severity='error'>{error}</Alert>}
      {success && <Alert severity='success'>{success}</Alert>}
      <div className='text-with-input'>
        <label htmlFor='nameUA'>Назва українською</label>
        <input
          id='nameUA'
          type='text'
          value={nameUA}
          onChange={e => setNameUA(e.target.value)}
        />
      </div>
      <div className='text-with-input'>
        <label htmlFor='nameRU'>Назва російською</label>
        <input
          id='nameRU'
          type='text'
          value={nameRU}
          onChange={e => setNameRU(e.target.value)}
        />
      </div>
      <div className='text-with-input'>
        <label htmlFor='svg'>svg</label>
        <input
          id='svg'
          type='file'
          accept='image'
          onChange={e => setSvg(e.target.files ? e.target.files[0] : null)}
        />
      </div>
      <Button variant='contained' color='primary' onClick={addCategory}>
        Додати
      </Button>
    </div>
  )
}

export default AddCategory
