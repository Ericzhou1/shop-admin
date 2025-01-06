import request from '@/utils/request'
import axios from 'axios'

interface uploadImgConfig {
  scene: string
  filename: string
}
/**a
 * 上传文件
 *
 * @param file
 */
export function uploadFileApi(file: any, scene = 'point') {
  const data: uploadImgConfig = { filename: file.name, scene: scene }
  return new Promise<void>((resolve, reject) => {
    request({
      url: '/common/ossAdmin',
      method: 'post',
      data: data,
    })
      .then(async (res: any) => {
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
          data: formData,
        })
        console.log(imgResponse, 22222)
        const imgUrl = url + fileData.dir
        const data: any = {
          name: file.name,
          url: imgUrl,
        }
        resolve(data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * 删除文件
 *
 * @param filePath 文件完整路径
 */
export function deleteFileApi(filePath?: string) {
  return request({
    url: '/api/v1/files',
    method: 'delete',
    params: { filePath: filePath },
  })
}
