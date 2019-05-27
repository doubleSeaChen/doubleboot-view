<template>
  <div style="margin-top:-15px;">
    <div class="operationNav">
      <el-button size="mini" type="primary" style="float:left;margin-bottom:10px;" @click="showAddBlog" v-has="'blog:add'">新增</el-button>
      <div class="operationNavForm">
          <el-input v-model="searchTitle" class="searchInput" placeholder="标题搜索" clearable></el-input>
          <el-button size="mini" type="primary" icon="el-icon-search" @click="searchData"></el-button>
          <!--<el-button size="mini" type="primary" icon="el-icon-plus" style="margin-left:2px;"></el-button>-->
      </div>
    </div>
    <el-table id="exampleTalbe" :data="tableDatas" stripe>
      <el-table-column prop="id" label="id" width="140" v-if="show">
      </el-table-column>
      <el-table-column prop="title" label="标题" width="400">
      </el-table-column>
      <el-table-column prop="author" label="作者" width="100">
      </el-table-column>
      <el-table-column prop="createDate" label="创建时间">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" icon="el-icon-edit" @click="showEditDialog(scope.$index, scope.row)" v-has="'blog:edit'"></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteBlog(scope.row.id, scope.row.title)" v-has="'blog:remove'"></el-button>
          <el-button size="mini" type="info" icon="fa fa-info-circle" @click="deleteBlog(scope.row.id, scope.row.title)" v-has="'blog:remove'"></el-button>
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

    <el-dialog title="新增" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="addRules" ref="form">
        <el-form-item label="标题" prop="title" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="type" :label-width="formLabelWidth">
          <el-input v-model="form.author" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content" :label-width="formLabelWidth">
          <el-input v-model="form.content" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" v-on:click="addBlog('form')">确 定</el-button>
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
        <el-form-item label="作者" prop="type" :label-width="formLabelWidth">
          <el-input v-model="editForm.author" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content" :label-width="formLabelWidth">
          <el-input v-model="editForm.content" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" v-on:click="editBlog('editForm')" >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import 'element-ui/lib/theme-chalk/base.css'
export default {
  name: 'blogList',
  data: function () {
    return {
      tableDatas: [],
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      searchTitle: '',
      form: {
        title: '',
        author: '',
        content: ''
      },
      editForm: {
        title: '',
        author: '',
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
        author: [
          {required: true, message: '请输入作者', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '请输入内容', trigger: 'blur'}
        ]
      },
      editRules: {
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'}
        ],
        author: [
          {required: true, message: '请输入作者', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '请输入内容', trigger: 'blur'}
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
    addBlog (form) {
      let _this = this
      _this.$refs[form].validate((valid) => {
        if (valid) {
          let blog = {
            title: this.form.title,
            author: this.form.author,
            content: this.form.content
          }
          axios.post('/api/blog/save',
            blog
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
      axios.get('/api/blog/list', {params: params}).then(function (response) {
        _this.tableDatas = response.data.blogList
        _this.total = response.data.total
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
      axios.get('/api/blog/list', {params: this.params}).then(function (response) {
        _this.tableDatas = response.data.blogList
        _this.total = response.data.total
      }).catch(function (response) {
        _this.$message({
          showClose: true,
          message: '查询失败，请联系管理员...',
          type: 'error'
        })
      })
    },
    showAddBlog: function () {
      let _this = this
      _this.dialogFormVisible = true
    },
    editBlog: function (editForm) {
      let _this = this
      _this.$refs[editForm].validate((valid) => {
        if (valid) {
          let blog = {
            id: this.editForm.id,
            title: this.editForm.title,
            author: this.editForm.author,
            content: this.editForm.content
          }
          axios.post('/api/blog/update',
            blog
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
      this.dialogEditFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    deleteBlog: function (id, name) {
      let _this = this
      this.$confirm('是否删除文章《' + name + '》?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post('/api/blog/remove/' + id
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
