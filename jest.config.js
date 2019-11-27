module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  // FIXME jest@24.9.0 doesn’t support BigInt (facebook/jest#8382)
  // coverageDirectory: "coverage",
  // collectCoverageFrom: ["src/**/*.ts"],
};
