'use client';
import React, { useState, useEffect, useRef } from 'react';
import './AuthHeader.scss';
import AuthSVG from '../../assest/Header/Auth.svg';
import { Locale } from '@/i18n.config';
import LogIn, { FormLoginProps } from './LogIn';
import Register, { FormRegisterProps } from './Register';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { logout, setToken } from '@/app/store/reducers/userReducers';
import { $authHost } from '@/app/http';
import ForgotPassword from './ForgotPassword';
import { getLocalizedPath } from '../utils/getLocalizedPath';
import { useTranslation } from '@/context/TranslationProvider';

type Props = {
  iconColor?: string;
  dictionary: any;
  lang: Locale;
  onFormClose?: () => void;
};

const AuthHeader = ({
  iconColor = 'white',
  dictionary,
  lang,
  onFormClose,
}: Props) => {
  const { isAuthorize } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [logIsOpen, setLogIsOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const router = useRouter();
  const toggleDropdownOpen = () => {
    setIsOpen(true);
  };
  const toggleDropdownClose = () => {
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  const handleLogin = () => {
    setLogIsOpen(false);
    setIsRegisterOpen(true);
  };
  const handleRegister = () => {
    setLogIsOpen(true);
    setIsRegisterOpen(false);
  };

  const closeLogIn = () => {
    setLogIsOpen(false);
  };
  const closeRegister = () => {
    setIsRegisterOpen(false);
  };

  const submitRegister = (e: React.FormEvent, formData: FormRegisterProps) => {
    e.preventDefault();
    setIsRegisterOpen(false);
    if (onFormClose) onFormClose();
    // Add your registration logic here
    router.push(getLocalizedPath(`/${lang}/user-cabinet`, lang));
  };
  const submitLogin = (formData: FormLoginProps) => {
    setLogIsOpen(false);
    if (onFormClose) onFormClose();
    // Add your registration logic here
    //router.push(`/${lang}/user-cabinet`)
  };

  useEffect(() => {
    if (logIsOpen || isRegisterOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [logIsOpen, isRegisterOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      dispatch(setToken(localStorage.getItem('token') || ''));
    }
  }, []);
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        if (!isAuthorize) return;
        // Надішли запит на сервер: користувач активний
        const res = await $authHost.post('user/active', {
          method: 'POST',
          credentials: 'include', // якщо використовуєш куки
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ active: true }),
        });
        console.log(res);
      } catch (err) {
        if (
          err &&
          typeof err === 'object' &&
          'status' in err &&
          (err as any).status === 401
        ) {
          dispatch(logout());
        }
      }
    }, 20000); // кожні 20 секунд
    return () => clearInterval(interval); // очистити інтервал при розмонтуванні
  }, [isAuthorize]);
  const setForgotPassword = () => {
    setIsForgotPassword(true);
    setLogIsOpen(false);
  };
  const closeForgot = () => {
    setIsForgotPassword(false);
  };
  const { t } = useTranslation();

  return (
    <>
      <div
        onMouseLeave={toggleDropdownClose}
        onMouseEnter={toggleDropdownOpen}
        className="auth-header-container"
        ref={dropdownRef}
      >
        <div
          className="title-container"
          onClick={() => {
            isAuthorize
              ? router.push(getLocalizedPath(`/${lang}/user-cabinet`, lang))
              : setLogIsOpen(true);
          }}
        >
          <div className={`title ${isOpen ? 'open' : ''}`}>
            <AuthSVG color={iconColor} />
          </div>
          {
            //!isAuthorize && <p>{dictionary.logIn}</p>
          }
        </div>
        {!isAuthorize && (
          <div className={`dropdown ${isOpen ? 'show' : ''}`}>
            <div
              className="log-in dropdownBtn"
              onClick={() => setLogIsOpen(true)}
            >
              {dictionary.logIn}
            </div>
            <div
              className="register dropdownBtn"
              onClick={() => setIsRegisterOpen(true)}
            >
              {dictionary.register}
            </div>
          </div>
        )}
        {isAuthorize && (
          <div className={`dropdown ${isOpen ? 'show' : ''}`}>
            <div
              className="register dropdownBtn"
              onClick={() => dispatch(logout())}
            >
              {t('exit')}
            </div>
          </div>
        )}
      </div>
      {logIsOpen && (
        <LogIn
          onSubmit={submitLogin}
          onRegisterModal={handleLogin}
          close={closeLogIn}
          lang={lang}
          setIsForgorPassword={setForgotPassword}
        />
      )}
      {isRegisterOpen && (
        <Register
          onSubmit={submitRegister}
          onClose={closeRegister}
          lang={lang}
        />
      )}
      {isForgotPassword && <ForgotPassword close={closeForgot} />}
    </>
  );
};

export default AuthHeader;
