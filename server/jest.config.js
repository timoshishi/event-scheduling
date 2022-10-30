/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  roots: ['./src'],
  collectCoverageFrom: ['src/**/*.ts*'],
  coveragePathIgnorePatterns: ['src/index.ts', 'src/types/', 'coverage/'],
  coverageThreshold: {
    global: {
      lines: 90,
      statements: 90,
    },
  },
};
