<template>
  <div id="login">
    <div id="loginBox">
      <h4>欢迎来到在线音乐室</h4>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="0">
        <el-form-item label="" prop="user_account" style="margin-top: 40px">
          <el-row style="width: 240px">
            <el-col :span="24">
              <el-input
                class="inps"
                placeholder="账号"
                v-model="form.user_account"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="" prop="user_password">
          <el-row style="width: 240px">
            <el-col :span="24">
              <el-input
                class="inps"
                placeholder="密码"
                v-model="form.user_password"
                type="password"
                show-password
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-top: 55px">
          <el-button type="primary" round class="submitBtn" @click="handleLogin"
            >登录/注册</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const form = ref({
  user_account: '13967406584',
  user_password: '123456'
})

const rules = ref({
  user_account: [
    {
      required: true,
      message: '请输入账号',
      trigger: 'blur'
    }
  ],
  user_password: [
    {
      required: true,
      message: '请输出密码',
      trigger: 'blur'
    }
  ]
})

const formRef = ref(null)
const handleLogin = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      store.dispatch('app/login', form.value)
    } else {
      console.log('error submit!!')
      return false
    }
  })
}
</script>
<style lang="scss" scoped>
#login {
  width: 100vw;
  padding: 0;
  margin: 0;
  height: 100vh;
  font-size: 16px;
  background-repeat: no-repeat;
  background-position: left top;
  background-color: #242645;
  color: #fff;
  font-family: 'Source Sans Pro';
  background-size: 100%;
  background-image: url('../assets/bg.png');
  position: relative;
  #loginBox {
    width: 240px;
    height: 280px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    padding: 50px 40px 40px 40px;
    box-shadow: -15px 15px 15px rgba(6, 17, 47, 0.7);
    opacity: 1;
    background: linear-gradient(
      230deg,
      rgba(53, 57, 74, 0) 0%,
      rgb(0, 0, 0) 100%
    );
    :deep .inps input {
      border: none;
      color: #fff;
      background-color: transparent;
      font-size: 12px;
    }
    .submitBtn {
      background-color: transparent;
      color: #39f;
      width: 200px;
      margin: 0 auto;
    }
    .iconfont {
      color: #fff;
    }
  }
}
</style>
