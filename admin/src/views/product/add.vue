<template>
  <div class="product-add-container">
    <el-card class="product-card">
      <div slot="header" class="card-header">
        <span class="card-title">添加茶叶商品</span>
      </div>

      <el-form
        ref="productForm"
        :model="productForm"
        :rules="rules"
        label-width="100px"
        class="product-form"
      >
        <!-- ==================== 1. 基本信息区 ==================== -->
        <div class="section-block">
          <div class="section-title">
            <span class="section-border"></span>
            <span>基本信息</span>
          </div>

          <el-form-item label="商品名称" prop="name">
            <el-input
              v-model="productForm.name"
              placeholder="请输入茶叶商品名称，如「明前龙井 2024新茶」"
              maxlength="50"
              show-word-limit
            ></el-input>
          </el-form-item>

          <el-form-item label="商品分类" prop="categoryId">
            <el-select
              v-model="productForm.categoryId"
              placeholder="请选择茶叶分类"
              style="width: 100%"
            >
              <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="简短描述" prop="brief">
            <el-input
              v-model="productForm.brief"
              type="textarea"
              :rows="3"
              placeholder="请输入简短描述，一句话介绍茶叶特色"
              maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>
        </div>

        <!-- ==================== 2. 价格库存区 ==================== -->
        <div class="section-block">
          <div class="section-title">
            <span class="section-border"></span>
            <span>价格库存</span>
          </div>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="售价" prop="price">
                <el-input-number
                  v-model="productForm.price"
                  :precision="2"
                  :step="0.1"
                  :min="0"
                  :disabled="hasMultiSpec"
                  style="width: 100%"
                >
                  <template slot="append">元</template>
                </el-input-number>
                <span v-if="hasMultiSpec" class="form-hint">多规格模式下由各规格决定</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="原价">
                <el-input-number
                  v-model="productForm.originalPrice"
                  :precision="2"
                  :step="0.1"
                  :min="0"
                  style="width: 100%"
                >
                  <template slot="append">元</template>
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="库存" prop="stock">
                <el-input-number
                  v-model="productForm.stock"
                  :step="1"
                  :min="0"
                  :disabled="hasMultiSpec"
                  style="width: 100%"
                ></el-input-number>
                <span v-if="hasMultiSpec" class="form-hint">多规格模式下由各规格决定</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="单位" prop="unit">
                <el-select v-model="productForm.unit" style="width: 100%">
                  <el-option label="盒" value="盒"></el-option>
                  <el-option label="罐" value="罐"></el-option>
                  <el-option label="饼" value="饼"></el-option>
                  <el-option label="袋" value="袋"></el-option>
                  <el-option label="包" value="包"></el-option>
                  <el-option label="斤" value="斤"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="重量">
                <el-select
                  v-model="productForm.weight"
                  filterable
                  allow-create
                  placeholder="选择或输入重量"
                  style="width: 100%"
                >
                  <el-option label="50g" value="50g"></el-option>
                  <el-option label="100g" value="100g"></el-option>
                  <el-option label="125g" value="125g"></el-option>
                  <el-option label="200g" value="200g"></el-option>
                  <el-option label="250g" value="250g"></el-option>
                  <el-option label="357g（标准饼）" value="357g"></el-option>
                  <el-option label="500g" value="500g"></el-option>
                  <el-option label="1000g" value="1000g"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="排序号">
                <el-input-number
                  v-model="productForm.sort"
                  :min="0"
                  :max="9999"
                  style="width: 100%"
                ></el-input-number>
                <span class="form-hint">数值越大越靠前</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- ==================== 3. 茶叶属性区 ==================== -->
        <div class="section-block">
          <div class="section-title">
            <span class="section-border"></span>
            <span>茶叶属性</span>
          </div>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="8">
              <el-form-item label="产地">
                <el-input
                  v-model="productForm.origin"
                  placeholder="如：杭州西湖"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="8">
              <el-form-item label="年份">
                <el-input
                  v-model="productForm.year"
                  placeholder="如：2024年春"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="8">
              <el-form-item label="香型">
                <el-input
                  v-model="productForm.aroma"
                  placeholder="如：清香型/浓香型"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- ==================== 4. 多规格管理区 ==================== -->
        <div class="section-block">
          <div class="section-title">
            <span class="section-border"></span>
            <span>多规格管理</span>
            <el-tooltip content="管理不同规格（如礼盒装/简装、不同克重）的价格和库存，仅一个规格时与主表单联动" placement="top">
              <i class="el-icon-question section-tip-icon"></i>
            </el-tooltip>
          </div>

          <div class="spec-table-wrapper">
            <el-table :data="productForm.specifications" border class="spec-table">
              <el-table-column label="规格名称" min-width="160">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.name"
                    placeholder="如：礼盒装 / 简装 / 试饮装"
                    size="small"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="价格(元)" width="160">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.price"
                    :precision="2"
                    :step="0.1"
                    :min="0"
                    size="small"
                    controls-position="right"
                    style="width: 130px"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="库存" width="140">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.stock"
                    :min="0"
                    :step="1"
                    size="small"
                    controls-position="right"
                    style="width: 110px"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    circle
                    :disabled="productForm.specifications.length <= 1"
                    @click="removeSpecification(scope.$index)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="small"
            class="add-spec-btn"
            @click="addSpecification"
          >
            添加规格
          </el-button>
          <span class="form-hint" style="margin-left: 12px">
            当前共 {{ productForm.specifications.length }} 个规格
          </span>
        </div>

        <!-- ==================== 5. 商品图片区 ==================== -->
        <div class="section-block">
          <div class="section-title">
            <span class="section-border"></span>
            <span>商品图片</span>
          </div>

          <el-form-item label="封面主图" prop="imageUrl">
            <el-upload
              class="cover-upload"
              action="/api/admin/upload/product"
              :headers="uploadHeaders"
              :on-preview="handlePreview"
              :on-remove="handleCoverRemove"
              :on-success="handleCoverSuccess"
              :on-error="handleUploadError"
              :before-upload="beforeImageUpload"
              :limit="1"
              :file-list="coverFileList"
              list-type="picture-card"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <div class="el-upload__tip">
              请上传商品封面图，支持 jpg/png 格式，大小不超过 2MB
            </div>
          </el-form-item>

          <el-form-item label="轮播图集">
            <el-upload
              class="gallery-upload"
              action="/api/admin/upload/product"
              :headers="uploadHeaders"
              :on-preview="handlePreview"
              :on-remove="handleGalleryRemove"
              :on-success="handleGallerySuccess"
              :on-error="handleUploadError"
              :before-upload="beforeImageUpload"
              :limit="9"
              :file-list="galleryFileList"
              list-type="picture-card"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <div class="el-upload__tip">
              可上传多张轮播图片，最多 9 张
            </div>
          </el-form-item>

          <el-dialog :visible.sync="previewVisible" append-to-body>
            <img width="100%" :src="previewUrl" alt="图片预览" />
          </el-dialog>
        </div>

        <!-- ==================== 6. 商品详情区 ==================== -->
        <div class="section-block">
          <div class="section-title">
            <span class="section-border"></span>
            <span>商品详情</span>
          </div>

          <el-form-item label="详细描述" prop="content">
            <el-input
              v-model="productForm.content"
              type="textarea"
              :rows="8"
              placeholder="请输入商品详细描述（后续可集成富文本编辑器，支持图文混排）"
            ></el-input>
            <div class="el-upload__tip" style="margin-top: 8px">
              提示：此区域将用于展示茶叶的冲泡方法、口感特点、产地故事等详细信息
            </div>
          </el-form-item>
        </div>

        <!-- ==================== 7. 标签与属性区 ==================== -->
        <div class="section-block">
          <div class="section-title">
            <span class="section-border"></span>
            <span>标签与属性</span>
          </div>

          <el-form-item label="商品标签">
            <div class="tag-container">
              <el-tag
                v-for="(tag, index) in productForm.tags"
                :key="index"
                closable
                :disable-transitions="false"
                size="medium"
                class="tag-item"
                @close="handleTagClose(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="tagInputVisible"
                ref="tagInput"
                v-model="tagInputValue"
                size="small"
                class="tag-input"
                @keyup.enter.native="handleTagConfirm"
                @blur="handleTagConfirm"
              ></el-input>
              <el-button
                v-else
                size="small"
                class="tag-add-btn"
                @click="showTagInput"
              >
                + 添加标签
              </el-button>
            </div>
            <div class="el-upload__tip" style="margin-top: 6px">
              如：明前茶、雨前茶、手工炒制、高山茶、有机认证
            </div>
          </el-form-item>

          <el-form-item label="是否新品">
            <el-switch
              v-model="productForm.isNew"
              active-color="#9c6e21"
            ></el-switch>
          </el-form-item>

          <el-form-item label="是否推荐">
            <el-switch
              v-model="productForm.isRecommend"
              active-color="#9c6e21"
            ></el-switch>
          </el-form-item>

          <el-form-item label="是否热销">
            <el-switch
              v-model="productForm.isHot"
              active-color="#9c6e21"
            ></el-switch>
          </el-form-item>
        </div>

        <!-- ==================== 8. 商品状态 ==================== -->
        <div class="section-block">
          <div class="section-title">
            <span class="section-border"></span>
            <span>商品状态</span>
          </div>

          <el-form-item label="上架状态">
            <el-radio-group v-model="productForm.status">
              <el-radio :label="1">上架</el-radio>
              <el-radio :label="0">下架</el-radio>
            </el-radio-group>
            <div class="el-upload__tip" style="margin-top: 6px">
              选择「下架」则商品不会在客户端展示
            </div>
          </el-form-item>
        </div>

        <!-- ==================== 操作按钮 ==================== -->
        <el-form-item class="action-buttons">
          <el-button
            type="primary"
            @click="submitForm"
            :loading="submitting"
            size="medium"
          >
            {{ submitting ? '提交中...' : '确认添加' }}
          </el-button>
          <el-button @click="resetForm" size="medium">重置表单</el-button>
          <el-button @click="goBack" size="medium">返回列表</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import productApi from '@/api/product'
