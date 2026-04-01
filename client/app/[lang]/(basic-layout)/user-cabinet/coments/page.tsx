'use client';

import React, { useState } from 'react';
import './coments-cabinet-container.scss';

type ReviewItem = {
  id: number;
  image?: string;
  title?: string;
  rating: number;
  reviewsCount?: number;
  text: string;
  date: string;
};

type CommentItem = {
  id: number;
  author: string;
  rating: number;
  reviewText: string;
  reviewDate: string;
  myComment: string;
  commentDate: string;
};

const reviews: ReviewItem[] = [
  {
    id: 1,
    image: '/images/product-review-1.png',
    title:
      'Kaaral Purify Hydra Kit 2×1000 ml Набір для зволоження волосся (шампунь+кондиціонер)',
    rating: 5,
    reviewsCount: 34,
    text: 'Дуже гарна маска для волосся. Після використання волосся стало м’якшим, більш слухняним і блискучим. Добре зволожує та не обтяжує волосся. Результатом повністю задоволена.',
    date: '12 березня 2024',
  },
  {
    id: 2,
    image: '/images/product-review-2.png',
    title:
      'Kaaral Purify Hydra Kit 2×1000 ml Набір для зволоження волосся (шампунь+кондиціонер)',
    rating: 5,
    reviewsCount: 34,
    text: 'Хороша маска для відновлення волосся. Після кількох використань волосся стало більш гладким і легко розчісується. Має приємний аромат та економно витрачається.',
    date: '12 березня 2024',
  },

  {
    id: 3,
    image: '/images/product-review-2.png',
    title:
      'Kaaral Purify Hydra Kit 2×1000 ml Набір для зволоження волосся (шампунь+кондиціонер)',
    rating: 5,
    reviewsCount: 34,
    text: 'Хороша маска для відновлення волосся. Після кількох використань волосся стало більш гладким і легко розчісується. Має приємний аромат та економно витрачається.',
    date: '12 березня 2024',
  },

  {
    id: 4,
    image: '/images/product-review-2.png',
    title:
      'Kaaral Purify Hydra Kit 2×1000 ml Набір для зволоження волосся (шампунь+кондиціонер)',
    rating: 5,
    reviewsCount: 34,
    text: 'Хороша маска для відновлення волосся. Після кількох використань волосся стало більш гладким і легко розчісується. Має приємний аромат та економно витрачається.',
    date: '12 березня 2024',
  },

   {
    id: 5,
    image: '/images/product-review-1.png',
    title:
      'Kaaral Purify Hydra Kit 2×1000 ml Набір для зволоження волосся (шампунь+кондиціонер)',
    rating: 5,
    reviewsCount: 34,
    text: 'Дуже гарна маска для волосся. Після використання волосся стало м’якшим, більш слухняним і блискучим. Добре зволожує та не обтяжує волосся. Результатом повністю задоволена.',
    date: '12 березня 2024',
  },
  {
    id: 6,
    image: '/images/product-review-2.png',
    title:
      'Kaaral Purify Hydra Kit 2×1000 ml Набір для зволоження волосся (шампунь+кондиціонер)',
    rating: 5,
    reviewsCount: 34,
    text: 'Хороша маска для відновлення волосся. Після кількох використань волосся стало більш гладким і легко розчісується. Має приємний аромат та економно витрачається.',
    date: '12 березня 2024',
  },

  {
    id: 7,
    image: '/images/product-review-2.png',
    title:
      'Kaaral Purify Hydra Kit 2×1000 ml Набір для зволоження волосся (шампунь+кондиціонер)',
    rating: 5,
    reviewsCount: 34,
    text: 'Хороша маска для відновлення волосся. Після кількох використань волосся стало більш гладким і легко розчісується. Має приємний аромат та економно витрачається.',
    date: '12 березня 2024',
  },

  {
    id: 8,
    image: '/images/product-review-2.png',
    title:
      'Kaaral Purify Hydra Kit 2×1000 ml Набір для зволоження волосся (шампунь+кондиціонер)',
    rating: 5,
    reviewsCount: 34,
    text: 'Хороша маска для відновлення волосся. Після кількох використань волосся стало більш гладким і легко розчісується. Має приємний аромат та економно витрачається.',
    date: '12 березня 2024',
  },

  {
    id: 9,
    image: '/images/product-review-2.png',
    title:
      'Kaaral Purify Hydra Kit 2×1000 ml Набір для зволоження волосся (шампунь+кондиціонер)',
    rating: 5,
    reviewsCount: 34,
    text: 'Хороша маска для відновлення волосся. Після кількох використань волосся стало більш гладким і легко розчісується. Має приємний аромат та економно витрачається.',
    date: '12 березня 2024',
  },

  {
    id: 10,
    image: '/images/product-review-2.png',
    title:
      'Kaaral Purify Hydra Kit 2×1000 ml Набір для зволоження волосся (шампунь+кондиціонер)',
    rating: 5,
    reviewsCount: 34,
    text: 'Хороша маска для відновлення волосся. Після кількох використань волосся стало більш гладким і легко розчісується. Має приємний аромат та економно витрачається.',
    date: '12 березня 2024',
  }

];

