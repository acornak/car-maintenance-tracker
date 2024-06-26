const nextJest = require("next/jest")

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
})

const customJestConfig = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    testEnvironment: "jest-environment-jsdom",
}
  
module.exports = createJestConfig(customJestConfig)

// module.exports = {
//     testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
//     transform: {
//         "^.+\\.(js|jsx|ts|tsx)$": "ts-jest",
//     },
//     moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
//     transform: {
//         "^.+\\.(js|jsx|ts|tsx)$": ["ts-jest", "tsconfig.jest.json"],
//     },
//     testEnvironment: "jsdom",
//     setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
//   };
  