import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      // Create the query parameters for categories
      const categoryParams = selectedCategories
        .map((cat) => `bookCategories=${encodeURIComponent(cat)}`)
        .join('&');

      // Build the full request URL including page size, page number, and categories
      const url = `https://localhost:5000/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`;

      console.log(`Fetching books from: ${url}`); // Log the full URL for debugging

      try {
        const response = await fetch(url);

        // Log the response for debugging
        console.log('Raw response:', response);

        if (!response.ok) {
          console.error('Error fetching books:', response.statusText);
          return;
        }

        const data = await response.json();
        console.log('Fetched books:', data.books); // Check the response data

        // Update state with the fetched books
        setBooks(data.books);
        setTotalItems(data.totalNumBooks);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (error) {
        console.error('Error while fetching books:', error);
      }
    };

    // Trigger fetchBooks whenever pageSize, pageNum, or selectedCategories change
    fetchBooks();
  }, [pageSize, pageNum, selectedCategories]); // Dependency array ensures the effect runs when any of these values change

  return (
    <>
      {books.length === 0 ? (
        <p>No books found for the selected categories.</p>
      ) : (
        books.map((b) => (
          <div id="bookCard" className="card" key={b.bookID}>
            <h3 className="card-title">{b.title}</h3>
            <div className="card-body">
              <ul className="list-unstyled">
                <li>
                  <strong>Author: </strong>
                  {b.author}
                </li>
                <li>
                  <strong>Publisher: </strong>
                  {b.publisher}
                </li>
                <li>
                  <strong>ISBN: </strong>
                  {b.iSBN}
                </li>
                <li>
                  <strong>Classification: </strong>
                  {b.classification}
                </li>
                <li>
                  <strong>Category: </strong>
                  {b.category}
                </li>
                <li>
                  <strong>Number of Pages: </strong>
                  {b.pageCount}
                </li>
                <li>
                  <strong>Price: </strong>${b.price}
                </li>
              </ul>
              <button
                className="btn btn-success"
                onClick={() =>
                  navigate(`/purchase/${b.title}/${b.bookID}/${b.price}`)
                }
              >
                Purchase
              </button>
            </div>
          </div>
        ))
      )}

      <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>
        Previous
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          onClick={() => setPageNum(i + 1)}
          disabled={pageNum === i + 1}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={pageNum === totalPages}
        onClick={() => setPageNum(pageNum + 1)}
      >
        Next
      </button>

      <br />
      <label>
        Results per page:
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPageNum(1); // Reset page number when page size changes
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
        </select>
      </label>
    </>
  );
}

export default BookList;
