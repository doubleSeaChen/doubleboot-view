<template>
  <div class="hello">
    <!--<el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '3']">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-message"></i>系统管理</template>
          <el-menu-item-group>
            <el-menu-item index="1-1" v-on:click="userManage">用户管理</el-menu-item>
            <el-menu-item index="1-2" v-on:click="menuManage">菜单管理</el-menu-item>
            <el-menu-item index="1-3" v-on:click="roleManage">角色管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu :index="item.text" v-for="item in menu" :key="item.text">
          <template slot="title" v-if="item.text" ><i class="el-icon-message"></i>{{ item.text }}</template>
          <el-menu-item-group v-for="child in item.children" :key="child.text">
            <el-menu-item :index="child.text">{{ child.text }}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>

      </el-menu>
    </el-aside>-->
  </div>
</template>

<script>
export default {
  // name: 'Hello'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
