/**
 * Build styles
 */
require('./paragraph/index.css').toString();

/**
 * @typedef {Object} ParagraphData
 * @description Tool's input and output data format
 * @property {String} text — Paragraph's content. Can include HTML tags: <a><b><i>
 */
class Paragraph {
  /**
   * Default placeholder for Paragraph Tool
   *
   * @return {string}
   * @constructor
   */
  static get DEFAULT_PLACEHOLDER() {
    return '';
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {object} params - constructor params
   * @param {ParagraphData} params.data - previously saved data
   * @param {ParagraphConfig} params.config - user config for Tool
   * @param {object} params.api - editor.js api
   * @param {boolean} readOnly - read only mode flag
   */
  constructor({data, config, api, readOnly}) {
    this.api = api;
    this.readOnly = readOnly;

    this._CSS = {
      block: this.api.styles.block,
      wrapper: 'ce-paragraph'
    };

    if (!this.readOnly) {
      this.onKeyUp = this.onKeyUp.bind(this);
    }

    /**
     * Placeholder for paragraph if it is first Block
     * @type {string}
     */
    this._placeholder = config.placeholder ? config.placeholder : Paragraph.DEFAULT_PLACEHOLDER;
    this._data = {};
    const { container, textElement, tagsElement} = this.drawView();
    this._textElement = textElement;
    this._containerElement = container;
    this._tagsElement = tagsElement;
    this._preserveBlank = config.preserveBlank !== undefined ? config.preserveBlank : false;

    this.data = {
      text: data.text || '',
      tags: data.tags || []
    };
  }

  /**
   * Check if text content is empty and set empty string to inner html.
   * We need this because some browsers (e.g. Safari) insert <br> into empty contenteditanle elements
   *
   * @param {KeyboardEvent} e - key up event
   */
  onKeyUp(e) {
    if (e.code !== 'Backspace' && e.code !== 'Delete') {
      return;
    }

    if (this._textElement.textContent === '') {
      this._textElement.innerHTML = '';
    }
  }

  /**
   * Create Tool's view
   * @return {HTMLElement}
   * @private
   */
  drawView() {
    let textElement = document.createElement('DIV');

    textElement.classList.add(this._CSS.wrapper, this._CSS.block);
    textElement.contentEditable = false;
    textElement.dataset.placeholder = this.api.i18n.t(this._placeholder);

    if (!this.readOnly) {
      textElement.contentEditable = true;
      textElement.addEventListener('keyup', this.onKeyUp);
    }

    let tagsElement = document.createElement('DIV');
    tagsElement.classList.add('ce-tags');

    let container = document.createElement('DIV');
    container.appendChild(textElement);
    container.appendChild(tagsElement);

    return { textElement, container, tagsElement };
  }

  /**
   * Return Tool's view
   *
   * @returns {HTMLDivElement}
   */
  render() {
    return this._containerElement;
  }

  /**
   * Method that specified how to merge two Text blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   * @param {ParagraphData} data
   * @public
   */
  merge(data) {
    let newData = {
      text: this.data.text + data.text,
      tags: [...new Set([...this.data.tags ,...data.tags])]
    };

    this.data = newData;
  }

  /**
   * Validate Paragraph block data:
   * - check for emptiness
   *
   * @param {ParagraphData} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(savedData) {
    if (savedData.text.trim() === '' && !this._preserveBlank) {
      return false;
    }

    return true;
  }

  /**
   * Extract Tool's data from the view
   * @param {HTMLDivElement} toolsContent - Paragraph tools rendered view
   * @returns {ParagraphData} - saved data
   * @public
   */
  save(toolsContent) {
    return {
      text: toolsContent.querySelector('.ce-paragraph').innerHTML,
      tags: Array.from(toolsContent.querySelector('.ce-tags').querySelectorAll('.ce-tag'))
        .map(tag => tag.innerHTML)
    };
  }

  /**
   * On paste callback fired from Editor.
   *
   * @param {PasteEvent} event - event with pasted data
   */
  onPaste(event) {
    const data = {
      text: event.detail.data.innerHTML,
      tags: this.data.tags || []
    };

    this.data = data;
  }

  /**
   * Enable Conversion Toolbar. Paragraph can be converted to/from other tools
   */
  static get conversionConfig() {
    return {
      export: 'text', // to convert Paragraph to other block, use 'text' property of saved data
      import: 'text' // to covert other block's exported string to Paragraph, fill 'text' property of tool data
    };
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      text: {
        br: true,
      }
    };
  }

  /**
   * Returns true to notify the core that read-only mode is supported
   *
   * @return {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Get current Tools`s data
   * @returns {ParagraphData} Current data
   * @private
   */
  get data() {
    this._data.text =  this._textElement.innerHTML;
    this._data.tags = Array.from(this._tagsElement.querySelectorAll('.ce-tag'))
        .map(tag => tag.innerHTML);

    return this._data;
  }

  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   *
   * @param {ParagraphData} data — data to set
   * @private
   */
  set data(data) {
    this._data = data || {};

    this._textElement.innerHTML = this._data.text || '';
    this._tagsElement.innerHTML = (this._data.tags || [])
      .map(tag => `<span class='ce-tag tag-${tag}'>${tag}</span>`).join('');
  }

  /**
   * Used by Editor paste handling API.
   * Provides configuration to handle P tags.
   *
   * @returns {{tags: string[]}}
   */
  static get pasteConfig() {
    return {
      tags: [ 'P' ]
    };
  }

  /**
   * Icon and title for displaying at the Toolbox
   *
   * @return {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: require('./paragraph/toolbox-icon.svg').default,
      title: 'Text'
    };
  }

  renderSettings(){
    const settings = [
      {
        name: 'feature'
      },
      {
        name: 'persona'
      },
      {
        name: 'irrelevant'
      },
      
    ];
    const wrapper = document.createElement('div');

    settings.forEach( tune => {
      let button = document.createElement('div');

      // button.classList.add('cdx-settings-button');
      button.classList.toggle('cdx-settings-button--active', this.data.tags.includes(tune.name));
      button.innerHTML = tune.name;
      wrapper.appendChild(button);
      
      button.addEventListener('click', () => {
        this._toggleTag(tune.name);
        button.classList.toggle('cdx-settings-button--active');
      });
    });

    return wrapper;
  }
  
  _toggleTag(tag) {
    if (this.data.tags.includes(tag)) {
      let data = this.data;
      // console.log('remove tag', tag, "tags:", data.tags, data.tags.indexOf(tag));
      data.tags.splice(data.tags.indexOf(tag), 1);
      // console.log(data);
      this.data = data;
    }
    else {
      console.log('add tag', tag);
      let data = this.data;
      data.tags.push(tag);
      this.data = data;
    }
  }
}

module.exports = Paragraph;