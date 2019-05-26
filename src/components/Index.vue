<!--suppress ALL -->
<template>
  <el-container style="height:100%; border: 1px solid #eee">
    <el-aside width="151px" height="100%" style="background-color: rgb(238, 241, 246);text-align:left;">
      <div style="height:60px;width:150px;background-color:#545c64;line-height:60px;text-align:center;">
        <a style="color:white;font-size:23px;">DoubleBoot</a>
      </div>
      <el-menu :default-openeds="['1', '3']" router background-color="#545c64"
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
        <el-popover
          placement="bottom"
          width="100"
          trigger="click">
          <div style="text-align: right; margin: 0">
            <span class="personMsg"><a @click="addTab(editableTabsValue, '个人信息', '/person_message',2)">个人信息</a></span><hr/>
            <span class="personMsg"><a @click="addTab(editableTabsValue, '密码修改', '/pwd_update',2)">密码修改</a></span><hr/>
            <span class="personMsg"><a @click="addTab(editableTabsValue, '头像上传', '/head_portrait',2)">头像上传</a></span><hr/>
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
  </el-container>
</template>

<script>
import axios from 'axios'
import router from '../router'
export default {
  name: 'mainIndex',
  methods: {
    logout: function () {
      let _this = this
      axios.get('/api/sysLogout').then(function (response) {
        localStorage.clear()
        _this.$router.push({path: '/'})
      }).catch(function (response) {
        console.log('登出失败:' + response)
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
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      const _this = this
      _this.menu = JSON.parse(localStorage.getItem('menuData'))
      _this.imgUrl = '/api' + JSON.parse(localStorage.getItem('user')).headPath
      _this.$refs.imgBtn.style.cssText = 'border:saddlebrown;vertical-align:middle;width:40px;height:40px;' +
        'background-size:cover;border-radius:50%;margin-right:15px;' + ' background-image: url(' + _this.imgUrl + ');'
    })
  },
  data: function () {
    return {
      routes: '',
      item: '',
      menu: '',
      imgUrl: '',
      editableTabsValue: '2',
      editableTabs: [{
        title: '首页',
        name: '1',
        content: 'Tab 1 content',
        path: '/demos'
      }],
      tabIndex: 2
    }
  }
}
</script>

<style scoped>
  .personMsg{
    width: 100%;
    display: block;
    text-align: left;
  }

  .personMsg a{
    text-decoration:none;
  }
  .el-submenu .el-menu-item {
    min-width: 150px;
  }
</style>
