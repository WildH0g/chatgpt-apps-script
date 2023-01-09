const _events = new WeakMap();

class MasterComponent extends HTMLElement {
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
    this.innerHTML = this.render();
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
   * @returns {MasterComponent}
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

  /**
   * Manages click events on the component
   * @param {Event} e The event object
   * @returns {void}
   */
  handleClick(e) {
    console.log('MasterComponent Click:', e);
  }

  /**
   * Creates HTML string for the component
   * @returns {string} HTML srint
   */
  render() {
    return /* html */ `
      <button class="button button-pink" data-ripple-light="true">
        Button
      </button>`;
  }
}

customElements.define('test-component', MasterComponent);

export default MasterComponent;