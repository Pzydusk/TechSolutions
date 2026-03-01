namespace TechSolutions.Api.DTOs
{
    public class CustomerDto
    {
        public Guid Id { get; set; }

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string? Phone { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime DateLastUpdated { get; set; }

        public byte[] RowVersion { get; set; } = Array.Empty<byte>();
    }
}
