<!--suppress ALL -->
<template>
  <div style="margin-top:-15px;">
    <div class="operationNav">
      <div class="operationNavForm" style="margin-bottom:5px;">
        <el-input v-model="searchUserName" class="searchInput" placeholder="用户名搜索" clearable></el-input>
        <el-button size="mini" type="primary" icon="el-icon-search" @click="searchData"></el-button>
      </div>
    </div>
    <el-table id="logTalbe" :data="tableDatas" stripe v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-table-column prop="id" label="id" width="140" v-if="show">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120">
      </el-table-column>
      <el-table-column prop="userName" label="用户名" width="140">
      </el-table-column>
      <el-table-column prop="operation" label="操作">
      </el-table-column>
      <el-table-column prop="time" label="耗时(ms)">
      </el-table-column>
      <el-table-column prop="createDate" label="访问时间">
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="total" style="margin-top:15px; text-align:right;">
    </el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'SysLog',
  data: function () {
    return {
      tableDatas: [],
      show: '',
      searchUserName: '',
      params: {
        offset: 0,
        limit: 10
      },
      loading: true,
      total: 0,
      queryForm: {
        userName: '',
        dateTime: ''
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
      this.params.offset = 10 * (val - 1)
      this.params.limit = 10
      this.getData(this.params)
    },
    getData: function (params) {
      var _this = this
      axios.get('/api/sys/log/list', {params: params}).then(function (response) {
        _this.tableDatas = response.data.logList
        _this.total = response.data.total
        _this.loading = false
      }).catch(function (response) {
        console.log('前后端分离测试failed:' + response)
      })
    },
    searchData: function () {
      let _this = this
      this.params.offset = 0
      this.params.limit = 10
      this.params.userName = this.searchUserName
      axios.get('/api/sys/log/list', {params: this.params}).then(function (response) {
        _this.tableDatas = response.data.logList
        _this.total = response.data.total
      }).catch(function (response) {
        _this.$message({
          showClose: true,
          message: '查询失败，请联系管理员...',
          type: 'error'
        })
      })
    }
  }
}
</script>

<style scoped>
  #logTalbe{
    text-align: left;
  }
</style>
