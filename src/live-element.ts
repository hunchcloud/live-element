import * as PrismPkg from "prismjs";
const Prism = window.Prism || PrismPkg;

let css = "";
if (process.env.NODE_ENV === "production") {
  css = require("./live-element.css.ts");
} else {
  css = require("fs").readFileSync("./src/live-element.css", "utf8");
}

const mkTemplate = (userStyle: string | undefined) => {
  const template = document.createElement("template");

  template.innerHTML = `
<style>${css}</style>

${userStyle ||
  '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.19.0/themes/prism-solarizedlight.min.css" />'}

<div id="live-editor">
  <div style="position: relative; min-height: 100%;">
    <textarea id="editor" spellcheck="false"></textarea>
    <pre id="highlight"></pre>
  </div>
</div>
<slot></slot>
`;

  return template;
};

class LiveElement extends HTMLElement {
  $editor: HTMLTextAreaElement | null = null;
  $highlight: HTMLElement | null = null;

  connectedCallback() {
    let userStyle;
    const styleTemplateId = this.getAttribute("style-template-id");
    if (styleTemplateId) {
      const styleTemplate = document.getElementById(styleTemplateId);
      userStyle = styleTemplate?.innerHTML;
    }

    const template = mkTemplate(userStyle);
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));

    this.$editor = shadow.querySelector("#editor");
    this.$editor?.addEventListener("input", this.onChange);
    this.$highlight = shadow.querySelector("#highlight");

    /**
     * Previously we used <template>, but all `&` will become `&amp;`, so we
     * changed to use <textarea>. One downside of <textarea> is having to escape
     * inner <textarea>.
     *
     * <live-element>
     *   <textarea>
     *     Inner &lt;textarea>&lt;/textarea>
     *   </textarea>
     * </live-element>
     */
    const content = this.querySelector("textarea");
    if (content) {
      const innerHTML = this.unIndent(content.value);
      if (this.$editor && innerHTML) {
        this.$editor.value = innerHTML;
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
    if (this.$editor) {
      const innerHTML = this.$editor.value;
      this.innerHTML = innerHTML;
      this.renderHighlight(innerHTML);
      setTimeout(() => {
        this.$editor?.focus();
      });
    }
  };

  renderHighlight(innerHTML: string) {
    if (this.$highlight) {
      this.$highlight.innerHTML = Prism.highlight(
        // Append a blank character to prevent misalignment when the last line
        // is empty.
        innerHTML + " ",
        Prism.languages.html,
        "html"
      );
    }
  }
}

customElements.define("live-element", LiveElement);
