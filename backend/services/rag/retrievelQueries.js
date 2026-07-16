const SECURITY_QUERY = `
Retrieve all repository content related to application security.

Prioritize files containing:

- Authentication logic
- Authorization and access control
- Login and signup functionality
- JWT or OAuth implementation
- Session management
- API keys and secrets
- Environment variables (.env, config files)
- Password hashing and verification
- Middleware
- Input validation and sanitization
- File upload handling
- Database queries that could introduce SQL Injection
- User supplied input
- CORS configuration
- CSRF protection
- Security headers
- Rate limiting
- Sensitive configuration

Return the code that would allow a senior security engineer to identify security vulnerabilities, insecure coding practices, secret exposure, authentication flaws, authorization issues, and OWASP Top 10 risks.
`;

const ARCHITECTURE_QUERY = `
Retrieve the repository content that explains the software architecture.

Prioritize files containing:

- Folder structure
- Entry points
- Routes
- Controllers
- Services
- Models
- Database layer
- Configuration files
- Dependency injection
- Middleware
- API organization
- Business logic
- Utility modules
- Project initialization
- Application flow

Return the code that best represents the overall software architecture, modularity, separation of concerns, maintainability, scalability, and design patterns.
`;

const PERFORMANCE_QUERY = `
Retrieve repository content related to runtime performance and scalability.

Prioritize files containing:

- Database operations
- Loops
- Nested loops
- Async/await logic
- Promise handling
- API requests
- External service calls
- File system operations
- Network requests
- Memory intensive code
- Expensive computations
- Caching
- Batch processing
- Pagination
- Concurrency
- Background jobs

Return the code most useful for identifying performance bottlenecks, inefficient algorithms, blocking operations, scalability issues, unnecessary computations, and resource-intensive logic.
`;

const DOCUMENTATION_QUERY = `
Retrieve all documentation and developer guidance from the repository.

Prioritize files containing:

- README.md
- Documentation files
- Setup instructions
- Installation guides
- Configuration documentation
- API documentation
- Project overview
- Code comments
- Environment setup
- Examples
- Usage instructions
- Developer onboarding guides

Return the repository content required to evaluate documentation quality, project clarity, ease of setup, maintainability, completeness, and developer experience.
`;

const SECURITY_K = 10;
const ARCHITECTURE_K = 12;
const PERFORMANCE_K = 10;
const DOCUMENTATION_K = 10;

module.exports = {
    SECURITY_QUERY,
    ARCHITECTURE_QUERY,
    PERFORMANCE_QUERY,
    DOCUMENTATION_QUERY,
    SECURITY_K,
    ARCHITECTURE_K,
    PERFORMANCE_K,
    DOCUMENTATION_K
};