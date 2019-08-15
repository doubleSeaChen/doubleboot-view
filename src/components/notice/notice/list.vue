<template>
  <div style="margin-top:-15px;">
    <div class="operationNav">
      <el-button size="mini" type="primary" style="float:left;margin-bottom:10px;" @click="showAddNotice" v-has="'notice:notice:add'">新增</el-button>
      <div class="operationNavForm">
          <el-input v-model="searchTitle" class="searchInput" placeholder="标题搜索" clearable></el-input>
          <el-button size="mini" type="primary" icon="el-icon-search" @click="searchData"></el-button>
          <!--<el-button size="mini" type="primary" icon="el-icon-plus" style="margin-left:2px;"></el-button>-->
      </div>
    </div>
    <el-table id="exampleTalbe" :data="tableDatas" stripe v-on:v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-table-column prop="id" label="id" width="140" v-if="show">
      </el-table-column>
      <el-table-column prop="title" label="标题" width="140">
      </el-table-column>
      <el-table-column prop="content" label="内容">
      </el-table-column>
      <el-table-column prop="createDate" label="创建时间">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" icon="el-icon-edit" @click="showEditDialog(scope.$index, scope.row)" v-has="'notice:notice:edit'"></el-button>
          <el-button
            size="mini" type="danger" icon="el-icon-delete" @click="deleteNotice(scope.row.id, scope.row.title)" v-has="'notice:notice:remove'"></el-button>
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

    <el-dialog title="新增" :visible.sync="dialogFormVisible" width="60%">
      <el-form :model="form" :rules="addRules" ref="form">
        <el-form-item label="标题" prop="title" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.content"></el-input>
        </el-form-item>
        <el-form-item label="通知人" prop="dept" :label-width="formLabelWidth" >
          <el-input v-model="form.userName" autocomplete="off" @click.native="getUsers" :disabled="true"></el-input>
          <el-input v-model="form.userId" :disabled="true" type="hidden"></el-input>
        </el-form-item>
      </el-form>
      <el-dialog
        width="40%"
        title="接收人"
        :visible.sync="innerVisible"
        append-to-body>
        <div>
          <el-table id="exampleTalbe" v-loading="loading"
                    element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)" :data="userDatas" stripe :row-key="getRowKey"
                    ref=multipleTable @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
            <el-table-column prop="id" label="id" min-width="140" v-if="show">
            </el-table-column>
            <el-table-column prop="userName" label="用户名" min-width="140">
            </el-table-column>
            <el-table-column prop="name" label="姓名" min-width="120">
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          @current-change="handleCurrentChangeUser"
          :current-page="1"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="userTotal" style="margin-top:15px; text-align:right;">
        </el-pagination>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="innerVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" v-on:click="addUser">确 定</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false" :disabled="saveBtn">取 消</el-button>
        <el-button size="mini" type="primary" v-on:click="addNotice('form')" :disabled="saveBtn">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="dialogEditFormVisible">
      <el-form :model="editForm" :rules="editRules" ref="editForm">
        <el-form-item label="ID" :label-width="formLabelWidth" v-show="false">
          <el-input v-model="editForm.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title" :label-width="formLabelWidth">
          <el-input v-model="editForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content" :label-width="formLabelWidth">
          <el-input v-model="editForm.content" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="接收人" prop="users" :label-width="formLabelWidth">
          <el-table :data="noticeUser" style="">
            <el-table-column prop="id" label="id" width="140" v-if="show"></el-table-column>
            <el-table-column prop="userName" label="姓名" width="120"></el-table-column>
            <el-table-column prop="deptName" label="部门" width="120"></el-table-column>
            <el-table-column prop="is_read" label="状态" width="120" :formatter="formatStatus"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogEditFormVisible = false" :disabled="saveBtn">取 消</el-button>
        <el-button size="mini" type="primary" v-on:click="editNotice('editForm')" :disabled="saveBtn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios'
