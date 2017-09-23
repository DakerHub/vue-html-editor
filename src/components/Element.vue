<template>
  <div class="ipanel-element" :class="[editing === element.id ? 'editing' : '', element.editable ? '' : 'no-edit', className]" :style="elementCopy.style">
    <div class="ipanel-element-inner">
      <i-element
        v-for="element in elementCopy.children"
        :key="element.name"
        :element="element"
        :curParEle="curParEle"
        :editing="editing"
        @edit-element="editElement">
      </i-element>
    </div>
    <span @mousedown="recodePosition($event, 0, 1)" v-show="editing === element.id && element.editable" class="dot dot-n"></span>
    <span @mousedown="recodePosition($event, -1, 0)" v-show="editing === element.id && element.editable" class="dot dot-e"></span>
    <span @mousedown="recodePosition($event, 1, 0)" v-show="editing === element.id && element.editable" class="dot dot-w"></span>
    <span @mousedown="recodePosition($event, 0, -1)" v-show="editing === element.id && element.editable" class="dot dot-s"></span>
    <span @mousedown="recodePosition($event, 1, 1)" v-show="editing === element.id && element.editable" class="dot dot-nw"></span>
    <span @mousedown="recodePosition($event, -1, 1)" v-show="editing === element.id && element.editable" class="dot dot-ne"></span>
    <span @mousedown="recodePosition($event, 1, -1)" v-show="editing === element.id && element.editable" class="dot dot-sw"></span>
    <span @mousedown="recodePosition($event, -1, -1)" v-show="editing === element.id && element.editable" class="dot dot-se"></span>
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
  methods: {
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
      this.$emit('style-change', { id: this.elementCopy.id, style: { top, height, left, width } })
    },
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
    editElement (id) {
      this.$emit('edit-element', id)
    }
  },
  mounted () {
    var self = this
    this.$nextTick(function () {
      var draggie = new Draggabilly(this.$el, {
        containment: this.elementCopy.inParent
      })
      this.draggie = draggie
      draggie.on('pointerDown', function (e, pointer) {
        pointer.stopPropagation()
        self.$emit('edit-element', self.elementCopy.id)
      })
      draggie.on('pointerUp', function (e, pointer) {
        let left = this.position.x + 'px'
        let top = this.position.y + 'px'
        self.elementCopy.style.top = top
        self.elementCopy.style.left = left
        self.$emit('style-change', { id: self.elementCopy.id, style: { top, left } })
      })
      if (!this.element.editable) {
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
  background-color: #0af !important;
  outline: thin dashed #0af;
  outline-offset: 2px;
}
.ipanel-element.editing:not(.no-edit){
  outline: thin dashed #00d0cd;
  background-color: #00d0cd !important;
  outline-offset: 2px;
}
.ipanel-element.is-dragging:not(.no-edit){
  background-color: #3ebfff !important;
}
.ipanel-element-inner{
  height: 100%;
  height: 100%;
}
.dot-n{
  left: calc(50% - 6px);
  top: -8px;
  cursor: n-resize;
}
.dot-s{
  top: calc(100% - 4px);
  left: calc(50% - 6px);
  cursor: s-resize;
}
.dot-e{
  top: calc(50% - 6px);
  left: calc(100% - 4px);
  cursor: e-resize;
}
.dot-w{
  top: calc(50% - 6px);
  left: -8px;
  cursor: w-resize;
}
.dot-nw{
  top: -8px;
  left: -8px;
  cursor: nw-resize;
}
.dot-ne{
  top: -8px;
  left: calc(100% - 4px);
  cursor: ne-resize;
}
.dot-sw{
  top: calc(100% - 4px);
  left: -8px;
  cursor: sw-resize;
}
.dot-se{
  top: calc(100% - 4px);
  left: calc(100% - 4px);
  cursor: se-resize;
}
</style>
