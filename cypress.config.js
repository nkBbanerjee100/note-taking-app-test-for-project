export default {
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      return config;
    },
    specPattern: 'cypress/e2e/**/*.test.cy.{js,jsx,ts,tsx}',
  },
}
