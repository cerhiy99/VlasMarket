'use client'
import React, { useState } from 'react'
import { $authHost } from '@/app/http'
import { Button, Alert } from '@mui/material'
import './AddLine.scss'

const AddLine = () => {
  const [nameUA, setNameUA] = useState<string>('')
  const [nameRU, setNameRU] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const addLine = async () => {
    if (!nameUA) {
      setError('Всі поля повинні бути заповнені.')
      setSuccess(null)
      return
    }

    try {
      const res = await $authHost.post('goods/addLinia', {
        name: nameUA
      })

      if (res.status === 200) {
        setSuccess('Лінію успішно додано.')
        setError(null)
        setNameUA('')
        setNameRU('')
      } else {
        setError('Щось пішло не так.')
        setSuccess(null)
      }
    } catch (err) {
      console.error(err)
      setError('Помилка при збереженні.')
      setSuccess(null)
    }
  }

  return (
    <div className='add-line'>
      <h1>Додати лінію</h1>
      {error && <Alert severity='error'>{error}</Alert>}
      {success && <Alert severity='success'>{success}</Alert>}
      <div className='text-with-input'>
        <label htmlFor='lineUA'>Назва</label>
        <input
          id='lineUA'
          type='text'
          value={nameUA}
          onChange={e => setNameUA(e.target.value)}
        />
      </div>
      <Button variant='contained' color='primary' onClick={addLine}>
        Додати
      </Button>
    </div>
  )
}

export default AddLine
