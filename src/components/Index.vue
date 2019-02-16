<template>
  <el-container style="height:100%; border: 1px solid #eee">
    <el-aside width="200px" height="100%" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '3']" router>
        <el-submenu :index="item.text" v-for="item in menu" :key="item.text">
          <template slot="title" v-if="item.text" ><i :class="item.icon"></i>{{ item.text }}</template>
          <el-menu-item-group>
            <!--<router-link v-for="child in item.children" :key="child.text" :to="child.path">-->
              <el-menu-item v-for="child in item.children" :key="child.text" :index="child.path"><i :class="child.icon"></i>{{ child.text }}</el-menu-item>
            <!--</router-link>-->
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container direction="vertical">
      <el-header style="text-align: right; font-size: 12px">
        <img :src="imgUrl" style="width:40px; height:40px; border-radius:50%; margin-top:10px; margin-right:10px;">
        <span v-on:click="logout">登出</span>
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import axios from 'axios'
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
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      const _this = this
      _this.menu = JSON.parse(localStorage.getItem('menuData'))
      _this.imgUrl = '/api' + JSON.parse(localStorage.getItem('user')).headPath
      console.log(_this.menu)
    })
  },
  data: function () {
    return {
      routes: '',
      item: '',
      menu: '',
      imgUrl: ''
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
