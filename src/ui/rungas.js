function getMockData(key) {
  const mocks = {
    getHeaders: [
      ['id', 'name', 'age', 'email', 'profession', 'company', 'address'],
    ],
  };
  return mocks[key] || null;
}

export default function rungas(fn, args) {
  if (!Array.isArray(args)) args = [args];
  console.log("🚀 ~ file: rungas.js:12 ~ rungas ~ args", args)
  return 'undefined' !== typeof google
    ? new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          [fn](...args);
      })
    : Promise.resolve(getMockData(fn));
}
