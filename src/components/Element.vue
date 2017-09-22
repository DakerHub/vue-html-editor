<template>
  <div class="ipanel-element" :class="editing === element.id ? 'editing' : ''" :style="elementCopy.style">
    <div class="ipanel-element-inner">
      <i-element
        v-for="element in elementCopy.children"
        :key="element.name"
        :element="element">
      </i-element>
    </div>
    <span @mousedown="recodePosition($event)" class="dot dot-n"></span>
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
    resizeEle (e, moveVector) {
      let north = moveVector.y
      let oriTop = this.oriTop
      let oriHeight = this.oriHeight
      let top
      let height
      if (oriHeight - north > 1) {
        top = oriTop + north + 'px'
        height = oriHeight - north + 'px'
      } else {
        top = oriTop + oriHeight - 1 + 'px'
        height = '1px'
      }
      if (oriTop + north < 0) {
        top = '0px'
        height = oriTop + oriHeight + 'px'
      }
      this.elementCopy.style.top = top
      this.draggie.position.y = parseInt(top)
      this.elementCopy.style.height = height
      this.$emit('style-change', { id: this.elementCopy.id, style: { top, height } })
    },
    recodePosition (e) {
      var self = this
      this.draggie.disable()
      this.oriHeight = parseInt(this.elementCopy.style.height)
      this.oriTop = parseInt(this.elementCopy.style.top)
      var oriX = e.clientX
      var oriY = e.clientY
      $(document).on('mousemove.resize', function (e) {
        var moveVector = {
          x: e.clientX - oriX,
          y: e.clientY - oriY
        }
        self.resizeEle(e, moveVector)
      }).on('mouseup', function () {
        $(this).off('.resize')
        self.draggie.enable()
      })
    }
  },
  mounted () {
    var self = this
    this.$nextTick(function () {
      var draggie = new Draggabilly(this.$el, {
        containment: this.elementCopy.inParent
      })
      this.draggie = draggie
      $(this.$el).on('mousedown', function (e) {
        e.stopPropagation()
        self.$emit('edit-element', self.elementCopy.id)
      })
      draggie.on('pointerDown', function (e, pointer) {
        pointer.stopPropagation()
      })
      draggie.on('pointerUp', function (e, pointer) {
        let left = this.position.x + 'px'
        let top = this.position.y + 'px'
        self.elementCopy.style.top = top
        self.elementCopy.style.left = left
        self.$emit('style-change', { id: self.elementCopy.id, style: { top, left } })
      })
    })
  }
}
</script>
<style scoped>
.dot{
  position: relative;
  display: none;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #fff;
  border: thin solid #0af;
}
.ipanel-element:hover{
  cursor: move;
  background-color: #0af !important;
  outline: thin dashed #0af;
  outline-offset: 2px;
}
.ipanel-element:hover .dot{
  display: block;
}
.ipanel-element.editing{
  outline: thin dashed #0af;
  background-color: #0af !important;
  outline-offset: 2px;
}
.ipanel-element.is-dragging{
  background-color: #3ebfff !important;
}
.dot-n{
  left: calc(50% - 5px);
  top: -8px;
  cursor: n-resize;
}
</style>