import 'element-ui/lib/theme-chalk/base.css'
export default {
  name: 'noticeList',
  data: function () {
    return {
      tableDatas: [],
      userDatas: [],
      noticeUser: [],
      userTotal: 0,
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      innerVisible: false,
      reserverData: true,
      searchTitle: '',
      loading: true,
      userParams: {
        offset: 0,
        limit: 10
      },
      saveBtn: false,
      form: {
        title: '',
        content: '',
        userIds: ''
      },
      editForm: {
        id: '',
        title: '',
        type: '',
        content: ''
      },
      formLabelWidth: '120px',
      show: '',
      total: 0,
      params: {
        offset: 0,
        limit: 10
      },
      addRules: {
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '请输入内容', trigger: 'blur'}
        ]
      },
      editRules: {
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '请输入内容', trigger: 'blur'}
        ]
      },
      multipleSelection: []
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.getData(this.params)
    })
  },
  methods: {
    addUser: function () {
      this.multipleSelection = this.$refs.multipleTable.selection
      let userNames = ''
      let userIds = ''
      for(let i=0; i<this.multipleSelection.length; i++){
        if(i < this.multipleSelection.length-1){
          userNames += this.multipleSelection[i].userName + ','
          userIds += this.multipleSelection[i].id + ','
        } else {
          userNames += this.multipleSelection[i].userName
          userIds += this.multipleSelection[i].id
        }
      }
      this.form.userName = userNames
      this.form.userId = userIds
      this.innerVisible = false
    },
    getRowKey (row) {
      return row.id
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    getUsers: function () {
      this.innerVisible = true
      this.getUserData(this.userParams)
    },
    getUserData: function (params) {
      let _this = this
      axios.get('/api/user/list', {params: params}).then(function (response) {
        _this.userDatas = response.data.userList
        _this.userTotal = response.data.total
        _this.loading = false
      }).catch(function (response) {
        _this.$message({
          showClose: true,
          message: '请求数据失败，请联系管理员...',
          type: 'error'
        })
      })
    },
    addNotice (form) {
      let _this = this
      _this.$refs[form].validate((valid) => {
        if (valid) {
          this.saveBtn = true
          let notice = {
            title: this.form.title,
            content: this.form.content,
            userIds: this.form.userId.split(',')
          }
          axios.post('/api/notice/notice/save',
            notice
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
    handleCurrentChangeUser (val) {
      this.params.offset = 10 * (val - 1)
      this.params.limit = 10
      this.getUserData(this.params)
    },
    getData: function (params) {
      let _this = this
      axios.get('/api/notice/notice/list', {params: params}).then(function (response) {
        _this.tableDatas = response.data.noticeList
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
      this.params.title = this.searchTitle
      axios.get('/api/notice/notice/list', {params: this.params}).then(function (response) {
        _this.tableDatas = response.data.noticeList
        _this.total = response.data.total
      }).catch(function (response) {
        _this.$message({
          showClose: true,
          message: '查询失败，请联系管理员...',
          type: 'error'
        })
      })
    },
    formatStatus: function (row, column) {
      return row.is_read ? '已读' :  '未读'
    },
    showAddNotice: function () {
      let _this = this
      _this.saveBtn = false
      _this.dialogFormVisible = true
    },
    editNotice: function (editForm) {
      let _this = this
      _this.$refs[editForm].validate((valid) => {
        if (valid) {
          this.saveBtn = true
          let notice = {
            id: this.editForm.id,
            title: this.editForm.title,
            content: this.editForm.content
          }
          axios.post('/api/notice/notice/update',
            notice
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
      this.saveBtn = false
      this.dialogEditFormVisible = true
      this.editForm = Object.assign({}, row)
      this.getNotifyUsers(row.id)
    },
    getNotifyUsers: function(id){
      let _this = this
      axios.post('/api/notice/notice/getNoticeUsers/' + id
      ).then(function (response) {
        _this.noticeUser = response.data
      }).catch(function (response) {
      })
    },
    deleteUser: function(id){
      let _this = this
      this.$confirm('删除后改用户无法接收到此条通知!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post('/api/notice/notice/removeUser/' + id
        ).then(function (response) {
          if (response.data === 1) {
            _this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'})
            _this.getNotifyUsers(_this.editForm.id)
          } else {
            this.$message({
              showClose: true,
              message: '删除失败',
              type: 'error'})
          }
        }).catch(function (response) {
        })
      }).catch(() => {
      })
    },
    deleteNotice: function (id, name) {
      let _this = this
      this.$confirm('是否删除公告"' + name + '"?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post('/api/notice/notice/remove/' + id
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
  .operationNav{
    /*height:40px;line-height:40px;*/
  }
</style>
<style>

</style>
