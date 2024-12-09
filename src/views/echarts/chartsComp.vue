<template>
  <div :style="{ height: chartHeight || '100%', width: '100%' }" ref="chart"></div>
</template>

<script setup lang="ts">
import {
  getCurrentInstance,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue"

const chart = ref<HTMLDivElement>()
const { proxy } = getCurrentInstance() as any

const myChart = ref()
/**
 * @description 基础配置
 * @param {object} option 配置对象
 * @param {string} chartHeight echarts 容器高度
 */

const props = defineProps(["option", "chartHeight"])

onMounted(() => {
  // ！！！这里必须用markRaw包裹住，否则当页面宽度变化控制台会报错
  myChart.value = markRaw(proxy.$echarts.init(chart.value as HTMLDivElement))
  myChart.value.setOption(props.option)

  // 监听页面视图变化echarts图的宽度变化
  window.addEventListener("resize", () => {
    myChart.value.resize()
  })
  nextTick(() => {
    myChart.value.resize()
  })
})

watch(
  () => props.option,
  (newValue, oldValue) => {
    myChart.value.clear()
    myChart.value.setOption(props.option)
  },
  { deep: true }
)

// 组件销毁前一定要取消监听的事情，不然会影响性能和暂用内存
onBeforeUnmount(() => {
  window.removeEventListener("resize", () => {
    myChart.value.resize()
  })
})
</script>

<style scoped lang="scss"></style>
