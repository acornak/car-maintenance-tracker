module.exports = {
    testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "ts-jest",
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "ts-jest",
    },
    testEnvironment: "jsdom",
  };
  