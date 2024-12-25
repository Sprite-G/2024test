<template>
    <h1>G6</h1>
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

import { init} from './G6'


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
<style lang="scss" scoped></style>