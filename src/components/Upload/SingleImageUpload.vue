<!-- 单图上传组件 -->
<template>
  <el-upload
    v-model="imgUrl"
    class="img-upload"
    :show-file-list="false"
    list-type="picture-card"
    :before-upload="handleBeforeUpload"
    :http-request="handleUpload"
    :style="{ width: props.size.width, height: props.size.height }"
    :accept="props.accept"
  >
    <div v-if="imgUrl" class="el-upload-list__item">
      <img class="el-upload-list__item-thumbnail" :src="imgUrl" alt="" />
      <span class="el-upload-list__item-actions">
        <span class="el-upload-list__item-preview" @click.stop="handlePictureCardPreview">
          <el-icon><ZoomIn /></el-icon>
        </span>
        <span class="el-upload-list__item-delete" @click.stop="handleDelete">
          <el-icon><Delete /></el-icon>
        </span>
      </span>
    </div>
    <el-icon v-else><Plus /></el-icon>
  </el-upload>

  <el-dialog
    v-model="dialogVisible"
    append-to-body
    :modal="true"
    align-center
    class="preview-dialog"
  >
    <div class="preview-image-wrapper">
      <img :src="imgUrl" alt="Preview Image" />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { UploadRawFile, UploadRequestOptions } from 'element-plus'
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import { uploadImgConfig } from '@/api/image'
import Compressor from 'compressorjs'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  maxSize: {
    type: Number,
    default: 10, // 默认限制为 10MB
  },
  accept: {
    type: String,
    default: '',
  },
  size: {
    type: Object as PropType<{ width?: string; height?: string }>,
    default: () => ({
      width: '150px',
      height: '150px',
    }),
  },
  scene: {
    type: String,
    default: 'spc-test',
  },
})

const emit = defineEmits(['update:modelValue'])
const imgUrl = defineModel('modelValue', {
  type: String,
  required: true,
  default: '',
})
const dialogVisible = ref(false)

/**
 * 自定义图片上传
 */
async function handleUpload(options: UploadRequestOptions): Promise<any> {
  new Compressor(options.file, {
    quality: 0.8,
    success(result) {
      uploadImgConfig(result, props.scene).then((res: any) => {
        imgUrl.value = res.url
      })
    },
    error(err) {
      console.error('压缩失败:', err)
    },
  })
}

/**
 * 限制用户上传文件的格式和大小
 */
function handleBeforeUpload(file: UploadRawFile) {
  if (file.size > props.maxSize * 1024 * 1024) {
    ElMessage.warning(`上传图片不能大于${props.maxSize}MB`)
    return false
  }
  return true
}

/**
 * 预览图片
 */
function handlePictureCardPreview() {
  if (imgUrl.value) {
    dialogVisible.value = true
  }
}

/**
 * 删除图片
 */
function handleDelete() {
  imgUrl.value = ''
}
</script>

<style scoped lang="scss">
:deep(.el-upload--picture-card) {
  width: 100%;
  height: 100%;
  margin: 0;
  border: none;
}

.el-upload-list__item {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--el-fill-color-blank);

  img {
    width: 100%;
  }

  .el-upload-list__item-actions {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #fff;
    background-color: var(--el-overlay-color-lighter);
    opacity: 0;
    transition: opacity 0.3s;

    &:hover {
      opacity: 1;
    }

    span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 10%;
      height: 10%;
      color: #fff;
      cursor: pointer;

      &:hover {
        color: var(--el-color-primary);
      }

      i {
        font-size: 1rem;
      }
    }
  }
}

.img-upload {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px var(--el-border-color) solid;
  border-radius: 5px;

  &:hover {
    border-color: var(--el-color-primary);
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
</style>
