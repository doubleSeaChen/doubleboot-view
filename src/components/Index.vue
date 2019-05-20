<template>
  <el-container style="height:100%; border: 1px solid #eee">
    <el-aside width="150px" height="100%" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '3']" router background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-submenu :index="item.text" v-for="item in menu" :key="item.text">
          <template slot="title" v-if="item.text" ><i :class="item.icon"></i>{{ item.text }}</template>
          <el-menu-item-group>
              <el-menu-item @click="addTab(editableTabsValue, child.text, child.path)" v-for="child in item.children" :key="child.text" :index="child.path"><i :class="child.icon"></i>{{ child.text }}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container direction="vertical">
      <!--<el-header style="text-align: right; font-size: 12px">
        <img :src="imgUrl" style="width:40px; height:40px; border-radius:50%; margin-top:10px; margin-right:10px;">
        <span v-on:click="logout">登出</span>
      </el-header>-->
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
    addTab (targetName, title, content) {
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
        title: 'Tab 1',
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
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
</style>
