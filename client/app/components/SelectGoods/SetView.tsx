import { $host } from '@/app/http'
import React, { useEffect } from 'react'

type Props = {
  id: number
}

const SetView = ({ id }: Props) => {
  useEffect(() => {
    const setData = async () => {
      try {
        const res = await $host.post('goods/setView?id=' + id)
      } catch (err) {}
    }
    setData()
  }, [])
  return null
}

export default SetView
