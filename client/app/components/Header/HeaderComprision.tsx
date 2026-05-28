'use client';
import './HeaderLike.scss';
import ComprisionSvg from '../../assest/comparison.svg';
import { Locale } from '@/i18n.config';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useTranslation } from '@/context/TranslationProvider';
import { useRouter } from 'next/navigation';
import { getLocalizedPath } from '../utils/getLocalizedPath';

type Props = {
  lang: Locale;
};

const HeaderComprision = ({ lang }: Props) => {
  const router = useRouter();
  const { comparison } = useSelector((state: RootState) => state.BasketAndLike);

  const openComprision = () => {
    if (comparison.length > 0) {
      router.push(getLocalizedPath(`/${lang}/comparison `, lang));
    }
  };

  return (
    <div className="header-like-container header-compresion">
      <div onClick={openComprision} className={`title`}>
        <ComprisionSvg />

        {comparison.length > 0 && (
          <div className="count">
            <span>{comparison.length}</span>
          </div>
        )}
      </div>
      <div className="info">{lang == 'ru' ? 'Сравнение' : 'Порівняння'}</div>
    </div>
  );
};

export default HeaderComprision;
