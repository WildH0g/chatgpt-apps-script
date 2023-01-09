function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('ChatGPT Demo')
    .addItem('🚀 Launch', 'openModal')
    .addToUi();
}

function openModal() {
  const html = HtmlService.createHtmlOutputFromFile('ui/index');
  SpreadsheetApp.getUi()
    .showModelessDialog(html, 'TEST');
}

function main() {
  const res = chatgpt().prompt({
    prompt:
    "Create a two-dimensional JSON array with 2 rows of fake data with the following columns and their optional formats in parentheses: id (uuidv4), name (string), age (number), email, profession, company, address. The array must contain a header row. Make sure it's not an array of objects, but an array of arrays, like in a spreadsheet. The locale is Spain.",
  });
  const ar = JSON.parse(JSON.parse(res).choices[0].text);
  console.log("🚀 ~ file: app.ts:10 ~ main ~ ar", ar);
  SpreadsheetApp.getActive()
    .getActiveSheet()
    .clear()
    .getRange(1, 1, ar.length, ar[0].length)
    .setValues(ar);
}

function chatgpt() {
  const { openAIKey } = ENV;
  const url = 'https://api.openai.com';
  return new APIWrapperBuilder(url, {
    type: 'Bearer',
    token: openAIKey,
  })
    .addMethod('prompt', {
      path: '/v1/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: {
        model: 'text-davinci-003',
        prompt: '{{prompt}}',
        temperature: 0.5,
        max_tokens: 1000,
      },
    })
    .build();
}
