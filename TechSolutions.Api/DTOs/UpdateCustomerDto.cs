using System.ComponentModel.DataAnnotations;

namespace TechSolutions.Api.DTOs
{
    public class UpdateCustomerDto
    {
        [Required, StringLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required, StringLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Required, EmailAddress, StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [Phone, StringLength(20)]
        public string? Phone { get; set; }

        [Required]
        public byte[] RowVersion { get; set; } = Array.Empty<byte>();
    }
}
