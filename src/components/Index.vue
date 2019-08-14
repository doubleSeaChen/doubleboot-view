<!--suppress ALL -->
<template>
  <el-container style="height:100%; border: 1px solid #eee">
    <el-aside width="151px" height="100%" style="background-color: rgb(238, 241, 246);text-align:left;">
      <div style="height:60px;width:150px;background-color:#545c64;line-height:60px;text-align:center;">
        <a style="color:white;font-size:23px;">DoubleBoot</a>
      </div>
      <el-menu router background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b" style="width:150px;">
        <el-submenu :index="item.text" v-for="item in menu" :key="item.text">
          <template slot="title" v-if="item.text" ><i :class="item.icon"></i>{{ item.text }}</template>
          <el-menu-item-group>
              <el-menu-item @click="addTab(editableTabsValue, child.text, child.path,2)" v-for="child in item.children" :key="child.text" :index="child.path"><i :class="child.icon"></i>{{ child.text }}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="height:50px;text-align:right;background-color:#545C64;line-height:50px;">
        <el-dropdown trigger="click"  @command="showNotice">
          <el-badge :value="noticeCount" class="item">
            <i style="color:#f9f4f4;font-size:20px;margin-right:25px;" class="fa fa-envelope-o" aria-hidden="true"></i>
          </el-badge>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :index="item.id" v-for="item in notice" :key="item.id" :command="item.id">{{item.title}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-popover
          placement="bottom"
          width="100"
          trigger="click">
          <div style="text-align: right; margin: 0">
            <span class="personMsg"><a @click="showPersonMsg">个人信息</a></span><hr/>
            <span class="personMsg"><a @click="showPwdUpdate">密码修改</a></span><hr/>
            <span class="personMsg"><a @click="logout">退出</a></span>
          </div>
          <button ref="imgBtn" slot="reference" style="width:40px; height:40px;">
          </button>
        </el-popover>
        <!--<span v-on:click="logout">登出</span>-->
      </el-header>
      <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="handleClick">
        <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name">
        </el-tab-pane>
      </el-tabs>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    <el-dialog title="通知" :visible.sync="dialogFormVisible" width="60%" top="4%">
    <el-form :model="noticeDetials">
      <el-form-item label="ID" :label-width="formLabelWidth" v-show="false">
        <el-input v-model="noticeDetials.id" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="标题" :label-width="formLabelWidth">
        <el-input v-model="noticeDetials.title" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="内容" :label-width="formLabelWidth">
        <el-input type="textarea" v-model="noticeDetials.content"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="dialogFormVisible = false">关 闭</el-button>
      <el-button size="mini" type="primary" v-on:click="readNotice" >已 读</el-button>
    </div>
    </el-dialog>
    <el-dialog  title="个人信息" :visible.sync="userMessageFlag" width="60%" top="4%">
      <usermessage ref="userMessage"></usermessage>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @closeMsg="closeUserMsg">关 闭</el-button>
        <el-button size="mini" type="primary" v-on:click="saveUserMsg" >保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog  title="密码修改" :visible.sync="pwdUpdateFlag" width="60%" top="4%">
      <pwdupdate ref="pwd_update"></pwdupdate>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @closeMsg="closePwdUpdate">关 闭</el-button>
        <el-button size="mini" type="primary" v-on:click="savePwdUpdate" >保 存</el-button>
      </div>
    </el-dialog>
  </el-container>

</template>

<script>
import axios from 'axios'
import router from '../router'
import usermessage from '../components/person/message.vue'
import pwdupdate from '../components/person/pwd_update.vue'
export default {
  components: { usermessage, pwdupdate },
  name: 'mainIndex',
  methods: {
    closeUserMsg: function () {
      let _this = this
      _this.userMessageFlag = false
    },
    saveUserMsg: function () {
      let _this = this
      let sex = this.$refs.userMessage.form.sex === 1 ? '男' : '女'
      let user = {
        id: JSON.parse(localStorage.getItem('user')).id,
        userName: this.$refs.userMessage.form.userName,
        phone: this.$refs.userMessage.form.phone,
        name: this.$refs.userMessage.form.name,
        sex: sex,
        email: this.$refs.userMessage.form.email
      }
      axios.post('/api/user/personUpdate',
        user
      ).then(function (response) {
        if (response.data === 1) {
          _this.userMessageFlag = false
          _this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
        } else {
        }
      }).catch(function (response) {
        console.log(response)
      })
    },
    logout: function () {
      let _this = this
      this.$confirm('您确定要退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.get('/api/sysLogout').then(function (response) {
          localStorage.clear()
          _this.$router.push({path: '/'})
        }).catch(function (response) {
        })
      }).catch(() => {
      })
    },
    addTab (targetName, title, content, addType) {
      let exist = false
      for (let i = 0; i < this.editableTabs.length; i++) {
        if (content === this.editableTabs[i].content) {
          exist = true
          break
        }
      }
      if (exist === true) {
        this.editableTabsValue = content
        return
      }
      this.editableTabs.push({
        title: title,
        name: content,
        content: content
      })
      this.editableTabsValue = content
      if (addType === 2) {
        router.push({path: content})
      }
    },
    removeTab (targetName) {
      let tabs = this.editableTabs
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }
      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter(tab => tab.name !== targetName)
      router.push({path: activeName})
    },
    handleClick (tab, event) {
      router.push({path: tab.name})
    },
    getNotice () {
      let _this = this
      axios.get('/api/notice/record/getUserNotice').then(function (response) {
        _this.notice = response.data
        _this.noticeCount = response.data.length
      }).catch(function (response) {

      })
    },
    showNotice (command) {
      let _this = this
      axios.post('/api/notice/record/getUserNoticeById/' + command
      ).then(function (response) {
        _this.noticeDetials.id = command
        _this.noticeDetials.title = response.data.title
        _this.noticeDetials.content = response.data.content
      }).catch(function (response) {
      })
      _this.dialogFormVisible = true
    },
    readNotice () {
      let _this = this
      axios.post('/api/notice/record/setRead/' + _this.noticeDetials.id).then(function (response) {
        if (response.data === 1) {
          _this.dialogFormVisible = false
          _this.getNotice()
        } else {
        }
      }).catch(function (response) {
      })
    },
    showPersonMsg () {
      let _this = this
      axios.post('/api/user/get/' + JSON.parse(localStorage.getItem('user')).id).then(function (response) {
        _this.$refs.userMessage.form.userName = response.data.userName
        _this.$refs.userMessage.form.name = response.data.name
        _this.$refs.userMessage.form.email = response.data.email
        let sex = response.data.sex === '男' ? 1 : 2
        _this.$refs.userMessage.form.sex = sex
        _this.$refs.userMessage.form.phone = response.data.phone
      }).catch(function (response) {
        console.log('前后端分离测试failed:' + response)
      })
      _this.userMessageFlag = true
    },
    showPwdUpdate () {
      let _this = this
      _this.pwdUpdateFlag = true
    },
    closePwdUpdate: function () {
      let _this = this
      _this.pwdUpdateFlag = false
    },
    savePwdUpdate () {
      let _this = this
      let pwdNew = _this.$refs.pwd_update.form.newPwd
      let pwdConfirm = _this.$refs.pwd_update.form.confirmPwd
      if (pwdNew === pwdConfirm) {
        let params = {
          id: JSON.parse(localStorage.getItem('user')).id,
          pwd: this.$refs.pwd_update.form.oldPwd
        }
        axios.get('/api/user/checkOldPassword', {params: params}).then(function (response) {
          if (response.data === 1) {
            _this.$nextTick(function () {
              let newPwdParams = {
                id: JSON.parse(localStorage.getItem('user')).id,
                pwd: _this.$refs.pwd_update.form.newPwd
              }
              axios.get('/api/user/updatePwd', {params: newPwdParams}).then(function (response) {
                if (response.data === 1) {
                  _this.pwdUpdateFlag = false
                  _this.$message({
                    type: 'success',
                    message: '修改成功!'
                  })
                } else {
                }
              }).catch(function (response) {
                console.log(response)
              })
            })
          } else {
            _this.$message({
              type: 'error',
              message: '原密码错误!'
            })
          }
        }).catch(function (response) {
          console.log(response)
        })
      } else {
        _this.$message({
          type: 'error',
          message: '您输入的新密码不一致!'
        })
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      const _this = this
      _this.menu = JSON.parse(localStorage.getItem('menuData'))
      _this.imgUrl = '/api' + JSON.parse(localStorage.getItem('user')).headPath
      _this.$refs.imgBtn.style.cssText = 'border:saddlebrown;vertical-align:middle;width:40px;height:40px;' +
        'background-size:cover;border-radius:50%;margin-right:15px;' + ' background-image: url(' + _this.imgUrl + ');'
      _this.getNotice()
    })
  },
  data: function () {
    return {
      routes: '',
      item: '',
      menu: '',
      imgUrl: '',
      noticeCount: 0,
      editableTabsValue: '2',
      notice: [],
      userMessageFlag: false,
      pwdUpdateFlag: false,
      editableTabs: [{
        title: '首页',
        name: '1',
        content: 'Tab 1 content',
        path: '/demos'
      }],
      tabIndex: 2,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      noticeDetials: {
        id: '',
        title: '',
        content: ''
      }
    }
  }
}
</script>

<style scoped>
  .personMsg{
    width: 100%;
    display: block;
    text-align: left;
    cursor: pointer;
  }

  .personMsg a{
    text-decoration:none;
  }
  .el-submenu .el-menu-item {
    min-width: 150px;
  }
</style>

<style>
  .el-badge__content.is-fixed {
    top: 14px;
    right: 28px;
  }
  .el-badge__content {
    background-color: #f56c6c;
    border: 0;
  }
</style>
