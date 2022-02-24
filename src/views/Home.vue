<template>
  <div id="app">
    <div>
      <div>
        <div>
          <div class="music_title">
            <div class="music_header">
              <span class="header_title">
                {{ roomInfo.room_name }}
              </span>
              <div class="music_btn_list">
                <span @click="showSearchSongs"> 点歌 </span>
                <span @click="showPlaySongList"> 已点 </span>
                <span @click="showMySongList"> 歌单 </span>
              </div>
            </div>
          </div>
          <div>
            <span>{{ lrcString }}</span>
          </div>
          <div>
            <div
              class="music_main_chat_history"
              id="music_main_chat_history"
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
                  class="music_main_chat_item music_main_chat_text"
                  :class="
                    item.user.user_id == userInfo.user_id
                      ? 'music_main_chat_mine'
                      : ''
                  "
                >
                  <div class="music_main_chat_head">
                    <img
                      class="music_main_chat_head_image xiaomi"
                      :src="getStaticUrl(item.user.user_head)"
                      :onerror="getStaticUrl('new/images/nohead.jpg')"
                    />
                  </div>
                  <div class="music_main_chat_name">
                    {{ urldecode(item.user.user_name) }}
                  </div>
                  <div class="music_main_chat_context_menu">
                    <!-- 图片消息 -->
                    <div
                      class="music_main_chat_content"
                      v-if="item.type == 'img'"
                      style="padding: 5px; border-radius: 10px; line-height: 0"
                    >
                      <img
                        class="music_main_chat_img"
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
                        class="music_main_chat_content content_at"
                        v-if="item.type == 'text'"
                      >
                        {{ urldecode(item.content) }}
                      </div>
                    </div>
                    <div v-if="!item.isAtAll">
                      <div
                        class="music_main_chat_content content_at"
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
                        class="music_main_chat_content"
                        v-if="
                          item.type == 'text' &&
                          item.user.user_id != userInfo.user_id &&
                          (!item.at || item.at.user_id != userInfo.user_id)
                        "
                      >
                        {{ urldecode(item.content) }}
                      </div>
                      <div
                        class="music_main_chat_content content_boy"
                        v-if="
                          item.type == 'text' &&
                          item.user.user_id == userInfo.user_id &&
                          userInfo.user_sex == 1
                        "
                      >
                        {{ urldecode(item.content) }}
                      </div>
                      <div
                        class="music_main_chat_content content_girl"
                        v-if="
                          item.type == 'text' &&
                          item.user.user_id == userInfo.user_id &&
                          userInfo.user_sex == 0
                        "
                      >
                        {{ urldecode(item.content) }}
                      </div>
                      <div
                        class="music_main_chat_content_loading love_fast"
                        v-if="item.loading"
                      >
                        <i class="iconfont icon-loading"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="item.type == 'system'"
                  class="music_main_chat_system"
                >
                  <span class="music_main_chat_system_text">{{
                    item.content
                  }}</span>
                </div>
                <div v-if="item.type == 'join'" class="music_main_chat_system">
                  <span class="music_main_chat_system_text">
                    欢迎<span v-if="item.where">{{ item.where }}的</span
                    ><span v-if="!item.user"
                      ><span v-if="item.plat">{{ item.plat }}用户</span
                      ><span v-if="!item.plat">临时用户</span></span
                    >{{ item.user ? '回来!' : '' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="music_main_chat_toolbar">
              <div class="music_main_chat_toolbar_item">
                <el-slider
                  v-if="isVolumeBarShow"
                  class="music_main_menu_song_volume_bar"
                  v-model="audioVolume"
                  vertical
                  show-stops
                  @input="audioVolumeChanged"
                  height="80px"
                >
                </el-slider>
                <div class="music_main_chat_input_song" v-if="isPlayerShow">
                  <div
                    class="music_main_chat_input_song_name"
                    v-if="songInfo && songInfo.song"
                  >
                    <span
                      >{{ songInfo.song.name }}({{
                        songInfo.song.singer
                      }})</span
                    >
                  </div>
                  <div class="music_main_chat_input_song_ctrl">
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
            <div class="music_main_chat_percent">
              <div :style="{ width: audioPercent + '%' }" v-if="songInfo"></div>
            </div>
            <div class="music_main_chat_input">
              <div class="music_main_chat_input_toolbar"></div>
              <div class="music_main_chat_input_form">
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
              <el-button
                type="primary"
                class="music_main_chat_input_send"
                id="qqLoginBtn"
                @click.stop="sendMessage"
              >
                发送
              </el-button>
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
  getWebsocketUrl,
  getLrc,
  updateServerTime
} from '@/api'
import { useStore } from 'vuex'
import { ref, reactive, nextTick, onMounted } from 'vue'
import {
  getStaticUrl,
  getImageWidth,
  urldecode,
  wssUrl,
  apiUrl
} from '@/utils/url.js'
import './components/style.scss'
// ref
const noticePlayer = ref(null)
// const audio_dong = ref(null)
// const audio_ci = ref(null)
// const audio_da = ref(null)
const preloadAudio = ref(null)
const audio = ref(null)

const store = useStore()
const roomInfo = ref({})
const userInfo = ref({})
const musicLrcObj = ref({})
const messageList = ref([])
// const uploadImageUrl = ref('/api/attach/uploadimage')
const message = ref('')
const lrcString = ref('')
const audioUrl = ref('')
const nextAudioUrl = ref('')
const audioTimeNow = ref('')
const audioTimeTotal = ref('')
const audioImage = ref('new/images/loading.png')
const audioVolume = ref(50) // 音量
const audioRetryTimes = ref(0) //
const audioPercent = ref(0) //
const timeDiff = ref(0) //
const isEnableScroll = ref(true)
const isVolumeBarShow = ref(false)
const songInfo = ref(false)
const timerVolumeBar = ref(null)
const isPlayerShow = ref(true)
const websocket = reactive({
  url: '',
  connection: null,
  isConnected: false,
  isForceStop: false,
  reConnectTimer: null,
  heartBeatTimer: null
})
// 消息最大允许保留
const historyMax = 100
onMounted(() => {
  ElMessageBox.confirm('欢迎来到在线音乐聊天室，即将为您播放音乐!', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success'
  })
    .then(() => {
      getUserInfo()
    })
    .catch(() => {})
})
// 同步时间戳

