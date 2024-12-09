<template>
  <slot></slot>
  <slot name = 'smallRabbit'></slot>
  <slot name = 'bigRabbit'></slot>
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





const { data } = toRefs(
  reactive({
    //定义数组和对象
    data: "",
  })
);
</script>
<style lang="scss" scoped>
</style>