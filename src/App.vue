<template>
  <div id="app"  style="position:absolute; left:0; top:0; width:100%;height:100%;">
    <!--<img src="./assets/logo.png">-->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
.el-table__header tr,.el-table__header th {
  padding: 0;
  height: 50px;
  background-color: #e9edf1;
}
.el-table__body tr,.el-table__body td {
  padding: 0;
  height: 40px;
}
.el-table thead {
  color: #333333;
}
.el-dialog__header {
  background-color:#545c64;
}
.el-dialog__title {
  line-height: 18px;
  color: white;
}
.el-dialog__headerbtn .el-dialog__close {
  color: #f2fdfc;
}
.el-dialog__footer {
  padding: 6px 20px 6px;
  border-top: solid 1px #e8ebee;
}
.searchInput input{
  height: 32px!important;
  width: 150px;
  border-radius: 0px;
  float: right!important;
  margin-right: 3px;
}
.operationNavForm{
  float: right;
  display: inline-flex;
}
.el-tabs__item {
  height: 35px;
  line-height: 35px;
}
.el-tabs__item.is-active {
  color: #fafafb;
  background-color: #565565;
}
.el-tabs--card>.el-tabs__header .el-tabs__nav {
  border: none;
}
</style>
