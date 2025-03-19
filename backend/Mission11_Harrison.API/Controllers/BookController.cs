using System.Collections.Immutable;
using Microsoft.AspNetCore.Mvc;
using Mission11_Harrison.API.Controllers.Data;

namespace Mission11_Harrison.API.Controllers;

[Route("[controller]")]
[ApiController]

public class BookController : ControllerBase
{
    private BookDbContext _bookContext;
    public BookController(BookDbContext temp) => _bookContext = temp;

    [HttpGet("AllBooks")]
    public IActionResult GetBooks(int pageSize = 5, int pageNum = 1)
    {
        var books = _bookContext.Books
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();
        var totalNumBooks = _bookContext.Books.Count();

        var allBooks = new
        {
            Books = books,
            TotalNumBooks = totalNumBooks
        };
        return Ok(allBooks);
    }

    [HttpGet("SortBooks")]
    public IActionResult GetSortBooks(int pageSize = 5, int pageNum = 1)
    {
        var books = _bookContext.Books
            .OrderBy(b => b.Title)
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();
        var totalSortBooks = _bookContext.Books.Count();
        var allSortBooks = new
        {
            Books = books,
            TotalNumBooks = totalSortBooks
        };
        return Ok(allSortBooks);
    }
}