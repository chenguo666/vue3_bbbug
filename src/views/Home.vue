<template>
  <div id="app">
    <div class="">
      <div class="">
        <div class="">
          <div class="">
            <div class="">
              <span class="">
                {{ roomInfo.room_name }}
              </span>
              <span @click="showSearchSongs"> 点歌 </span>
              <span @click="showPlaySongList"> 已点 </span>
              <span @click="showMySongList"> 歌单 </span>
            </div>
          </div>
          <!--  -->
          <div>
            <div
              class="bbbug_main_chat_history"
              id="bbbug_main_chat_history"
              @scroll="onMessageScroll"
            >
              <div v-for="(item, index) in messageList" :key="index">
                <div
                  v-if="
                    item.type == 'text' ||
                    item.type == 'img' ||
                    item.type == 'join' ||
                    item.type == 'system'
                  "
                  class="bbbug_main_chat_item bbbug_main_chat_text"
                  :class="
                    item.user.user_id == userInfo.user_id
                      ? 'bbbug_main_chat_mine'
                      : ''
                  "
                >
                  <div class="bbbug_main_chat_head">
                    <img
                      class="bbbug_main_chat_head_image xiaomi"
                      :src="getStaticUrl(item.user.user_head)"
                      :onerror="getStaticUrl('new/images/nohead.jpg')"
                    />
                  </div>
                  <div class="bbbug_main_chat_name">
                    {{ urldecode(item.user.user_name) }}
                  </div>
                  <div class="bbbug_main_chat_context_menu">
                    <!-- 图片消息 -->
                    <div
                      class="bbbug_main_chat_content"
                      v-if="item.type == 'img'"
                      style="padding: 5px; border-radius: 10px; line-height: 0"
                    >
                      <img
                        class="bbbug_main_chat_img"
                        :style="{
                          width: getImageWidth(urldecode(item.content)) + 'px'
                        }"
                        :src="getStaticUrl(urldecode(item.content))"
                        :onerror="getStaticUrl('/new/images/error.jpg')"
                        :large="getStaticUrl(urldecode(item.resource))"
                        :preview="item.message_id"
                      />
                    </div>
                    <!--文字消息-->
                    <div v-if="item.isAtAll">
                      <div
                        class="bbbug_main_chat_content content_at"
                        v-if="item.type == 'text'"
                      >
                        {{ urldecode(item.content) }}
                      </div>
                    </div>
                    <div v-if="!item.isAtAll">
                      <div
                        class="bbbug_main_chat_content content_at"
                        v-if="
                          item.type == 'text' &&
                          item.user.user_id != userInfo.user_id &&
                          item.at &&
                          item.at.user_id == userInfo.user_id
                        "
                      >
                        {{ urldecode(item.content) }}
                      </div>
                      <div
                        class="bbbug_main_chat_content"
                        v-if="
                          item.type == 'text' &&
                          item.user.user_id != userInfo.user_id &&
                          (!item.at || item.at.user_id != userInfo.user_id)
                        "
                      >
                        {{ urldecode(item.content) }}
                      </div>
                      <div
                        class="bbbug_main_chat_content content_boy"
                        v-if="
                          item.type == 'text' &&
                          item.user.user_id == userInfo.user_id &&
                          userInfo.user_sex == 1
                        "
                      >
                        {{ urldecode(item.content) }}
                      </div>
                      <div
                        class="bbbug_main_chat_content content_girl"
                        v-if="
                          item.type == 'text' &&
                          item.user.user_id == userInfo.user_id &&
                          userInfo.user_sex == 0
                        "
                      >
                        {{ urldecode(item.content) }}
                      </div>
                      <div
                        class="bbbug_main_chat_content_loading love_fast"
                        v-if="item.loading"
                      >
                        <i class="iconfont icon-loading"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="item.type == 'system'"
                  class="bbbug_main_chat_system"
                >
                  <span class="bbbug_main_chat_system_text">{{
                    item.content
                  }}</span>
                </div>
                <div v-if="item.type == 'join'" class="bbbug_main_chat_system">
                  <span class="bbbug_main_chat_system_text">
                    欢迎<span v-if="item.where">{{ item.where }}的</span
                    ><span v-if="!item.user"
                      ><span v-if="item.plat">{{ item.plat }}用户</span
                      ><span v-if="!item.plat">临时用户</span></span
                    >{{ item.user ? '回来!' : '' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="bbbug_main_chat_toolbar">
              <div class="bbbug_main_chat_toolbar_item">
                <el-upload
                  :action="uploadImageUrl"
                  :show-file-list="false"
                  :on-success="handleImageUploadSuccess"
                  class="bbbug_main_chat_toolbar_img"
                  :before-upload="doUploadBefore"
                  :data="baseData"
                >
                  <img
                    title="上传图片"
                    class=""
                    :src="getStaticUrl('new/images/button_image.png')"
                  />
                </el-upload>
                <el-slider
                  v-if="isVolumeBarShow"
                  class="bbbug_main_menu_song_volume_bar"
                  v-model="audioVolume"
                  vertical
                  show-stops
                  @input="audioVolumeChanged"
                  height="80px"
                >
                </el-slider>
                <div class="bbbug_main_chat_input_song" v-if="isPlayerShow">
                  <div
                    class="bbbug_main_chat_input_song_name"
                    v-if="songInfo && songInfo.song"
                  >
                    <span
                      >{{ songInfo.song.name }}({{
                        songInfo.song.singer
                      }})</span
                    >
                    <i
                      class="iconfont icon-icon_people_fill"
                      style="
                        font-weight: bold;
                        font-size: 14px;
                        vertical-align: middle;
                        margin-left: 10px;
                        display: inline-block;
                      "
                    ></i>
                  </div>
                  <div
                    class="bbbug_main_chat_input_song_ctrl"
                    v-if="roomInfo.room_type == 1 || roomInfo.room_type == 4"
                  >
                    <i
                      title="音量"
                      @click="setEnableOrDisableVolume"
                      @mouseover="showAudioVolumeBar"
                      class="iconfont volume_bar"
                      :class="
                        audioVolume > 0
                          ? 'icon-changyongtubiao-xianxingdaochu-zhuanqu-39'
                          : 'icon-changyongtubiao-xianxingdaochu-zhuanqu-40'
                      "
                    ></i>
                    <i
                      @click.stop="passTheSong"
                      title="切歌/不喜欢"
                      class="iconfont icon-xiayige"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="bbbug_main_chat_percent">
              <div :style="{ width: audioPercent + '%' }" v-if="songInfo"></div>
            </div>
            <div class="bbbug_main_chat_input">
              <div class="bbbug_main_chat_input_toolbar"></div>
              <div class="bbbug_main_chat_input_form">
                <textarea
                  class="bbug_main_chat_input_message"
                  :placeholder="
                    roomInfo &&
                    roomInfo.room_sendmsg == 1 &&
                    roomInfo.room_user != userInfo.user_id &&
                    !userInfo.user_admin
                      ? '全员禁言中,你暂时无法发言...'
                      : '开始你的聊天吧'
                  "
                  @keydown.enter="sendMessage"
                  @input="messageChanged"
                  v-model="message"
                  :disabled="
                    roomInfo &&
                    roomInfo.room_sendmsg == 1 &&
                    roomInfo.room_user != userInfo.user_id &&
                    !userInfo.user_admin
                      ? true
                      : false
                  "
                ></textarea>
              </div>
              <button
                class="bbbug_main_chat_input_send"
                id="qqLoginBtn"
                @click.stop="sendMessage"
              >
                发送(Enter)
              </button>
              <el-tag
                class="bbbug_main_chat_input_quot"
                closable
                type="info"
                v-if="atUserInfo && atUserInfo.message"
                @close="atUserInfo = { user: {} }"
              >
                {{ getQuotMessage(atUserInfo) }}
              </el-tag>
              <div
                class="bbbug_main_chat_toolbar_lrc"
                v-if="
                  isLrcStringShow &&
                  (roomInfo.room_type == 1 || roomInfo.room_type == 4)
                "
              >
                <span>{{ lrcString }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <audio
      :src="getStaticUrl('new/mp3/dingdong.mp3')"
      ref="noticePlayer"
    ></audio>
    <audio :src="getStaticUrl('new/mp3/dong.m4a')" ref="audio_dong"></audio>
    <audio :src="getStaticUrl('new/mp3/ci.m4a')" ref="audio_ci"></audio>
    <audio :src="getStaticUrl('new/mp3/da.m4a')" ref="audio_da"></audio>
    <audio :src="nextAudioUrl" ref="preloadAudio" control1></audio>
    <audio
      :src="audioUrl"
      ref="audio"
      control1
      @timeupdate="audioTimeUpdate"
      @ended="audioEnded"
      @error="audioError"
      @loadedmetadata="audioLoaded"
      @canplay="canplay"
    ></audio>
  </div>
</template>

<script setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  getmyinfo,
  getRoomInfo,
  MessageList,
  messageSend,
  songPass,
  getWebsocketUrl
} from '@/api'
import { useStore } from 'vuex'
import { ref } from 'vue'
import { getStaticUrl, getImageWidth, urldecode } from '@/utils/url.js'
const store = useStore()
const roomInfo = ref({})
const userInfo = ref({})
const messageList = ref([])
const uploadImageUrl = ref('')
const message = ref('')
const lrcString = ref('')
const audioUrl = ref('')
const nextAudioUrl = ref('')
const audioImage = ref('new/images/loading.png')
const audioVolume = ref(50) // 音量

const isEnableScroll = ref(true)
const baseData = ref(false)
const isVolumeBarShow = ref(false)
const songInfo = ref(false)
const timerVolumeBar = ref(null)
const isPlayerShow = ref(true)
// 消息最大允许保留
const historyMax = 100
ElMessageBox.confirm('欢迎来到在线音乐聊天室，即将为您播放音乐!', '提示', {
  confirmButtonText: '确定',
  cancelButtonText: '取消',
  type: 'success'
})
  .then(() => {
    getUserInfo()
  })
  .catch(() => {})
const getUserInfo = async () => {
  const info = await getmyinfo()
  store.commit('app/setMyinfo', JSON.stringify(info) || '')
  userInfo.value = info
  RoomInfo()
  getMessageList()
}

const RoomInfo = async () => {
  const info = await getRoomInfo({
    room_id: '1001',
    room_password: ''
  })
  store.commit('app/setRoomInfo', JSON.stringify(info) || '')
  roomInfo.value = info
  getWebsocketUrls()
}

const getMessageList = async () => {
  const info = await MessageList({
    room_id: '1001',
    per_page: 20
  })
  messageList.value = []
  for (let i = 0; i < info.length; i++) {
    let _obj = false
    try {
      _obj = JSON.parse(info[i].message_content)
    } catch (error) {
      continue
    }
    if (_obj) {
      if (_obj.at) {
        _obj.content = '@' + _obj.at.user_name + ' ' + _obj.content
      }
      _obj.time = info[i].message_createtime
      _obj.isAtAll = false
      if (_obj.type === 'text') {
        try {
          _obj.content = decodeURIComponent(decodeURIComponent(_obj.content))
        } catch (e) {
          _obj.content = decodeURIComponent(_obj.content)
        }
        _obj.isAtAll = !!(
          _obj.content.indexOf('@全体') === 0 &&
          (_obj.user.user_id === roomInfo.value.room_user ||
            _obj.user.user_admin)
        )
      }
      messageList.value.unshift(_obj)
    }
  }
  // console.log(messageList.value)
  if (messageList.value.length > historyMax) {
    messageList.value.shift()
  }
}
const onMessageScroll = (e) => {
  if (e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight + 50) {
    isEnableScroll.value = true
  } else {
    isEnableScroll.value = false
  }
  isVolumeBarShow.value = false
}
const handleImageUploadSuccess = (res, file) => {
  if (res.code === 200) {
    messageSend({
      where: 'channel',
      to: '1001',
      type: 'img',
      msg: res.data.attach_thumb,
      resource: res.data.attach_path
    })
  } else {
    ElMessage.error(res.msg)
  }
}
const doUploadBefore = (file) => {
  const isJPG =
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/gif'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('发送图片只能是 JPG/PNG/GIF 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('发送图片大小不能超过 2MB!')
    return false
  }
  return isJPG && isLt2M
}
const audioVolumeChanged = () => {
  // t$refs.audio.volume = parseFloat(audioVolume.value / 100);
  localStorage.setItem('volume', audioVolume.value)
  hideVolumeBarAfter5seconds()
}
const hideVolumeBarAfter5seconds = () => {
  clearTimeout(timerVolumeBar)
  timerVolumeBar.value = setTimeout(function () {
    isVolumeBarShow.value = false
  }, 5000)
}
const setEnableOrDisableVolume = () => {
  if (audioVolume.value > 0) {
    // 设置静音
    localStorage.setItem('volume_old', audioVolume.value)
    audioVolume.value = 0
    this.$refs.audio.volume = 0
    localStorage.setItem('volume', 0)
  } else {
    // 取消静音
    let volume = localStorage.getItem('volume_old') || 30
    volume = parseInt(volume)
    audioVolume.value = volume
    this.$refs.audio.volume = parseFloat(volume / 100)
    localStorage.setItem('volume', volume)
  }
}
const passTheSong = async () => {
  if (!songInfo.value) {
    return
  }
  const info = songPass({ room_id: '1001', mid: songInfo.value.song.mid })
  audioImage.value = getStaticUrl('new/images/loading.png')
  ElMessage.$message.success(info.msg)
}
const sendMessage = (e = false) => {
  if (e) {
    e.preventDefault()
  }
  if (message.value === '') {
    return
  }
  if (messageList.value.length > historyMax) {
    messageList.value.shift()
  }
  console.log(messageList.value)

  const _tempMessage = {
    type: 'text',
    user: userInfo.value,
    content: encodeURIComponent(message.value),
    time: parseInt(new Date().valueOf() / 1000),
    at: false,
    isAtAll: false,
    where: 'channel'
  }
  console.log(_tempMessage)
  messageList.value.push(_tempMessage)
  messageSend({
    where: 'channel',
    to: '1001',
    type: 'text',
    msg: encodeURIComponent(message.value),
    at: false
  })
  message.value = ''
}
const getQuotMessage = (itemAt) => {
  if (!itemAt.message) {
    return false
  }
  switch (itemAt.message.type) {
    case 'jump':
      return '[机票]'
    case 'img':
      return '[图片]'
    case 'link':
      return '[链接]'
    default:
      return this.urldecode(itemAt.message.content)
  }
}
const getWebsocketUrls = async () => {
  const info = await getWebsocketUrl({
    channel: '1001',
    referer: document.referrer || false
  })
  console.log(info)
  // that.appLoading = false;
  // that.websocket.url = that.global.wssUrl + '?account=' + res.data.account + "&channel=" + res.data.channel + "&ticket=" + res.data.ticket;
  // if (that.doForceCloseWebsocket()) {
  //     that.connectWebsocket();
  // }
}
</script>
<style scoped>
.el-dropdown-menu {
  padding: 0;
}

.bbbug_main_chat_item {
  position: relative;
  min-height: 70px;
  margin: 10px;
  text-align: left;
  padding-top: 30px;
}

.bbbug_main_chat_mine {
  text-align: right;
}

.bbbug_main_chat_head {
  position: absolute;
  left: 0px;
  top: 0px;
  cursor: pointer;
}

.bbbug_main_chat_head_image {
  width: 40px;
  height: 40px;
  border-radius: 10px;
}

.bbbug_main_chat_mine .bbbug_main_chat_head {
  left: auto;
  right: 0px;
}

.bbbug_main_chat_name {
  position: absolute;
  left: 55px;
  top: 0px;
  display: inline-block;
  max-width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  line-height: 20px;
}

.bbbug_main_chat_name_icon {
  font-size: 12px;
  color: white;
  background-color: orangered;
  padding: 2px;
  border-radius: 3px;
  line-height: 12px;
  display: inline-block;
}

.bbbug_main_chat_mine .bbbug_main_chat_name {
  position: absolute;
  left: auto;
  right: 55px;
}

.bbbug_main_chat_context_menu {
  display: inline-block;
  overflow: hidden;
}

.bbbug_main_chat_content {
  background-color: #e5e5e5;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 14px;
  color: #666;
  max-width: 300px;
  margin-left: 60px;
  display: inline-block;
  word-break: break-all;
  word-wrap: break-word;
  position: relative;
}

.bbbug_main_chat_content::before {
  content: '';
  position: absolute;
  top: -6px;
  left: -13px;
  width: 15px;
  height: 15px;
  border-width: 0;
  border-style: solid;
  border-color: transparent;
  border-bottom-width: 12px;
  border-bottom-color: currentColor;
  border-radius: 0 0 0 15px;
  color: #e5e5e5;
}

.content_boy::before {
  color: #66cbff;
}

.content_girl::before {
  color: #fe9898;
}

.content_at::before {
  color: #666;
}

.bbbug_main_chat_mine .bbbug_main_chat_content::before {
  content: '';
  position: absolute;
  right: -15px;
  top: -6px;
  left: calc(100% - 2px);
  width: 15px;
  height: 15px;
  border-width: 0;
  border-style: solid;
  border-color: transparent;
  border-bottom-width: 12px;
  border-bottom-color: currentColor;
  border-radius: 0 0 15px 0;
}

.bbbug_main_chat_content_reply {
  color: orangered;
  font-size: 12px;
  margin-left: 50px;
  cursor: pointer;
  margin-top: 5px;
  margin-right: 50px;
}

.bbbug_main_chat_mine .bbbug_main_chat_content {
  margin-left: auto;
  margin-right: 60px;
  text-align: left;
}

.bbbug_main_chat_notice .bbbug_main_chat_notice_title {
  background-color: #666;
  color: white;
  margin: -8px -16px;
  padding: 5px 10px;
  font-size: 12px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.bbbug_main_chat_notice .bbbug_main_chat_notice_content {
  font-size: 14px;
  margin-top: 15px;
}

.bbbug_main_chat_notice::before {
  color: #666;
}

.bbbug_main_chat_img {
  width: 60px;
  border-radius: 5px;
}

.bbbug_main_chat {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.95);
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  overflow: hidden;
}

.bbbug_main_chat_input {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100px;
}

.bbbug_main_chat_toolbar_lrc {
  position: absolute;
  left: 10px;
  bottom: 5px;
  color: #999;
  font-size: 12px;
}

.bbbug_main_chat_percent {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100px;
  height: 1px;
  background-color: #eee;
}

.bbbug_main_chat_percent div {
  position: relative;
}

.bbbug_main_chat_percent div::after {
  content: '';
  width: 4px;
  height: 4px;
  font-size: 0px;
  background-color: #999;
  border-radius: 100%;
  position: absolute;
  right: 0;
  top: -2px;
}

.bbbug_main_chat_percent div {
  height: 100%;
  background-color: #e5e5e5;
}

.bbbug_main_chat_input_form {
  padding: 10px;
  position: absolute;
  left: 10px;
  right: 10px;
  top: 10px;
  bottom: 10px;
}

.bbug_main_chat_input_message {
  width: 100%;
  height: 50px;
  outline: none;
  resize: none;
  background-color: transparent;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border: none;
  font-size: 14px;
  color: #333;
}

.bbbug_main_chat_input_send {
  position: absolute;
  right: 10px;
  bottom: 10px;
  border: none;
  background-color: #eee;
  color: #999;
  border-radius: 5px;
  padding: 8px 16px;
  cursor: pointer;
}

.bbbug_main_chat_invate {
  vertical-align: middle;
  font-size: 14px;
  margin-right: 10px;
  display: inline-block;
}

.bbbug_main_chat_enable {
  background-color: #666666;
  color: #fff;
}

.bbbug_app {
  position: absolute;
  left: 0;
  top: 42px;
  right: 0;
  height: 200px;
  border: none;
  border-bottom: 1px solid #e5e5e5;
  background-color: transparent;
  overflow: hidden;
}

.bbbug_app_fullpage {
  height: auto;
  bottom: 0;
  border-bottom: none !important;
}

.bbbug_dark .bbbug_app {
  border-bottom: 1px solid #444;
}

.bbbug_app iframe {
  width: 100%;
  height: 100%;
}

.bbbug_app_close {
  position: absolute;
  right: 0px;
  top: 42px;
  background-color: #ccc;
  font-size: 12px;
  padding: 3px 5px;
  border-radius: 0;
  color: white;
  cursor: pointer;
  z-index: 10;
}

.bbbug_dark .bbbug_app_close {
  background-color: #444;
}

.bbbug_app_close:hover {
  background-color: orange;
}

.bbbug_main_chat_history {
  position: absolute;
  left: 0;
  top: 42px;
  right: 0;
  bottom: 150px;
  overflow: hidden;
  overflow-y: scroll;
  padding-bottom: 30px;
  z-index: 0;
}

.bbbug_main_chat_system {
  text-align: center;
  margin: 5px 10%;
  margin-top: 10px;
  overflow: hidden;
}

.bbbug_main_chat_system_text {
  color: #aaa;
  background-color: transparent;
  text-align: center;
  font-size: 12px;
}

.bbbug_main_chat_toolbar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100px;
  height: 40px;
}

