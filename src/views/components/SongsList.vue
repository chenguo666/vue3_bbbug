<template>
  <el-drawer :model-value="drawer2" title="歌单" :direction="right">
    <div>
      <div class="music_list">
        <div class="music_scroll">
          <div class="list_item" v-for="(item, index) in list" :key="index">
            <img
              :src="getStaticUrl(item.song.pic)"
              class="xiaomi"
              :onerror="getStaticUrl('new/images/nohead.jpg')"
            />
            <div class="span_text">
              {{ item.song.name }}-{{ item.song.singer }}
            </div>
            <!-- <el-button @click="playSong(index)">点歌</el-button> -->
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>
<script setup>
import { ref } from 'vue'
import { songmySongList } from '../../api/index.js'
import { getStaticUrl } from '@/utils/url.js'
// import { ElMessage } from 'element-plus'
const list = ref([])
const getList = async () => {
  const info = await songmySongList({
    room_id: '1001'
  })
  console.log(info)
  list.value = info
}
getList()
</script>
<style scoped>
.music_title {
  text-align: left;
  padding: 0px 10px 5px 10px;
  color: #aaa;
  font-size: 12px;
}
.xiaomi {
  width: 50px;
  height: 50px;
  vertical-align: middle;
  float: left;
}
.music_list {
  width: 100%;
  height: 550px;
}
.music_scroll {
  width: 90%;
  height: 100%;
  margin: 0 auto;
}
.list_item {
  height: 50px;
  width: 100%;
  line-height: 50px;
  margin-bottom: 10px;
  text-align: left;
}
.span_text {
  float: left;
  display: block;
  line-height: 50px;
  font-size: 16px;
  color: black;
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
