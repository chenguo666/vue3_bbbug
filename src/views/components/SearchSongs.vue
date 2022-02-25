<template>
  <el-drawer :model-value="drawer" title="点歌" :direction="right">
    <div>
      <div class="music_title">
        <el-input v-model="keyword" placeholder="歌名/歌手">
          <template #append><div @click="getList">搜索</div> </template>
        </el-input>
      </div>
      <div class="music_list">
        <div class="music_scroll">
          <div class="list_item" v-for="(item, index) in list" :key="index">
            <img
              :src="getStaticUrl(item.pic)"
              class="xiaomi"
              :onerror="getStaticUrl('new/images/nohead.jpg')"
            />
            <div class="span_text">{{ item.name }}-{{ item.singer }}</div>
            <el-button @click="playSong(index)">点歌</el-button>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>
<script setup>
import { ref } from 'vue'
import { songsearch, songaddSong } from '../../api/index.js'
import { getStaticUrl } from '@/utils/url.js'
import { ElMessage } from 'element-plus'
const list = ref([])
const keyword = ref('')
const getList = async () => {
  if (keyword.value) {
    const info = await songsearch({
      room_id: '1001',
      keyword: keyword.value,
      isHots: 0
    })
    console.log(info)
    list.value = info
  }
}
const playSong = async (index) => {
  const info = await songaddSong({
    room_id: '1001',
    mid: list.value[index].mid
  })
  console.log(info)
  ElMessage.success('点歌成功')
}
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
