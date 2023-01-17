function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('ChatGPT Demo')
    .addItem('🚀 Launch', 'openModal')
    .addToUi();
}

function openModal() {
  const html = HtmlService.createHtmlOutputFromFile('ui/index')
    .setWidth(500)
    .setHeight(700);
  SpreadsheetApp.getUi().showModelessDialog(html, 'TEST');
}

function main(fields, numLines, locale = 'France') {
  const fieldsStr = fields
    .map(field => {
      let fieldStr = field.name;
      if (field.type) fieldStr += ` (${field.type})`;
      return fieldStr;
    })
    .join(', ')
    .replace(/[, ]*$/g, '');
  console.log("🚀 ~ file: app.js:23 ~ main ~ fieldsStr", fieldsStr);
  const prompt = `Create a two-dimensional JSON array with ${numLines} ${numLines > 1 ? 'rows' : 'row'} of fake data with the following columns and their optional formats in parentheses: ${fieldsStr}. Make sure it's not an array of objects, but an array of arrays, like in a spreadsheet. All values must be strings. The locale is ${locale}.`;

  console.log("🚀 ~ file: app.js:25 ~ main ~ prompt", prompt);

  const res = chatgpt().prompt({
    prompt,
  });
  console.log("🚀 ~ file: app.js:29 ~ res ~ res", res.getContentText())
  const ar = JSON.parse(JSON.parse(res).choices[0].text);
  console.log('🚀 ~ file: app.ts:32 ~ main ~ ar', ar);
  const ws = SpreadsheetApp.getActive().getActiveSheet();

  const lr = ws.getLastRow();

  ws.getRange(lr + 1, 1, ar.length, ar[0].length).setValues(ar);
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

function getHeaders() {
  try {
    const ws = SpreadsheetApp.getActive().getActiveSheet();
    const lc = ws.getLastColumn();
    return ws.getRange(1, 1, 1, lc).getDisplayValues();
  } catch (err) {
    return err;
  }
}
