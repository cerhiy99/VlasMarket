'use client';

import { Locale } from '@/i18n.config';
import './discountComponent.scss';
import DiamondLevel from '@/public/svgs/userNavigation/diamond.svg';
import { useTranslation } from '@/context/TranslationProvider';

interface DiscountLevelProps {
  currentAmount: number;
  lang: Locale;
}

const levels = [
  { amount: 10000, discount: 3 },
  { amount: 25000, discount: 5 },
  { amount: 50000, discount: 7 },
];

export default function DiscountLevel({ currentAmount }: DiscountLevelProps) {
  const { t } = useTranslation();
  const sortedLevels = [...levels].sort((a, b) => a.amount - b.amount);

  const currentLevelIndex = sortedLevels.findIndex(
    (level) => currentAmount >= level.amount,
  );
  const currentLevel =
    currentLevelIndex >= 0 ? sortedLevels[currentLevelIndex] : null;
  const nextLevel =
    currentLevelIndex < sortedLevels.length - 1
      ? sortedLevels[currentLevelIndex + 1]
      : null;

  const maxAmount = sortedLevels[sortedLevels.length - 1]?.amount || 0;

  const calculateProgressWidth = () => {
    if (maxAmount === 0) return 0;
    const progress = (currentAmount / maxAmount) * 100;
    return Math.min(progress, 100);
  };

  const remainingToNextLevel = nextLevel ? nextLevel.amount - currentAmount : 0;

  return (
    <div className="discount-level">
      {nextLevel ? (
        <p className="discount-level__subtitle">
          {t('discount.toNextLevel', {
            discount: nextLevel.discount,
            remaining: remainingToNextLevel.toLocaleString('uk-UA', {
              useGrouping: false,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
          })}
        </p>
      ) : (
        <p className="discount-level__subtitle">
          {t('discount.maxLevelReached', {
            discount: sortedLevels[sortedLevels.length - 1].discount,
          })}
        </p>
      )}

      <div className="discount-level__progress-container">
        {sortedLevels.map((level, index) => {
          const leftPosition = (level.amount / maxAmount) * 100;
          return (
            <div
              key={index}
              className={`discount-level__marker ${
                currentAmount >= level.amount
                  ? 'discount-level__marker--active'
                  : ''
              }`}
              style={{ left: `${leftPosition}%` }}
            >
              <DiamondLevel className="discount-level__diamond" />
              <div className="discount-level__percent">{level.discount}%</div>
              <div className="discount-level__dot"></div>
              <div className="discount-level__amount">
                {level.amount.toLocaleString('uk-UA', {
                  useGrouping: false,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                {t('discount.currency')}
              </div>
            </div>
          );
        })}

        <div className="discount-level__progress-bar">
          <div
            className="discount-level__progress"
            style={{ width: `${calculateProgressWidth()}%` }}
          ></div>
        </div>
      </div>

      <div className="discount-level__text">{t('discount.promoText')}</div>
    </div>
  );
}
