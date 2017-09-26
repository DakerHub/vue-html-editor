<template>
  <div class="ipanel-element" :class="[editing === element.id ? 'editing' : '', element.editable ? '' : 'no-edit', className]" :style="elementCopy.style">
    <span v-if="element.text" class="ipanel-element-text">{{element.text}}</span>
    <img v-if="element.img" :src="element.img" class="ipanel-element-img"></img>
    <div class="ipanel-element-inner" v-if="element.children && element.children.length > 0">
      <i-element
        v-for="element in elementCopy.children"
        :key="element.name"
        :element="element"
        :curParEle="curParEle"
        :editing="editing"
        @edit-element="editElement">
      </i-element>
    </div>
    <span @mousedown="recodePosition($event, 0, 1)" v-show="enableDots.includes('01')" class="dot dot-n"></span>
    <span @mousedown="recodePosition($event, -1, 0)" v-show="enableDots.includes('-10')" class="dot dot-e"></span>
    <span @mousedown="recodePosition($event, 1, 0)" v-show="enableDots.includes('10')" class="dot dot-w"></span>
    <span @mousedown="recodePosition($event, 0, -1)" v-show="enableDots.includes('0-1')" class="dot dot-s"></span>
    <span @mousedown="recodePosition($event, 1, 1)" v-show="enableDots.includes('11')" class="dot dot-nw"></span>
    <span @mousedown="recodePosition($event, -1, 1)" v-show="enableDots.includes('-11')" class="dot dot-ne"></span>
    <span @mousedown="recodePosition($event, 1, -1)" v-show="enableDots.includes('1-1')" class="dot dot-sw"></span>
    <span @mousedown="recodePosition($event, -1, -1)" v-show="enableDots.includes('-1-1')" class="dot dot-se"></span>
  </div>
