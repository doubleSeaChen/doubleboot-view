<template>
  <div style="margin:auto; width:60%;">
    <el-col class="warp-main">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.userName" disabled class="msg_class"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.name" class="msg_class"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-radio-group v-model="form.sex" autocomplete="off" style="float:left;margin-left:15px;margin-top:10px;">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" class="msg_class"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" :label-width="formLabelWidth">
          <el-input v-model="form.phone" class="msg_class"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="save">修改并保存</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'message',
  data: function () {
    return {
      form: {
        userName: '',
        name: '',
        email: '',
        sex: '',
        phone: ''
      },
      formLabelWidth: '120px',
      msg_class: ''
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.getData(this.params)
    })
  },
  methods: {
    getData: function f () {
      let _this = this
      axios.post('/api/user/get/' + JSON.parse(localStorage.getItem('user')).id).then(function (response) {
        _this.form.userName = response.data.userName
        _this.form.name = response.data.name
        _this.form.email = response.data.email
        let sex = response.data.sex === '男' ? 1 : 2
        _this.form.sex = sex
        _this.form.phone = response.data.phone
      }).catch(function (response) {
        console.log('前后端分离测试failed:' + response)
      })
    },
    save: function (event) {
      let sex = this.form.sex === 1 ? '男' : '女'
      let user = {
        id: JSON.parse(localStorage.getItem('user')).id,
        userName: this.form.userName,
        phone: this.form.phone,
        name: this.form.name,
        sex: sex,
        email: this.form.email
      }
      axios.post('/api/user/personUpdate',
        user
      ).then(function (response) {
        console.log('前后端分离测试数据修改：' + response)
        // location.reload()
      }).catch(function (response) {
        console.log('前后端分离测试修改失败:' + response)
      })
    }
  }
}
</script>

<style scoped>
  .msg_class{
    width: 250px;
    margin-left: 15px;
    float: left;
  }
</style>
