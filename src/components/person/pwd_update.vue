<template>
  <div style="margin:auto; width:60%;">
    <el-row class="warp">
      <el-col :span="24" class="warp-main">
        <el-form :model="form" label-width="120px">
          <el-form-item label="原密码">
            <el-input v-model="form.oldPwd"></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input v-model="form.newPwd"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码">
            <el-input v-model="form.confirmPwd"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="default" v-on:click="updatePwd">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'pwd_update',
  data: function () {
    return {
      form: {
        oldPwd: '',
        newPwd: '',
        confirmPwd: ''
      }
    }
  },
  methods: {
    updatePwd: function () {
      let pwdNew = this.form.newPwd
      let pwdConfirm = this.form.confirmPwd
      let _this = this
      if (pwdNew === pwdConfirm) {
        let params = {
          id: JSON.parse(localStorage.getItem('user')).id,
          pwd: this.form.oldPwd
        }
        axios.get('/api/user/checkOldPassword', {params: params}).then(function (response) {
          if (response.data === 1) {
            _this.$nextTick(function () {
              let newPwdParams = {
                id: JSON.parse(localStorage.getItem('user')).id,
                pwd: this.form.newPwd
              }
              axios.get('/api/user/updatePwd', {params: newPwdParams}).then(function (response) {
                if (response.data === 1) {
                  alert('修改成功')
                } else {
                }
              }).catch(function (response) {
                console.log(response)
              })
            })
          } else {
            this.$message({
              type: 'success',
              message: '原密码错误!'
            })
          }
        }).catch(function (response) {
          console.log(response)
        })
      } else {
        this.$message({
          type: 'success',
          message: '您输入的新密码不一致!'
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
