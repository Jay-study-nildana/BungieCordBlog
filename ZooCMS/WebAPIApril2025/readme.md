# Web API April 2025

Another API project demonstrating several .NET Web API related concepts.

## Programming Principles Followed

1. Separation of Concern (Clean Code Principles)
1. Reusability
1. Testability
1. Consistency
1. Readibility
1. Decoupling
1. Scalability
1. Decoupling
1. Single Responsibility (Clean Code Principles)
1. Test Driven Development

# Concepts Covered

1. Building Web API with .NET
1. Swagger
1. Unit Testing with NUnit and Moq
1. Helper Class with the purpose of seperation of concern,
1. EF Core with SQL Server
1. EF Core with In Memory Database (for Unit Testing)
1. MOQ Usage (for Unit Testing)
1. Models - Domain and Models - DTO
1. Dependency Injection of Services
1. Dependency Injection of Helper Classes
1. Primary Key and Foreign Key usage with EF Core
1. Controller and API EndPoints with CRUD with Complex Primary Key and Foreign Key Relationships
1. Controller and API EndPoints that generate randomly generated objects and inserting them into database
1. Seeding and Disposing of Database during Unit Testing resulting in Isolated Testing
1. Usage of virtual DBSets for EF Core table creation to enable easier Unit Testing
1. Centralized Error Handling with Middleware
1. DTO Validation with Fluent Validation
1. Cache with InMemory Database
1. Unit Testing of Controllers
1. Logging to Console via ILogger
1. Logging to SQLite DB with EF Core via SeriLog

## TODO. Skipped on Purpose

1. AutoMapper. I want students to do manual mapping and later, add AutoMapper on their own.
1. Upgrade from InMemory Cache to Redis Cache

## Database

1. Add-Migration InitialCreate -context ApplicationDbContext
1. Update-Database -Context ApplicationDbContext
1. Add-Migration InitialCreate -context LoggingDbContext
1. Update-Database -Context LoggingDbContext

## Future Enhancements - TODO - in a future project

- Security:
  - Add JWT-based authentication and role-based authorization.
  - Implement rate limiting to prevent abuse.
  - Encrypt sensitive data using Azure Key Vault or ASP.NET Core Data Protection.
- API Versioning:
  - Introduce API versioning to ensure backward compatibility for future changes.
- Performance Optimization:
  - Optimize database queries with EF Core projections and `AsNoTracking`.
  - Use Redis for distributed caching.
  - Ensure all I/O-bound operations are fully asynchronous.
- Deployment and Monitoring:
  - Containerize the application using Docker.
  - Set up CI/CD pipelines with GitHub Actions or Azure DevOps.
  - Integrate Application Insights for real-time monitoring.
- Advanced Logging:
  - Add contextual information (e.g., user ID, request ID) to logs.
  - Use tools like ELK Stack or Seq for centralized log aggregation.
- API Enhancements:
  - Add pagination for endpoints returning large datasets.
  - Consider GraphQL for flexible querying.
- Testing and Quality Assurance:
  - Add integration tests to verify component interactions.
  - Perform load testing with tools like Apache JMeter or k6.
  - Use SonarQube for static code analysis.
- Scalability and High Availability:
  - Deploy to a Kubernetes cluster for auto-scaling.
  - Use read replicas for scaling database reads.
- Event-Driven Architecture:
  - Introduce RabbitMQ or Azure Service Bus for asynchronous messaging.
- Documentation and Developer Experience:
  - Enhance Swagger with detailed examples and authentication flows.
  - Create a developer portal with guides and sample applications.
- Domain-Driven Design (DDD):
  - Refactor to follow DDD principles with aggregates, value objects, and domain events.
- Internationalization (i18n):
  - Add support for multiple languages using ASP.NET Core localization.
- Cloud-Native Features:
  - Use Azure Functions or AWS Lambda for serverless tasks.
  - Implement feature flags with LaunchDarkly or Azure App Configuration.


# book a session with me

1. [calendly](https://calendly.com/jaycodingtutor/30min)

# hire and get to know me

find ways to hire me, follow me and stay in touch with me.

1. [github](https://github.com/Jay-study-nildana)
1. [personal site](https://thechalakas.com)
1. [upwork](https://www.upwork.com/fl/vijayasimhabr)
1. [fiverr](https://www.fiverr.com/jay_codeguy)
1. [codementor](https://www.codementor.io/@vijayasimhabr)
1. [stackoverflow](https://stackoverflow.com/users/5338888/jay)
1. [Jay's Coding Channel on YouTube](https://www.youtube.com/channel/UCJJVulg4J7POMdX0veuacXw/)
1. [medium blog](https://medium.com/@vijayasimhabr)
