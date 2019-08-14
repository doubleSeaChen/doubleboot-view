<template>
  <div class="login_panel">
    <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="loginForm.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login('loginForm')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import router from '../router'
import {formatRoutes} from '../utils/utils'
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        userName: 'chen',
        password: '123456'
      },
      rules: {
        userName: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入登录密码', trigger: 'blur'},
          {min: 6, message: '密码长度不少于6个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    /**
     * 登录校验
     * @param loginForm
     */
    login (loginForm) {
      let _this = this
      _this.$refs[loginForm].validate((valid) => {
        if (valid) {
          let user = {
            userName: _this.loginForm.userName,
            password: _this.loginForm.password
          }
          _this.loginValid(user)
        } else {
          return false
        }
      })
    },
    /**
     * 获取用户权限标识
     * @param userId
     */
    setPermission: function (userId) {
      axios.post('/api/menu/signList/' + userId).then(function (response) {
        if (response.data) {
          localStorage.setItem('permissionSign', JSON.stringify(response.data))
        }
      }).catch(function (response) {
        console.log(response)
      })
    },
    /**
     * 登录后台请求
     * @param user
     */
    loginValid: function (user) {
      let _this = this
      axios.post('/api/login',
        user
      ).then(function (response) {
        // 登录成功，获取用户的权限信息
        if (response.data !== 0) {
          localStorage.setItem('user', JSON.stringify(response.data))
          _this.setPermission(JSON.parse(localStorage.getItem('user')).id)
          // 确定用户登录成后，请求菜单数据存入localstroe,确保存入后再进行页面跳转
          _this.getMenuByUser(JSON.parse(localStorage.getItem('user')).id)
        } else {
          _this.$message({
            type: 'error',
            message: `用户名或密码错误！`
          })
        }
      }).catch(function (response) {
        console.log(response)
      })
    },
    /**
     * 获取用户菜单
     * @param userId
     */
    getMenuByUser: function (userId) {
      let _this = this
      axios.post('/api/menu/treeListByUser/' + userId).then(function (response) {
        if (response.data) {
          localStorage.setItem('menuData', JSON.stringify(response.data))
          let fmtRoutes = formatRoutes(response.data)
          for (let i = 0; i < fmtRoutes.length; i++) {
            router.addRoutes(fmtRoutes)
          }
          _this.$nextTick(function () {
            router.push({path: '/main'})
          })
        }
      }).catch(function (response) {
        console.log(response)
      })
    }
  }
}
</script>

<style scoped>
  .login_panel {
    width: 35%;
    margin: 0 auto;
  }
</style>
