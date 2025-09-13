/**
 * A Service Locator.
 *
 * Used to register and resolve dependency in a recursive manner.
 */
class ServiceLocator {
  #registry = {};

  #cache = {};

  /**
   * @param {string} name
   * @param  {string} message
   * @return {Error}
   */
  static #buildError(name, message) {
    return new Error(`[Service Locator]: ${name}: Oops! ${message}`);
  }

  /**
   * @param {string} name
   * @param  {Function} constructor    The function used for initially instantiating the dependency.
   * @return {void}
   */
  register(name, constructor) {
    if (!name) {
      throw this.#buildError(name, 'Invalid dependency name provided');
    }

    if (typeof constructor !== 'function') {
      throw this.#buildError(name, 'Constructor is not a function');
    }

    this.#registry[name] = constructor;
  }

  /**
   * @param {string} name
   * @param {object} config
   * @returns {object}
   */
  get(name, config = {}) {
    if (this.#registry[name] === undefined) {
      throw this.#buildError(name, 'Unknown service');
    }

    if (this.#cache[name] === undefined) {
      const constructor = this.#registry[name];
      const instance = constructor(this, config);
      if (!instance) {
        throw this.#buildError(name, 'Unable to instantiate service');
      }
      this.#cache[name] = instance;
    }

    return this.#cache[name];
  }

  /**
   * @returns void
   */
  flush() {
    this.#cache = {};
  }
}

export default new ServiceLocator();