import categoryApi from '@/api/category'
import { mapGetters } from 'vuex'

export default {
  name: 'ProductAdd',

  data() {
    const validatePrice = (rule, value, callback) => {
      if (value === '' || value === null || value === undefined) {
        callback(new Error('请输入售价'))
      } else if (Number(value) <= 0) {
        callback(new Error('售价必须大于0'))
      } else {
        callback()
      }
    }

    const validateStock = (rule, value, callback) => {
      if (value === '' || value === null || value === undefined) {
        callback(new Error('请输入库存'))
      } else if (Number(value) < 0) {
        callback(new Error('库存不能为负数'))
      } else {
        callback()
      }
    }

    return {
      // -------- 表单数据 --------
      productForm: {
        name: '',
        categoryId: '',
        brief: '',
        price: 0,
        originalPrice: 0,
        stock: 0,
        unit: '盒',
        weight: '100g',
        origin: '',
        year: '',
        aroma: '',
        sort: 0,
        status: 1,
        imageUrl: '',
        images: [],
        content: '',
        tags: [],
        isNew: true,
        isRecommend: false,
        isHot: false,
        specifications: [{ name: '默认规格', price: 0, stock: 0 }]
      },

      // -------- 表单校验规则 --------
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 2, max: 50, message: '商品名称长度在 2 到 50 个字符之间', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请选择商品分类', trigger: 'change' }
        ],
        price: [
          { required: true, validator: validatePrice, trigger: 'blur' }
        ],
        stock: [
          { required: true, validator: validateStock, trigger: 'blur' }
        ],
        imageUrl: [
          { required: true, message: '请上传商品封面主图', trigger: 'change' }
        ],
        brief: [
          { max: 200, message: '简短描述不能超过 200 个字符', trigger: 'blur' }
        ]
      },

      // -------- 分类选项 --------
      categoryOptions: [],

      // -------- 图片相关 --------
      coverFileList: [],
      galleryFileList: [],
      previewVisible: false,
      previewUrl: '',

      // -------- 标签相关 --------
      tagInputVisible: false,
      tagInputValue: '',

      // -------- 规格同步标志 --------
      specSyncing: false,

      // -------- 提交状态 --------
      submitting: false
    }
  },

  computed: {
    ...mapGetters(['token']),

    uploadHeaders() {
      return { Authorization: `Bearer ${this.token}` }
    },

    hasMultiSpec() {
      return this.productForm.specifications.length > 1
    }
  },

  watch: {
    // 规格变更时，单规格模式下同步到主表单
    'productForm.specifications': {
      deep: true,
      handler(specs) {
        if (this.specSyncing) return
        if (specs.length === 1) {
          this.specSyncing = true
          this.productForm.price = specs[0].price
          this.productForm.stock = specs[0].stock
          this.$nextTick(() => {
            this.specSyncing = false
          })
        }
      }
    },

    // 主表单售价变更时，单规格模式下同步回规格表
    'productForm.price'(val) {
      if (this.specSyncing) return
      if (this.productForm.specifications.length === 1) {
        this.specSyncing = true
        this.productForm.specifications[0].price = val
        this.$nextTick(() => {
          this.specSyncing = false
        })
      }
    },

    // 主表单库存变更时，单规格模式下同步回规格表
    'productForm.stock'(val) {
      if (this.specSyncing) return
      if (this.productForm.specifications.length === 1) {
        this.specSyncing = true
        this.productForm.specifications[0].stock = val
        this.$nextTick(() => {
          this.specSyncing = false
        })
      }
    }
  },

  created() {
    this.fetchCategories()
  },

  methods: {
    // ==================== 分类接口 ====================
    fetchCategories() {
      categoryApi
        .getAll()
        .then((response) => {
          if (response.code === 0) {
            this.categoryOptions = (response.data || []).map((item) => ({
              value: item.id,
              label: item.name
            }))
          } else {
            this.$message.warning(response.message || '获取分类列表失败')
            this.mockCategoryOptions()
          }
        })
        .catch(() => {
          this.mockCategoryOptions()
        })
    },

    mockCategoryOptions() {
      this.categoryOptions = [
        { value: 1, label: '绿茶' },
        { value: 2, label: '红茶' },
        { value: 3, label: '乌龙茶（青茶）' },
        { value: 4, label: '白茶' },
        { value: 5, label: '黄茶' },
        { value: 6, label: '黑茶' },
        { value: 7, label: '普洱茶' },
        { value: 8, label: '花茶' }
      ]
    },

    // ==================== 图片上传 ====================
    handleCoverSuccess(response, file, fileList) {
      if (response.code === 0) {
        this.productForm.imageUrl = response.data.url
        this.$message.success('封面图上传成功')
      } else {
        this.$message.error(response.message || '封面图上传失败')
        fileList.pop()
      }
    },

    handleGallerySuccess(response, file, fileList) {
      if (response.code === 0) {
        this.productForm.images.push(response.data.url)
      } else {
        this.$message.error(response.message || '图片上传失败')
        fileList.pop()
      }
    },

    handleUploadError(err) {
      console.error('图片上传失败:', err)
      this.$message.error('图片上传失败，请检查网络后重试')
    },

    beforeImageUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isWEBP = file.type === 'image/webp'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG && !isWEBP) {
        this.$message.error('上传图片仅支持 JPG / PNG / WEBP 格式')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB')
        return false
      }
      return true
    },

    handlePreview(file) {
      this.previewUrl = file.url
      this.previewVisible = true
    },

    handleCoverRemove(file, fileList) {
      this.productForm.imageUrl = ''
    },

    handleGalleryRemove(file, fileList) {
      const urlToRemove = file.url || (file.response && file.response.data && file.response.data.url)
      const index = this.productForm.images.findIndex(
        (url) => url === urlToRemove || url === file.url
      )
      if (index !== -1) {
        this.productForm.images.splice(index, 1)
      }
    },

    // ==================== 规格管理 ====================
    addSpecification() {
      this.productForm.specifications.push({
        name: '',
        price: 0,
        stock: 0
      })
    },

    removeSpecification(index) {
      if (this.productForm.specifications.length <= 1) {
        this.$message.warning('至少保留一个规格')
        return
      }
      this.productForm.specifications.splice(index, 1)
    },

    // ==================== 标签管理 ====================
    showTagInput() {
      this.tagInputVisible = true
      this.$nextTick(() => {
        this.$refs.tagInput && this.$refs.tagInput.focus()
      })
    },

    handleTagConfirm() {
      const value = this.tagInputValue.trim()
      if (value) {
        if (this.productForm.tags.indexOf(value) === -1) {
          this.productForm.tags.push(value)
        } else {
          this.$message.warning('该标签已存在')
        }
      }
      this.tagInputVisible = false
      this.tagInputValue = ''
    },

    handleTagClose(tag) {
      const index = this.productForm.tags.indexOf(tag)
      if (index !== -1) {
        this.productForm.tags.splice(index, 1)
      }
    },

    // ==================== 规格校验 ====================
    validateSpecifications() {
      const specs = this.productForm.specifications
      if (!specs || specs.length === 0) {
        this.$message.warning('请至少添加一个规格')
        return false
      }
      for (let i = 0; i < specs.length; i++) {
        const spec = specs[i]
        if (!spec.name || spec.name.trim() === '') {
          this.$message.warning(`请填写第 ${i + 1} 个规格的名称`)
          return false
        }
        if (spec.price === null || spec.price === undefined || Number(spec.price) <= 0) {
          this.$message.warning(`「${spec.name}」的价格必须大于 0`)
          return false
        }
        if (spec.stock === null || spec.stock === undefined || Number(spec.stock) < 0) {
          this.$message.warning(`「${spec.name}」的库存不能为负数`)
          return false
        }
      }
      return true
    },

    // ==================== 表单提交 ====================
    submitForm() {
      this.$refs.productForm.validate((valid) => {
        if (!valid) {
          this.$message.warning('请完善表单中的必填信息')
          return false
        }

        // 额外校验规格数据
        if (!this.validateSpecifications()) {
          return false
        }

        this.submitting = true

        // 构建提交数据
        const specs = this.productForm.specifications.map((s) => ({
          name: s.name,
          price: s.price,
          stock: s.stock
        }))

        // 多规格时计算汇总值
        let submitPrice = this.productForm.price
        let submitStock = this.productForm.stock
        if (specs.length > 1) {
          submitPrice = Math.min(...specs.map((s) => s.price))
          submitStock = specs.reduce((sum, s) => sum + (s.stock || 0), 0)
        }

        const submitData = {
          name: this.productForm.name,
          categoryId: this.productForm.categoryId,
          brief: this.productForm.brief,
          price: submitPrice,
          originalPrice: this.productForm.originalPrice,
          stock: submitStock,
          unit: this.productForm.unit,
          weight: this.productForm.weight,
          origin: this.productForm.origin,
          year: this.productForm.year,
          aroma: this.productForm.aroma,
          sort: this.productForm.sort,
          status: this.productForm.status,
          imageUrl: this.productForm.imageUrl,
          images: this.productForm.images,
          content: this.productForm.content,
          tags: this.productForm.tags,
          isNew: this.productForm.isNew,
          isRecommend: this.productForm.isRecommend,
          isHot: this.productForm.isHot,
          specifications: specs
        }

        productApi
          .create(submitData)
          .then((response) => {
            if (response.code === 0) {
              this.$message.success('茶叶商品添加成功！')
              this.$router.push('/product/list')
            } else {
              this.$message.error(response.message || '添加失败，请重试')
              this.submitting = false
            }
          })
          .catch((error) => {
            console.error('添加商品出错:', error)
            this.$message.error('网络异常，添加失败，请重试')
            this.submitting = false
          })
      })
    },

    // ==================== 表单重置 ====================
    resetForm() {
      this.$refs.productForm.resetFields()
      this.productForm = {
        name: '',
        categoryId: '',
        brief: '',
        price: 0,
        originalPrice: 0,
        stock: 0,
        unit: '盒',
        weight: '100g',
        origin: '',
        year: '',
        aroma: '',
        sort: 0,
        status: 1,
        imageUrl: '',
        images: [],
        content: '',
        tags: [],
        isNew: true,
        isRecommend: false,
        isHot: false,
        specifications: [{ name: '默认规格', price: 0, stock: 0 }]
      }
      this.coverFileList = []
      this.galleryFileList = []
      this.productForm.images = []
      this.$message.info('表单已重置')
    },

    // ==================== 返回 ====================
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
// ==================== 主题色变量 ====================
$tea-primary: #9c6e21;
$tea-primary-light: #b8862d;
$tea-bg: #fdf8f0;
$tea-border: #e8d5b0;
$section-bar-width: 4px;

