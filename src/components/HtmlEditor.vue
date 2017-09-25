<template>
  <div class="ipanel-html-editor">
    <div class="html-editor-meta">
      <div
        v-for="temp in eleTemp"
        :key="temp.name"
        :style="temp.style"
        @click="newElement(temp)">
      </div>
    </div>
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
      <div class="html-editor-oprater-title">属性编辑</div>
      <div class="html-editor-oprater-content">
        <el-form label-width="90px" @blur="console.log(arguments)">
          <el-form-item label="宽度(width)">
            <input
              :class="['input-left', curEle.resizeable ? '' : 'disabled']"
              type="number"
              :value="parseInt(curEle.style.width || 0)"
              :disabled="!curEle.resizeable"
              @input="(e) => {editStyle(e.target.value, 'width')}"
              @blur="(e) => {validInput(e, 'width')}">
              <span class="input-right">px</span>
          </el-form-item>
          <el-form-item label="高度(height)">
             <input
              :class="['input-left', curEle.resizeable ? '' : 'disabled']"
              type="number"
              :disabled="!curEle.resizeable"
              :value="parseInt(curEle.style.height || 0)"
              @input="(e) => {editStyle(e.target.value, 'height')}"
              @blur="(e) => {validInput(e, 'height')}">
              <span class="input-right">px</span>
          </el-form-item>
          <el-form-item label="上边距(top)">
            <input
              :class="['input-left', curEle.moveable ? '' : 'disabled']"
              type="number"
              :disabled="!curEle.moveable"
              :value="parseInt(curEle.style.top || 0)"
              @input="(e) => {editStyle(e.target.value, 'top')}"
              @blur="(e) => {validInput(e, 'top')}">
              <span class="input-right">px</span>
          </el-form-item>
          <el-form-item label="左边距(left)">
            <input
              :class="['input-left', curEle.moveable ? '' : 'disabled']"
              type="number"
              :disabled="!curEle.moveable"
              :value="parseInt(curEle.style.left || 0)"
              @input="(e) => {editStyle(e.target.value, 'left')}"
              @blur="(e) => {validInput(e, 'left')}">
              <span class="input-right">px</span>
          </el-form-item>
          <el-form-item label="颜色">
            <span class="color-preview" :style="{backgroundColor: curEle.style.backgroundColor}"></span>
            <el-button @click="showColorSelector" size="mini" class="color-btn">选择颜色</el-button>
          </el-form-item>
        </el-form>
      </div>
      <button @click="save" class="button">保存</button>
    </div>
    <color-picker v-show="colorSelectorShow" :style="CSPosition" v-model="curEle.style.backgroundColor" class="color-picker"></color-picker>
  </div>
