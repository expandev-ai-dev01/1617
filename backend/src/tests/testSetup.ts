import { config } from '@/config';

export function setupTestEnvironment(): void {
  process.env.NODE_ENV = 'test';
  process.env.DB_NAME = 'todolist_test';
}

export function teardownTestEnvironment(): void {
  // Cleanup logic
}

export const testConfig = {
  ...config,
  database: {
    ...config.database,
    database: 'todolist_test',
  },
};
