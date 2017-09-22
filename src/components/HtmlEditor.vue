<template>
  <div class="ipanel-html-editor">
    <div class="html-editor-container">
      <i-element
        v-for="element in elements"
        :key="element.name"
        :element="element"
        :editing="editing"
        @style-change="changeStyle"
        @edit-element="editElement">
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
import util from './../assets/js/util.js'
export default {
  name: 'htmlEditor',
  data () {
    return {
      maxId: 0,
      editing: -1,
      elements: [],
      eleTemp: [
        {
          name: 'box',
          style: {
            top: '0px',
            left: '0px',
            width: '80px',
            height: '80px',
            borderRadius: '5px',
            backgroundColor: '#b5b5b5',
            zIndex: 1
          },
          inParent: true,
          tag: 'div',
          editable: true,
          children: []
        }
      ]
    }
  },
  components: {
    IElement
  },
  methods: {
    newElement (temp) {
      this.maxId ++
      let newEle = {
        id: this.maxId
      }
      $.extend(true, newEle, temp)
      this.elements.push(newEle)
    },
    changeStyle (changes) {
      util.findInTree(this.elements, function (ele, i, arr) {
        if (ele.id === changes.id) {
          Object.assign(ele.style, changes.style)
          return false
        } else {
          return true
        }
      })
    },
    editElement (id) {
      this.editing = id
    }
  },
  mounted () {
    var self = this
    this.$nextTick(() => {
      $(this.$el).on('mousedown', function (e) {
        e.stopPropagation()
        self.editing = -1
      })
    })
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
  position: relative;
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

