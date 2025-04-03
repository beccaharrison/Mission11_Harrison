using System.Collections.Immutable;
using Microsoft.AspNetCore.Mvc;
using Mission11_Harrison.API.Controllers.Data;

namespace Mission11_Harrison.API.Controllers
{

    [Route("[controller]")]
    [ApiController]

    public class BookController : ControllerBase
    {
        private BookDbContext _bookContext;
        public BookController(BookDbContext temp) => _bookContext = temp;

        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageSize = 5, int pageNum = 1,
            [FromQuery] List<string>? bookCategory = null)
        {
            var query = _bookContext.Books.AsQueryable();
            if (bookCategory != null && bookCategory.Any())
            {
                query = query.Where(b => bookCategory.Contains(b.Category));
            }

            var books = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .Select(b => new
                {
                    b.BookID,
                    b.Title,
                    b.Author,
                    b.Publisher,
                    b.ISBN,
                    b.Classification,
                    b.Category,
                    b.PageCount,
                    b.Price
                })
                .ToList();
            
            var totalNumBooks = query.Count();

            var allBooks = new
            {
                Books = books,
                TotalNumBooks = totalNumBooks
            };
            return Ok(allBooks);
        }
        

        [HttpGet("GetBookCategory")]
        public IActionResult GetBookCategory()
        {
            var bookCategories = _bookContext.Books
                .Select(c => c.Category)
                .Distinct()
                .ToList();
            return Ok(bookCategories);
        }

        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook)
        {
            _bookContext.Books.Add(newBook);
            _bookContext.SaveChanges();
            return Ok(newBook);
        }

        [HttpPut("UpdateBook/{bookID}")]
        public IActionResult UpdateBook(int bookID, [FromBody] Book updatedBook)
        {
            var existingBook = _bookContext.Books.Find(bookID);
            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.Price = updatedBook.Price;
            
            _bookContext.Books.Update(existingBook);
            _bookContext.SaveChanges();
            
            return Ok(updatedBook);
        }

        [HttpDelete("DeleteBook/{bookID}")]
        public IActionResult DeleteProject(int bookID)
        {
            var book = _bookContext.Books.Find(bookID);

            if (book == null)
            {
                return NotFound(new { message = "Project not found" });
                
            }
            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();
            return NoContent();
        }

    }
}