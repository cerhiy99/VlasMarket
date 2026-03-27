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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  fill="#e1e6ee"
                />
                <path
                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  fill="#ff671f"
                  style={{ clipPath: `inset(0 ${100 - fillLevel * 100}% 0 0)` }}
                />
              </svg>
            </div>
          );
        })}
      </div>

      {/* Якщо 0 — виводимо просто 0, якщо більше — 4.50 і т.д. */}
      <p>{numericRating > 0 ? numericRating.toFixed(2) : 0}</p>
    </div>
  );
};

export default MyRating;
