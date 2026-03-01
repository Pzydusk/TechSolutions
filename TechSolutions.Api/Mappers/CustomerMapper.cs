using TechSolutions.Api.DTOs;
using TechSolutions.Api.Models;

namespace TechSolutions.Api.Mappers
{
    public static class CustomerMapper
    {
        public static CustomerDto ToDto(this Customer entity)
        {
            return new CustomerDto
            {
                Id = entity.Id,
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                Email = entity.Email,
                Phone = entity.Phone,
                DateCreated = entity.DateCreated,
                DateLastUpdated = entity.DateLastUpdated,
                RowVersion = entity.RowVersion
            };
        }

        public static Customer ToEntity(this CreateCustomerDto dto)
        {
            return new Customer
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone
            };
        }
    }
}
