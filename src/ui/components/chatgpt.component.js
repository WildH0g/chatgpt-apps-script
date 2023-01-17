/******************
 *
 * RESOURCES
 *
 * https://www.material-tailwind.com/
 * https://flowbite.com/
 *
 *
 ******************/

import getSpinner from './getSpinner.js';
import rungas from '../rungas.js';
import locales from './locales.js';

const _events = new WeakMap();
class ChatGPTInput extends HTMLElement {
  /**
   * @param {string} name The name of the child component
   * @param {boolean} shadow Create shadow DOM or not
   */
  constructor() {
    super();
    _events.set(this, []);
  }

  /**
   * Executes when added to the DOM
   * @returns {void}
   */
  connectedCallback() {
    this.attachEvent(this, 'click', this.handleClick.bind(this));
    this.innerHTML = this.render(getSpinner());
  }

  /**
   * Executes when removed from the DOM
   * @returns {void}
   */
  disconnectedCallback() {
    this.detachAllEvents();
  }

  /**
   * Attaches an event to the component
   * @param {Element} element The element to observe
   * @param {string} type The event type
   * @param {Function} callback The callback to execute
   * @param {Object} [options] Event listener options
   * @returns {ChatGPTInput}
   */
  attachEvent(element, type, callback, options) {
    element.addEventListener(type, callback, options);
    _events.get(this).push({ element, type, callback });
    return this;
  }

  /**
   * Removes all events, typically called by disconnectedCallback
   * @returns {void}
   */
  detachAllEvents() {
    _events.get(this).forEach(event => {
      event.element.removeEventListener(
        event.type,
        event.callback,
        event.options
      );
    });
  }

  qs = path => this.querySelector(path);
  qsa = path => [...this.querySelectorAll(path)];

  /**
   * Manages click events on the component
   * @param {Event} e The event object
   * @returns {void}
   */
  async handleClick(e) {
    if ('submit' !== e.composedPath()[0].dataset.action) return;
    const fields = this.qsa('[data-header]').map(field => ({
      name: field.dataset.header,
      type: field.value,
    }));
    const num = this.qs('[data-numlines]').value;
    const locale = this.qs('[data-locale]').value;
    this.innerHTML = this.render(getSpinner());
    try {
      const response = await rungas('main', [fields, num, locale]);
      if ('undefined' === typeof google) return;
      google?.script?.host?.close();
    } catch(err) {
      console.error('Could not send data:', err);
    }
  }

  async displayOptions(headers) {
    const headersGrid = _getHeadersHTML(headers);
    const numLinesGrid = _getNumLinesHTML();
    const submitButton = _getSubmitButtonHTML();
    const locales = _getLocalesHTML('fr-FR');
    this.innerHTML = this.render(
      headersGrid,
      numLinesGrid,
      locales,
      submitButton
    );
    await this.importJS('input');
    await this.importJS('ripple');
    await this.importJS(
      'choices.min',
      'https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/'
      );
    new Choices(this.qs('#choice-search'), {});
    await this.importJS('select');
  }

  /**
   * Creates HTML string for the component
   * @returns {string} HTML sring
   */
  render() {
    return [...arguments].join('');
  }

  async importJS(file, baseUrl) {
    const defaultBaseUrl =
      'https://unpkg.com/@material-tailwind/html@latest/scripts/';
    const base = baseUrl || defaultBaseUrl;
    return await import(`${base}${file}.js`);
  }
}

function _getHeadersHTML(headers) {
  return /* html */ `
    <div class="grid grid-cols-2">
    <div class="pb-5 pt-5 font-bold uppercase">Column</div>
    <div class="pb-5 pt-5 font-bold uppercase">Type/description</div>
    ${headers
      .map(header => {
        return /* html */ `
        <div class="pb-5">${header}</div>
        <div class="input-group input-group-outline pb-1  z-0">
          <label class="form-label">${header}</label>
          <input type="text" class="form-control" data-header="${header}" />
        </div>
      `;
      })
      .join('')}
  </div>
  `;
}

function _getNumLinesHTML() {
  return /* html */ `
    <div class="flex justify-start mt-10">
    <div class="mr-5">Enter the number of lines to generate:</div>
    <div class="input-group input-group-outline pb-1 w-24  z-0">
        <label class="form-label">#</label>
        <input type="number" class="form-control" value="2" data-numlines />
      </div>
    </div>
  `;
}

function _getSubmitButtonHTML() {
  return /* html */ `
    <button class="button button-pink mt-10" data-ripple-light="true" data-action="submit">
      Submit
    </button>
  `;
}

function _getLocalesHTML(defaultLocale) {
  const localesAr = Object.entries(locales).map(([key, value]) => {
    return {
      name: value.englishName,
      code: key,
    };
  });
  return /* html */ `
    <div class="mt-10">
      <p>Choose a locale:</p>
      <select
        class="form-control z-50"
        name="choice-search"
        id="choice-search"
        placeholder="Locale"
        data-locale
      >
      ${
        localesAr.map(locale => {
          const isDefault = !!defaultLocale && locale.code === defaultLocale;
          return /* html */ `
            <option${isDefault ? ' selected' : ''} value="${locale.code}">${locale.name}</option>
          `;
        })
      }
      </select>
    </div>
  `;
}

customElements.define('chatgpt-input', ChatGPTInput);

export default ChatGPTInput;