.bbbug_main_chat_toolbar_tobottom {
  position: absolute;
  right: 20px;
  bottom: 40px;
  z-index: 10;
}

.bbbug_main_chat_toolbar_tobottom i {
  color: #666;
  background-color: #fff;
  font-size: 28px;
  border-radius: 10px;
  width: 40px;
  height: 40px;
  display: inline-block;
  text-align: center;
  line-height: 42px;
  cursor: pointer;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
}

.bbbug_main_chat_toolbar {
  margin-left: 10px;
  vertical-align: middle;
}

.bbbug_main_chat_toolbar_emoji {
  width: 32px;
  height: 32px;
  vertical-align: middle;
  margin-right: 5px;
  cursor: pointer;
}

.bbbug_main_chat_content_loading {
  position: absolute;
  right: 40px;
  top: 20px;
}

.bbbug_main_chat_content_loading .iconfont {
  font-size: 16px;
  font-weight: bold;
  color: #999;
}

.bbbug_main_chat_emojis {
  width: 280px;
  background-color: white;
  border-radius: 10px;
  z-index: 10;
  position: absolute;
  left: 20px;
  bottom: 150px;
  padding: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.bbbug_main_chat_emojis img {
  width: 36px;
  height: 36px;
  margin: 5px;
  cursor: pointer;
}

.bbbug_main_chat_toolbar_img {
  width: 28px;
  height: 28px;
  vertical-align: middle;
  cursor: pointer;
  display: inline-block;
}

.bbbug_main_chat_toolbar_img img {
  width: 28px;
  height: 28px;
  vertical-align: middle;
  cursor: pointer;
}

.bbbug_main_chat_name_time {
  font-size: 12px;
  color: #aaa;
  text-align: left;
  margin-left: 55px;
  margin-right: 55px;
  margin-top: 5px;
}

.bbbug_main_chat_mine .bbbug_main_chat_name_time {
  text-align: right;
}

.bbbug_main_chat_input_quot {
  position: absolute;
  left: 90px;
  bottom: 105px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 20px;
}

.bbbug_main_chat_content_quot {
  font-size: 12px;
  color: #aaa;
  background-color: #eee;
  border-radius: 5px;
  padding: 2px 5px;
  display: inline-block;
  margin: 5px 50px;
  cursor: pointer;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content_girl {
  background-color: #fe9898;
  color: white;
}

.content_boy {
  background-color: #66cbff;
  color: #333;
}

.content_at {
  background-color: #666666;
  color: white;
}

.contextmenu {
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  position: fixed;
  z-index: 100;
}

.contextmenu div {
  padding: 8px 30px;
  font-size: 14px;
  color: #666;
  border-radius: 10px;
}

.contextmenu div:hover {
  background-color: #f5f5f5;
  cursor: pointer;
}

.bbbug_link {
  position: fixed;
  right: 10px;
  bottom: 10px;
}

.bbbug_link a {
  font-size: 14px;
  text-decoration: none;
  color: rgba(255, 255, 255, 1);
  text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
}

.bbbug_link a:hover {
  color: #fff;
  text-decoration: underline;
}

.bbbug_main_chat_jump_id {
  border-radius: 3px;
  background-color: #ddd;
  font-size: 12px;
  margin-right: 5px;
  display: inline-block;
  color: #666;
  padding: 2px 5px;
}

.bbbug_main_chat_jump {
  position: relative;
  cursor: pointer;
  min-width: 200px;
}

.bbbug_main_chat_jump_desc {
  font-size: 12px;
  margin-top: 10px;
  color: #999;
  margin-bottom: 40px;
}

.bbbug_main_chat_jump_tips {
  position: absolute;
  background-color: #666;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 5px 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  font-size: 12px;
  color: #fff;
}

.bbbug_main_chat_jump_tips font {
  position: absolute;
  right: 10px;
}

.bbbug_main_chat_input_song {
  font-size: 14px;
  position: absolute;
  right: 10px;
  bottom: 5px;
  color: rgb(121, 115, 115);
}

.bbbug_main_chat_input_song_name {
  font-size: 12px;
  display: inline-block;
  margin-right: 5px;
  color: #aaa;
  vertical-align: middle;
}

.bbbug_main_chat_input_song_name * {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  vertical-align: middle;
}

.bbbug_main_chat_input_song_ctrl {
  display: inline-block;
  vertical-align: middle;
}

.bbbug_main_chat_input_song_ctrl .iconfont {
  font-size: 20px;
  color: #666;
  cursor: pointer;
}

.bbbug_main_chat_input_song_ctrl .iconfont:hover {
  color: orangered;
}

.bbbug_main_chat_emojis_input {
  margin-bottom: 10px;
}

.bbbug_locked {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: center;
  justify-content: center;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.bbbug_locked .main {
  width: 1000px;
  height: 500px;
  backdrop-filter: blur(0px);
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
}

.bbbug_locked .bg_back {
  filter: blur(50px);
  position: fixed;
  left: -100px;
  right: -100px;
  top: -100px;
  bottom: -100px;
  background: #000 url(https://bbbug.hamm.cn/new/images/bg_dark.jpg) center
    no-repeat;
  background-size: cover;
}

.bbbug_locked .bg {
  filter: blur(50px);
  position: fixed;
  left: -100px;
  right: -100px;
  top: -100px;
  bottom: -100px;
  background: transparent url(https://bbbug.hamm.cn/new/images/bg_dark.jpg)
    center no-repeat;
  background-size: cover;
}

.bbbug_locked {
  color: white;
  z-index: 100;
}

.bbbug_locked .pic {
  width: 360px;
  height: 360px;
  position: absolute;
  left: 0px;
  top: 50px;
  border-radius: 20px;
  overflow: hidden;
}

.bbbug_locked .pic img {
  width: 100%;
  height: 100%;
}

.bbbug_locked .info {
  position: absolute;
  left: 400px;
  top: 50px;
  width: 560px;
}

.bbbug_locked .name {
  font-size: 36px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bbbug_locked .desc {
  font-size: 20px;
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bbbug_locked .controls {
  position: absolute;
  left: 400px;
  top: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bbbug_locked .controls .iconfont {
  display: inline-block;
  font-size: 64px;
  cursor: pointer;
}

.bbbug_locked .progress {
  background-color: rgba(255, 255, 255, 0.1);
  position: absolute;
  left: 400px;
  top: 330px;
  height: 5px;
  border-radius: 20px;
  width: 560px;
}

.bbbug_locked .progress div {
  background: rgba(255, 255, 255, 0.5);
  width: 20%;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: 20px;
}

.bbbug_locked .time {
  position: absolute;
  left: 400px;
  top: 340px;
  color: rgba(255, 255, 255, 0.8);
  width: 560px;
}

.bbbug_locked .time .now {
  position: absolute;
  left: 0;
  top: 0;
}

.bbbug_locked .time .total {
  position: absolute;
  right: 0;
  top: 0;
}

.bbbug_locked .logo {
  position: absolute;
  left: 20px;
  top: 20px;
}

.bbbug_locked .logo img {
  width: 40px;
  height: 40px;
  vertical-align: middle;
  border-radius: 10px;
}

.bbbug_locked .copyright {
  position: fixed;
  right: 20px;
  bottom: 20px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.bbbug_locked .lrc {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
  position: absolute;
  left: 400px;
  top: 380px;
  width: 560px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bbbug_main_menu [data-count] {
  position: relative;
}

.bbbug_main_menu [data-count]:not([data-count='0'])::before {
  content: attr(data-count);
  font-weight: bold;
  color: #333;
  background-color: #999;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  border: solid 2px currentColor;
  font-size: 12px;
  position: absolute;
  top: 0%;
  left: 50%;
  transform: translate(calc(-50% - 10px), calc(-50% + 8px));
  pointer-events: none;
}
</style>
