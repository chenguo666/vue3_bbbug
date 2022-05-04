const staticUrl = 'http://music_api.guopro.cn/'
export function getStaticUrl(url) {
  if (!url) {
    url = ''
  }
  const isHttps = document.location.protocol === 'https:'
  if (isHttps) {
    url = http2https(url.toString())
  }
  if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
    return url
  } else {
    if (
      url.indexOf('new/images') > -1 ||
      url.indexOf('new/mp3') > -1 ||
      url.indexOf('music/') > -1
    ) {
      return staticUrl + url
    } else {
      return staticUrl + 'uploads/' + url
    }
  }
}
export function getImageWidth(url) {
  if (url.indexOf('/images/emoji/') > 0) {
    return 60
  } else {
    return 200
  }
}
export function urldecode(str) {
  try {
    return decodeURIComponent(str)
  } catch (e) {
    return str
  }
}
export const wssUrl = 'ws://49.232.138.153:10011'
// export const wssUrl = 'ws://192.168.0.128:10011'
export const apiUrl = 'http://music_api.guopro.cn/'

function http2https(str) {
  return str.toString().replace('http://', 'https://')
}
