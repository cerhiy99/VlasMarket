'use client'

import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google'
import GoogleSVG from '../../assest/Header/Google.svg'
import { $host } from '@/app/http'

export default function GoogleLoginButton() {
  const login = useGoogleLogin({
    onSuccess: async tokenResponse => {
      try {
        const { access_token } = tokenResponse
        // Надіслати токен на бекенд для обробки
        const res = await $host.post('user/google-login', {
          token: access_token
        })

        console.log('Успішна авторизація:', res.data)
      } catch (err) {
        console.error('Помилка авторизації:', err)
      }
    },
    onError: error => {
      console.error('Помилка входу через Google:', error)
    },
    flow: 'implicit' // або 'auth-code', якщо обробка на бекенді
  })

  return (
    <div style={{ cursor: 'poinet' }} className='buttons-log-in'>
      <div className='button-google'>
        <button onClick={() => login()}>
          <GoogleSVG />
          <div className='button-text'>Google</div>
        </button>
      </div>
    </div>
  )
}