</template>
<script>
import IElement from './Element'
import util from './../assets/js/util.js'
import Draggabilly from 'draggabilly'
import { Chrome } from 'vue-color'
export default {
  name: 'htmlEditor',
  data () {
    return {
      maxId: 0,
      editing: 0,
      backgroundColor: {
        hex: '#fff'
      },
      CSPosition: {
        top: 0,
        left: 0
      },
      colorSelectorShow: false,
      curParEle: {
        style: {
          height: 0,
          width: 0
        }
      },
      curEle: {
        id: -1,
        style: {
          top: '',
          left: '',
          width: '',
          height: '',
          borderRadius: '',
          backgroundColor: '',
          zIndex: 1
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
        editable: true,
        moveable: false,
        resizeable: false,
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
          moveable: true,
          resizeable: true,
          children: []
        }
      ]
    }
  },
  components: {
    IElement,
    ColorPicker: Chrome
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
    editElement (ele) {
      this.editing = ele.id
      this.curEle = ele
    },
    save () {
      var htmlStr = util.creatHtml(this.elements)
      console.log(htmlStr)
    },
    editStyle (val, styleType, validInput, e) {
      var valInt = parseInt(val || 1)
      switch (styleType) {
        case 'width':
          let left = parseInt(this.curEle.style.left)
          valInt = valInt + left > 1024 ? 1024 - left : valInt
          break
        case 'height':
          let top = parseInt(this.curEle.style.top)
          valInt = valInt + top > 720 ? 720 - top : valInt
          break
        case 'top':
          let height = parseInt(this.curEle.style.height)
          valInt = valInt + height > 720 ? 720 - height : valInt
          break
        case 'left':
          let width = parseInt(this.curEle.style.width)
          valInt = valInt + width > 1024 ? 1024 - width : valInt
          break
      }
      if (validInput) {
        e.target.value = valInt
      } else {
        var style = {}
        valInt += 'px'
        style[styleType] = valInt
        this.changeStyle({
          id: this.editing,
          style
        })
      }
    },
    validInput (e, styleType) {
      this.editStyle(e.target.value, styleType, true, e)
    },
    showColorSelector (e) {
      e.stopPropagation()
      var self = this
      var x = e.clientX
      var y = e.clientY + 20
      var winW = window.innerWidth
      var winH = window.innerHeight
      if (x + 225 > winW) {
        x = winW - 225
      }
      if (y + 242 > winH) {
        y = y - 282
      }
      this.CSPosition.top = y + 'px'
      this.CSPosition.left = x + 'px'
      console.log(this.colorSelectorShow)
      if (!this.colorSelectorShow) {
        this.colorSelectorShow = true
        console.log(this.colorSelectorShow)
        $(document).on('click.hideCS', function (e) {
          if ($(e.target).parents('.color-picker').length === 0) {
            $(this).off('.hideCS')
            self.colorSelectorShow = false
          }
        })
      } else {
        this.colorSelectorShow = false
      }
    }
  },
  mounted () {
    this.curParEle = this.elements[0]
    this.$nextTick(() => {
      /* eslint-disable no-unused-vars */
      var draggie = new Draggabilly('.html-editor-oprater', {
        handle: '.html-editor-oprater-title'
      })
    })
  }
}
</script>
<style scoped>
.ipanel-html-editor{
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  background-color: #191919;
  font-size: 0;
}
.html-editor-container{
  width: 1024px;
  height: 100%;
  margin-left: 20px;
  display: inline-block;
  position: relative;
}
.html-editor-oprater{
  width: 220px;
  height: 600px;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: rgba(111, 111, 111, 0.5) 0px 0px 11px 2px;
  overflow: hidden;
  position: fixed;
  right: 0px;
  top: calc(50% - 360px);
  z-index: 9999;
}
.html-editor-target{
  -webkit-transform-origin-x: left;
  -webkit-transform-origin-y: top;
  top: calc(50% - 360px) !important;
}
.html-editor-meta{
  display: inline-block;
  height: 100%;
  width: 160px;
  background-color: #232527;
}
.html-editor-oprater-title{
  height: 40px;
  line-height: 40px;
  background-color: #D3DCE6;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  color: #1F2D3D;
  cursor: move;
}
.html-editor-oprater-content{
  height: calc(100% - 76px);
  padding: 0 10px;
}
.html-editor-meta div{
  margin: 20px 0;
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
.input-left{
  appearance: none;
  background-color: #fff;
  background-image: none;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border: 1px solid #bfcbd9;
  box-sizing: border-box;
  color: #1f2d3d;
  display: inline-block;
  font-size: inherit;
  height: 22px;
  line-height: 1;
  outline: none;
  padding: 3px 10px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  width: calc(100% - 30px);
  vertical-align: middle;
}
.input-left:hover {
  border-color: #8391a5;
}
.input-left:focus {
  outline: none;
  border-color: #20a0ff;
}
.input-left.disabled{
  background-color: #eef1f6;
  border-color: #d1dbe5;
  color: #bbb;
  cursor: not-allowed;
}
.input-right{
  width: 30px;
  display: inline-block;
  text-align: center;
  height: 22px;
  vertical-align: middle;
  line-height: 17px;
  border: 1px solid #bfcbd9;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-left: none;
  box-sizing: border-box;
}
.color-picker{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}
.color-preview{
  display: inline-block;
  height: 22px;
  width: 40px;
  border-radius: 4px;
  border: 1px solid #bfcbd9;
  vertical-align: middle;
}
.color-btn{
  vertical-align: middle;
  margin-left: 5px;
}
</style>
<style>
.ipanel-element{
  position: absolute;
}
.ipanel-html-editor .el-form-item__label{
  font-size: 12px;
}
.ipanel-html-editor .el-form-item__content{
  font-size: 0px;
}
.ipanel-html-editor .el-form-item__content input, 
.ipanel-html-editor .el-form-item__content span{
  font-size: 12px;
}
.ipanel-html-editor .el-form-item{
  margin-bottom: 0px;
  font-size: 0px;
}
</style>

