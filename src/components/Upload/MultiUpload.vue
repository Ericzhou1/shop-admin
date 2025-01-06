<!--
  多图上传组件
  @description: 支持多图片上传、预览、排序、压缩等功能
  @props:
    - modelValue: 图片路径数组
    - limit: 最大上传数量
    - scene: 上传场景
    - disabled: 是否禁用
    - isShowName: 是否显示图片名称
    - isNeedGoFirst: 是否需要置顶功能
    - sizeType: 大小限制类型(M/KB)
    - maxSize: 最大大小
    - uploadFileType: 允许上传的文件类型
    - size: 组件尺寸控制
-->

<template>
  <el-upload
    v-if="fileList.length < props.limit"
    v-model:file-list="fileList"
    list-type="picture-card"
    :before-upload="handleBeforeUpload"
    :http-request="handleUpload"
    :on-remove="handleRemove"
    :limit="props.limit"
    :disabled="disabled"
    :on-exceed="handleExceed"
    :style="{ '--el-upload-list-picture-card-size': props.size.width || '146px' }"
  >
    <el-icon><Plus /></el-icon>
    <template #file="{ file }">
      <div :class="[isShowName ? 'isShowName' : '']">
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          alt=""
          :style="{ width: props.size.width, height: props.size.height }"
        />
        <span v-if="isShowName" class="img-title">{{ file.name }}</span>
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <el-icon><zoom-in /></el-icon>
          </span>
          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
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

  <div v-else class="upload-list-only">
    <div
      v-for="file in fileList"
      :key="file.url"
      class="el-upload-list__item"
      :style="{ width: props.size.width, height: props.size.height, margin: '0 auto' }"
    >
      <img
        class="el-upload-list__item-thumbnail"
        :src="file.url"
        alt=""
        :style="{ width: props.size.width, height: props.size.height }"
      />
      <span class="el-upload-list__item-actions">
        <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file as any)">
          <el-icon><zoom-in /></el-icon>
        </span>
        <span class="el-upload-list__item-delete" @click="handleRemove(file as any)">
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
  </div>

  <el-dialog
    v-model="dialogVisible"
    append-to-body
    :modal="true"
    align-center
    class="preview-dialog"
  >
    <div class="preview-image-wrapper">
      <img :src="previewImgUrl" alt="Preview Image" />
    </div>
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
   * 组件尺寸控制
   * @example { width: '100px', height: '100px' }
   */
  size: {
    type: Object as PropType<{ width?: string; height?: string }>,
    default: () => ({
      width: '146px',
      height: '146px',
    }),
  },
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

/**
 * 判断是否不是第一个文件
 * @param file 当前文件
 * @returns boolean
 */
function isNotFirst(file: any) {
  const findIndex = fileList.value.findIndex((item: any) => {
    return item.url === file.url && item.name === file.name
  })
  return findIndex !== 0
}

/**
 * 监听 modelValue 变化
 */
watch(
  () => props.modelValue,
  (newVal: any[]) => {
    if (!newVal || !newVal.length) return (fileList.value = [])
    const filePaths = fileList.value.map((file) => file.url)

    // 根据是否显示文件名处理不同的数据结构
    if (!props.isShowName) {
      if (
        filePaths.length > 0 &&
        filePaths.length === newVal.length &&
        filePaths.every((x) => newVal.some((y) => y === x)) &&
        newVal.every((y) => filePaths.some((x) => x === y))
      ) {
        return
      }
      fileList.value = newVal.map((filePath) => ({ url: filePath }) as UploadUserFile)
    } else {
      if (
        filePaths.length > 0 &&
        filePaths.length === newVal.length &&
        filePaths.every((x: any) => newVal.some((y: any) => y.url === x.url)) &&
        newVal.every((y: any) => filePaths.some((x: any) => x.url === y.url))
      ) {
        return
      }
      fileList.value = newVal.map((file) => ({ url: file.url, name: file.name }) as UploadUserFile)
    }
  },
  { immediate: true }
)

