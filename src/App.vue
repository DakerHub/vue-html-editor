<template>
  <div id="app">
    <html-editor></html-editor>
  </div>
</template>

<script>
import HtmlEditor from './components/HtmlEditor'
export default {
  name: 'app',
  components: {
    HtmlEditor
  }
}
</script>

<style>
html, body, #app{
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
</style>
