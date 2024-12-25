<template>
  <div class="network-topo">
    <div class="tip" v-if="showTip">
      <!-- <el-button type="primary" @click="seIsBeginNode('1', true)">开始节点</el-button>
      <el-button type="primary" @click="setIsEndNode('15', true)">结束节点</el-button>
      <el-button type="primary" @click="setFlow(['edge2', 'edge11', 'edge24'],'#40bd0b')">设置流动的链路</el-button>
      <el-button type="primary" @click="setFlow(['edge3', 'edge14', 'edge26'],'#e4a71b')">设置流动的链路</el-button> -->
      <div><img src="./topoImg/deviceBegin.png" />开始节点</div>
      <div style="margin-left: 20px">
        <img src="./topoImg/deviceEnd.png" />结束节点
      </div>
      <div style="margin-left: 20px">
        <span style="    display: inline-block;
    width: 50px;
    height: 3px;
    border-top: 3px dotted #1a9c16;
    margin-right: 5px;
    margin-bottom: 4px;"></span>主路径
      </div>
      <div style="margin-left: 20px">
        <span style="    display: inline-block;
    width: 50px;
    height: 3px;
    border-top: 3px dotted #dca74a;
    margin-right: 5px;
    margin-bottom: 4px;"></span>备路径
      </div>
    </div>
    <div class="action">
      <el-button-group>
        <el-button type="primary" @click="updatePositon" icon="Promotion">{{isUpdate?'确定':'修改位置'}}</el-button>
        <el-button type="primary" @click="downloadImage" icon="Film">下载图片</el-button>
      </el-button-group>
      
    </div>
    <div id="topo-config"></div>
  </div>
</template>
<script setup>
import { onMounted, ref, nextTick } from "vue";
import { topoUtils } from "./g6.js";
import DATA from "./data.js";

const isUpdate = ref(false);

const props = defineProps({
  // 截图框的宽高比例
  showTip: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(["node-click"]);

const init = () => {
  const DATAS = JSON.parse(JSON.stringify(DATA))
  topoUtils.init(
    "topo-config",
    {
      nodes: DATAS.nodes.map((item) => {
        // item.name = item.id;
        item.name = topoUtils.fittingString(item.devName, 80, 12);
        //   item.x = item.axisX;
        //   item.y = item.axisY;
        return item;
      }),
      edges: DATAS.edges,
    },
    (type, data) => {
      emits(type, data);
    }
  );
};

const updatePositon = () => {
  if (isUpdate.value) {
    topoUtils.setMode("default");
  } else {
    topoUtils.setMode("move");
  }
  isUpdate.value = !isUpdate.value;
}

const downloadImage = () => {
  topoUtils.downloadImage();
}

onMounted(() => {
  nextTick(() => {
    init();
  });
});
// 设置是否是开始节点
// type: true / false
const seIsBeginNode = (nodeId, type) => {
  const nodeItem = topoUtils.findById(nodeId);
  topoUtils.updateItem(nodeItem, {
    isBegin: type,
  });
};
// 设置是否是结束节点
// type: true / false
const setIsEndNode = (nodeId, type) => {
  const nodeItem = topoUtils.findById(nodeId);
  topoUtils.updateItem(nodeItem, {
    isEnd: type,
  });
};
// 设置流动
// setFlow(['edge2', 'edge11', 'edge24'],'#40bd0b')
const setFlow = (edgeIdList, color) => {
  edgeIdList.forEach((id) => {
    const edgeItem = topoUtils.findById(id);
    if (!edgeItem) return;
    topoUtils.updateItem(edgeItem, {
      flow: true,
      style: {
        stroke: color,
        lineWidth: 3
      },
    });
  });
};

defineExpose({ seIsBeginNode, setIsEndNode, setFlow });
</script>
<style scoped lang="scss">
.network-topo {
  position: relative;
  height: 100%;
  width: 100%;
  #topo-config {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }
  .tip {
    position: absolute;
    z-index: 9;
    left: 20px;
    top: 20px;
    display: flex;
    align-items: center;
    color: #333;
    img {
      width: 25px;
      vertical-align: -6px;
      margin-right: 6px;
    }
  }
  .action {
    position: absolute;
    right: 20px;
    top: 20px;
    z-index: 9;
  }
}
</style>
<style lang="scss">
/* 提示框的样式 */
.g6-tooltip {
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  font-size: 13px;
  color: #545454;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px 8px;
  box-shadow: rgb(174, 174, 174) 0px 0px 10px;
}
</style>
