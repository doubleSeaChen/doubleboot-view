<!--suppress ALL -->
<template>
  <div style="margin-top:-15px;">
    <el-table id="logTalbe" :data="tableDatas" border>
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
      :total="total" style="margin-top:15px; text-align:left;">
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
      params: {
        offset: 0,
        limit: 10
      },
      total: 0
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
      var _this = this // 很重要！！
      axios.get('/api/sys/log/list', {params: params}).then(function (response) {
        _this.tableDatas = response.data.logList
        _this.total = response.data.total
      }).catch(function (response) {
        console.log('前后端分离测试failed:' + response)
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
