using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechSolutions.Api.Data;
using TechSolutions.Api.DTOs;
using TechSolutions.Api.Mappers;
using TechSolutions.Api.Models;

namespace TechSolutions.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly TechSolutionsDBContext _db;

        public CustomersController(TechSolutionsDBContext db) => _db = db;
        // GET: api/customers
        [HttpGet]
        public async Task<ActionResult<List<CustomerDto>>> GetAll()
        {
            var customers = await _db.Customers
                .AsNoTracking()
                .Select(c => c.ToDto())
                .ToListAsync();

            return Ok(customers);
        }


        // GET: api/customers/{id}
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<CustomerDto>> GetById([FromRoute] Guid id)
        {
            var customer = await _db.Customers
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id);

            return customer is null ? NotFound() : Ok(customer.ToDto());
        }

        [HttpPost]
        public async Task<ActionResult<CustomerDto>> Create([FromBody] CreateCustomerDto dto)
        {
            var emailExists = await _db.Customers.AnyAsync(c => c.Email == dto.Email);
            if (emailExists)
                return Conflict("A customer with this email already exists.");

            var entity = dto.ToEntity();
            entity.DateCreated = DateTime.UtcNow;
            entity.DateLastUpdated = DateTime.UtcNow;

            _db.Customers.Add(entity);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity.ToDto());
        }

        // PUT: api/customers/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateCustomerDto dto)
        {
            var customer = await _db.Customers.FirstOrDefaultAsync(c => c.Id == id);
            if (customer is null) return NotFound();

            _db.Entry(customer).Property(c => c.RowVersion).OriginalValue = dto.RowVersion;

            var emailExists = await _db.Customers.AnyAsync(c => c.Email == dto.Email && c.Id != id);
            if (emailExists)
                return Conflict("A customer with this email already exists.");

            customer.FirstName = dto.FirstName;
            customer.LastName = dto.LastName;
            customer.Email = dto.Email;
            customer.Phone = dto.Phone;

            customer.DateLastUpdated = DateTime.UtcNow;

            try
            {
                await _db.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict("This customer was updated by someone else. Reload and try again.");
            }
        }

        // DELETE: api/customers/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            var customer = await _db.Customers.FirstOrDefaultAsync(c => c.Id == id);
            if (customer is null) return NotFound();

            _db.Customers.Remove(customer);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}
