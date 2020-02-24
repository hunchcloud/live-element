const template = document.createElement("template");

template.innerHTML = `
<style>
:host {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
<textarea></textarea>
<slot></slot>
`;

class LiveElement extends HTMLElement {
  editor: HTMLElement | null = null;
  preview: HTMLElement | null = null;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));

    this.editor = shadow.querySelector("textarea");
    this.preview = shadow.querySelector("slot");

    this.editor.addEventListener("input", this.onChange);
  }

  connectedCallback() {
    const innerHTML = this.querySelector("template").innerHTML;
    this.editor.value = innerHTML;
    this.innerHTML = innerHTML;
  }

  onChange = (e: HTMLInputEvent) => {
    this.innerHTML = e.target.value;
    e.target.focus();
  };
}

customElements.define("live-element", LiveElement);
