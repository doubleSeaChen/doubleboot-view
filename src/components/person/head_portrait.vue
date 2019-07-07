<template>
  <div>
    <el-upload class="upload-demo"
    action="/api/user/img"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :on-change="onchange"
    :before-upload="beforeAvatarUpload">
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>

export default {
  name: 'head_portrait',
  data () {
    return {
      imageUrl: ''
    }
  },
  methods: {
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 当上传图片后，调用onchange方法，获取图片本地路径
    onchange (file, fileList) {
      let _this = this
      // let event = window.event
      file = file.raw
      let reader = new FileReader()
      // 转base64
      reader.onload = function (e) {
        _this.imageUrl = e.target.result // 将图片路径赋值给src
      }
      reader.readAsDataURL(file)
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      const _this = this
      _this.imgUrl = '/api' + JSON.parse(localStorage.getItem('user')).headPath
    })
  }
}
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: solid 1px;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
