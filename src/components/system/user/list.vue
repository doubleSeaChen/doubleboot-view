<template>
  <div style="margin-top:-15px;">
    <el-button id="addBtn" size="mini" type="primary" style="float:left;margin-bottom:10px;" @click="showAddUser" v-has="'sys:user:add'">新增</el-button>
    <div class="operationNav">
      <div class="operationNavForm">
        <el-input v-model="searchUserName" class="searchInput" placeholder="用户名搜索" clearable></el-input>
        <el-button size="mini" type="primary" icon="el-icon-search" @click="searchData"></el-button>
        <el-button size="mini" type="primary" style="margin-left:2px;" @click="queryPanle = !queryPanle">更多...</el-button>
      </div>
    </div>
    <transition name="expand">
      <div v-if="queryPanle" style="clear: both;border: solid 1px #5454;">
        <el-form :model="queryForm" class="queryForm">
          <span class="querySpan">部门</span><input class="queryInput" v-model="queryForm.userName"/>
          <span class="querySpan">用户名</span><input class="queryInput" v-model="queryForm.userName"/>
          <span class="querySpan">姓名</span><input class="queryInput" v-model="queryForm.name"/>
          <el-button style="padding-top:8px;" size="mini" type="primary" >查询</el-button>
        </el-form>
      </div>
    </transition>
    <el-table id="exampleTalbe" v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              :data="tableDatas" stripe>
      <el-table-column prop="id" label="id" width="140" v-if="show">
      </el-table-column>
      <el-table-column prop="userName" label="用户名" width="140">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120">
      </el-table-column>
      <el-table-column prop="sex" label="性别">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" icon="el-icon-edit" @click="showEditDialog(scope.$index, scope.row)" v-has="'sys:user:update'"></el-button>
          <el-button
            size="mini" type="danger" icon="el-icon-delete" @click="deleteUser(scope.row.id, scope.row.userName)" v-has="'sys:user:delete'"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="total" style="margin-top:15px; text-align:right;">
    </el-pagination>

    <el-dialog title="新增" :visible.sync="dialogFormVisible" width="60%" top="4%">
      <el-form :model="form" :rules="addRules" ref="form">
        <el-form-item label="用户名" prop="userName" :label-width="formLabelWidth">
          <el-input v-model="form.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex" :label-width="formLabelWidth">
          <el-radio-group v-model="form.sex" autocomplete="off" style="float:left;margin-top:10px;">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone" :label-width="formLabelWidth">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="dept" :label-width="formLabelWidth" >
          <el-input v-model="form.deptName" autocomplete="off" @click.native="getDeptTree" :disabled="true"></el-input>
          <el-input v-model="form.deptId" :disabled="true" type="hidden"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="roleList" :label-width="formLabelWidth">
          <el-checkbox-group style="text-align:left;" v-model="roleList">
            <el-checkbox :index="item.id" v-for="item in roles" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <el-dialog
        width="30%"
        title="部门"
        :visible.sync="innerVisible"
        append-to-body>
        <el-tree
          :data="deptData"
          node-key="id"
          :props="defaultProps" @node-click="handleNodeClick">
        </el-tree>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false" :disabled="saveBtn">取 消</el-button>
        <el-button size="mini" type="primary" v-on:click="addUser('form')" :disabled="saveBtn">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="dialogEditFormVisible">
      <el-form :model="editForm" :rules="editRules" ref="editForm">
        <el-form-item label="ID" :label-width="formLabelWidth" v-show="false">
          <el-input v-model="editForm.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="userName" :label-width="formLabelWidth">
          <el-input v-model="editForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name" :label-width="formLabelWidth">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone" :label-width="formLabelWidth">
          <el-input v-model="editForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="dept" :label-width="formLabelWidth" >
          <el-input v-model="editForm.deptName" autocomplete="off" @click.native="getDeptTree" :disabled="true"></el-input>
          <el-input v-model="editForm.deptId" :disabled="true" type="hidden"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" :label-width="formLabelWidth">
          <el-checkbox-group style="text-align:left;" v-model="roleUpdateList">
            <el-checkbox :index="item.id" v-for="item in roleUpdatePre" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <el-dialog
        width="30%"
        title="部门"
        :visible.sync="innerVisible"
        append-to-body>
        <el-tree
          :data="deptData"
          node-key="id"
          :props="defaultProps" @node-click="handleNodeClick">
        </el-tree>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false" :disabled="saveBtn">取 消</el-button>
        <el-button size="mini" type="primary" v-on:click="editUser('editForm')" :disabled="saveBtn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
  import axios from 'axios'
  let checkPhone = (rule, value, callback) => {
    const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
    if (!value) {
      return callback(new Error('请输入电话号码'))
    }
    setTimeout(() => {
      if (phoneReg.test(value)) {
        callback()
      } else {
        callback(new Error('电话号码格式不正确'))
      }
    }, 100)
  }
  let checkEmail = (rule, value, callback) => {
    const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
    if (!value) {
      return callback(new Error('请输入用户邮箱'))
    }
    setTimeout(() => {
      if (mailReg.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的邮箱格式'))
      }
    }, 100)
  }