const comments: CommentItem[] = [
  {
    id: 1,
    author: 'Олена К.',
    rating: 4,
    reviewText:
      'Дуже хороша маска для волосся. Після кількох використань волосся стало м’яким і більш слухняним. Також подобається, що вона добре зволожує і не обтяжує волосся.',
    reviewDate: '12 березня 2024',
    myComment:
      'Дуже гарна маска для волосся. Після використання волосся стало м’яким, більш слухняним і блискучим. Добре зволожує та не обтяжує волосся. Результатом повністю задоволена.',
    commentDate: '13 березня 2024',
  },
  {
    id: 2,
    author: 'Ірина П.',
    rating: 4,
    reviewText:
      'Маска добре зволожує волосся і приємно пахне. Після використання волосся виглядає більш доглянутим.',
    reviewDate: '12 березня 2024',
    myComment:
      'Скажіть, будь ласка, як часто ви її використовуєте? Один чи два рази на тиждень?',
    commentDate: '13 березня 2024',
  },
  {
    id: 3,
    author: 'Оксана Д.',
    rating: 4,
    reviewText: 'Дуже гарна маска, волосся стало більш гладким і блискучим.',
    reviewDate: '12 березня 2024',
    myComment: 'Підкажіть, будь ласка, чи не обтяжує вона тонке волосся?',
    commentDate: '13 березня 2024',
  },
];

const renderStars = (count: number) => {
  return '★'.repeat(count) + '☆'.repeat(5 - count);
};

const Page = () => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'comments'>('reviews');

  return (
    <div className="coments-cabinet-container">
      <h1 className="coments-cabinet-title">Відгуки та коментарі</h1>

      <div className="coments-cabinet-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Відгуки
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          Коментарі
        </button>
      </div>

      {activeTab === 'reviews' && (
        <div className="coments-cabinet-list">
          {reviews.map((item) => (
            <div className="review-card" key={item.id}>
              <div className="review-card-left">
                <div className="review-card-image">
                  <img src={item.image} alt={item.title} />
                </div>
              </div>

              <div className="review-card-center">
                <h3>{item.title}</h3>

                <div className="review-card-rating">
                  <div className="stars">{renderStars(item.rating)}</div>
                  <span>({item.reviewsCount}) Відгуків</span>
                </div>

                <p>{item.text}</p>

                <div className="review-card-actions">
                  <button type="button" className="review-action-btn">
                    <img src="/images/edit-review-icon.svg" alt="" />
                    Редагувати
                  </button>

                  <button type="button" className="review-action-btn">
                    <img src="/images/delete-review-icon.svg" alt="" />
                    Видалити
                  </button>
                </div>
              </div>

              <div className="review-card-right">{item.date}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'comments' && (
        <div className="coments-cabinet-list">
          {comments.map((item) => (
            <div className="comment-card" key={item.id}>
              <div className="comment-card-top">
                <div className="comment-card-main">
                  <div className="comment-author-row">
                    <span className="comment-author">{item.author}</span>
                    <span className="stars">{renderStars(item.rating)}</span>
                  </div>

                  <p className="comment-review-text">{item.reviewText}</p>

                  <div className="my-comment-title">↳ Ваш коментар:</div>
                  <p className="comment-my-text">{item.myComment}</p>

                  <div className="review-card-actions">
                    <button type="button" className="review-action-btn">
                      <img src="/images/edit-review-icon.svg" alt="" />
                      Редагувати
                    </button>

                    <button type="button" className="review-action-btn">
                      <img src="/images/delete-review-icon.svg" alt="" />
                      Видалити
                    </button>
                  </div>
                </div>

                <div className="comment-card-dates">
                  <div>{item.reviewDate}</div>
                  <div>{item.commentDate}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="cabinet-pagination">
        <button type="button" className="pagination-arrow">
          ←
        </button>
        <button type="button" className="pagination-btn">
          1
        </button>
        <button type="button" className="pagination-btn">
          2
        </button>
        <button type="button" className="pagination-btn active">
          3
        </button>
        <button type="button" className="pagination-btn">
          4
        </button>
        <button type="button" className="pagination-btn dots">
          ...
        </button>
        <button type="button" className="pagination-btn">
          6
        </button>
        <button type="button" className="pagination-arrow">
          →
        </button>
      </div>
    </div>
  );
};

export default Page;