using Microsoft.EntityFrameworkCore;
using TechSolutions.Api.Models;

namespace TechSolutions.Api.Data
{
    public class TechSolutionsDBContext : DbContext
    {
        public TechSolutionsDBContext(DbContextOptions<TechSolutionsDBContext> options) : base(options)
        {
        }

        public DbSet<Models.Customer> Customers { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Customer>()
                .HasIndex(c => c.Email)
                .IsUnique();

            builder.Entity<Customer>()
                .Property(c => c.RowVersion)
                .IsRowVersion();
        }
    }
}
