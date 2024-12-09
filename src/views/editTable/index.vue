<template>
  <div>
    <el-table
      :data="dataList"
         @cell-dblclick="handleCellClick"
    >
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="名称" prop="name" width="120" align="center">
        <template #default="scope">
          <el-input
            v-if="scope.row.isEdit"
            class="cell-input"
            v-model="scope.row.name"
          />
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" width="150" align="center">
        <template #default="scope">
          <el-select
            v-if="scope.row.isEdit"
            class="cell-select"
            v-model="scope.row.type"
            placeholder="请选择"
            @visible-change="(arg: any) => handleOptionVisibleChange(arg, scope.row)"
          >
            <el-option
              v-for="item in TypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="值" prop="value" width="150" align="center">
        <template #default="scope">
          <el-input
            v-if="scope.row.isEdit"
            class="cell-input"
            v-model="scope.row.value"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";

interface TempData {
  name: string;
  type: string;
  value: string;
  isEdit: boolean;
}

const TypeOptions = [
  {
    value: "Option1",
    label: "Option1",
  },
  {
    value: "Option2",
    label: "Option2",
  },
  {
    value: "Option3",
    label: "Option3",
  },
];

const dataList = reactive<TempData[]>([
  {
    name: "张三",
    type: "Option1",
    value: "value",
    isEdit: false,
  },
  {
    name: "李四",
    type: "Option2",
    value: "value",
    isEdit: false,
  },
  {
    name: "王五",
    type: "Option3",
    value: "value",
    isEdit: false,
  },
]);

let canUpdateEditingState = false;
const handleOptionVisibleChange = (isVisible: boolean, row: any) => {
  canUpdateEditingState = isVisible;
  if (!isVisible) {
    row.isEdit = false;
  }
};

const handleCompositionStart = () => {
    canUpdateEditingState = true
}
 
const handleCompositionEnd = () => {
    canUpdateEditingState = false
}
let rowa
const handleCellClick = (row: any, column: any, cell: any, event: any) => {
  if (canUpdateEditingState) return;
  rowa = row
  row.isEdit = true;
};

const handleCellLeave = (row: any, column: any, cell: any, event: any) => {
  return 
  if (canUpdateEditingState) return;
  row.isEdit = false;
};
document.body.addEventListener("click", (event) => {
  console.log('click',rowa);
  if (canUpdateEditingState) return;
  rowa.isEdit = false;
})
</script>
<style scoped>
.cell-input {
  height: 26px;
  margin-left: -10px;
}

:deep(.cell-select .el-select__wrapper) {
  height: 26px;
  min-height: 26px;
  margin-left: -11px;
}

:deep(.el-table .el-table__row) {
  height: 50px;
}
</style>