// ==================== 容器 ====================
.product-add-container {
  min-height: 100vh;
  padding: 24px;
  background: #f5f3ef;

  .product-card {
    max-width: 900px;
    margin: 0 auto;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

    .card-header {
      .card-title {
        font-size: 18px;
        font-weight: 600;
        color: #303133;
      }
    }
  }

  .product-form {
    padding: 10px 0;
  }
}

// ==================== 分区块 ====================
.section-block {
  margin-bottom: 28px;
  padding-bottom: 4px;

  .section-title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-left: 0;
    font-size: 15px;
    font-weight: 600;
    color: #303133;

    .section-border {
      display: inline-block;
      width: $section-bar-width;
      height: 18px;
      background: $tea-primary;
      border-radius: 2px;
      margin-right: 10px;
    }

    .section-tip-icon {
      margin-left: 8px;
      font-size: 16px;
      color: $tea-primary-light;
      cursor: help;
    }
  }
}

// ==================== 表单提示文字 ====================
.form-hint {
  display: inline-block;
  font-size: 12px;
  color: #909399;
  line-height: 1;
  margin-top: 2px;
}

// ==================== 规格表格 ====================
.spec-table-wrapper {
  margin-bottom: 12px;
}

.spec-table {
  margin-bottom: 12px;

  ::v-deep .el-input-number--small {
    width: 130px;
  }

  ::v-deep .cell {
    padding: 6px 8px;
  }
}

