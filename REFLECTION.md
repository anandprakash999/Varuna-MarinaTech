# Reflection on AI Agent Usage

## Learning Experience
Using an AI agent (Antigravity) for this project significantly accelerated the boilerplate setup and architectural structuring. The agent was able to quickly generate the directory structure for the Hexagonal Architecture, which can be tedious to set up manually.

## Efficiency Gains
- **Setup**: Project initialization (Vite, Express, Prisma) was automated, saving ~30 minutes.
- **Boilerplate**: Generating entities, repositories, and controllers was very fast.
- **Logic Implementation**: The agent correctly implemented the core logic for compliance calculations and pooling based on the requirements.

## Improvements for Next Time
- **Dependency Management**: There were some issues with `npm install` locking files on Windows. A more robust approach to package installation (e.g., checking for existing processes) would be better.
- **Database Setup**: Automating the database provisioning (e.g., via Docker) would make the "deployable" aspect smoother, as relying on a local Postgres instance can be flaky if not pre-configured.
- **Testing**: While the plan included tests, more focus on TDD (Test Driven Development) from the start would ensure higher code quality.

## Conclusion
The AI agent acted as a capable pair programmer, handling the heavy lifting of code generation while I focused on the architectural decisions and review. The combination of Hexagonal Architecture and AI generation proved to be powerful for maintaining clean code.
