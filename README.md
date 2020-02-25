# `<live-element>`

A custom element to live edit other custom elements. Like react-live, but for web components (custom elements).

💫️ [Demos](https://live-element.glitch.me/)

## Usage

Install by

```
yarn add @hunchcloud/live-element
```

Insert the following HTML

```html
<live-element>
  <template>
    <your-custom-element></your-custom-element>
  </template>
<live-element>
```

Then you will get a playground to live edit `<your-custom-element>`.

Notice the `<template>` wrapper is required to prevent `<your-custom-element>` rendering before being passed to `<live-element>`.

## Development

```
parcel example/demo.md
```
