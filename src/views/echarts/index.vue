<template>
  <div style="width: 800px;height: 600px;">
    <echarts :option="option1"></echarts>
  </div>
  <div style="width: 800px;height: 600px;">
    <echarts :option="option2"></echarts>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  toRefs,
  watch ,
  onMounted,
  getCurrentInstance
} from 'vue'
import option1 from './params/options1';
import option2 from './params/options2';
const option = ref({
  title: {
    text: "Traffic Sources",
    left: "center",
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
  },
  legend: {
    orient: "vertical",
    left: "left",
    data: ["Direct", "Email", "Ad Networks", "Video Ads", "Search Engines"],
  },
  series: [
    {
      // name: "Traffic Sources",
      type: "pie",
      radius: "55%",
      center: ["50%", "60%"],
      data: [
        { value: 335, name: "Direct" },
        { value: 310, name: "Email" },
        { value: 234, name: "Ad Networks" },
        { value: 135, name: "Video Ads" },
        { value: 1548, name: "Search Engines" },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
});
import echarts from './chartsComp.vue'

</script>
<style lang="scss" scoped>
</style>