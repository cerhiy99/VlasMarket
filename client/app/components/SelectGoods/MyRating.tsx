// MyRating.tsx
import './MyRating.scss';

type Props = {
  rating: number | string | null;
};

const MyRating = ({ rating }: Props) => {
  // Гарантовано перетворюємо в число
  const numericRating = Number(rating) || 0;

  // Обмежуємо від 0 до 5 для зірочок
  const validRating = Math.max(0, Math.min(5, numericRating));

  return (
    <div className="my-rating">
      <div className="stars-container">
        {[...Array(5)].map((_, i) => {
          const fillLevel = Math.max(0, Math.min(1, validRating - i));
          return (
            <div key={i} className="star-wrapper">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.6416 1.61426C5.78889 1.31905 6.2111 1.31905 6.3584 1.61426L7.23047 3.36426C7.4052 3.71454 7.73979 3.95778 8.12695 4.01562L10.0605 4.30469C10.3866 4.35377 10.5166 4.75414 10.2812 4.98535L8.88672 6.35547C8.60761 6.62985 8.48037 7.02315 8.54492 7.40918L8.86719 9.33789C8.92129 9.6632 8.58071 9.91016 8.28809 9.75781L6.55371 8.85547C6.20661 8.67491 5.79339 8.67491 5.44629 8.85547L3.71191 9.75781C3.41929 9.91016 3.07871 9.6632 3.13281 9.33789L3.45508 7.40918C3.51963 7.02315 3.39239 6.62985 3.11328 6.35547L1.71875 4.98535C1.48344 4.75414 1.61337 4.35377 1.93945 4.30469L3.87305 4.01562C4.26021 3.95778 4.5948 3.71454 4.76953 3.36426L5.6416 1.61426Z"
                  stroke={numericRating > i ? '#F80000' : '#7F7F7F'}
                  stroke-width="0.8"
                  fill={numericRating > i ? '#F80000' : 'transparent'}
                />
              </svg>
            </div>
          );
        })}
      </div>

      {/* Якщо 0 — виводимо просто 0, якщо більше — 4.50 і т.д. */}
      <p>{numericRating > 0 ? numericRating.toFixed(2) : ''}</p>
    </div>
  );
};

export default MyRating;
