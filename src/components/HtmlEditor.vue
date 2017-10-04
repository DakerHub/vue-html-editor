<template>
  <div class="ipanel-html-editor">
    <!-- 元素模板选择区域begin -->
    <div class="html-editor-meta">
      <div class="html-editor-meta-inner">
        <div
          class="html-editor-meta-temp"
          v-for="temp in eleTemp"
          :key="temp.name"
          :style="temp.style"
          @click="newElement(temp)">
          <div v-if="temp.text">{{temp.text}}</div>
          <img v-if="temp.img" :src="temp.img" class="html-editor-meta-temp-img"></img>
        </div>
      </div>
    </div>
    <!-- 元素模板选择区域end -->
    
    <!-- 元素编辑区域begin -->
    <div class="html-editor-container">
      <i-element
        class-name="html-editor-target"
        v-for="element in elements"
        :key="element.id"
        :element="element"
        :curParEle="curParEle"
        :editing="editing"
        @style-change="changeStyle"
        @show-img-selector="imgSelectShow = true"
        @edit-element="editElement">
      </i-element>
    </div>
    <!-- 元素编辑区域end -->
    
    <!-- 元素属性编辑区域begin -->
    <div class="html-editor-oprater">
      <div class="html-editor-oprater-title">属性编辑</div>
      <div class="html-editor-oprater-content">
        <el-form label-width="90px">
          <!-- 调节宽度begin -->
          <el-form-item label="宽度(width)">
            <input
              :class="['input-left', curEle.resizeable ? '' : 'disabled']"
              type="number"
              :value="parseInt(curEle.style.width || 0) || 0"
              :disabled="!curEle.resizeable"
              @input="(e) => {editStyle(e.target.value, 'width')}"
              @blur="(e) => {validInput(e, 'width')}">
              <span class="input-right">px</span>
          </el-form-item>
          <!-- 调节宽度end -->

          <!-- 调节高度begin -->
          <el-form-item label="高度(height)">
             <input
              :class="['input-left', curEle.resizeable ? '' : 'disabled']"
              type="number"
              :disabled="!curEle.resizeable"
              :value="parseInt(curEle.style.height || 0) || 0"
              @input="(e) => {editStyle(e.target.value, 'height')}"
              @blur="(e) => {validInput(e, 'height')}">
              <span class="input-right">px</span>
          </el-form-item>
          <!-- 调节高度end -->

          <!-- 调节上边距begin -->
          <el-form-item label="上边距(top)">
            <input
              :class="['input-left', curEle.moveable ? '' : 'disabled']"
              type="number"
              :disabled="!curEle.moveable"
              :value="parseInt(curEle.style.top || 0) || 0"
              @input="(e) => {editStyle(e.target.value, 'top')}"
              @blur="(e) => {validInput(e, 'top')}">
              <span class="input-right">px</span>
          </el-form-item>
          <!-- 调节上边距end -->

          <!-- 调节左边距begin -->
          <el-form-item label="左边距(left)">
            <input
              :class="['input-left', curEle.moveable ? '' : 'disabled']"
              type="number"
              :disabled="!curEle.moveable"
              :value="parseInt(curEle.style.left || 0) || 0"
              @input="(e) => {editStyle(e.target.value, 'left')}"
              @blur="(e) => {validInput(e, 'left')}">
              <span class="input-right">px</span>
          </el-form-item>
          <!-- 调节左边距end -->

          <!-- 选择背景颜色begin -->
          <el-form-item label="背景颜色">
            <span class="color-preview" :style="{backgroundColor: curEle.style.backgroundColor}"></span>
            <el-button @click="(e) => { showColorSelector(e, 'bgColorSelectorShow') }" :disabled="!curEle.editable" size="mini" class="color-btn">选择颜色</el-button>
          </el-form-item>
          <!-- 选择背景颜色end -->

          <!-- 调节边框宽度begin -->
          <el-form-item label="边框宽度">
              <input
              :class="['input-left', curEle.editable ? '' : 'disabled']"
              type="number"
              :disabled="!curEle.editable"
              :value="parseInt(curEle.style.borderWidth || 0) || 0"
              @input="(e) => {editStyle(e.target.value, 'borderWidth')}"
              @blur="(e) => {validInput(e, 'borderWidth')}">
              <span class="input-right">px</span>
          </el-form-item>
          <!-- 调节边框宽度end -->

          <!-- 调节边框样式begin -->
          <el-form-item label="边框样式">
              <el-select 
              v-model="curEle.style.borderStyle" 
              size="mini"
              :disabled="!curEle.editable || !curEle.style.borderWidth">
              <el-option label="实线" value="solid"></el-option>
              <el-option label="虚线" value="dashed"></el-option>
              <el-option label="点线" value="dotted"></el-option>
            </el-select>
          </el-form-item>
          <!-- 调节边框样式end -->

          <!-- 调节边框颜色begin -->
          <el-form-item label="边框颜色">
              <span class="color-preview" :style="{backgroundColor: curEle.style.borderColor || '#000'}"></span>
              <el-button @click="(e) => { showColorSelector(e, 'bdColorSelectorShow') }" :disabled="!curEle.style.borderWidth" size="mini" class="color-btn">选择颜色</el-button>
          </el-form-item>
          <!-- 调节边框颜色end -->

          <!-- 调节圆角半径begin -->
          <el-form-item label="圆角半径">
            <input
              :class="['input-left', 'input-short' , curEle.editable ? '' : 'disabled']"
              type="number"
              :disabled="!curEle.editable"
              :value="parseInt(curEle.style.borderRadius || 0) || 0"
              @input="(e) => {editStyle(e.target.value, 'borderRadius')}"
              @blur="(e) => {validInput(e, 'borderRadius')}">
              <el-select 
                v-model="unit.borderRadiusUnit" 
                size="mini"
                :disabled="!curEle.editable"
                @change="() => {editStyle(parseInt(curEle.style.borderRadius), 'borderRadius')}"
                class="select-right">
                <el-option label="px" value="px"></el-option>
                <el-option label="%" value="%"></el-option>
              </el-select>
          </el-form-item>
          <!-- 调节圆角半径end -->

          <!-- 文字输入begin -->
          <el-form-item label="文字内容">
            <el-input v-model="curEle.text" :disabled="typeof curEle.text === 'undefined'" size="mini"></el-input>
          </el-form-item>
          <!-- 文字输入end -->

          <!-- 选择文字颜色begin -->
          <el-form-item label="文字颜色">
            <span class="color-preview" :style="{backgroundColor: curEle.style.color}"></span>
            <el-button @click="(e) => { showColorSelector(e, 'colorSelectorShow') }" :disabled="!curEle.text" size="mini" class="color-btn">选择颜色</el-button>
          </el-form-item>
          <!-- 选择文字颜色end -->

          <!-- 调节文字大小begin -->
          <el-form-item label="文字大小">
            <input
              :class="['input-left', curEle.text ? '' : 'disabled']"
              type="number"
              :disabled="!curEle.text"
              :value="parseInt(curEle.style.fontSize || 0) || 0"
              @input="(e) => {editStyle(e.target.value, 'fontSize')}"
              @blur="(e) => {validInput(e, 'fontSize')}">
              <span class="input-right">px</span>
          </el-form-item>
          <!-- 调节文字大小end -->

          <!-- 调节文字上下边距begin -->
          <el-form-item label="文字上下边距">
            <input
              :class="['input-left', curEle.text ? '' : 'disabled']"
              type="number"
              :disabled="!curEle.text || curEle.text === ''"
              :value="parseInt(curEle.style.paddingTop || 0) || 0"
              @input="(e) => {editStyle(e.target.value, 'paddingTop')}"
              @blur="(e) => {validInput(e, 'paddingTop')}">
              <span class="input-right">px</span>
          </el-form-item>
          <!-- 调节文字上下边距end -->

          <!-- 调节文字上下边距begin -->
          <el-form-item label="文字对齐">
            <el-radio-group :disabled="!curEle.text || curEle.text === ''" v-model="curEle.style.textAlign" size="mini">
              <el-radio-button label="left"></el-radio-button>
              <el-radio-button label="center"></el-radio-button>
              <el-radio-button label="right"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <!-- 调节文字上下边距end -->

          <!-- 调节文字上下边距begin -->
          <el-form-item label="文字加粗">
            <el-switch
              :disabled="!curEle.text || curEle.text === ''"
              v-model="curEle.style.fontWeight"
              on-text="粗"
              off-text="细"
              on-value="bold"
              off-value="normal">
            </el-switch>
          </el-form-item>
          <!-- 调节文字上下边距end -->

         
        </el-form>
      </div>
      <button @click="del" class="button del">删除元素</button>
      <button @click="save" class="button">保存</button>
    </div>
    <!-- 元素属性编辑区域end -->
    <color-picker v-show="bgColorSelectorShow" :style="CSPosition" :value="curEle.style.backgroundColor||'#fff'" @input="changeBgColor" class="color-picker"></color-picker>
    <color-picker v-show="colorSelectorShow" :style="CSPosition" :value="curEle.style.color||'#fff'" @input="changeColor" class="color-picker"></color-picker>
    <color-picker v-show="bdColorSelectorShow" :style="CSPosition" :value="curEle.style.borderColor||'#fff'" @input="changeBdColor" class="color-picker"></color-picker>
    <img-selector @finish-select-img="changeImg" :show.sync="imgSelectShow"></img-selector>
  </div>
