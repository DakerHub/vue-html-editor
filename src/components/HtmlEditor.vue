<template>
  <div class="ipanel-html-editor">
    <div class="html-editor-container">
      <i-element
        v-for="element in elements" :key="element.name"
        :props="element">
      </i-element>
    </div>
    <div class="html-editor-meta">
      <div
        v-for="temp in eleTemp"
        :key="temp.name"
        :style="temp.style"
        @click="newElement(temp)">
      </div>
    </div>
  </div>
</template>
<script>
import IElement from './Element'
export default {
  name: 'htmlEditor',
  data () {
    return {
      elements: [],
      eleTemp: [
        {
          name: 'box',
          style: {
            width: '80px',
            height: '80px',
            borderRadius: '5px',
            backgroundColor: '#b5b5b5',
            zIndex: 1
          },
          inParent: true,
          tag: 'div',
          children: [
            {
              name: 'box',
              style: {
                width: '40px',
                height: '40px',
                borderRadius: '5px',
                backgroundColor: '#666',
                zIndex: 1
              },
              inParent: true,
              tag: 'div',
              children: []
            }
          ]
        }
      ]
    }
  },
  components: {
    IElement
  },
  methods: {
    newElement (temp) {
      this.elements.push(temp)
    }
  },
  created () {
  }
}
</script>
<style scoped>
.ipanel-html-editor{
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #191919;
}
.html-editor-container{
  width: 100%;
  height: calc(100% - 220px);
  background-color: #fff;
}
.html-editor-meta{
  margin-top: 20px;
  height: 200px;
  width: 100%;
  background-color: #232527;
  display: flex;
  align-items: center;
}
.html-editor-meta div{
  margin: 0 20px;
}
</style>
<style>
.ipanel-element{
  position: absolute;
}
</style>

