<template>
  <div class="ipanel-element" :style="propsCopy.style">
    <i-element
      v-for="element in propsCopy.children"
      :key="element.name"
      :props="element">
    </i-element>
  </div>
</template>
<script>
import Draggabilly from 'draggabilly'
export default {
  name: 'iElement',
  props: {
    props: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      propsCopy: this.props
    }
  },
  mounted () {
    this.$nextTick(function () {
      var draggie = new Draggabilly(this.$el, {
        containment: this.propsCopy.inParent
      })
      // draggie.on('dragMove', function (e, pointer) {
      //   e.stopPropagation()
      //   pointer.stopPropagation()
      //   return false
      // })
      // draggie.on('pointerMove', function (e, pointer) {
      //   e.stopPropagation()
      //   pointer.stopPropagation()
      //   return false
      // })
      // draggie.on('staticClick', function (e, pointer) {
      //   e.stopPropagation()
      //   pointer.stopPropagation()
      //   return false
      // })
      // draggie.on('dragStart', function (e, pointer) {
      //   e.stopPropagation()
      //   pointer.stopPropagation()
      //   return false
      // })
      draggie.on('pointerDown', function (e, pointer) {
        e.stopPropagation()
        pointer.stopPropagation()
      })
    })
  }
}
</script>
<style scoped>
</style>
