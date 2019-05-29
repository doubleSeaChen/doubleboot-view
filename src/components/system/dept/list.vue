<template>
  <div class="app-container"  style="margin-top:-15px;">
    <el-button size="mini" type="primary" style="float:left;margin-bottom:10px;" @click="showAddDialog('1','','')" v-has="'system:dept:add'">新增</el-button>
    <div class="operationNavForm">
      <el-input class="searchInput" placeholder="搜索" clearable></el-input>
      <el-button size="mini" type="primary" icon="el-icon-search"></el-button>
      <el-button size="mini" type="primary" icon="el-icon-plus" style="margin-left:2px;"></el-button>
    </div>
    <tree-table :data="data" :columns="columns" stripe @getAuth="getAuth">
      <el-table-column label="" prop="object.text"></el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="showAddDialog('2',scope.row.text,scope.row.id)" v-has="'system:dept:add'"></el-button>
          <el-button size="mini" type="success" icon="el-icon-edit" @click="showEditDialog(scope.$index,scope.row)" v-has="'system:dept:edit'"></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="remove(scope.row.object.id, scope.row.object.name)" v-has="'system:dept:remove'"></el-button>
        </template>
      </el-table-column>
    </tree-table>

    <el-dialog title="新增" :visible.sync="dialogFormTop">
      <el-form :model="form" :rules="addRules" ref="form">
        <el-form-item label="部门名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormTop = false">取 消</el-button>
        <el-button size="mini" type="primary" v-on:click="addDept('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="dialogFormTop">
      <el-form :model="editForm" :rules="editRules" ref="editForm">
        <el-form-item label="ID" :label-width="formLabelWidth" v-show="false">
          <el-input v-model="editForm.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormTop = false">取 消</el-button>
        <el-button size="mini" type="primary" v-on:click="editDept('editForm')" >确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
/**
   Auth: Leiy
   Created: 2018/09/29-11:25
   Explain:根据花裤衩的表格改的,
   isIndeterminate属性是控制多选半选中状态，
   checkAll是控制全选中状态
   selectchecked是放置sonData1选中项
   */
import treeTable from '@/components/TreeTableAuthor'
import axios from 'axios'
export default {
  name: 'deptList',
  components: { treeTable },
  data () {
    return {
      columns: [
        {
          text: '部门名称',
          value: 'description',
          width: 200,
          option: 'sonData1'
        }
      ],
      data: [],
      dialogFormTop: false,
      dialogForm: false,
      isComponet: true,
      form: {
        name: '',
        component: '',
        sign: '',
        parentName: '',
        parentId: 0,
        type: '',
        router: ''
      },
      editForm: {
        name: '',
        component: '',
        sign: '',
        type: '',
        router: ''
      },
      formLabelWidth: '120px',
      dialogFormEdit: false,
      dialogMenuIcon: false,
      addRules: {
        name: [
          {required: true, message: '请输入部门名称', trigger: 'blur'}
        ]
      },
      editRules: {
        name: [
          {required: true, message: '请输入部门名称', trigger: 'blur'}
        ]
      }
    }
  },
  created () {

  },
  methods: {
    getAuth (data) {
      let opt = []
      data.forEach(val => {
        opt.push(val.id)
        if (val.children) {
          val.children.forEach(el => {
            if (el.selectchecked.length) {
              opt.push(el.id)
              opt.push(el.selectchecked)
            }
          })
        }
      })
      opt = opt.join().split(',').filter(n => { return n })
      console.log(opt)
    },
    addDept: function (form) {
      let _this = this
      _this.$refs[form].validate((valid) => {
        if (valid) {
          let dept = {
            name: this.form.name
          }
          axios.post('api/system/dept/save',
            dept
          ).then(function (response) {
            if (response.data === 1) {
              _this.dialogFormTop = false
              _this.getData()
              _this.$message({
                showClose: true,
                message: '新增成功',
                type: 'success'
              })
            } else {
              this.$message({
                showClose: true,
                message: '新增失败',
                type: 'error'
              })
            }
          }).catch(function (response) {
            this.$message({
              showClose: true,
              message: '新增失败',
              type: 'error'
            })
          })
        } else {
          return false
        }
      })
    },
    showAddDialog: function (isTop, name, id) {
      if (isTop === '1') {
        this.form.parentName = '顶级'
        this.form.parentId = 0
        this.isComponet = false
      } else {
        this.form.parentName = name
        this.form.parentId = id
        this.isComponet = true
      }
      this.dialogFormTop = true
    },
    showEditDialog: function (index, row) {
      this.dialogFormEdit = true
      this.editForm = Object.assign({}, row.object)
    },
    editMenu: function (editForm) {
      let _this = this
      _this.$refs[editForm].validate((valid) => {
        if (valid) {
          let menu = {
            id: this.editForm.id,
            name: this.editForm.name,
            sign: this.editForm.sign,
            component: this.editForm.component,
            type: this.editForm.type,
            router: this.editForm.router
          }
          axios.post('api/menu/update',
            menu
          ).then(function (response) {
            if (response.data === 1) {
              _this.dialogFormEdit = false
              _this.getData()
              _this.$message({
                showClose: true,
                message: '修改成功',
                type: 'success'
              })
            } else {
              this.$message({
                showClose: true,
                message: '修改失败',
                type: 'error'
              })
            }
          }).catch(function (response) {
            this.$message({
              showClose: true,
              message: '新增失败',
              type: 'error'
            })
          })
        } else {
          return false
        }
      })
    },
    remove: function (id, name) {
      let _this = this
      this.$confirm('是否删除菜单' + name + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post('/api/menu/remove/' + id
        ).then(function (response) {
          if (response.data === 1) {
            _this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            _this.getData()
          } else {
            this.$message({
              showClose: true,
              message: '删除失败',
              type: 'error'
            })
          }
        }).catch(function (response) {
          console.log('前后端分离测试删除失败:' + response)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showMenuIcon: function () {
      this.dialogMenuIcon = true
    },
    getData: function () {
      let _this = this
      axios.get('/api/system/dept/listTree').then(function (response) {
        _this.data = response.data
      }).catch(function (response) {
        _this.$message({
          showClose: true,
          message: '请求数据失败，请联系管理员...',
          type: 'error'
        })
      })
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.getData()
    })
  }
}
</script>
