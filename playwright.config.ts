import { defineConfig, devices } from '@playwright/test';

const uiBaseURL = process.env.REGI_PY_BASE_URL ?? 'http://localhost:30050';
const apiBaseURL = process.env.REGI_PY_API_BASE_URL ?? 'http://localhost:30050';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: uiBaseURL,
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: undefined,
  metadata: {
    uiBaseURL,
    apiBaseURL,
  },
});
