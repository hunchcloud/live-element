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
    <textarea id="editor"></textarea>
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
    const innerHTML = this.querySelector("template")?.innerHTML.trim();
    if (this.editor && innerHTML) {
      this.editor.value = innerHTML;
      this.innerHTML = innerHTML;
      this.renderHighlight(innerHTML);
    }
  }

  renderHighlight(innerHTML: string) {
    if (this.highlight) {
      this.highlight.innerHTML = Prism.highlight(
        innerHTML,
        Prism.languages.html,
        "html"
      );
    }
  }

  onChange = () => {
    if (this.editor) {
      const innerHTML = this.editor.value.trim();
      this.innerHTML = innerHTML;
      this.renderHighlight(innerHTML);
      setTimeout(() => {
        this.editor?.focus();
      });
    }
  };
}

customElements.define("live-element", LiveElement);