/**
 * 处理图片上传
 * @param options 上传选项
 */
async function handleUpload(options: UploadRequestOptions): Promise<any> {
  // 使用 Compressor.js 压缩图片
  new Compressor(options.file, {
    quality: 0.8, // 压缩质量
    success(result) {
      // 调用上传 API
      uploadImgConfig(result, props.scene).then((res: any) => {
        // 更新文件列表
        const fileIndex = fileList.value.findIndex(
          (file) =>
            file.url == (options.file as any).url && file.name === (options.file as any).name
        )
        fileList.value.splice(fileIndex, 1, {
          name: res.name,
          url: res.url,
        } as UploadUserFile)

        // 触发更新事件
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

/**
 * 处理超出上传限制
 */
function handleExceed() {
  ElMessage.warning(`图片数量最多为${props.limit}张！`)
}

/**
 * 处理图片删除
 * @param removeFile 要删除的文件
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
 * 上传前的验证
 * @param file 要上传的文件
 * @returns boolean
 */
function handleBeforeUpload(file: UploadRawFile) {
  // 验证文件类型
  if (!props.uploadFileType.includes(file.type)) {
    ElMessage.error('请上传正确格式的图片！')
    return false
  }

  // 验证文件大小
  if (props.sizeType === 'M' && file.size > props.maxSize * 1048 * 1048) {
    ElMessage.warning(`上传图片不能大于${props.maxSize}M`)
    return false
  } else if (props.sizeType === 'KB' && file.size / 1024 > props.maxSize) {
    ElMessage.warning(`上传图片不能大于${props.maxSize}KB`)
    return false
  }

  return true
}

/**
 * 处理图片预览
 * @param file 要预览的文件
 */
const handlePictureCardPreview = (file: UploadFile) => {
  previewImgUrl.value = file.url!
  dialogVisible.value = true
}

/**
 * 将图片置顶
 * @param file 要置顶的文件
 */
function goFirst(file: any) {
  const index = fileList.value.findIndex((item: any) => item.url === file.url)
  let item = fileList.value.splice(index, 1)[0]
  fileList.value.unshift(item)
}
</script>

<style scoped lang="scss">
:deep(.el-upload-list--picture-card) {
  .el-upload-list__item-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 25%;
      height: 25%;
      color: #fff;
      cursor: pointer;

      &:hover {
        color: var(--el-color-primary);
      }

      i {
        font-size: 20px;
      }
    }
  }
}

.preview-dialog {
  :deep(.el-dialog) {
    max-width: 80%;
    max-height: 80vh;
    margin-top: 8vh !important;

    .el-dialog__body {
      padding: 16px;
    }
  }

  .preview-image-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      max-width: 100%;
      max-height: calc(80vh - 100px);
      object-fit: contain;
    }
  }
}

.upload-list-only {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .el-upload-list__item {
    position: relative;
    overflow: hidden;
    background-color: var(--el-fill-color-blank);
    border: 1px solid var(--el-border-color);
    border-radius: 6px;

    img {
      object-fit: cover;
    }

    .el-upload-list__item-actions {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      color: #fff;
      background-color: var(--el-overlay-color-lighter);
      opacity: 0;
      transition: opacity 0.3s;

      &:hover {
        opacity: 1;
      }

      .el-upload-list__item-delete,
      .el-upload-list__item-preview,
      .el-upload-list__item-homeFilled {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25%;
        height: 25%;
        padding: 0;
        font-size: 16px;
        cursor: pointer;

        &:hover {
          color: var(--el-color-primary);
        }

        .el-icon {
          font-size: inherit;
        }
      }

      .el-upload-list__item-delete {
        position: absolute;
        top: 50%;
        right: 10%;
        width: 50%;
        height: 50%;
        transform: translate(-50%, -50%);
      }

      .el-upload-list__item-preview {
        position: absolute;
        top: 50%;
        left: 20%;
        width: 50%;
        height: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}

:deep(.el-upload--picture-card) {
  width: v-bind('props.size.width');
  height: v-bind('props.size.height');
}
</style>
