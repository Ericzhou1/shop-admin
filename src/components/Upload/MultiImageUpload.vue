<!--
  多图上传组件
  @author: youlaitech
  @date 2022/11/20
-->

<template>
  <el-upload
    v-model:file-list="fileList"
    list-type="picture-card"
    :before-upload="handleBeforeUpload"
    :http-request="handleUpload"
    :on-remove="handleRemove"
    :limit="props.limit"
    :disabled="disabled"
    :on-exceed="handleExceed"
  >
    <i-ep-plus />
    <template #file="{ file }">
      <div :class="[isShowName ? 'isShowName' : '']">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" style="width: 146px" />
        <span class="img-title">{{ file.name }}</span>
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <el-icon><zoom-in /></el-icon>
          </span>

          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
            <el-icon><Delete /></el-icon>
          </span>
          <span
            v-if="!disabled && isNotFirst(file) && isNeedGoFirst"
            class="el-upload-list__item-homeFilled"
            @click="goFirst(file)"
          >
            <el-icon><HomeFilled /></el-icon>
          </span>
        </span>
      </div>
    </template>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="previewImgUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script setup lang="ts">
import { Delete, Download, Plus, ZoomIn, HomeFilled } from '@element-plus/icons-vue'
import {
  UploadRawFile,
  UploadRequestOptions,
  UploadUserFile,
  UploadFile,
  UploadProps,
} from 'element-plus'
import { uploadImgConfig } from '@/api/image'

import Compressor from 'compressorjs'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  /**
   * 文件路径集合
   */
  modelValue: {
    type: Array<any>,
    default: () => [],
  },
  /**
   * 文件上传数量限制
   */
  limit: {
    type: Number,
    default: 10,
  },
  scene: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  isShowName: {
    type: Boolean,
    default: false,
  },
  isNeedGoFirst: {
    type: Boolean,
    default: false,
  },
  sizeType: {
    type: String,
    default: 'M',
  },
  maxSize: {
    type: Number,
    default: 2,
  },
  uploadFileType: {
    type: Array,
    default: () => [],
  },
})

const previewImgUrl = ref('')
const dialogVisible = ref(false)

const fileList = ref([] as UploadUserFile[])

function isNotFirst(file: any) {
  const findIndex = fileList.value.findIndex((item: any) => {
    return item.url === file.url && item.name === file.name
  })
  return findIndex !== 0
}
watch(
  () => props.modelValue,
  (newVal: any[]) => {
    if (!newVal || !newVal.length) return (fileList.value = [])
    const filePaths = fileList.value.map((file) => file.url)
    // 监听modelValue文件集合值未变化时，跳过赋值

    if (!props.isShowName) {
      if (
        filePaths.length > 0 &&
        filePaths.length === newVal.length &&
        filePaths.every((x) => newVal.some((y) => y === x)) &&
        newVal.every((y) => filePaths.some((x) => x === y))
      ) {
        return
      }

      fileList.value = newVal.map((filePath) => {
        return { url: filePath } as UploadUserFile
      })
    } else {
      if (
        filePaths.length > 0 &&
        filePaths.length === newVal.length &&
        filePaths.every((x: any) => newVal.some((y: any) => y.url === x.url)) &&
        newVal.every((y: any) => filePaths.some((x: any) => x.url === y.url))
      ) {
        return
      }

      fileList.value = newVal.map((file) => {
        return { url: file.url, name: file.name } as UploadUserFile
      })
    }
    // fileList.value = newVal.map((filePath) => {
    //   return { url: filePath } as UploadUserFile
    // })
    // console.log(88, fileList.value)
  },
  { immediate: true }
)

/**
 * 自定义图片上传
 *
 * @param params
 */
async function handleUpload(options: UploadRequestOptions): Promise<any> {
  // 上传API调用
  // const { data: fileInfo } = await uploadImgConfig(options.file)
  new Compressor(options.file, {
    quality: 0.8,
    success(result) {
      uploadImgConfig(result, props.scene).then((res: any) => {
        // 上传成功需手动替换文件路径为远程URL，否则图片地址为预览地址 blob:http://
        const fileIndex = fileList.value.findIndex(
          (file) =>
            file.url == (options.file as any).url && file.name === (options.file as any).name
        )
        fileList.value.splice(fileIndex, 1, {
          name: res.name,
          url: res.url,
        } as UploadUserFile)
        if (props.isShowName) {
          emit('update:modelValue', fileList.value)
        } else {
          emit(
            'update:modelValue',
            fileList.value.map((file) => file.url)
          )
        }
      })
    },
    error(err) {
      console.error('压缩失败:', err)
    },
  })
}

function handleExceed() {
  ElMessage.warning(`图片数量最多为${props.limit}张！`)
}

/**
 * 删除图片
 */
function handleRemove(removeFile: UploadFile) {
  const index = fileList.value.findIndex((item: any) => item.url === removeFile.url)
  if (index > -1) {
    fileList.value.splice(index, 1)
    if (props.isShowName) {
      emit('update:modelValue', fileList.value)
    } else {
      emit(
        'update:modelValue',
        fileList.value.map((file) => file.url)
      )
    }
  }
}

/**
 * 限制用户上传文件的格式和大小
 */
function handleBeforeUpload(file: UploadRawFile) {
  if (!props.uploadFileType.includes(file.type)) {
    ElMessage.error('请上传正确格式的图片！')
    return false
  } else if (props.sizeType === 'M' && file.size > props.maxSize * 1048 * 1048) {
    ElMessage.warning(`上传图片不能大于${props.maxSize}M`)
    return false
  } else if (props.sizeType === 'KB' && file.size / 1024 > props.maxSize) {
    ElMessage.warning(`上传图片不能大于${props.maxSize}KB`)
    return false
  }

  return true
}

/**
 * 预览图片
 */

const handlePictureCardPreview = (file: UploadFile) => {
  previewImgUrl.value = file.url!
  dialogVisible.value = true
}

function goFirst(file: any) {
  const index = fileList.value.findIndex((item: any) => item.url === file.url)
  let item = fileList.value.splice(index, 1)[0] // 从数组中移除该项并获得它
  fileList.value.unshift(item)
}
</script>

<style scoped lang="scss">
.isShowName {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  .img-title {
    white-space: nowrap;
  }

  img {
    width: 108px;
    height: 108px;
  }
}
</style>
