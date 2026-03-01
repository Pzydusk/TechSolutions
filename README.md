# TechSolutions -- Secure Data Management System

## Architecture

TechSolutions.sln 
├── TechSolutions.Api → REST API (Business + DataLayer)
├── TechSolutions.Web → MVC Frontend (Presentation Layer) 
└──README.md

### Technology Stack

-   .NET 10 / ASP.NET Core
-   ASP.NET Core MVC
-   ASP.NET Core Web API
-   Entity Framework Core
-   SQL Server
-   ASP.NET Core Identity
-   JWT Authentication
-   JavaScript (Fetch API)
-   Bootstrap 5

------------------------------------------------------------------------

## Database Design

### Customers Table

-   Id (GUID -- Primary Key)
-   FirstName
-   LastName
-   Email (Unique validation enforced)
-   Phone
-   DateCreated
-   DateLastUpdated
-   RowVersion (Optimistic concurrency token)

### Identity Tables

-   AspNetUsers
-   AspNetRoles
-   Related Identity tables

### Design Decisions

-   GUID primary keys for scalability.
-   RowVersion for optimistic concurrency control.
-   Identity framework for secure password hashing.
-   EF Core migrations for schema management.

------------------------------------------------------------------------

## Security Implementation

### Authentication

-   JWT (JSON Web Token) authentication
-   ASP.NET Core Identity for password hashing and user management
-   Issuer, Audience, and Signing Key validation

### Authorization

-   `[Authorize]` attribute protects customer endpoints
-   Unauthorized requests return HTTP 401

### Data Protection

-   Password policy enforcement
-   Unique email validation
-   Server-side DataAnnotations validation
-   Concurrency protection via RowVersion
-   CORS policy configuration

------------------------------------------------------------------------

## Web Application Features

-   Login & Register pages
-   JWT stored in sessionStorage
-   Secure API calls via Fetch API
-   Dynamic navigation (Login / Logout toggle)
-   Protected menu items
-   Full CRUD interface for customers

------------------------------------------------------------------------

## Setup Instructions

### Prerequisites

-   .NET 10 SDK
-   SQL Server (LocalDB or full SQL Server)
-   Visual Studio 2026

### 1. Configure Database

Update the connection string in:

TechSolutions.Api/appsettings.json

Example: Server=localhost;Database=TechSolutionsDb;Trusted_Connection=True;TrustServerCertificate=True;

### 2. Apply Migrations

Using Package Manager Console:

Update-Database

Or CLI:

dotnet ef database update

### 3. Run the Solution

Set multiple startup projects:

-   TechSolutions.Api → Start
-   TechSolutions.Web → Start

Run the solution.

### To Test the Application

1.  Register a new user
2.  Login
3.  Create Add /Edit/Delete customers
4.  Logout

------------------------------------------------------------------------

## Cloud Deployment Readiness

The system is cloud-ready:

-   Stateless JWT authentication
-   Deployable to Azure App Service
-   Compatible with Azure SQL Database
-   JWT secret can be stored in Azure Key Vault
-   CI/CD ready via GitHub Actions or Azure DevOps

