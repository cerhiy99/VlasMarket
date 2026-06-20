'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './AboutGoods.scss';
import CardSelectGoods from './CardSelectGoods';
import ClientRating from '../Reviews/ClientRating';
import MyClientRating from './MyClientRating';
import SelectSortSVG from '../../assest/Goods/SelectSort.svg';
import Review from './Review';
import AddReview from './AddReview';
import { GoodInterface } from '@/app/interfaces/goods';
import { Locale } from '@/i18n.config';
import UserWatched from '../utils/UserWatched';
import AddToYouWatched from '../AddToYouWatched/AddToYouWatched';
import { useTranslation } from '@/context/TranslationProvider';

type Props = {
  dictionary: any;
  selectGoods: GoodInterface;
  selectVolume: number;
  sectionName: string;
  lang: Locale;
  revie: any;
  watchMore: any;
};

function convertYoutubeUrlToIframe(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (!match) return null;
  const videoId = match[1];
  return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
}

const AboutGoods = ({
  dictionary,
  selectGoods,
  selectVolume,
  sectionName,
  lang,
  revie,
  watchMore,
}: Props) => {
  const refDesctription = useRef<HTMLDivElement>(null);
  const refCharactersitics = useRef<HTMLDivElement>(null);
  const refReview = useRef<HTMLDivElement>(null);
  const refVideo = React.createRef<HTMLDivElement>();
  const refSimilar = React.createRef<HTMLDivElement>();

  const scrollToSection = useCallback(
    (sectionName: string) => {
      // Определяем отступ сверху (для учета фиксированных элементов)
      const listTitleContainerHeight =
        document
          .querySelector('.list-title-info-header')
          ?.getBoundingClientRect().height || 60;
      const mainHeaderHeight =
        document
          .querySelector('.catalog-search-and-other-container')
          ?.getBoundingClientRect().height || 50;
      const headerOffset = listTitleContainerHeight + mainHeaderHeight; // Приблизительная высота всех фиксированных элементов
      // Функция для выполнения скролла с учетом отступа
      const scrollWithOffset = (element: HTMLElement | null) => {
        if (!element) return;

        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      };

      // Выбираем нужный элемент в зависимости от секции
      switch (sectionName) {
        case 'description':
          scrollWithOffset(refDesctription.current);
          break;
        case 'characteristics':
          scrollWithOffset(refCharactersitics.current);
          break;
        case 'reviews':
          scrollWithOffset(refReview.current);
          break;
        case 'video':
          scrollWithOffset(refVideo.current);
          break;
        case 'similar':
          scrollWithOffset(refSimilar.current);
          break;
        default:
          break;
      }
    },
    [refDesctription, refCharactersitics, refReview, refVideo, refSimilar]
  );
  const text =
    lang == 'ru'
      ? selectGoods.descriptionru.replaceAll(`<p><br></p>`, '')
      : selectGoods.descriptionuk.replaceAll(`<p><br></p>`, '');

  useEffect(() => {
    scrollToSection(sectionName);
  }, [sectionName, scrollToSection]);
  const [textExpanded, setTextExpanded] = useState(true);
  const [isCharacteristicsExpanded, setCharacteristicsExpanded] =
    useState(true);
  const [reviewsExpanded, setReviewsExpanded] = useState(true);

  function parseCharacteristics(html: string, lang: 'ru' | 'ua') {
    if (typeof window === 'undefined') return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const items = Array.from(doc.querySelectorAll('li'));

    const characteristics = items.map((li: any) => {
      const name = li.querySelector('p')?.textContent.trim() || '';
      const value = li.querySelector('span')?.textContent.trim() || '';
      return { name, value };
    });

    // 🔧 Пріоритети для обох мов
    const priorityOrder =
      lang === 'ru'
        ? [
            'Страна производ', // початок фрази
            'Производ',
            'Назначе',
            'Линия',
            'Пол',
          ]
        : ['Країна виробника', 'Виробник', 'Призначення', 'Лінія', 'Стать'];

    // 🧠 Кастомна функція сортування
    characteristics.sort((a, b) => {
      const indexA = priorityOrder.findIndex((x) => a.name.startsWith(x));
      const indexB = priorityOrder.findIndex((x) => b.name.startsWith(x));

      // Якщо обидва не в списку → звичайне алфавітне сортування
      if (indexA === -1 && indexB === -1) {
        return a.name.localeCompare(b.name, lang === 'ru' ? 'ru' : 'uk');
      }

      // Якщо лише один не в списку — він має бути вище
      if (indexA === -1) return -1;
      if (indexB === -1) return 1;

      // Якщо обидва в списку — сортуємо за порядком у масиві
      return indexA - indexB;
    });

    return characteristics;
  }

  const html =
    lang == 'ru' ? selectGoods.characteristicru : selectGoods.characteristicuk;
  const characteristics = parseCharacteristics(html, lang);
  const displayedCharacteristics = isCharacteristicsExpanded
    ? characteristics
    : characteristics.slice(0, 3);
  // Logic for displaying reviews
  const [displayedReviews, setDisplayedReviews] = useState(
    revie.listReviews.length > 0
      ? reviewsExpanded
        ? revie.listReviews
        : revie.listReviews.slice(0, 3)
      : []
  );
  useEffect(() => {
    setDisplayedReviews(
      revie.listReviews.length > 0
        ? reviewsExpanded
          ? revie.listReviews
          : revie.listReviews.slice(0, 3)
        : []
    );
  }, [reviewsExpanded]);
  const [convertYoutubeUrl, setConvertYoutubeUrl] = useState<null | string>(
    selectGoods.video ? convertYoutubeUrlToIframe(selectGoods.video) : null
  ); //
  const showWithStar = (countStar: number) => {
    const newShowReviews = revie.listReviews.filter(
      (x: any) => x.countStar == countStar
    );
    setDisplayedReviews(newShowReviews);
  };

  return (
    <div className="about-goods">
      <div id="aboutGoodsContainer" className="about-goods-container">
        <div className="text">
          <div className="description" ref={refDesctription}>
            <h2>{dictionary.title}</h2>
            {/* <div className='description-text32'>{selectGoods.description}</div> */}
            <div
              className={`description-text32 ${textExpanded ? 'expanded' : 'no-show12'}`}
              dangerouslySetInnerHTML={{ __html: text }}
            />
            <div className="add-info53">
              {lang == 'ru'
                ? '*Производитель оставляет за собой право изменить внешний вид упаковки товара. Мы стараемся следить за изменениями, но, если вы заметили какое-либо несоответствие, пожалуйста, сообщите нам об этом в письме или в комментарии к товару. Спасибо!'
                : '*Виробник залишає за собою право змінити зовнішній вигляд упаковки товару. Ми намагаємося стежити за змінами, але якщо ви помітили будь-яку невідповідність, будь ласка, повідомте нам про це в листі або коментарі до товару. Дякую!'}
            </div>
            <br />

            <div className="button-container">
              <button onClick={() => setTextExpanded(!textExpanded)}>
                {textExpanded
                  ? lang == 'ru'
                    ? 'Скрыть'
                    : 'Приховати'
                  : lang == 'ru'
                    ? 'Показать еще'
                    : 'Показати ще'}
                {textExpanded ? (
                  <span>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.70844 3.1725C8.16431 2.999 9.63695 3.30676 10.9015 4.04878C12.166 4.7908 13.153 5.9263 13.7116 7.28188C13.7637 7.4222 13.7637 7.57655 13.7116 7.71688C13.4819 8.27375 13.1783 8.79719 12.8091 9.27312M8.80282 8.84875C8.44919 9.1903 7.97556 9.37929 7.48394 9.37501C6.99232 9.37074 6.52205 9.17355 6.17441 8.82591C5.82677 8.47827 5.62957 8.008 5.6253 7.51638C5.62103 7.02476 5.81002 6.55113 6.15157 6.1975M10.9247 10.9369C10.0956 11.428 9.1706 11.735 8.21242 11.8371C7.25423 11.9392 6.28529 11.834 5.37134 11.5287C4.45738 11.2233 3.61981 10.7249 2.91545 10.0673C2.21108 9.40975 1.65641 8.60835 1.28907 7.7175C1.23698 7.57718 1.23698 7.42282 1.28907 7.2825C1.84321 5.93866 2.81824 4.81078 4.06782 4.06812M1.25032 1.25L13.7503 13.75"
                        stroke="black"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                ) : (
                  <span>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.70844 3.1725C8.16431 2.999 9.63695 3.30676 10.9015 4.04878C12.166 4.7908 13.153 5.9263 13.7116 7.28188C13.7637 7.4222 13.7637 7.57655 13.7116 7.71688C13.4819 8.27375 13.1783 8.79719 12.8091 9.27312"
                        fill="black"
                      />
                      <path
                        d="M8.80282 8.84875C8.44919 9.1903 7.97556 9.37929 7.48394 9.37501C6.99232 9.37074 6.52205 9.17355 6.17441 8.82591C5.82677 8.47827 5.62957 8.008 5.6253 7.51638C5.62103 7.02476 5.81002 6.55113 6.15157 6.1975"
                        fill="black"
                      />
                      <path
                        d="M10.9247 10.9369C10.0956 11.428 9.1706 11.735 8.21242 11.8371C7.25423 11.9392 6.28529 11.834 5.37134 11.5287C4.45738 11.2233 3.61981 10.7249 2.91545 10.0673C2.21108 9.40975 1.65641 8.60835 1.28907 7.7175C1.23698 7.57718 1.23698 7.42282 1.28907 7.2825C1.84321 5.93866 2.81824 4.81078 4.06782 4.06812"
                        fill="black"
                      />
                      <path
                        d="M1.25 1.25L13.75 13.75"
                        stroke="black"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </div>
          {selectGoods[`characteristic${lang == 'ru' ? 'ru' : 'uk'}`] && (
            <div className="characteristics" ref={refCharactersitics}>
              <h2>{dictionary.characteristics}</h2>
              <ul>
                {displayedCharacteristics.map((item, i) => (
                  <li className={`${i % 2 ? 'select' : ''}`} key={i}>
                    <p>{item.name}</p>
                    <span>{item.value}</span>
                  </li>
                ))}
                {/*<li>
                  <p>Стать</p>
                  <span>
                    {selectGoods.isForMan == null
                      ? 'Унісекс'
                      : selectGoods.isForMan
                        ? 'Для чоловіків'
                        : 'Для жінок'}
                  </span>
                </li>*/}
                {/*selectGoods.linium&&selectGoods.linium.name&&
                <li>
                  <p>Лінія</p>
                  <span>{selectGoods.linium.name}</span>
                </li>*/}
              </ul>
              <div className="button-container">
                <button
                  onClick={() =>
                    setCharacteristicsExpanded(!isCharacteristicsExpanded)
                  }
                >
                  {isCharacteristicsExpanded
                    ? lang == 'ru'
                      ? 'Скрыть'
                      : 'Приховати'
                    : lang == 'ru'
                      ? 'Показать еще'
                      : 'Показати ще'}
                  {isCharacteristicsExpanded ? (
                    <span>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.70844 3.1725C8.16431 2.999 9.63695 3.30676 10.9015 4.04878C12.166 4.7908 13.153 5.9263 13.7116 7.28188C13.7637 7.4222 13.7637 7.57655 13.7116 7.71688C13.4819 8.27375 13.1783 8.79719 12.8091 9.27312M8.80282 8.84875C8.44919 9.1903 7.97556 9.37929 7.48394 9.37501C6.99232 9.37074 6.52205 9.17355 6.17441 8.82591C5.82677 8.47827 5.62957 8.008 5.6253 7.51638C5.62103 7.02476 5.81002 6.55113 6.15157 6.1975M10.9247 10.9369C10.0956 11.428 9.1706 11.735 8.21242 11.8371C7.25423 11.9392 6.28529 11.834 5.37134 11.5287C4.45738 11.2233 3.61981 10.7249 2.91545 10.0673C2.21108 9.40975 1.65641 8.60835 1.28907 7.7175C1.23698 7.57718 1.23698 7.42282 1.28907 7.2825C1.84321 5.93866 2.81824 4.81078 4.06782 4.06812M1.25032 1.25L13.7503 13.75"
                          stroke="black"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  ) : (
                    <span>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.70844 3.1725C8.16431 2.999 9.63695 3.30676 10.9015 4.04878C12.166 4.7908 13.153 5.9263 13.7116 7.28188C13.7637 7.4222 13.7637 7.57655 13.7116 7.71688C13.4819 8.27375 13.1783 8.79719 12.8091 9.27312"
                          fill="black"
                        />
                        <path
                          d="M8.80282 8.84875C8.44919 9.1903 7.97556 9.37929 7.48394 9.37501C6.99232 9.37074 6.52205 9.17355 6.17441 8.82591C5.82677 8.47827 5.62957 8.008 5.6253 7.51638C5.62103 7.02476 5.81002 6.55113 6.15157 6.1975"
                          fill="black"
                        />
                        <path
                          d="M10.9247 10.9369C10.0956 11.428 9.1706 11.735 8.21242 11.8371C7.25423 11.9392 6.28529 11.834 5.37134 11.5287C4.45738 11.2233 3.61981 10.7249 2.91545 10.0673C2.21108 9.40975 1.65641 8.60835 1.28907 7.7175C1.23698 7.57718 1.23698 7.42282 1.28907 7.2825C1.84321 5.93866 2.81824 4.81078 4.06782 4.06812"
                          fill="black"
                        />
                        <path
                          d="M1.25032 1.25L13.7503 13.75L1.25032 1.25Z"
                          fill="black"
                        />
                        <path
                          d="M6.70844 3.1725C8.16431 2.999 9.63695 3.30676 10.9015 4.04878C12.166 4.7908 13.153 5.9263 13.7116 7.28188C13.7637 7.4222 13.7637 7.57655 13.7116 7.71688C13.4819 8.27375 13.1783 8.79719 12.8091 9.27312M8.80282 8.84875C8.44919 9.1903 7.97556 9.37929 7.48394 9.37501C6.99232 9.37074 6.52205 9.17355 6.17441 8.82591C5.82677 8.47827 5.62957 8.008 5.6253 7.51638C5.62103 7.02476 5.81002 6.55113 6.15157 6.1975M10.9247 10.9369C10.0956 11.428 9.1706 11.735 8.21242 11.8371C7.25423 11.9392 6.28529 11.834 5.37134 11.5287C4.45738 11.2233 3.61981 10.7249 2.91545 10.0673C2.21108 9.40975 1.65641 8.60835 1.28907 7.7175C1.23698 7.57718 1.23698 7.42282 1.28907 7.2825C1.84321 5.93866 2.81824 4.81078 4.06782 4.06812M1.25032 1.25L13.7503 13.75"
                          stroke="black"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="reviews" ref={refReview}>
            <div className="title">
              <h2>{lang == 'ru' ? 'Отзывов' : 'Відгуків'}</h2>
              <p>{lang == 'ru' ? selectGoods.nameru : selectGoods.nameuk}</p>
            </div>

            <AddReview goodsId={selectGoods.id} dictionary={dictionary} />
            {/*<div className='list-imgs-buys'>
              <p>
                {dictionary.photoBuys} <span>{revie.countImgs}</span>
              </p>
              <div className='list-imgs'>
                <AddReviews />
                <ListImgReviewsBuys listReviews={revie.listReviews} />
              </div>
            </div>*/}
            <div id="listReviews">
              {revie.listReviews.length > 0 ? (
                <div className="rating-review" ref={refReview}>
                  <div className="average-rating">
                    <div className="avarge">
                      <p>{revie.avarge}</p>
                      <span>
                        ({revie.listReviews.length}) {dictionary.manyreviews}
                      </span>
                    </div>
                    <ClientRating
                      name="half-rating-read"
                      defaultValue={revie.avarge}
                      precision={0.1}
                      isReadOnly={false}
                      size={27}
                    />
                  </div>
                  <div className="list-rating">
                    {[5, 4, 3, 2, 1].map((x) => (
                      <div key={x} className="count-rating five">
                        <MyClientRating value={x} />
                        <div className="rating-interest">
                          <div
                            style={{
                              width:
                                (revie[`count${x}`] / revie.countReviews) *
                                  100 +
                                '%',
                            }}
                            className="interest-select"
                          />
                          <div
                            style={{
                              width:
                                100 -
                                (revie[`count${x}`] / revie.countReviews) *
                                  100 +
                                '%',
                            }}
                            className="interest-no-select"
                          />
                        </div>
                        <p>{revie[`count${x}`]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="review-empty">
                  {lang == 'ru'
                    ? 'Отзывов пока нет, но вы можете оставить первый.'
                    : 'Отзывов пока нет, но вы можете оставить первый.'}
                </div>
              )}
            </div>
            {revie.listReviews.length > 0 && (
              <div className="list-star-and-star">
                <div className="list-star">
                  {[5, 4, 3, 2, 1].map((x) => (
                    <div
                      key={x}
                      onClick={() => showWithStar(x)}
                      className="sort-in-star"
                    >
                      <MyClientRating value={1} />
                      <p>{x}</p>
                    </div>
                  ))}
                </div>
                <div className="sort">
                  <select>
                    <option>{dictionary.forDate}</option>
                    <option>По рейтингом</option>
                  </select>
                  <div className="button-svg">
                    <SelectSortSVG />
                  </div>
                </div>
              </div>
            )}
            <div className="review">
              {displayedReviews.length > 0 ? (
                displayedReviews.map((review: any, index: any) => (
                  <Review
                    goodsId={selectGoods.id}
                    key={review.id}
                    review={review}
                  />
                ))
              ) : (
                <div className=""></div>
              )}
            </div>
          </div>
          {convertYoutubeUrl && (
            <div className="video" ref={refVideo}>
              <h2>{lang == 'ru' ? 'Видео' : 'Відео'}</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: convertYoutubeUrl,
                }}
                className="video-container"
              />
            </div>
          )}
        </div>
        <div ref={refSimilar}>
          <CardSelectGoods
            selectVolume={selectVolume}
            dictionary={dictionary}
            selectGoods={selectGoods}
            lang={lang}
            review={revie}
            isFreeDelivery={selectGoods.volumes[selectVolume].isFreeDelivery}
            isNovetly={selectGoods.isNovetly}
            isDiscount={selectGoods.isDiscount}
            isHit={selectGoods.isHit}
          />
        </div>
      </div>
      <UserWatched
        title={lang == 'ru' ? 'Вы просматривали' : 'Ви переглядали'}
        lang={lang}
        dictionary={{ reviews: lang == 'ru' ? 'Отзывы' : 'Відгуки' }}
        type=""
      />
      <AddToYouWatched
        userWatch={selectGoods.id}
        idVolume={selectGoods.volumes[0].id}
      />
    </div>
  );
};

export default AboutGoods;