</template>
<script>
import IElement from './Element'
import ImgSelector from './ImgSelector'
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
      imgSelectShow: false,
      CSPosition: {
        top: 0,
        left: 0
      },
      unit: {
        borderRadiusUnit: 'px'
      },
      colorSelectorShow: false,
      bgColorSelectorShow: false,
      bdColorSelectorShow: false,
      curParEle: {
        style: {
          height: 0,
          width: 0
        }
      },
      curEle: {
        id: 0,
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
        editable: false,
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
            borderWidth: '',
            borderColor: '',
            borderStyle: '',
            color: '',
            backgroundColor: '#b5b5b5',
            zIndex: 1
          },
          inParent: true,
          tag: 'div',
          editable: true,
          moveable: true,
          resizeable: true,
          children: []
        },
        {
          name: 'box',
          style: {
            top: '0px',
            left: '0px',
            width: '80px',
            height: '80px',
            borderRadius: '0px',
            borderWidth: '',
            borderColor: '',
            borderStyle: '',
            color: '',
            backgroundColor: '#b5b5b5',
            zIndex: 1
          },
          inParent: true,
          tag: 'img',
          img: 'http://ostjp7jb4.bkt.clouddn.com/17-9-19/40861607.jpg',
          editable: true,
          moveable: true,
          resizeable: true
        },
        {
          name: 'h1',
          style: {
            top: '0px',
            left: '0px',
            width: '80px',
            height: '',
            fontSize: '20px',
            fontWeight: 'bold',
            lineHeight: '20px',
            display: 'inline-block',
            textAlign: 'center',
            paddingTop: '10px',
            paddingBottom: '10px',
            color: '#8c8c8c',
            borderRadius: '0px',
            borderWidth: '',
            borderColor: '',
            borderStyle: '',
            backgroundColor: '',
            zIndex: 1
          },
          text: '文字标题',
          inParent: true,
          tag: 'h1',
          editable: true,
          moveable: true,
          resizeable: ['-10', '10']
        }
      ]
    }
  },
  components: {
    IElement,
    ImgSelector,
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
          ele.children && ele.children.push(newEle)
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
      var self = this
      let pId = ele.pId
      this.editing = ele.id
      this.curEle = ele
      util.findInTree(this.elements, function (ele, i, arr) {
        if (ele.id === pId) {
          self.curParEle = ele
          return false
        } else {
          return true
        }
      })
    },
    save () {
      var htmlStr = util.creatHtml(this.elements)
      console.log(htmlStr)
    },
    del () {
      var self = this
      util.findInTree(this.elements, function (ele, i, arr) {
        if (ele.editable && ele.id === self.editing) {
          arr.splice(i, 1)
          return false
        } else {
          return true
        }
      })
      this.curEle = {
        id: 0,
        style: {
          backgroundColor: ''
        }
      }
      this.editing = 0
    },
    changeImg (url) {
      this.curEle.img = url
      console.log(url)
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
        case 'borderRadius':
          valInt < 0 && (valInt = 0)
          break
        case 'fontSize':
          valInt < 12 && (valInt = 12)
          break
        case 'paddingTop':
          valInt < 0 && (valInt = 0)
          break
      }
      if (validInput) {
        e.target.value = valInt
      } else {
        var style = {}
        if (styleType === 'borderRadius') {
          valInt += this.unit.borderRadiusUnit
        } else {
          valInt += 'px'
        }
        if (styleType === 'fontSize') {
          style['lineHeight'] = valInt
        }
        if (styleType === 'paddingTop') {
          style['paddingBottom'] = valInt
        }
        style[styleType] = valInt
        console.log(style)
        this.changeStyle({
          id: this.editing,
          style
        })
      }
    },
    validInput (e, styleType) {
      this.editStyle(e.target.value, styleType, true, e)
    },
    showColorSelector (e, colorType) {
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
      if (!this[colorType]) {
        this[colorType] = true
        $(document).on('click.hideCS', function (e) {
          if ($(e.target).parents('.color-picker').length === 0) {
            $(this).off('.hideCS')
            self[colorType] = false
          }
        })
      } else {
        this[colorType] = false
      }
    },
    changeColor (color) {
      this.curEle.style.color = color.hex
    },
    changeBgColor (color) {
      this.curEle.style.backgroundColor = color.hex
    },
    changeBdColor (color) {
      this.curEle.style.borderColor = color.hex
    }
  },
  mounted () {
    var self = this
    this.curParEle = this.elements[0]
    this.$nextTick(() => {
      /* eslint-disable no-unused-vars */
      var draggie = new Draggabilly('.html-editor-oprater', {
        handle: '.html-editor-oprater-title'
      })
      $('.html-editor-target').on('click', function (e) {
        self.editing = 0
        e.stopPropagation()
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
  width: 222px;
  height: 720px;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: rgba(111, 111, 111, 0.5) 0px 0px 11px 2px;
  overflow: hidden;
  position: fixed;
  right: 0px;
  top: calc(50% - 360px);
  z-index: 998;
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
  vertical-align: top;
}
.html-editor-meta-inner{
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.html-editor-meta-temp-img{
  width: 100%;
  height: 100%;
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
  height: calc(100% - 112px);
  padding: 0 10px;
}
.html-editor-meta-temp{
  margin: 10px 0;
  cursor: pointer;
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
  cursor: pointer;
}
.button.del{
  background-color: #FF4949;
}
.button.del:hover{
  background-color: #ff8181;
}
.button.del:active{
  background-color: #d23232;
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
.input-short{
  width: calc(100% - 60px);
}
.select-right{
  width: 60px;
  vertical-align: middle;
  margin-top: -3px;
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
  z-index: 999;
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
@media screen and (max-height: 720px){
.html-editor-oprater{
  height: calc(100% - 20px);
  width: 246px;
  top: 10px;
}
.html-editor-oprater-content{
  height: calc(100% - 112px);
  overflow: auto;
}
.html-editor-container{
  overflow: auto;
}
.html-editor-target{
  top: 0px !important;
}
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
.ipanel-html-editor .select-right .el-input__inner{
  border-left: none;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}
</style>

