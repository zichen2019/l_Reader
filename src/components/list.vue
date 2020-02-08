<template>
  <div class="list">
      <Dragable>
        <ul slot="list">
          <li v-for="i in 10" v-bind:key="i" class="list-item" :class="{'first': i % 2 == 0}">
            {{`测试数据_${i}`}}
          </li>
        </ul>
      </Dragable>
  </div>
</template>

<script>
import Dragable from './dragable'
export default {
  name: 'dragable',
  components: {
    Dragable
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list-item {
  padding: 10px;
  margin:10px 10px 0;
  width: calc(100vw - 40px);
  border: 1px solid #c5c5c5;
  border-radius: 5px;
}
ul, li {
  list-style: none
}
.first {
  background: #c5c5c5
}
.list {
  /* margin-top: 30px; */
}
</style>
