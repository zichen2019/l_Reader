<template>
  <div
    class="dragable"
    @touchstart="touchStart($event)"
    @touchmove="touchMove($event)"
    @touchend="touchEnd($event)"
    >
      <slot name="list" />
  </div>
</template>

<script>
export default {
  name: 'dragable',
  data () {
    return {
      timeOut: null,
      isLongPress: false,
      containerNode: null,

      curNode: null,
      curNodeOffsetTop: 0,
      curNodeOffsetHeight: 0,
      placeholderNode: null
    }
  },
  mounted () {
  },
  methods: {
    touchStart (e) {
      let vm = this
      vm.timeOut = setTimeout(() => { vm.isLongPress = true }, 500)

      vm.curNode = e.target
      vm.curNodeOffsetTop = e.target.offsetTop
      vm.curNodeOffsetHeight = e.target.offsetHeight
      // e.stopPropagation()
    },

    touchMove (e) {
      let vm = this
      // 获取当前节点的拖动信息
      vm.isLongPress = true

      if (!vm.containerNode) {
        vm.containerNode = e.target.parentNode
        vm.containerNode.style.position = 'relative'
      }

      if (!vm.placeholderNode) {
        vm.placeholderNode = document.createElement('p')
        vm.placeholderNode.style.height = (vm.curNode.offsetHeight * 2 / 3) + 'px'
        vm.placeholderNode.style.width = '10vw'
        vm.placeholderNode.style.margin = '0'
      }

      // 给活动节点添加虚影样式
      // vm.curNode.style.display = 'none'
      // console.log('当前拖动信息:', e.targetTouches[0].target.offsetTop)
      // console.log('当前拖动信息:', vm.curNodeOffsetTop)
      // console.log('pageY:', e.targetTouches[0].pageY)
      // console.log('e.target.parentNode.offsetTop:', e.target.parentNode.offsetTop)
      // console.log('vm.curNodeOffsetTop', vm.curNodeOffsetTop)
      // console.log('相对父级的移动距离', e.targetTouches[0].pageY - vm.curNode.parentNode.offsetTop)
      // console.log('父级长度', e.target.parentNode.offsetHeight)
      // console.log('单个节点的高度', e.target.offsetHeight)

      // 当前拖动节点 拖动到的位置索引
      let pageY = e.targetTouches[0].pageY // 当前活动节点距离页面顶部的距离
      let pageX = e.targetTouches[0].pageX // 当前活动节点距离页面最左边的距离
      vm.curNode.style.position = 'absolute'
      vm.curNode.style.top = pageY + 'px'
      vm.curNode.style.left = pageX + 'px'
      vm.curNode.style.opacity = '0.9'

      let parentOffset = vm.containerNode.offsetTop // 当前活动节点的父级节点距离页面顶部的距离
      let parentOffHeight = vm.containerNode.offsetHeight // 当前活动节点的父级节点的高度
      let parentChildsLen = vm.containerNode.children.length // 当前活动节点的父级节点的子节点个数
      let index = (pageY - parentOffset) / parentOffHeight * (parentChildsLen - 1)
      index = Math.ceil(index)
      console.log('vm.containerNode', vm.containerNode)
      console.log('vm.containerNode.children', vm.containerNode.children)
      vm.containerNode.insertBefore(vm.placeholderNode, vm.containerNode.children[index])
    },

    touchEnd (e) {
      let vm = this
      // 长按拖动结束
      clearTimeout(vm.timeOut)
      vm.timeOut = null

      if (vm.isLongPress) {
        vm.onExchangeNode()
      }

      vm.isLongPress = false
    },

    // 长按事件
    onExchangeNode (e) {
      let vm = this
      if (vm.containerNode) {
        vm.containerNode.removeChild(vm.curNode)
        vm.containerNode.insertBefore(vm.curNode, vm.placeholderNode)
        vm.containerNode.removeChild(vm.placeholderNode)

        vm.curNode.style.position = ''
        vm.curNode.style.opacity = '1'
        vm.curNode = null
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dragable {
  overflow-x: hidden;
}
p {
  margin: 0;
  padding: 0;
}
</style>
