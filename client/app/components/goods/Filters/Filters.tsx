'use client';
import React, { useEffect, useState } from 'react';
import Categories from './Categories';
import './Filters.scss';
import Brends from './Brends';
import PriceSelector from './PriceSelector';
import { Locale } from '@/i18n.config';
import Subcategories from './Subcategories';
import CountryMade from './CountryMade';
import ProductFilter from './ProductFilter';
import Pruznachenia from './Pruznachenia';
import Linies from './Linies';
import Gender from './Gender';
import Brands2 from './Brends2';
import MobFilterSVG from '../../../assest/Filters/Filter.svg';
import CloseSVG from '../../../assest/Filters/Close.svg';
import { useRouter, useSearchParams } from 'next/navigation';
import Sort from '../Sort/Sort';

type Category = {
  id: number;
  name: string;
};

type Props = {
  lang: Locale;
  filters: any;
  currentSearchParams: any;
  noBrands?: true;
  brand?: string;
  currentPathname?: string;
  realName?: string;
  isMob?: boolean;
};

const Filters = ({
  lang,
  filters,
  currentSearchParams,
  noBrands,
  brand,
  currentPathname,
  realName,
  //isMob
}: Props) => {
  const isMob = false;
  const [isMobile, setIsMobile] = useState(isMob);
  const [openFilter, setOpenFilter] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get('filter') === 'open';

  // Визначення мобільної версії

  const setOpen = (value: string) => {};

  const filterOpenOrClose = (isOpen: boolean) => {
    const params = new URLSearchParams(searchParams.toString());

    if (isOpen) {
      params.set('filter', 'open');
    } else {
      params.delete('filter');
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="filters-parent">
      <div className="mob-open-filter-and-sort">
        <div onClick={() => filterOpenOrClose(!isOpen)} className="mob-is-open">
          <MobFilterSVG />
          {lang == 'ru' ? 'Фильтры' : 'Фільтри'}
        </div>
        <Sort lang={lang} />
      </div>
      <div className={`filters-container ${isOpen ? 'open' : 'close'}`}>
        <div className="filter-main-title">
          <h4>{lang == 'ru' ? 'Фильтры' : 'Фільтри'}</h4>
          <div onClick={() => filterOpenOrClose(false)} className="close">
            <CloseSVG />
          </div>
        </div>
        {filters.categories && (
          <Categories
            lang={lang}
            listCategories={filters.categories}
            currentSearchParams={currentSearchParams}
            brand={brand}
            currentPathname={currentPathname}
            nameOpen="category"
            open={openFilter}
            setOpen={setOpen}
            isMob={isMob}
          />
        )}
        {filters.subcategories && (
          <Subcategories
            lang={lang}
            listSubcategories={filters.subcategories}
            currentSearchParams={currentSearchParams}
            currentPathname={currentPathname}
            brand={brand}
            nameOpen="subcategory"
            open={openFilter}
            setOpen={setOpen}
            isMob={isMob}
          />
        )}
        {!noBrands && (
          <Brends
            currentSearchParams={currentSearchParams}
            currentPathname={currentPathname}
            realBrands={filters.brends}
            lang={lang}
            nameOpen="brends"
            open={openFilter}
            setOpen={setOpen}
            isMob={isMob}
          />
        )}
        {noBrands && brand && (
          <Brands2
            currentSearchParams={currentSearchParams}
            currentPathname={currentPathname}
            realBrands={filters.brends}
            lang={lang}
            nameOpen="brends"
            open={openFilter}
            setOpen={setOpen}
            brend={realName || ''}
            isMob={isMob}
          />
        )}
        <CountryMade
          currentSearchParams={currentSearchParams}
          currentPathname={currentPathname}
          realCountries={filters.countries}
          lang={lang}
          brand={brand}
          nameOpen="countryMade"
          open={openFilter}
          setOpen={setOpen}
          isMob={isMob}
        />
        <Pruznachenia
          currentSearchParams={currentSearchParams}
          realCountries={filters.recognitions}
          currentPathname={currentPathname}
          lang={lang}
          brand={brand}
          nameOpen="pruznachenia"
          open={openFilter}
          setOpen={setOpen}
          isMob={isMob}
        />
        <Gender
          currentPathname={currentPathname}
          lang={lang}
          currentSearchParams={currentSearchParams}
          brand={brand}
          nameOpen="gender"
          open={openFilter}
          setOpen={setOpen}
          isMob={isMob}
        />
        {
          //<VolumeSelector />
        }
        {
          //<Appointment />
        }
        {
          //     <GenderSelector />
        }

        {filters.linias && (
          <Linies
            currentSearchParams={currentSearchParams}
            realBrands={filters.linias}
            currentPathname={currentPathname}
            lang={lang}
            brand={brand}
            nameOpen="linia"
            open={openFilter}
            setOpen={setOpen}
            isMob={isMob}
          />
        )}
        <PriceSelector
          minAvailablePrice={filters.minAvailablePrice}
          maxAvailablePrice={filters.maxAvailablePrice}
          currentPathname={currentPathname}
          lang={lang}
          currentSearchParams={currentSearchParams}
          brand={brand}
          nameOpen="price"
          open={openFilter}
          setOpen={setOpen}
          isMob={isMob}
        />
        {filters.productFilters &&
          filters.productFilters.map((x: any) => (
            <ProductFilter
              filterData={x}
              key={x.id}
              lang={lang}
              currentSearchParams={currentSearchParams}
              currentPathname={currentPathname}
              brand={brand}
              nameOpen="product"
              open={openFilter}
              setOpen={setOpen}
              isMob={isMob}
            />
          ))}
      </div>
    </div>
  );
};

export default Filters;