.add-spec-btn {
  margin-top: 4px;
}

// ==================== 上传组件 ====================
.cover-upload,
.gallery-upload {
  ::v-deep .el-upload--picture-card {
    width: 120px;
    height: 120px;
    line-height: 126px;
  }

  ::v-deep .el-upload-list--picture-card .el-upload-list__item {
    width: 120px;
    height: 120px;
  }
}

.el-upload__tip {
  font-size: 12px;
  color: #909399;
  margin-top: 6px;
  line-height: 1.5;
}

// ==================== 标签 ====================
.tag-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.tag-item {
  flex-shrink: 0;
}

.tag-input {
  width: 110px;
  flex-shrink: 0;
}

.tag-add-btn {
  flex-shrink: 0;
}

// ==================== Element UI 主题覆盖 ====================
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}

::v-deep .el-radio__input.is-checked .el-radio__inner {
  border-color: $tea-primary;
  background: $tea-primary;
}

::v-deep .el-radio__input.is-checked + .el-radio__label {
  color: $tea-primary;
}

::v-deep .el-button--primary {
  background-color: $tea-primary;
  border-color: $tea-primary;

  &:hover,
  &:focus {
    background-color: $tea-primary-light;
    border-color: $tea-primary-light;
  }

  &.is-plain {
    color: $tea-primary;
    background: rgba($tea-primary, 0.06);
    border-color: rgba($tea-primary, 0.4);

    &:hover {
      background: rgba($tea-primary, 0.12);
      border-color: $tea-primary;
    }
  }
}

