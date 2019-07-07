<template>
  <div style="margin:auto; width:60%;">
    <el-row class="warp">
      <el-col :span="24" class="warp-main">
        <el-form :model="form" label-width="120px">
          <el-form-item label="原密码">
            <el-input v-model="form.oldPwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input v-model="form.newPwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码">
            <el-input v-model="form.confirmPwd" type="password"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
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

    }
  }
}
</script>

<style scoped>

</style>
