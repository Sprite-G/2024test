<template>
<div>
    <!-- 添加或修改菜单对话框 -->
    <el-dialog title="新增组织机构" v-model="visible" width="680px" append-to-body :close-on-click-modal="false">
      <el-form ref="dataFormRef" :model="dataForm" :rules="rules" label-width="100px">
        <el-form-item label="组织机构" prop="name">
          <el-input v-model.trim="dataForm.name" placeholder="请输入组织机构"/>
        </el-form-item>
        <el-form-item label="机构编码" prop="code">
          <el-input v-model.trim="dataForm.code" placeholder="请输入机构编码"/>
        </el-form-item>
        <el-form-item label="上级机构" prop="parentId">
          <el-tree-select
              v-model="dataForm.parentId"
              :data="treeData"
              placeholder="选择上级机构"
              check-strictly
              node-key="id"
              :default-expanded-keys="[dataForm.parentId]"
              :default-checked-keys="[dataForm.parentId]"
          />
          <!-- <div @click="getOrgName" style="cursor: pointer;width:100%">
            <el-input v-model="dataForm.parentName" readonly placeholder="请选择上级机构"/>
          </div> -->
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input v-model="dataForm.orderNum" type="number" placeholder="请输入排序"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="dataForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="visible=false">取 消</el-button>
          <el-button type="primary" @click="submitForm" :loading="loading">确 定</el-button>
        </div>
      </template>
    </el-dialog>
</div>
</template>
<script name="Org">
  import {defineComponent, reactive} from "vue";
  // import * as systemApi from "@/api/systemApi"

  export default defineComponent({
  name: "org-modal",
  props:{
    data: { type: Object, default() {return {}} },
  },
  setup() {
    return reactive({
        visible: false,
        treeData: [],
        rules:{
          name: [{ required: true, message: '请输入组织机构', trigger: 'blur' }],
          code: [{ required: true, message: '请选择机构编码', trigger: 'blur' }],
          parentId: [{ required: true, message: '请选择上级机构', trigger: 'blur',type: "number" }],
          orderNum: [{ required: true, message: '请输入排序', trigger: 'blur' }],
          status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        },
        treeRes:[],
        loading: false,
        dataForm: {
          id:0,
          name:"",
          code:"",
          parentId:"",
          parentName:"",
          orderNum:0,
          status: 1,
        }
    });
  },
  methods:{
    init(row) {
      this.visible = true;
      this.getOrgName();
      this.$nextTick(() => {
        this.$refs.dataFormRef.resetFields();
        this.dataForm = Object.assign(this.$options.setup().dataForm, row || {});
      });
    },
    // 获取上级机构
     getOrgName () {
      let obj = [];
      systemApi.orgSelect().then(res => {
        res.forEach((item) => {
          item.children = [];
          item.label = item.name;
          item.value = item.id;
          res.forEach((item2) => {
            if (item2.parentId === item.id) {
              item2.label = item2.name;
              item.children.push(item2)
            }
          });
          if (item.parentId === 0 || item.parentId === null) {
            item.title = item.name;
            obj.push(item)
          }
        });
        obj.unshift({
          label: "一级机构",
          name: "一级机构",
          id: 0,
        })
        this.treeData = obj;
      });
    },
    submitForm() {
      this.$refs.dataFormRef.validate(valid => {
        if (!valid) return;
        if (this.dataForm.parentId !== 0 && this.dataForm.id === this.dataForm.parentId) {
          this.$modal.msgError("上级机构不能选择本身");
          return;
        }
        this.loading = true;
        if (!this.dataForm.id) {
          systemApi.orgSave(this.dataForm).then(res => {
            this.$modal.msgSuccess("添加成功");
            this.$emit("on-comfirm");
            this.loading = false;
            this.visible = false;
          }).catch(err => {
            this.loading = false;
          })
        } else {
          systemApi.orgUpdate(this.dataForm).then(res => {
            this.$modal.msgSuccess("修改成功");
            this.$emit("on-comfirm");
            this.loading = true;
            this.visible = false;
          }).catch(err => {
            this.loading = false;
          })
        }
      })
    }
  }
});
</script>
