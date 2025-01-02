<template>
  <div id="selector">
    <el-select v-model="modeType" placeholder="请选择" size="small" @change="changeMode">
      <el-option value="default" label="默认" />
      <el-option value="addNode" label='添加节点' />
      <el-option value="addEdge" label='添加边' />
    </el-select>
  </div>
  <div id="topo-config"></div>

</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  toRefs,
  watch,
  onMounted,
  nextTick,
  getCurrentInstance
} from 'vue'

import { init ,graph} from './G6'
const modeType = ref('default')
const changeMode = (val: string) => {
  graph.setMode(val)
}
onMounted(() => {

  nextTick(() => {
    init('topo-config')
  });
});



const emit = defineEmits([""])
const props = defineProps({
  propData: {
    type: String,
    default: ''
  },
})


</script>
<style scoped>
#selector {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  width: 100px;
  height: 50px;
}
</style>