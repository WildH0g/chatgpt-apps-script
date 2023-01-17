import rungas from './rungas.js';

async function getHeaders() {
  return await rungas('getHeaders');
}

(async function () {
  try {
    const headers = (await getHeaders()).flat();
    console.log('🚀 ~ file: app.js:9 ~ headers', headers);
    const chatgptInput = document.querySelector('chatgpt-input');
    chatgptInput.displayOptions(headers);
  } catch (err) {
    console.log('Could not fetch headers:', err);
  }
})();
