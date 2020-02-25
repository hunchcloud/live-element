<style>
  live-element {
    width: 50rem;
    margin: 0 auto;
    height: 12rem;
    grid-gap: 1rem;
  }
  .tabs {
    display: flex;
    cursor: pointer;
    border-bottom: 1px solid lightgray;
  }
  .tabs > * {
    padding: 0.5rem 1rem;
  }
  .tabs > *.active {
    color: royalblue;
    border-bottom: 2px solid currentcolor;
  }
  .panels {
    padding: 1rem;
  }
</style>

<live-element>
  <template>
    <hunch-tabs>
      <div slot="tabs" class="tabs">
        <div>tab 1</div>
        <div>tab 2tab tab tab tab tab tab tab tab tab 222222222</div>
      </div>
      <div slot="panels" class="panels">
        <div>panel1panel1111111111111111111111111111111111111111111111111111111111111111111</div>
        <div>panel2</div>
      </div>
    </hunch-tabs>
  </template>
</live-element>

<script src="https://unpkg.com/@hunchcloud/elements@0.2.1/dist/hunch-tabs.js"></script>
<script src="../src/live-element.ts"></script>
