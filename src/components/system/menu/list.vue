<template>
  <div class="app-container"  style="margin-top:-15px;">
    <el-button size="mini" type="primary" style="float:left;margin-bottom:10px;" @click="showAddDialog('1','','')" v-has="'sys:menu:add'">新增</el-button>
    <!--<el-button type="primary" style="float:left" @click="showMenuIcon()">图标</el-button>-->
    <tree-table :data="data" :columns="columns" stripe @getAuth="getAuth">
      <el-table-column label="权限标识" prop="object.sign"></el-table-column>
      <el-table-column label="组件路径" prop="object.component"></el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="showAddDialog('2',scope.row.text,scope.row.id)" v-has="'sys:menu:add'"></el-button>
          <el-button size="mini" type="success" icon="el-icon-edit" @click="showEditDialog(scope.$index,scope.row)" v-has="'sys:menu:update'"></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="remove(scope.row.object.id, scope.row.object.name)" v-has="'sys:menu:delete'"></el-button>
        </template>
      </el-table-column>
    </tree-table>

    <el-dialog title="新增菜单" :visible.sync="dialogFormTop">
      <el-form :model="form" :rules="addRules" ref="form">
        <el-form-item label="上级菜单" :label-width="formLabelWidth">
          <el-input v-model="form.parentName" autocomplete="off" :disabled="true"></el-input>
          <el-input v-show="false" v-model="form.parentId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="router" :label-width="formLabelWidth">
          <el-input v-model="form.router" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="组件路径" prop="component" :label-width="formLabelWidth" v-show="isComponet">
          <el-input v-model="form.component" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="sign" :label-width="formLabelWidth">
          <el-input v-model="form.sign" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" prop="type" :label-width="formLabelWidth">
            <el-radio-group v-model="form.type" autocomplete="off" style="float:left;margin-top:10px;">
              <el-radio :label="1">目录</el-radio>
              <el-radio :label="2">菜单</el-radio>
              <el-radio :label="3">按钮</el-radio>
            </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormTop = false">取 消</el-button>
        <el-button type="primary" v-on:click="addMenu('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑菜单" :visible.sync="dialogFormEdit">
      <el-form :model="editForm" :rules="editRules" ref="editForm">
        <el-form-item label="ID" :label-width="formLabelWidth" v-show="false">
          <el-input v-model="editForm.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="router" :label-width="formLabelWidth">
          <el-input v-model="editForm.router" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="组件路径" prop="component" :label-width="formLabelWidth">
          <el-input v-model="editForm.component" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="sign" :label-width="formLabelWidth">
          <el-input v-model="editForm.sign" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" :label-width="formLabelWidth">
          <el-radio-group v-model="editForm.type" autocomplete="off" style="float:left;margin-top:10px;">
            <el-radio :label="1">目录</el-radio>
            <el-radio :label="2">菜单</el-radio>
            <el-radio :label="3">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormEdit = false">取 消</el-button>
        <el-button type="primary" v-on:click="editMenu('editForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="菜单图标" :visible.sync="dialogMenuIcon">
      <div><MenuIcon></MenuIcon></div>
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
import MenuIcon from '../../menu_icon/menu_icon'
export default {
  name: 'SysMenu',
  components: { MenuIcon, treeTable },
  data () {
    return {
      columns: [
        {
          text: '菜单名称',
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
          {required: true, message: '请输入菜单名称', trigger: 'blur'}
        ],
        router: [
          {required: true, message: '请输入菜单路径', trigger: 'blur'}
        ],
        component: [
          {required: true, message: '请输入组件路径', trigger: 'blur'}
        ],
        type: [
          { required: true, message: '请选择菜单类别', trigger: 'change' }
        ],
        sign: [
          {required: true, message: '请输入菜单权限标识', trigger: 'blur'}
        ]
      },
      editRules: {
        name: [
          {required: true, message: '请输入菜单名称', trigger: 'blur'}
        ],
        router: [
          {required: true, message: '请输入菜单路径', trigger: 'blur'}
        ],
        component: [
          {required: true, message: '请输入组件路径', trigger: 'blur'}
        ],
        sign: [
          {required: true, message: '请输入菜单权限标识', trigger: 'blur'}
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
            console.log(val.id)
            if (el.selectchecked.length) {
              opt.push(el.id)
              opt.push(el.selectchecked)
            }
          })
        }
      })
      console.log(data)
      opt = opt.join().split(',').filter(n => { return n })
      console.log(opt)
    },
    addMenu: function (form) {
      let _this = this
      _this.$refs[form].validate((valid) => {
        if (valid) {
          let menu = {
            name: this.form.name,
            sign: this.form.sign,
            component: this.form.component,
            type: this.form.type,
            parentId: this.form.parentId,
            router: this.form.router
          }
          axios.post('api/menu/save',
            menu
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
          alert('error')
        }
      })
    },
    showAddDialog: function (isTop, name, id) {
      if (isTop === '1') {
        this.form.parentName = '顶级菜单'
        this.form.parentId = 0
        this.form.component = '/Index'
        this.isComponet = false
      } else {
        this.form.parentName = name
        this.form.parentId = id
        this.isComponet = true
        this.form.component = ''
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
          alert('error')
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
      axios.get('/api/menu/list').then(function (response) {
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
