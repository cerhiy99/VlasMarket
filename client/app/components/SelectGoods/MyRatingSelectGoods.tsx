// MyRating.tsx
import './MyRatingSelectGoods.scss';

type Props = {
  rating: number | string | null;
};

const MyRatingSelectGoods = ({ rating }: Props) => {
  // Гарантовано перетворюємо в число
  const numericRating = Number(rating) || 0;

  // Обмежуємо від 0 до 5 для зірочок
  const validRating = Math.max(0, Math.min(5, numericRating));

  return (
    <div className="my-rating-select-goods">
      <div className="stars-container">
        {[...Array(5)].map((_, i) => {
          const fillLevel = Math.max(0, Math.min(1, validRating - i));
          return (
            <div key={i} className="star-wrapper">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.80673 2.39362C9.29758 1.40901 10.7024 1.40901 11.1933 2.39362L12.6469 5.30939C12.841 5.69876 13.2128 5.96893 13.6431 6.03322L16.8654 6.51463C17.9535 6.67719 18.3876 8.01328 17.6028 8.78437L15.279 11.0678C14.9686 11.3728 14.8266 11.8099 14.8984 12.239L15.4363 15.4523C15.6179 16.5374 14.4814 17.3631 13.5055 16.8551L10.6157 15.3506C10.2298 15.1497 9.77018 15.1497 9.38428 15.3506L6.49446 16.8551C5.51861 17.3631 4.38207 16.5374 4.5637 15.4523L5.10158 12.239C5.17341 11.8099 5.03137 11.3728 4.72105 11.0678L2.39716 8.78437C1.61242 8.01328 2.04654 6.67719 3.13465 6.51463L6.35689 6.03322C6.78718 5.96893 7.15904 5.69876 7.35315 5.30939L8.80673 2.39362Z"
                  stroke="#F80000"
                  fill={numericRating > i ? '#F80000' : 'transpert'}
                />
              </svg>
            </div>
          );
        })}
      </div>

      {/* Якщо 0 — виводимо просто 0, якщо більше — 4.50 і т.д. */}
      {
        //<p>{numericRating > 0 ? numericRating.toFixed(2) : 0}</p>
      }
    </div>
  );
};

export default MyRatingSelectGoods;