let checkUserName = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入用户名'))
  }
  setTimeout(() => {
    axios.post('/api/user/isExist/' + value
    ).then(function (response) {
      if (response.data === 1) {
        callback(new Error('该用户已存在'))
      } else {
        callback()
      }
    }).catch(function (respones) {
    })
  }, 100)
}

  export default {
    name: 'userTable',
    data: function () {
      return {
        tableDatas: [],
        deptData: [],
        defaultProps: {
          children: 'children',
          label: 'text'
        },
        dialogFormVisible: false,
        dialogEditFormVisible: false,
        roles: '',
        rolesUpdate: '',
        searchUserName: '',
        roleList: [],
        roleUpdateList: [],
        roleUpdatePre: [],
        outerVisible: false,
        innerVisible: false,
        loading: true,
        saveBtn: false,
        queryPanle: false,
        queryForm: {
          userName: '',
          name: ''
        },
        form: {
          userName: '',
          name: '',
          password: '',
          sex: '',
          email: '',
          phone: '',
          deptName: '',
          deptId: ''
        },
        editForm: {
          id: '',
          userName: '',
          name: '',
          password: '',
          sex: '',
          deptName: '',
          deptId: ''
        },
        formLabelWidth: '120px',
        show: '',
        total: 0,
        params: {
          offset: 0,
          limit: 10
        },
        addRules: {
          userName: [ {validator: checkUserName, trigger: 'blur'} ],
          name: [ {required: true, message: '请输入用户姓名', trigger: 'blur'} ],
          email: [
            {validator: checkEmail, trigger: 'blur'}
          ],
          phone: [
            {validator: checkPhone, trigger: 'blur'}
          ],
          sex: [
            { required: true, message: '请选择用户性别', trigger: 'change' }
          ],
          password: [
            {required: true, message: '请输入登录密码', trigger: 'blur'},
            {min: 6, message: '密码长度不少于6个字符', trigger: 'blur'}
          ]
        },
        editRules: {
          userName: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入用户姓名', trigger: 'blur'}
          ],
          email: [
            {validator: checkEmail, trigger: 'blur'}
          ],
          phone: [
            {validator: checkPhone, trigger: 'blur'}
          ],
          sex: [
            { required: true, message: '请选择用户性别', trigger: 'change' }
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
      handleNodeClick (data) {
        let _this = this
        _this.form.deptName = data.text
        _this.form.deptId = data.id
        _this.editForm.deptName = data.text
        _this.editForm.deptId = data.id
        _this.innerVisible = false
      },
      getDeptTree: function () {
        let _this = this
        _this.innerVisible = true
        axios.get('/api/system/dept/listTree').then(
          function (response) {
            _this.deptData = response.data
          }
        ).catch(function (respones) {
          console.log('请求菜单列表数据失败')
        })
      },
      addUser (form) {
        let _this = this
        _this.$refs[form].validate((valid) => {
          if (valid) {
            this.saveBtn = true
            let user = JSON.parse(JSON.stringify(this.form))
            user['roleIds'] = this.roleList
            axios.post('/api/user/save',
              user
            ).then(function (response) {
              if (response.data === 1) {
                _this.dialogFormVisible = false
                _this.$message({
                  showClose: true,
                  message: '新增成功',
                  type: 'success'
                })
                _this.getData(_this.params)
              } else {
                this.$message({
                  showClose: true,
                  message: '新增失败',
                  type: 'error'
                })
              }
            }).catch(function (response) {
            })
          } else {
            return false
          }
        })
      },
      handleCurrentChange (val) {
        this.params.offset = 10 * (val - 1)
        this.params.limit = 10
        this.getData(this.params)
      },
      getData: function (params) {
        let _this = this
        axios.get('/api/user/list', {params: params}).then(function (response) {
          _this.tableDatas = response.data.userList
          _this.total = response.data.total
          _this.loading = false
        }).catch(function (response) {
          _this.$message({
            showClose: true,
            message: '请求数据失败，请联系管理员...',
            type: 'error'
          })
        })
      },
      searchData: function () {
        let _this = this
        this.params.offset = 0
        this.params.limit = 10
        this.params.userName = this.searchUserName
        axios.get('/api/user/list', {params: this.params}).then(function (response) {
          _this.tableDatas = response.data.userList
          _this.total = response.data.total
        }).catch(function (response) {
          _this.$message({
            showClose: true,
            message: '查询失败，请联系管理员...',
            type: 'error'
          })
        })
      },
      showAddUser: function () {
        let _this = this
        this.saveBtn = false
        axios.get('/api/role/listAll').then(function (response) {
            _this.roles = response.data
          }
        ).catch(function (respones) {
          console.log('请求菜单列表数据失败')
        })
        _this.dialogFormVisible = true
      },
      editUser: function (editForm) {
        let _this = this
        _this.$refs[editForm].validate((valid) => {
          if (valid) {
            this.saveBtn = true
            let user = {
              id: this.editForm.id,
              userName: this.editForm.userName,
              password: this.editForm.password,
              name: this.editForm.name,
              email: this.editForm.email,
              phone: this.editForm.phone,
              roleIds: this.roleUpdateList
            }
            axios.post('/api/user/update',
              user
            ).then(function (response) {
              if (response.data === 1) {
                _this.dialogEditFormVisible = false
                _this.$message({
                  showClose: true,
                  message: '修改成功',
                  type: 'success'
                })
                _this.getData(_this.params)
              } else {
                this.$message({
                  showClose: true,
                  message: '修改失败',
                  type: 'error'
                })
              }
            }).catch(function (response) {
              console.log('前后端分离测试修改失败:' + response)
            })
          } else {
            return false
          }
        })
      },
      showEditDialog: function (index, row) {
        let _this = this
        this.saveBtn = false
        axios.get('/api/role/listAll').then(function (response) {
          _this.roleUpdatePre = response.data
          _this.$nextTick(function () {
            axios.post('/api/role/listByUserId/' + row.id).then(function (response) {
              _this.roleUpdateList = []
              for (var i = 0; i < response.data.length; i++) {
                _this.roleUpdateList.push(response.data[i].roleId)
              }
            }).catch(function (response) {
            })
          })
        })
        this.dialogEditFormVisible = true
        this.editForm = Object.assign({}, row)
      },
      deleteUser: function (id, name) {
        let _this = this
        this.$confirm('是否删除该' + name + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post('/api/user/remove/' + id
          ).then(function (response) {
            if (response.data === 1) {
              _this.dialogEditFormVisible = false
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
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    }
  }
</script>

<style scoped>
  #exampleTalbe{
    text-align: left;
  }
</style>
<style>

</style>