const getUserInfo = async () => {
  const info2 = await updateServerTime()
  const info = await getmyinfo()
  store.commit('app/setMyinfo', JSON.stringify(info) || '')
  userInfo.value = info
  timeDiff.value = parseInt(new Date().valueOf()) - info2.time
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
const audioVolumeChanged = () => {
  audio.value.volume = parseFloat(audioVolume.value / 100)
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
    audio.value.volume = 0
    localStorage.setItem('volume', 0)
  } else {
    // 取消静音
    let volume = localStorage.getItem('volume_old') || 30
    volume = parseInt(volume)
    audioVolume.value = volume
    audio.value.volume = parseFloat(volume / 100)
    localStorage.setItem('volume', volume)
  }
}
const passTheSong = async () => {
  if (!songInfo.value) {
    return
  }
  const info = songPass({ room_id: '1001', mid: songInfo.value.song.mid })
  console.log(info)
  audioImage.value = getStaticUrl('new/images/loading.png')
  ElMessage.success('切歌成功！')
}
const sendMessage = (e = false) => {
  if (e) {
    e.preventDefault()
  }
  if (message.value === '') {
    ElMessage.warning('请输入消息')
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
const getWebsocketUrls = async () => {
  const info = await getWebsocketUrl({
    channel: 1001,
    referer: document.referrer || false
  })
  console.log(info)
  websocket.url =
    wssUrl +
    '?account=' +
    info.account +
    '&channel=' +
    info.channel +
    '&ticket=' +
    info.ticket
  if (doForceCloseWebsocket()) {
    connectWebsocket()
  }
}
// 强制断开当前的websocket连接
const doForceCloseWebsocket = () => {
  if (!websocket.isConnected) {
    return true
  }
  // console.log("wating...");
  if (websocket.connection.readyState === 1) {
    websocket.connection.send('bye')
    websocket.connection.close()
  }
  setTimeout(function () {
    return doForceCloseWebsocket()
  }, 10)
}
// 连接websocket
const connectWebsocket = () => {
  websocket.connection = new WebSocket(websocket.url)
  websocket.connection.onopen = function (evt) {
    // console.log("链接成功");
    websocket.isConnected = true
    websocket.isForceStop = false
  }
  websocket.connection.onmessage = function (event) {
    messageController(event.data)
  }
  websocket.connection.onclose = function (event) {
    websocket.isConnected = false
    if (!websocket.isForceStop) {
      doWebsocketError()
    }
  }
}
const messageController = (data) => {
  try {
    let obj = {}
    // 这里有点尴尬
    try {
      obj = JSON.parse(data)
    } catch (e) {
      return
    }

    if (messageList.value.length > historyMax) {
      messageList.value.shift()
    }
    obj.time = parseInt(new Date().valueOf() / 1000)
    switch (obj.type) {
      case 'text':
        try {
          obj.content = decodeURIComponent(decodeURIComponent(obj.content))
        } catch (e) {
          obj.content = decodeURIComponent(obj.content)
        }
        if (obj.at) {
          try {
            obj.at.content = decodeURIComponent(decodeURIComponent(obj.content))
          } catch (e) {
            obj.content = decodeURIComponent(obj.content)
          }
        }

        obj.isAtAll = !!(
          obj.content.indexOf('@全体') === 0 &&
          (obj.user.user_id === roomInfo.value.room_user || obj.user.user_admin)
        )
        if (obj.user.user_id === userInfo.value.user_id) {
          for (let i = messageList.value.length - 1; i >= 0; i--) {
            if (messageList.value[i].loading === 1) {
              messageList.value.splice(i, 1)
              break
            }
          }
        }
        messageList.value.push(obj)
        break
      case 'link':
      case 'img':
      case 'system':
        if (messageList.value.length > historyMax) {
          messageList.value.shift()
        }
        messageList.value.push(obj)
        break
      case 'join':
        if (messageList.value.length > historyMax) {
          messageList.value.shift()
        }
        messageList.value.push(obj)
        break
      case 'addSong':
        addSystemMessage(
          urldecode(obj.user.user_name) +
            ' 点了一首 《' +
            obj.song.name +
            '》(' +
            obj.song.singer +
            ')'
        )
        break
      case 'push':
        addSystemMessage(
          urldecode(obj.user.user_name) +
            ' 顶了下《' +
            obj.song.name +
            '》(' +
            obj.song.singer +
            ')'
        )
        break
      case 'removeSong':
        addSystemMessage(
          urldecode(obj.user.user_name) +
            ' 将歌曲 《' +
            obj.song.name +
            '》(' +
            obj.song.singer +
            ') 从队列移除'
        )
        break
      case 'pass':
        musicLrcObj.value = {}
        audio.value.stop()
        addSystemMessage(
          urldecode(obj.user.user_name) +
            ' 切掉了当前播放的歌曲 《' +
            obj.song.name +
            '》(' +
            obj.song.singer +
            ') '
        )
        break
      case 'all':
        addSystemMessage(obj.content, '#fff', '#666')
        break

      case 'playSong':
        if (obj.song) {
          obj.song.pic = obj.song.pic.replace('http://', 'https://')
          songInfo.value = obj
          audioUrl.value = apiUrl + '/api/song/playurl?mid=' + obj.song.mid
          console.log('audioUrl', audioUrl.value)
          playMusic()
          if (obj.song.mid < 0) {
            addSystemMessage(
              '正在播放 ' +
                decodeURIComponent(obj.user.user_name) +
                ' 上传的歌曲《' +
                obj.song.name +
                '》(' +
                obj.song.singer +
                ')'
            )
          }
          if (obj.user.user_id === userInfo.value.user_id) {
            const notifyContent =
              '《' + obj.song.name + '》(' + obj.song.singer + ')'
            ElMessage.success(notifyContent)
          }
          console.log('songInfo', songInfo.value)
          playSystemAudio()
        }
        break
    }
  } catch (e) {
    console.log(e)
  }
}
// 添加系统消息
const addSystemMessage = (msg, color = '#999', bgColor = 'transparent') => {
  if (messageList.value.length > historyMax) {
    messageList.value.shift()
  }
  messageList.value.push({
    type: 'system',
    content: msg,
    bgColor: bgColor,
    color: color
  })
}
// 播放系统提示音
const playSystemAudio = () => {
  noticePlayer.value.play()
}
const playMusic = () => {
  getMusicLrc()
  audioRetryTimes.value = 0
  nextTick(() => {
    audioStartPlay()
  })
}
const doWebsocketError = () => {
  if (websocket.isForceStop) {
    return
  }
  // console.log("连接已断开，10s后将自动重连");
  clearTimeout(websocket.reConnectTimer)
  websocket.reConnectTimer = setTimeout(function () {
    connectWebsocket()
  }, 1000)
}
const audioStartPlay = () => {
  try {
    audio.value.load()
  } catch (e) {}
}
const getMusicLrc = async () => {
  musicLrcObj.value = {}
  lrcString.value = '歌词读取中...'
  const info = await getLrc({ mid: songInfo.value.song.mid })

  musicLrcObj.value = info
}
// audio
const audioTimeUpdate = () => {
  if (songInfo.value && audio.value.duration > 0) {
    audioTimeNow.value = getSongTime(audio.value.currentTime)
    audioTimeTotal.value = getSongTime(audio.value.duration)
    audioPercent.value =
      parseInt((audio.value.currentTime / audio.value.duration) * 10000) / 100
    if (audio.value.duration > 0) {
      if (musicLrcObj.value) {
        for (let i = 0; i < musicLrcObj.value.length; i++) {
          // console.log('musicLrcObj[i].time', musicLrcObj.value[i])
          if (i === musicLrcObj.value.length - 1) {
            updateLrcString(musicLrcObj.value[i].lineLyric)
            return
          } else {
            try {
              if (
                audio.value.currentTime > musicLrcObj.value[i].time &&
                audio.value.currentTime < musicLrcObj.value[i + 1].time
              ) {
                updateLrcString(musicLrcObj.value[i].lineLyric)
                return
              }
            } catch (error) {
              return
            }
          }
        }
      }
    }
  }
  updateLrcString('歌词读取中...')
}
const updateLrcString = (str) => {
  if (lrcString.value !== str) {
    lrcString.value = str
  }
}
const getSongTime = (long) => {
  long = parseInt(long)
  if (long === 0) {
    return '00:00'
  }
  let string = ''
  string +=
    parseInt(long / 60) < 10 ? '0' + parseInt(long / 60) : parseInt(long / 60)

  string += ':'
  string += long % 60 < 10 ? '0' + (long % 60) : long % 60
  return string
}
const audioEnded = () => {
  audioResetImage()
  if (
    roomInfo.value &&
    roomInfo.value.room_type === 4 &&
    roomInfo.value.room_playone
  ) {
    playMusic()
  }
}
const audioResetImage = () => {
  audioImage.value = getStaticUrl('new/images/loading.png')
}
const audioError = () => {
  audioResetImage()
  if (audioRetryTimes.value < 5) {
    if (audioUrl.value) {
      console.log('歌曲加载失败,正在准备重试')
      setTimeout(function () {
        audio.value.src = getStaticUrl(
          'music/' + songInfo.value.song.mid + '.jpg'
        )
        audioRetryTimes.value++
      }, 500)
    }
  } else {
    console.error('尝试了5次,还是加载不出来了...')
  }
}
const audioLoaded = () => {
  const nowTimeStamps = parseInt((new Date().valueOf() - timeDiff.value) / 1000)
  let now = 0
  switch (roomInfo.value.room_type) {
    case 1:
    case 2:
    case 4:
      now = parseFloat(nowTimeStamps - songInfo.value.since).toFixed(2)
      if (now >= audio.value.duration && audio.value.duration > 0) {
        audioUrl.value = ''
        songInfo.value = false
        return
      }
      if (now < 5) {
        now = 0
      }
      audio.value.currentTime = now < 0 ? 0 : now
      audioImage.value = decodeURIComponent(songInfo.value.user.user_head)
      break
    default:
  }
  audioTimeNow.value = getSongTime(audio.value.currentTime)
  audioTimeTotal.value = getSongTime(audio.value.duration)
}
const canplay = () => {
  audio.value.play()
}
</script>
<style scoped>
.music_title {
  height: 50px;
  width: 100%;
}
.music_header {
  width: 100%;
  height: 100%;
}
.header_title {
  line-height: 50px;
  font-size: 30px;
  float: left;
  margin-left: 20px;
}
.music_btn_list {
  float: left;
  width: 200px;
  height: 100%;
  display: flex;
  line-height: 50px;
  justify-content: space-between;
}
</style>
