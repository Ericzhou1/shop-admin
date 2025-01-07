import request from '@/utils/request'
import axios from 'axios'
import { ElMessage } from 'element-plus'
interface uploadImgConfig {
  scene: string
  filename: string
}
export function uploadImgConfig(file: any, scene = 'point') {
  const data: uploadImgConfig = { filename: file.name, scene: scene }
  return new Promise<void>((resolve, reject) => {
    request({
      url: '/common/oss-token',
      method: 'post',
      data: data
    }).then(async (res: any) => {
      const fileData = res.data
      const formData = new FormData()
      formData.append('signature', fileData.signature)
      formData.append('key', fileData.dir)
      formData.append('OSSAccessKeyId', fileData.accessId)
      formData.append('policy', fileData.policy)
      formData.append('file', file)
      formData.append('callback', fileData.callback)
      formData.append('success_action_status', '200')
      const url = fileData.host
      const imgResponse: any = await axios({
        url,
        method: 'post',
        data: formData
      })
      const imgUrl = url + fileData.dir
      resolve(imgUrl)
    })
  })
}
export function validateUploadImg(rawFile: any) {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('上传图片格式错误!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('图片大小不能超过5MB!')
    return false
  }
  return true
}
