'use client';
const limit = 20;

import type React from 'react';
import { useState, useMemo, useCallback, memo, useEffect, use } from 'react';
import './Reviews.scss';
import AdminHeader from '@/app/components/Admin/AdminHeader/AdminHeader';
import SearchSVG from '@/app/assest/Admin/Search.svg';
import type { Locale } from '@/i18n.config';
import Pagination from '@/app/components/utils/Pagination';
import Link from 'next/link';
import { $authHost } from '@/app/http';

// Demo review data

// Define types
interface Review {
  id: number;
  text: string;
  author: string;
  published: string;
  date: string;
  isShow: boolean;
  good: any;
}

interface SortConfig {
  key: keyof Review | null;
  direction: 'ascending' | 'descending' | null;
}

const REVIEWS_PER_PAGE = 10;

// Memoized review row component
const ReviewRow = memo(
  ({
    review,
    index,
    isSelected,
    onSelect,
  }: {
    review: Review;
    index: number;
    isSelected: boolean;
    onSelect: (id: number) => void;
  }) => {
    return (
      <div
        className={`review ${isSelected ? 'selected' : ''}`}
        style={{
          backgroundColor: index % 2 === 0 ? '#2695691A' : '#A5A1A100',
        }}
      >
        <div className="review-checkbox">
          <input type="checkbox" checked={isSelected} onChange={() => onSelect(review.id)} />
        </div>
        <div className="tema">
          <span className="mobile-label">Тема:</span>
          <div>{review.text}</div>
        </div>
        <div className="author">
          <span className="mobile-label">Автор:</span>
          {review.author}
        </div>
        <div className="published">
          <span className="mobile-label">Опубликовано:</span>
          {review.isShow ? (
            <Link href={`/ru/goods/${review.good.volumes[0].url}`}>{review.published}</Link>
          ) : (
            <div>{review.published}</div>
          )}
        </div>
        <div className="date">
          <span className="mobile-label">Дата обновления:</span>
          {review.date}
        </div>
        <div className="operations">
          <span className="mobile-label">Операции:</span>
          {/* <span className='edit-link'>Редактировать</span> */}
          <button className="edit-button">Редактировать</button>
        </div>
      </div>
    );
  }
);

ReviewRow.displayName = 'ReviewRow';