::v-deep .el-switch.is-checked .el-switch__core {
  border-color: $tea-primary;
  background-color: $tea-primary;
}

::v-deep .el-select .el-input.is-focus .el-input__inner {
  border-color: $tea-primary;
}

::v-deep .el-input__inner:focus {
  border-color: $tea-primary;
}

::v-deep .el-input-number__increase:hover:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled),
::v-deep .el-input-number__decrease:hover:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled) {
  border-color: $tea-primary;
}

// ==================== 操作按钮区 ====================
.action-buttons {
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;

  ::v-deep .el-form-item__content {
    display: flex;
    gap: 12px;
  }
}

// ==================== 响应式适配 ====================
@media screen and (max-width: 768px) {
  .product-add-container {
    padding: 12px;

    .product-form {
      ::v-deep .el-form-item__label {
        width: 80px !important;
        font-size: 13px;
      }

      ::v-deep .el-form-item__content {
        margin-left: 80px !important;
      }
    }

    .section-block .section-title {
      font-size: 14px;
    }
  }

  .cover-upload,
  .gallery-upload {
    ::v-deep .el-upload--picture-card {
      width: 90px;
      height: 90px;
      line-height: 96px;
    }

    ::v-deep .el-upload-list--picture-card .el-upload-list__item {
      width: 90px;
      height: 90px;
    }
  }
}

@media screen and (max-width: 480px) {
  .product-add-container {
    padding: 8px;

    .product-form {
      ::v-deep .el-form-item__label {
        width: 70px !important;
        font-size: 12px;
      }

      ::v-deep .el-form-item__content {
        margin-left: 70px !important;
      }
    }

    .spec-table-wrapper {
      overflow-x: auto;
    }
  }
}
</style>
