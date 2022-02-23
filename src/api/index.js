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
