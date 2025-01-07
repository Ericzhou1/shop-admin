<template>
  <div class="app-container">
    <div class="form-container" :class="{ 'form-hidden': isScrolled }">
      <el-form :model="productInfo" label-width="120px">
        <el-row style="padding: 0px">
          <el-col :span="6">
            <div class="image-gallery">
              <el-row class="main-image-container" justify="center">
                <el-image
                  :src="'//images.weserv.nl/?url=' + selectedImage"
                  class="main-image"
                  fit="contain"
                />
              </el-row>
              <div class="thumbnail-container">
                <div class="thumbnail-wrapper">
                  <div
                    v-for="(image, index) in productInfo.images"
                    :key="index"
                    class="thumbnail-item"
                  >
                    <el-image
                      :src="'//images.weserv.nl/?url=' + image.url"
                      class="thumbnail"
                      :class="{ active: selectedImage === image.url }"
                      @click="selectImage(image.url)"
                      fit="cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="18">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="商品名称">
                  <span>{{ productInfo.name }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品条码">
                  <span>{{ productInfo.ean13 }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品售价">
                  <span>{{ productInfo.buyPrice }}元</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品类型">
                  <span>{{ productInfo.typeName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品编号">
                  <span>{{ productInfo.code }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24">
            <el-form-item label="商品参数">
              <div class="params-list">
                <el-tag
                  v-for="(param, index) in productInfo.params"
                  :key="index"
                  class="param-item"
                  type="info"
                  effect="plain"
                >
                  {{ param.key }}: {{ param.value }}
                </el-tag>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="description-container" ref="descriptionRef">
      <el-divider content-position="center"> 商品描述 </el-divider>
      <el-scrollbar height="100vh" @scroll="handleScroll">
        <div v-html="productInfo.intro"></div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { productTypeList, productDetails } from '@/api/product'
import { useRoute } from 'vue-router'
import { InfoFilled } from '@element-plus/icons-vue'

const route = useRoute()
const productTypeOptions = ref<any>([])
const productInfo = reactive<any>({
  productName: '',
  productBarcode: '',
  productPrice: '',
  productType: '',
  productParameters: [],
  productImages: [],
  productDescription: ''
})

const isScrolled = ref(false)
const descriptionRef = ref()
const selectedImage = ref('')

const handleScroll = (e: any) => {
  if (e.scrollTop > 50) {
    isScrolled.value = true
  } else {
    isScrolled.value = false
  }
}

const fetchProductTypeOptions = async () => {
  const res = await productTypeList()
  productTypeOptions.value = res.data.items
}

const fetchProductDetails = async () => {
  const data = { id: Number(route.query.id) }
  const res = await productDetails(data)
  Object.assign(productInfo, res.data)
  if (res.data.images && res.data.images.length > 0) {
    selectedImage.value = res.data.images[0].url
  }
}

const selectImage = (url: string) => {
  selectedImage.value = url
}

onMounted(() => {
  fetchProductTypeOptions()
  fetchProductDetails()
})
</script>

<style lang="scss" scoped>
.app-container {
  height: calc(100vh - 110px);
  background-color: #fff;
  margin: 20px;
  border-radius: 10px;
  position: relative;
  overflow: hidden;

  .form-container {
    transition: all 0.3s ease;
    background: #fff;
    position: relative;
    z-index: 2;
    padding: 20px;

    &.form-hidden {
      transform: translateY(-100%);
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
  }

  .description-container {
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
    padding: 0 20px;
  }

  .image-gallery {
    width: 100%;

    .main-image-container {
      margin-bottom: 8px;

      .main-image {
        width: 100%;
        height: 150px;
        border: 1px solid #eee;
        border-radius: 4px;
      }
    }

    .thumbnail-container {
      width: 100%;
      padding: 0 8px;

      .thumbnail-wrapper {
        display: flex;
        justify-content: center;
        gap: 6px;
        flex-wrap: wrap;
        margin: 0 auto;
        max-width: fit-content;
      }

      .thumbnail-item {
        width: 40px;
        height: 40px;
        flex-shrink: 0;

        .thumbnail {
          width: 100%;
          height: 100%;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
          padding: 2px;

          &:hover {
            border-color: var(--el-color-primary);
            transform: scale(1.05);
          }

          &.active {
            border-color: var(--el-color-primary);
            border-width: 2px;
            padding: 1px;
          }
        }
      }
    }
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
  }

  :deep(.el-descriptions__label) {
    font-weight: 500;
    width: 120px;
  }

  .params-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .param-item {
    font-size: 14px;
    padding: 8px 12px;
  }

  :deep(.el-divider) {
    margin: 16px 0;

    .el-icon {
      font-size: 20px;
      color: var(--el-text-color-secondary);
    }
  }
}
</style>
