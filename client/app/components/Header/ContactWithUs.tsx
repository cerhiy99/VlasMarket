'use client';
import React, { useState, useEffect, useRef } from 'react';
import './ContactWithUs.scss';
import { Locale } from '@/i18n.config';
import CallSVG from '../../assest/Header/Call.svg';
import DownSVG from '../../assest/Header/Down.svg';
import ViberSVG from '../../assest/Header/Viber.svg';
import TelegramSVG from '../../assest/Header/Telegram.svg';
import WhatccapSVG from '../../assest/Header/Whatccap.svg';
import PhoneSVG from '../../assest/Header/Phone.svg';

type Props = {
  lang: Locale;
  dictionary: any;
};

const ContactWithUs = ({ lang, dictionary }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      onMouseEnter={toggleDropdownOpen}
      onMouseLeave={toggleDropdownClose}
      className="header-contact"
      ref={dropdownRef}
    >
      <div className={`contactUs ${isOpen ? 'open' : ''}`}>
        <CallSVG />
        <p>{dictionary.title}</p>
        <DownSVG className="arrow" />
      </div>
      <div className={`dropdown ${isOpen ? 'show' : ''}`}>
        <p>{dictionary.timeWorkTitle}</p>
        <span>{dictionary.timeWorkDescription1}</span>
        <span>{dictionary.timeWorkDescription2}</span>
        <div className="list-icon">
          <div className="list__item">
            <ViberSVG />
            <p>Viber</p>
            <a href={process.env.NEXT_PUBLIC_VIBER}></a>
          </div>
          <div className="list__item">
            <TelegramSVG />
            <p>Telegram</p>
            <a href={process.env.NEXT_PUBLIC_TELEGRAM}></a>
          </div>
          <div className="list__item">
            <WhatccapSVG />
            <p>Whatsapp</p>
            <a href={process.env.NEXT_PUBLIC_WHATSAPP}></a>
          </div>
          <div className="icon2">
            <PhoneSVG color={'#fe680a'} stroke={'white'} />
            <p>
              <a href={process.env.NEXT_PUBLIC_PHONE_URL_1}>
                {process.env.NEXT_PUBLIC_PHONE_1}
              </a>
              <a href={process.env.NEXT_PUBLIC_PHONE_URL_2}>
                {process.env.NEXT_PUBLIC_PHONE_2}
              </a>
            </p>
          </div>
          <div className="list__item">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_1_2413)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.6799 0C24.3398 0 31.3599 7.02017 31.3599 15.68C31.3599 24.3398 24.3398 31.36 15.6799 31.36C7.02011 31.36 -6.10352e-05 24.3398 -6.10352e-05 15.68C-6.10352e-05 7.02017 7.02011 0 15.6799 0ZM25.6331 21.7585V10.1049L19.8059 15.9317L25.6331 21.7585ZM6.97166 21.9959H24.3886L19.0655 16.6728L17.0367 18.7013C16.9383 18.7994 16.8051 18.8545 16.6661 18.8544H14.6939C14.6251 18.8545 14.5569 18.841 14.4933 18.8147C14.4297 18.7884 14.3719 18.7499 14.3233 18.7013L12.2945 16.6728L6.97141 21.9959H6.97166ZM5.72681 10.1045V21.7588L11.554 15.9317L5.72681 10.1045ZM24.8923 9.36408H6.46794L14.9109 17.807H16.4493L24.8923 9.36408Z"
                  fill="#FEC90A"
                />
              </g>
              <defs>
                <clipPath id="clip0_1_2413">
                  <rect width="31.36" height="31.36" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <p>{process.env.NEXT_PUBLIC_EMAIL}</p>
            <a href={process.env.NEXT_PUBLIC_EMAIL_URL}></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactWithUs;
