import request from './request'

export const getmyinfo = (data) => {
  return request({
    url: 'user/getmyinfo',
    method: 'POST',
    data
  })
}
export const getRoomInfo = (data) => {
  return request({
    url: 'room/getRoomInfo',
    method: 'POST',
    data
  })
}
export const MessageList = (data) => {
  return request({
    url: 'message/getMessageList',
    method: 'POST',
    data
  })
}
export const messageSend = (data) => {
  return request({
    url: 'message/send',
    method: 'POST',
    data
  })
}
export const songPass = (data) => {
  return request({
    url: 'song/pass',
    method: 'POST',
    data
  })
}
export const getWebsocketUrl = (data) => {
  return request({
    url: 'room/getWebsocketUrl',
    method: 'POST',
    data
  })
}
export const getLrc = (data) => {
  return request({
    url: 'song/getLrc',
    method: 'POST',
    data
  })
}
export const upload = (data) => {
  console.log('data', data)
  return request({
    url: 'attach/uploadimage',
    method: 'POST',
    data
  })
}
export const updateServerTime = (data) => {
  return request({
    url: 'system/time',
    method: 'POST',
    data
  })
}
export const songsearch = (data) => {
  return request({
    url: 'song/search',
    method: 'POST',
    data
  })
}
export const songaddSong = (data) => {
  return request({
    url: 'song/addSong',
    method: 'POST',
    data
  })
}
export const songmySongList = (data) => {
  return request({
    url: 'song/songList',
    method: 'POST',
    data
  })
}