const ReviewsPage = ({ params }: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = use(params);
  // State for reviews and UI
  const [countReviews, setCountReviews] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('published');
  const [selectedReviews, setSelectedReviews] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState('0');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on a mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Filter reviews by search term and selected filter
  const filteredReviews = useMemo(() => {
    return reviews;
  }, []);

  // Sort reviews based on sort config
  const sortedReviews = useMemo(() => {
    const sortableReviews = [...filteredReviews];

    if (sortConfig.key && sortConfig.direction) {
      sortableReviews.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableReviews;
  }, [filteredReviews, sortConfig.key, sortConfig.direction]);

  // Calculate paginated data
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
    return sortedReviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE);
  }, [sortedReviews, currentPage]);

  // Calculate total pages
  const [totalPages, setTotalPages] = useState(0);

  // Handlers with useCallback for better performance
  const handleRequestSort = useCallback((key: keyof Review) => {
    setSortConfig((prevConfig) => {
      let direction: 'ascending' | 'descending' | null = 'ascending';

      if (prevConfig.key === key) {
        if (prevConfig.direction === 'ascending') {
          direction = 'descending';
        } else if (prevConfig.direction === 'descending') {
          direction = null;
        }
      }

      return { key, direction };
    });

    setCurrentPage(1); // Reset to first page when sorting changes
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSelectReview = useCallback((id: number) => {
    setSelectedReviews((prev) => {
      if (prev.includes(id)) {
        return prev.filter((reviewId) => reviewId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  const handleSelectAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        setSelectedReviews(reviews.map((review) => review.id));
      } else {
        setSelectedReviews([]);
      }
    },
    [reviews]
  );

  const handleBulkActionChange = (e: any) => {
    try {
      setBulkAction(e.target.value);
      //const res=await $authHost.post('review/')
    } catch (err) {
      alert('Помилка');
    }
  };

  const handleApplyBulkAction = async (e: any) => {
    try {
      const res = await $authHost.post('review/updateStatus', {
        status: bulkAction,
        ides: selectedReviews,
      });
      getNewReviews();
      setSelectedReviews([]);
    } catch (err) {
      alert('Помилка');
    }
  };

  const handleFilterChange = useCallback((filter: string) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  // Determine if all reviews on current page are selected
  const allSelected = useMemo(() => {
    return (
      paginatedReviews.length > 0 &&
      paginatedReviews.every((review) => selectedReviews.includes(review.id))
    );
  }, [paginatedReviews, selectedReviews]);

  // Get sort direction for a column
  const getSortDirection = useCallback(
    (key: keyof Review) => {
      return sortConfig.key === key ? sortConfig.direction : null;
    },
    [sortConfig]
  );

  const LOréal = "L'Oréal";
  const Paris = 'Paris';
  const getNewReviews = async () => {
    try {
      const res = await $authHost.get(`review/getAllReviews?page=${currentPage}&limit=${limit}`);
      console.log(4234324, res);
      setReviews(res.data.res);
      setCountReviews(res.data.count);
      setTotalPages(Math.ceil(res.data.count / limit));
    } catch (err) {
      alert('Помилка');
    }
  };
  useEffect(() => {
    getNewReviews();
  }, [currentPage]);

  return (
    <>
      <AdminHeader url="reviews" name="Комментарии" lang={lang} />
      <div className="admin-reviews-container">
        <div className="filter-container">
          <div className="filters">
            <div
              className={`filter ${selectedFilter === 'published' ? 'select' : ''}`}
              onClick={() => handleFilterChange('published')}
            >
              Комментарии ({countReviews})
            </div>
            {/*<div
              className={`filter ${selectedFilter === 'unapproved' ? 'select' : ''}`}
              onClick={() => handleFilterChange('unapproved')}
            >
              Неодобренные комментарии (1)
            </div>*/}
            <div className="admin-reviews-search">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Пошук..."
              />
              <div className="search-svg">
                <SearchSVG />
              </div>
            </div>
          </div>
        </div>
        <div className="selects-adn-input">
          <select value={bulkAction} onChange={handleBulkActionChange}>
            <option value="0">Массовые операции</option>
            <option value="del">Удалить комментарии</option>
            <option value="show">Опубликовать комментарии</option>
            <option value="no-show">Снять комментарии из публикации</option>
          </select>
          <button
            onClick={handleApplyBulkAction}
            disabled={!(bulkAction !== '0' && selectedReviews.length != 0)}
          >
            Применить
          </button>
        </div>

        <div className="list-reviews">
          {isMobile && (
            <div className="mobile-sort-controls">
              <div className="mobile-sort-label">Сортувати по:</div>
              <select
                onChange={(e) => handleRequestSort(e.target.value as keyof Review)}
                value={(sortConfig.key as string) || ''}
              >
                <option value="">Выберите поле</option>
                <option value="text">Тема</option>
                <option value="author">Автор</option>
                <option value="published">Опубликовано</option>
                <option value="date">Дата обновления</option>
              </select>

              {sortConfig.key && (
                <select
                  onChange={(e) =>
                    setSortConfig({
                      key: sortConfig.key,
                      direction: e.target.value as 'ascending' | 'descending' | null,
                    })
                  }
                  value={sortConfig.direction || ''}
                >
                  <option value="ascending">По возрастанию</option>
                  <option value="descending">По убыванию</option>
                </select>
              )}
            </div>
          )}

          <div className="table-container">
            <div className="review-header">
              <div className="review-checkbox">
                <input type="checkbox" checked={allSelected} onChange={handleSelectAll} />
              </div>
              <div
                className={`tema ${getSortDirection('text') ? `sorted-${getSortDirection('text')}` : ''}`}
                onClick={() => handleRequestSort('text')}
              >
                Тема
              </div>
              <div
                className={`author ${getSortDirection('author') ? `sorted-${getSortDirection('author')}` : ''}`}
                onClick={() => handleRequestSort('author')}
              >
                Автор
              </div>
              <div
                className={`published ${
                  getSortDirection('published') ? `sorted-${getSortDirection('published')}` : ''
                }`}
                onClick={() => handleRequestSort('published')}
              >
                Опубликовано
              </div>
              <div
                className={`date ${getSortDirection('date') ? `sorted-${getSortDirection('date')}` : ''}`}
                onClick={() => handleRequestSort('date')}
              >
                Дата обновления
              </div>
              <div className="operations">Операции</div>
            </div>

            {reviews.length === 0 ? (
              <div className="review emptyMessage">Нет комментариев для отображения</div>
            ) : (
              <div className="reviews-list">
                {reviews.map((review, index) => (
                  <ReviewRow
                    key={review.id}
                    review={review}
                    index={index}
                    isSelected={selectedReviews.includes(review.id)}
                    onSelect={handleSelectReview}
                  />
                ))}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination
              totalItems={countReviews}
              itemsPerPage={limit}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              countPages={Math.ceil(countReviews / limit)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ReviewsPage;
