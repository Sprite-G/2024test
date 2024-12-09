<template>
  <div>parent</div>
  <child>
    <p>默认插槽</p>
    <template v-slot:smallRabbit> 小兔 </template>
    <template #bigRabbit> 大兔 </template>
  </child>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  toRefs,
  toRef,
  watch,
  onMounted,
  getCurrentInstance,
} from "vue";
import child from "./child.vue";
const datac = ref(123);
const { data, version } = toRefs(
  reactive({
    //定义数组和对象
    data: "abc",
    version: "3.0.0",
  })
);
const state = reactive({
  name: "Vue 3",
  version: "3.0.0",
});
const nameRef = toRefs(state);
onMounted(() => {
  console.log("parent", (nameRef.name.value += "123"), state.name);
});
</script>
<style lang="scss" scoped></style>
