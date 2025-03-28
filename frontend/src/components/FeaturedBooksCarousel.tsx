import { useEffect, useState } from 'react';
import { Book } from '../types/Book';

function FeaturedBooksCarousel() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      // Fetch a set of featured books (you can adjust this logic to suit your backend)
      const response = await fetch(
        'https://localhost:5000/Book/AllBooks?pageSize=5&pageNum=1'
      );
      const data = await response.json();
      setFeaturedBooks(data.books.slice(0, 5)); // Just show 5 featured books
    };

    fetchFeaturedBooks();
  }, []);

  return (
    <div
      id="featuredBooksCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      <h2>Suggested Books</h2>
      <div className="carousel-inner">
        {featuredBooks.map((book, index) => (
          <div
            className={`carousel-item ${index === 0 ? 'active' : ''}`}
            key={book.bookID}
          >
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
                <p className="card-text">{book.author}</p>
                <a
                  href={`/purchase/${book.title}/${book.bookID}/${book.price}`}
                  className="btn btn-primary"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Previous Button */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#featuredBooksCarousel"
        data-bs-slide="prev"
      >
        <i className="bi bi-arrow-left-circle-fill" aria-hidden="true"></i>
        <span className="visually-hidden">Previous</span>
      </button>

      {/* Next Button */}
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#featuredBooksCarousel"
        data-bs-slide="next"
      >
        <i className="bi bi-arrow-right-circle-fill" aria-hidden="true"></i>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default FeaturedBooksCarousel;
