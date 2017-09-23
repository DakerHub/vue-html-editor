<template>
  <div class="ipanel-html-editor">
    <div class="html-editor-container">
      <i-element
        class-name="html-editor-target"
        v-for="element in elements"
        :key="element.name"
        :element="element"
        :curParEle="curParEle"
        :editing="editing"
        @style-change="changeStyle"
        @edit-element="editElement">
      </i-element>
    </div>
    <div class="html-editor-oprater">
      <button @click="save" class="button">保存</button>
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
      editing: 0,
      curParEle: {
        style: {
          height: 0,
          width: 0
        }
      },
      elements: [{
        id: 0,
        name: 'container',
        style: {
          top: '0px',
          left: '0px',
          width: '1024px',
          height: '720px',
          borderRadius: '0px',
          backgroundColor: '#fff',
          zIndex: 1
        },
        inParent: true,
        tag: 'div',
        editable: false,
        children: []
      }],
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
      let pId = this.editing
      let newEle = {
        id: this.maxId,
        pId
      }
      $.extend(true, newEle, temp)
      util.findInTree(this.elements, function (ele, i, arr) {
        if (ele.id === pId) {
          ele.children.push(newEle)
          return false
        } else {
          return true
        }
      })
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
      console.log(id)
      this.editing = id
    },
    save () {
      var htmlStr = util.creatHtml(this.elements)
      console.log(htmlStr)
    }
  },
  mounted () {
    this.curParEle = this.elements[0]
    this.$nextTick(() => {
      let height = parseInt(this.curParEle.style.height)
      let cHeight = $('.html-editor-container').height()
      let scale = cHeight / height
      $('.html-editor-target').css('transform', 'scale(' + scale + ')')
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
  width: calc(100% - 220px);
  height: calc(100% - 220px);
  float: left;
  position: relative;
}
.html-editor-oprater{
  width: 220px;
  height: calc(100% - 220px);
  margin-bottom: 20px;
  background-color: #fff;
  float: left;
}
.html-editor-target{
  -webkit-transform-origin-x: left;
  -webkit-transform-origin-y: top;
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
.button{
  height: 36px;
  width: 100%;
  line-height: 36px;
  padding: 0 20px;
  border: none;
  background-color: #20A0FF;
  color: #fff;
  outline: none;
}
.button:hover{
  background-color: #58B7FF;
}
.button:active{
  background-color: #1D8CE0;
}
</style>
<style>
.ipanel-element{
  position: absolute;
}
</style>

