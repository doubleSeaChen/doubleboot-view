<template>
  <div style="margin:auto; width:60%;">
    <el-col class="warp-main">
      <el-form ref="form" :model="form" label-width="160px">
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
      </el-form>
    </el-col>
  </div>
</template>

<script>
export default {
  name: 'usermessage',
  props: {
    fatherMethod: {
      type: Function,
      default: null
    }
  },
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
      msg_class: '',
      saveFlag: false
    }
  },
  mounted: function () {
    this.$nextTick(function () {

    })
  },
  methods: {
  }
}
</script>

<style scoped>
  .msg_class{
    margin-left: 15px;
    float: left;
  }
</style>
