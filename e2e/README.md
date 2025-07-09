## Root E2E Tools
This directory contains comprehensive Playwright E2E tests for the User Management Application.

# Test Files
- navbar.spec.ts - Navbar functionality tests
- pagination.spec.ts - Creates pagination if user list exceeds more than five
- api-integration.spec.ts - API error handling and integration tests
- user-management.spec.ts - Core functionality tests (navigation , form validation, create user)

# Run Tests

✅ Run all E2E tests
```
npx playwright test
```

✅ Run tests with UI
```
npx playwright test --ui
```

✅ Run from selected suite (new browser)
```
npx playwright test tests/api-integration.spec.ts
```

✅ Debug mode
```
npx playwright test --debug
```

✅ Run headed
```
npx playwright test --headed
```

✅ Install Playwright browsers
```
npx playwright install
```

# Prerequisites
- Playwright tools and browser must be started with:
  npx playwright test --ui

- Install Playwright browser:
  npx playwright install