</template>
<script>
import Draggabilly from 'draggabilly'
export default {
  name: 'iElement',
  props: {
    element: {
      type: Object,
      required: true
    },
    editing: {
      type: Number
    },
    curParEle: {
      type: Object
    },
    className: {
      type: String
    }
  },
  data () {
    return {
      elementCopy: this.element,
      oriHeight: 0,
      oriWidth: 0,
      oriTop: 0,
      oriLeft: 0,
      mouseInterval: 0,
      draggie: null
    }
  },
  computed: {
    enableDots () {
      var dots = []
      if (this.element.id === this.editing) {
        if (this.element.resizeable === true) {
          dots = ['01', '-10', '10', '0-1', '11', '-11', '1-1', '-1-1']
        } else if (Array.isArray(this.element.resizeable)) {
          dots = this.element.resizeable
        }
      }
      return dots
    }
  },
  watch: {
    element: {
      immediate: true,
      deep: true,
      handler (element) {
        this.elementCopy = element
        if (this.draggie) {
          this.draggie.position.x = parseInt(element.style.left)
          this.draggie.position.y = parseInt(element.style.top)
        }
      }
    }
  },
  methods: {
    /**
     * 调整组件的大小
     * @param {Object} e 鼠标事件对象
     * @param {Object} moveVector 鼠标相对于起始点的移动向量
     * @param {Object} dir 调整大小的方向
     */
    resizeEle (e, moveVector, dir) {
      let north = moveVector.y
      let east = moveVector.x
      let oriTop = this.oriTop
      let oriHeight = this.oriHeight
      let oriLeft = this.oriLeft
      let oriWidth = this.oriWidth
      let top = oriTop
      let height = oriHeight
      let left = oriLeft
      let width = oriWidth
      let pHeight = parseInt(this.curParEle.style.height)
      let pWidth = parseInt(this.curParEle.style.width)

      // 右控件
      if (dir.horDir < 0) {
        if (oriWidth - east + oriLeft > pWidth) {
          width = pWidth - oriLeft
        } else if (oriWidth - east < 1) {
          width = 1
        } else {
          width = oriWidth - east
        }
      }
      // 左控件
      if (dir.horDir > 0) {
        if (oriLeft + east > 0) {
          width = oriWidth - east
          left = oriLeft + east
        } else {
          width = oriWidth + oriLeft
          left = 0
        }
        if (oriWidth - east < 1) {
          width = 1
          left = oriLeft + oriWidth - 1
        }
      }
      // 下控件
      if (dir.verDir < 0) {
        if (oriHeight - north + oriTop > pHeight) {
          height = pHeight - oriTop
        } else if (oriHeight - north < 1) {
          height = 1
        } else {
          height = oriHeight - north
        }
      }
      // 上控件
      if (dir.verDir > 0) {
        if (oriTop + north > 0) {
          height = oriHeight - north
          top = oriTop + north
        } else {
          height = oriHeight + oriTop
          top = 0
        }
        if (oriHeight - north < 1) {
          height = 1
          top = oriHeight + oriTop - 1
        }
      }
      this.draggie.position.y = top
      this.draggie.position.x = left
      top += 'px'
      left += 'px'
      height += 'px'
      width += 'px'
      this.elementCopy.style.top = top
      this.elementCopy.style.left = left
      this.elementCopy.style.height = height
      this.elementCopy.style.width = width
      // this.$emit('style-change', { id: this.elementCopy.id, style: { top, height, left, width } })
    },
    /**
     * 记录初始位置,绑定鼠标移动事件,计算鼠标移动向量
     * @param {Object} e 鼠标事件对象
     * @param {Number} horDir 水平方向 向左: 1, 向右: -1, 不变: 0
     * @param {Number} verDir 垂直方向 向上: 1, 向下: -1, 不变: 0
     */
    recodePosition (e, horDir, verDir) {
      var self = this
      this.draggie.disable()
      this.oriHeight = parseInt(this.elementCopy.style.height)
      this.oriWidth = parseInt(this.elementCopy.style.width)
      this.oriTop = parseInt(this.elementCopy.style.top)
      this.oriLeft = parseInt(this.elementCopy.style.left)
      var oriX = e.clientX
      var oriY = e.clientY
      $(document).on('mousemove.resize', function (e) {
        var moveVector = {
          x: (e.clientX - oriX) * horDir,
          y: (e.clientY - oriY) * verDir
        }
        self.resizeEle(e, moveVector, { horDir, verDir })
      }).on('mouseup', function () {
        $(this).off('.resize')
        self.draggie.enable()
      })
    },
    editElement (ele) {
      this.$emit('edit-element', ele)
    }
  },
  mounted () {
    var self = this
    this.$nextTick(function () {
      /* 阻止点击事件的冒泡,用于精确触发点击事件的目标元素的处理函数 */
      $(this.$el).on('click', (e) => { e.stopPropagation() })

      /* 新建拖拽对象,绑定到该组件,使得组件能够被拖动 */
      var draggie = new Draggabilly(this.$el, {
        containment: this.elementCopy.inParent
      })
      /* 把拖拽对象设置为组件内部全局访问 */
      this.draggie = draggie
      /* 绑定拖拽目标鼠标按下事件,设置编辑器的编辑目标为当前组件 */
      draggie.on('pointerDown', function (e, pointer) {
        e.stopPropagation()
        pointer.stopPropagation()
        self.$emit('edit-element', self.elementCopy)
      })
      /* 绑定鼠标松开事件,同步当前组件的位置数据 */
      draggie.on('pointerUp', function (e, pointer) {
        if (self.elementCopy.moveable) {
          let left = this.position.x + 'px'
          let top = this.position.y + 'px'
          self.elementCopy.style.top = top
          self.elementCopy.style.left = left
          // self.$emit('style-change', { id: self.elementCopy.id, style: { top, left } })
        }
      })
      /* 如果当前组件是不可移动组件,则禁用拖拽 */
      if (!this.element.moveable) {
        draggie.disable()
      }
    })
  }
}
</script>
<style scoped>
.dot{
  position: absolute;
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #fff;
  border: thin solid #0af;
}
.ipanel-element:not(.no-edit):hover{
  cursor: move;
  outline: thin dashed #0af;
  outline-offset: 6px;
}
.ipanel-element.editing:not(.no-edit){
  outline: thin dashed #00d0cd;
  outline-offset: 6px;
}
.ipanel-element.is-dragging:not(.no-edit){
  background-color: #3ebfff !important;
}
.ipanel-element-inner{
  height: 100%;
  height: 100%;
}
.ipanel-element-text{
  width: 100%;
  display: inline-block;
  text-align: inherit;
}
.ipanel-element-img{
  width: 100%;
  height: 100%;
}
.dot-n{
  left: calc(50% - 6px);
  top: -13px;
  cursor: n-resize;
}
.dot-s{
  top: calc(100% + 1px);
  left: calc(50% - 6px);
  cursor: s-resize;
}
.dot-e{
  top: calc(50% - 6px);
  left: calc(100% + 1px);
  cursor: e-resize;
}
.dot-w{
  top: calc(50% - 6px);
  left: -13px;
  cursor: w-resize;
}
.dot-nw{
  top: -13px;
  left: -13px;
  cursor: nw-resize;
}
.dot-ne{
  top: -13px;
  left: calc(100% + 1px);
  cursor: ne-resize;
}
.dot-sw{
  top: calc(100% + 1px);
  left: -13px;
  cursor: sw-resize;
}
.dot-se{
  top: calc(100% + 1px);
  left: calc(100% + 1px);
  cursor: se-resize;
}
</style>
