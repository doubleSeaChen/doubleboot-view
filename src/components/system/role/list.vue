<template>
  <div>
    <el-button type="primary" style="float:left" v-on:click="getMenuTree" @click="dialogAddFormVisible=true" v-has="'sys:role:add'">新增</el-button>
    <el-table id="exampleTalbe" :data="tableDatas" >
      <el-table-column prop="id" label="id" width="140" v-if="show">
      </el-table-column>
      <el-table-column prop="name" label="角色名" width="140">
      </el-table-column>
      <el-table-column prop="sign" label="标识符" width="120">
      </el-table-column>
      <el-table-column prop="remark" label="备注">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini" @click="showEditDialog(scope.$index, scope.row)" v-has="'sys:role:update'">编辑</el-button>
          <el-button
            size="mini"
            type="danger" @click="deleteRole(scope.row.id, scope.row.name)" v-has="'sys:role:delete'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="5"
      :total="total">
    </el-pagination>
    <el-dialog title="角色信息" :visible.sync="dialogAddFormVisible">
      <el-form :model="addForm" :rules="addRules" ref="addForm">
        <el-form-item label="角色名" prop="name" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="标识符" :label-width="formLabelWidth">
          <el-input v-model="addForm.sign" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="addForm.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限" :label-width="formLabelWidth">
          <el-tree
            :data="menuData"
            show-checkbox
            node-key="id"
            :props="defaultProps"
            ref="roleAddTree">
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-on:click="addRole('addForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="角色信息" :visible.sync="dialogEditFormVisible">
      <el-form :model="editForm" :rules="editRules" ref="editForm">
        <el-form-item label="ID" :label-width="formLabelWidth" v-show="false">
          <el-input v-model="editForm.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色名" prop="name" :label-width="formLabelWidth">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="标识符" :label-width="formLabelWidth">
          <el-input v-model="editForm.sign" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="editForm.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限" :label-width="formLabelWidth">
          <el-tree
            :data="menuData"
            show-checkbox
            node-key="id"
            :props="defaultProps"
            ref="roleAddTree">
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-on:click="editRole('editForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'SysRole',
  data: function () {
    return {
      tableDatas: [],
      show: '',
      form: '',
      dialogAddFormVisible: false,
      dialogEditFormVisible: false,
      addForm: {
        name: '',
        sign: '',
        remark: ''
      },
      editForm: {
        id: '',
        name: '',
        sign: '',
        remark: ''
      },
      formLabelWidth: '120px',
      menuData: [],
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      getCheckedNodes: '',
      total: 0,
      params: {
        offset: 0,
        limit: 5
      },
      addRules: {
        name: [
          {required: true, message: '请输入角色名', trigger: 'blur'}
        ]
      },
      editRules: {
        name: [
          {required: true, message: '请输入角色名', trigger: 'blur'}
        ]
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.getData(this.params)
    })
  },
  methods: {
    handleCurrentChange (val) {
      this.params.offset = 5 * (val - 1)
      this.params.limit = 5
      this.getData(this.params)
    },
    getData: function (params) {
      let _this = this
      axios.get('/api/role/list', {params: params}).then(
        function (response) {
          _this.tableDatas = response.data.roleList
          _this.total = response.data.total
        }
      ).catch(function (respones) {
        _this.$message({
          showClose: true,
          message: '请求数据失败，请联系管理员...',
          type: 'error'
        })
      })
    },
    addRole: function (addForm) {
      let _this = this
      _this.$refs[addForm].validate((valid) => {
        if (valid) {
          let dataRecieve = _this.$refs.roleAddTree.getCheckedKeys().concat(this.$refs.roleAddTree.getHalfCheckedKeys())
          let role = {
            name: this.addForm.name,
            sign: this.addForm.sign,
            remark: this.addForm.remark,
            menuIds: dataRecieve
          }
          axios.post('/api/role/save', role).then(
            function (response) {
              if (response.data === 1) {
                _this.dialogAddFormVisible = false
                _this.$message({
                  showClose: true,
                  message: '新增成功',
                  type: 'success'
                })
                _this.getData(_this.params)
              } else {
                _this.dialogAddFormVisible = false
                this.$message({
                  showClose: true,
                  message: '新增失败',
                  type: 'error'
                })
              }
            }
          ).catch(function (response) {
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
    showEditDialog: function (index, row) {
      let _this = this
      this.dialogEditFormVisible = true
      this.editForm = Object.assign({}, row)

      axios.get('/api/menu/treeList').then(function (response) {
        _this.menuData = response.data
        _this.$nextTick(function () {
          axios.post('/api/menu/listByRoleId/' + row.id).then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
              _this.setMenuIds(response.data[i])
            }
          }).catch(function (response) {
          })
        })
      }
      ).catch(function (respones) {
        console.log('请求菜单列表数据失败')
      })
    },
    editRole: function (editForm) {
      let _this = this
      _this.$refs[editForm].validate((valid) => {
        if (valid) {
          let dataRecieve = _this.$refs.roleAddTree.getCheckedKeys().concat(this.$refs.roleAddTree.getHalfCheckedKeys())
          let role = {
            id: this.editForm.id,
            name: this.editForm.name,
            sign: this.editForm.sign,
            remark: this.editForm.remark,
            menuIds: dataRecieve
          }
          axios.post('/api/role/update', role).then(
            function (response) {
              if (response.data === 1) {
                _this.dialogEditFormVisible = false
                _this.$message({
                  showClose: true,
                  message: '修改成功',
                  type: 'success'
                })
                _this.getData(_this.params)
              } else {
                _this.dialogEditFormVisible = false
                this.$message({
                  showClose: true,
                  message: '修改失败',
                  type: 'error'
                })
              }
            }
          ).catch(function (respones) {
            this.$message({
              showClose: true,
              message: '修改失败',
              type: 'error'
            })
          })
        } else {
          alert('error')
          return false
        }
      })
    },
    deleteRole: function (id, name) {
      this.$confirm('是否删除该' + name + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let _this = this
        axios.post('/api/role/remove/' + id
        ).then(function (response) {
          if (response.data === 1) {
            _this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            _this.getData(_this.params)
          } else {
            this.$message({
              showClose: true,
              message: '删除失败',
              type: 'error'
            })
          }
        }).catch(function (response) {
          this.$message({
            showClose: true,
            message: '删除失败',
            type: 'error'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getMenuTree: function () {
      var _this = this
      axios.get('/api/menu/treeList').then(
        function (response) {
          _this.menuData = response.data
        }
      ).catch(function (respones) {
        console.log('请求菜单列表数据失败')
      })
    },
    /**
       * (keys, leafOnly) 接收两个参数，1. 勾选节点的 key 的数组 2. boolean 类型的参数，若为 true 则仅设置叶子节点的选中状态，默认值为 false
       */
    setMenuIds: function (keys) {
      // this.$refs.roleAddTree.setCheckedKeys(keys, true)
      this.$refs.roleAddTree.setChecked(keys, true, false)
    }
  }
}
</script>

<style scoped>
  #exampleTalbe{
    text-align: left;
  }
</style>
