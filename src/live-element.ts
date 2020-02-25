import * as PrismPkg from "prismjs";

const Prism = window.Prism || PrismPkg;

const template = document.createElement("template");

template.innerHTML = `
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.19.0/themes/prism.min.css" />

<style>
:host {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

* {
  box-sizing: border-box;
}

#editor-wrap {
  position: relative;
  font-family: monospace;
  border: 1px solid gray;
  height: 100%;
  overflow: auto;
}

#editor {
  color: transparent;
  caret-color: black;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  resize: none;
  overflow: hidden;
  font: inherit;
  padding: 10px;
  white-space: pre-wrap;
  word-break: break-all;
}

#editor:focus {
  outline: none;
}

#highlight {
  position: relative;
  pointer-events: none;
  margin: 0;
  font: inherit;
  padding: 10px;
  white-space: pre-wrap;
  word-break: break-all;
}

::slotted(*) {
  min-width: 0;
  min-height: 0;
  overflow: auto;
}
</style>

<div id="editor-wrap">
  <div style="position: relative;">
    <textarea id="editor" spellcheck="false"></textarea>
    <pre id="highlight"></pre>
  </div>
</div>
<slot></slot>
`;

class LiveElement extends HTMLElement {
  editor: HTMLTextAreaElement | null = null;
  highlight: HTMLElement | null = null;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));

    this.editor = shadow.querySelector("#editor");
    this.highlight = shadow.querySelector("#highlight");

    this.editor?.addEventListener("input", this.onChange);
  }

  connectedCallback() {
    const template = this.querySelector("template");
    if (template) {
      const innerHTML = this.unIndent(template.innerHTML);
      if (this.editor && innerHTML) {
        this.editor.value = innerHTML;
        this.innerHTML = innerHTML;
        this.renderHighlight(innerHTML);
      }
    }
  }

  /**
   * Get the indentation level (space count: `n`) of the last line (assumed as
   * the closing tag), remove `n` leading spaces of each line.
   */
  unIndent(str: string) {
    const lines = str.trim().split("\n");
    const length = lines.length;
    if (length) {
      const index = lines[length - 1].search(/[^\s]/);
      for (let i = 0; i < length; i++) {
        if (lines[i].slice(0, index).trim() === "") {
          lines[i] = lines[i].slice(index);
        }
      }
    }
    return lines.join("\n");
  }

  onChange = () => {
    if (this.editor) {
      const innerHTML = this.editor.value;
      this.innerHTML = innerHTML;
      this.renderHighlight(innerHTML);
      setTimeout(() => {
        this.editor?.focus();
      });
    }
  };

  renderHighlight(innerHTML: string) {
    if (this.highlight) {
      this.highlight.innerHTML = Prism.highlight(
        innerHTML,
        Prism.languages.html,
        "html"
      );
    }
  }
}

customElements.define("live-element", LiveElement);
