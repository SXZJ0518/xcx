<template>
  <div class="product-detail-container">
    <el-card>
      <div slot="header" class="card-header">
        <span>{{ isEdit ? '编辑商品' : '新增商品' }}</span>
        <el-button style="float: right" size="mini" @click="goBack">返回</el-button>
      </div>
      
      <el-form 
        ref="productForm" 
        :model="productForm" 
        :rules="rules" 
        label-width="120px" 
        class="product-form"
        v-loading="loading"
      >
        <!-- 基本信息 -->
        <div class="section-block">
          <div class="section-title">
            <span class="section-border"></span>
            <span>基本信息</span>
          </div>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="商品名称" prop="name">
                <el-input v-model="productForm.name" placeholder="请输入商品名称" maxlength="50" show-word-limit></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商品分类" prop="categoryId">
                <el-select v-model="productForm.categoryId" placeholder="请选择分类" style="width: 100%" @change="handleCategoryChange">
                  <el-option 
                    v-for="item in categoryOptions" 
                    :key="item.value" 
                    :label="item.label" 
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="香型" prop="aromaId">
                <el-select 
                  v-model="productForm.aromaId" 
                  placeholder="请选择香型" 
                  style="width: 100%"
                  :disabled="!isDancongCategory"
                  clearable
                >
                  <el-option 
                    v-for="item in aromaOptions" 
                    :key="item.value" 
                    :label="item.label" 
                    :value="item.value"
                  ></el-option>
                </el-select>
                <span v-if="!isDancongCategory" class="form-hint">特惠茶和农产品无需选择香型</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序">
                <el-input-number v-model="productForm.sort" :min="0" :max="9999" style="width: 100%"></el-input-number>
                <span class="form-hint">数值越大越靠前</span>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item label="简短描述" prop="brief">
            <el-input 
              v-model="productForm.brief" 
              type="textarea" 
              :rows="2" 
              placeholder="一句话介绍茶叶特色，显示在商品列表"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
          
          <el-form-item label="详细描述" prop="description">
            <el-input 
              v-model="productForm.description" 
              type="textarea" 
              :rows="4" 
              placeholder="详细介绍茶叶的特点、口感、冲泡方法等"
              maxlength="500"
              show-word-limit
            ></el-input>
          </el-form-item>
        </div>

        <!-- 价格库存 -->
        <div class="section-block">
          <div class="section-title">
            <span class="section-border"></span>
            <span>价格库存</span>
          </div>
          
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="售价" prop="price">
                <el-input-number v-model="productForm.price" :precision="2" :min="0" style="width: 100%">
                  <template slot="append">元</template>
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="原价">
                <el-input-number v-model="productForm.originalPrice" :precision="2" :min="0" style="width: 100%">
                  <template slot="append">元</template>
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="库存" prop="stock">
                <el-input-number v-model="productForm.stock" :min="0" :step="1" style="width: 100%"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="重量">
                <el-select v-model="productForm.weight" placeholder="选择重量" style="width: 100%" filterable allow-create>
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
            <el-col :span="8">
              <el-form-item label="单位">
                <el-select v-model="productForm.unit" style="width: 100%">
                  <el-option label="盒" value="盒"></el-option>
                  <el-option label="罐" value="罐"></el-option>
                  <el-option label="袋" value="袋"></el-option>
                  <el-option label="包" value="包"></el-option>
                  <el-option label="饼" value="饼"></el-option>
                  <el-option label="斤" value="斤"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="包装类型">
                <el-checkbox-group v-model="productForm.packaging">
                  <el-checkbox label="bag">袋装</el-checkbox>
                  <el-checkbox label="tin">铁罐</el-checkbox>
                  <el-checkbox label="box">礼盒</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 产地信息 -->
        <div class="section-block">
          <div class="section-title">
            <span class="section-border"></span>
            <span>产地信息</span>
          </div>
          
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="产地">
                <el-input v-model="productForm.origin" placeholder="如：凤凰山"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="海拔">
                <el-input v-model="productForm.altitude" placeholder="如：800米以上">
                  <template slot="append">米</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工艺">
                <el-radio-group v-model="productForm.craft">
                  <el-radio label="charcoal">炭焙</el-radio>
                  <el-radio label="electric">电焙</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="采摘季节">
                <el-radio-group v-model="productForm.season">
                  <el-radio label="spring">春茶</el-radio>
                  <el-radio label="second">二春</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="年份">
                <el-input v-model="productForm.year" placeholder="如：2024"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 冲泡参数 -->
        <div class="section-block">
          <div class="section-title">
            <span class="section-border"></span>
            <span>冲泡参数</span>
          </div>
          
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="水温">
                <el-input v-model="productForm.brewTemp" placeholder="如：95-100">
                  <template slot="append">°C</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="时间">
                <el-input v-model="productForm.brewTime" placeholder="如：3-5">
                  <template slot="append">秒</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="冲泡次数">
                <el-input v-model="productForm.brewCount" placeholder="如：8-10">
                  <template slot="append">泡</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 商品图片 -->
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
              :on-success="handleCoverSuccess"
              :on-error="handleUploadError"
              :before-upload="beforeImageUpload"
              :limit="1"
              :file-list="coverFileList"
              list-type="picture-card"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <div class="el-upload__tip">请上传商品封面图，支持 jpg/png 格式，大小不超过 2MB</div>
          </el-form-item>
          
          <el-form-item label="详情图集">
            <el-upload
              class="gallery-upload"
              action="/api/admin/upload/product"
              :headers="uploadHeaders"
              :on-success="handleGallerySuccess"
              :on-remove="handleGalleryRemove"
              :on-error="handleUploadError"
              :before-upload="beforeImageUpload"
              :limit="9"
              :file-list="galleryFileList"
              list-type="picture-card"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <div class="el-upload__tip">可上传多张详情图片，最多 9 张</div>
          </el-form-item>
        </div>

        <!-- 标签与属性 -->
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
              <el-button v-else size="small" class="tag-add-btn" @click="showTagInput">+ 添加标签</el-button>
            </div>
            <div class="el-upload__tip" style="margin-top: 6px">如：高山、炭焙、春茶、新品、热销等</div>
          </el-form-item>
          
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="是否新品">
                <el-switch v-model="productForm.isNew" active-color="#c9a86c"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否热销">
                <el-switch v-model="productForm.isHot" active-color="#c9a86c"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否推荐">
                <el-switch v-model="productForm.isRecommend" active-color="#c9a86c"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 商品状态 -->
        <div class="section-block">
          <div class="section-title">
            <span class="section-border"></span>
            <span>商品状态</span>
          </div>
          
          <el-form-item label="上架状态" prop="status">
            <el-radio-group v-model="productForm.status">
              <el-radio :label="1">上架</el-radio>
              <el-radio :label="0">下架</el-radio>
            </el-radio-group>
            <div class="el-upload__tip" style="margin-top: 6px">选择「下架」则商品不会在客户端展示</div>
          </el-form-item>
        </div>

        <!-- 操作按钮 -->
        <el-form-item class="action-buttons">
          <el-button type="primary" @click="submitForm" :loading="submitting">
            {{ submitting ? '提交中...' : (isEdit ? '保存修改' : '确认添加') }}
          </el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button @click="goBack">返回列表</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import productApi from '@/api/product'
import categoryApi from '@/api/category'
import aromaApi from '@/api/aroma'
import { mapGetters } from 'vuex'

export default {
  name: 'ProductDetail',
  data() {
    return {
      isEdit: false,
      editId: null,
      loading: false,
      submitting: false,
      
      productForm: {
        name: '',
        categoryId: '',
        aromaId: '',
        brief: '',
        description: '',
        price: 0,
        originalPrice: 0,
        stock: 0,
        weight: '500g',
        unit: '盒',
        packaging: [],
        origin: '',
        altitude: '',
        craft: 'charcoal',
        season: 'spring',
        year: '2024',
        brewTemp: '95-100',
        brewTime: '3-5',
        brewCount: '8-10',
        imageUrl: '',
        images: [],
        tags: [],
        isNew: true,
        isHot: false,
        isRecommend: false,
        status: 1,
        sort: 0
      },
      
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 2, max: 50, message: '商品名称长度在 2 到 50 个字符之间', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请选择商品分类', trigger: 'change' }
        ],
        price: [
          { required: true, message: '请输入售价', trigger: 'blur' },
          { type: 'number', min: 0.01, message: '售价必须大于0', trigger: 'blur' }
        ],
        stock: [
          { required: true, message: '请输入库存', trigger: 'blur' }
        ],
        imageUrl: [
          { required: true, message: '请上传商品封面主图', trigger: 'change' }
        ],
        brief: [
          { max: 100, message: '简短描述不能超过 100 个字符', trigger: 'blur' }
        ]
      },
      
      categoryOptions: [],
      aromaOptions: [],
      coverFileList: [],
      galleryFileList: [],
      tagInputVisible: false,
      tagInputValue: ''
    }
  },
  
  computed: {
    ...mapGetters(['token']),
    
    uploadHeaders() {
      return { Authorization: `Bearer ${this.token}` }
    },
    
    // 判断当前分类是否为单枞茶（只有单枞茶需要选择香型）
    isDancongCategory() {
      const dancongCategory = this.categoryOptions.find(c => c.label === '单枞茶')
      if (!dancongCategory) return false
      return this.productForm.categoryId === dancongCategory.value
    }
  },
  
  created() {
    this.isEdit = this.$route.query.id ? true : false
    this.editId = this.$route.query.id
    
    this.fetchCategories()
    this.fetchAromas()
    
    if (this.isEdit) {
      this.fetchProductDetail()
    }
  },
  
  methods: {
    // 获取分类列表
    fetchCategories() {
      categoryApi.getAll()
        .then(response => {
          if (response.code === 0) {
            this.categoryOptions = (response.data || []).map(item => ({
              value: item.id,
              label: item.name
            }))
          }
        })
        .catch(() => {
          this.categoryOptions = [
            { value: 1, label: '单枞茶' },
            { value: 2, label: '特惠茶' },
            { value: 3, label: '农产品' }
          ]
        })
    },
    
    // 获取香型列表
    fetchAromas() {
      aromaApi.getAll()
        .then(response => {
          if (response.code === 0) {
            this.aromaOptions = (response.data || []).map(item => ({
              value: item.id,
              label: item.name
            }))
          }
        })
        .catch(() => {
          this.aromaOptions = [
            { value: 1, label: '蜜兰香' },
            { value: 2, label: '鸭屎香' },
            { value: 3, label: '黄枝香' },
            { value: 4, label: '桂花香' },
            { value: 5, label: '芝兰香' },
            { value: 6, label: '杏仁香' },
            { value: 7, label: '玉兰香' },
            { value: 8, label: '姜花香' },
            { value: 9, label: '肉桂香' },
            { value: 10, label: '茉莉香' }
          ]
        })
    },
    
    // 获取商品详情
    fetchProductDetail() {
      this.loading = true
      productApi.getDetail(this.editId)
        .then(response => {
          if (response.code === 0 && response.data) {
            const data = response.data
            this.productForm = {
              ...this.productForm,
              ...data,
              packaging: data.packaging || [],
              tags: data.tags || [],
              images: data.images || []
            }
            
            // 设置图片文件列表
            if (data.imageUrl) {
              this.coverFileList = [{ url: data.imageUrl }]
            }
            if (data.images && data.images.length > 0) {
              this.galleryFileList = data.images.map((url, index) => ({
                name: `gallery-${index + 1}`,
                url: url
              }))
            }
          } else {
            this.$message.error(response.message || '获取商品详情失败')
          }
          this.loading = false
        })
        .catch(error => {
          console.error('获取商品详情出错:', error)
          this.$message.error('获取数据失败')
          this.loading = false
        })
    },
    
    // 分类变更
    handleCategoryChange(val) {
      // 如果不是单枞茶分类，清空香型选择
      if (!this.isDancongCategory) {
        this.productForm.aromaId = ''
      }
    },
    
    // 图片上传成功
    handleCoverSuccess(response) {
      if (response.code === 0) {
        this.productForm.imageUrl = response.data.url
        this.$message.success('封面图上传成功')
      } else {
        this.$message.error(response.message || '上传失败')
      }
    },
    
    handleGallerySuccess(response, file, fileList) {
      if (response.code === 0) {
        this.productForm.images.push(response.data.url)
      } else {
        this.$message.error(response.message || '上传失败')
      }
    },
    
    handleUploadError() {
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
    
    handleGalleryRemove(file, fileList) {
      const urlToRemove = file.url || (file.response && file.response.data && file.response.data.url)
      const index = this.productForm.images.findIndex(url => url === urlToRemove)
      if (index !== -1) {
        this.productForm.images.splice(index, 1)
      }
    },
    
    // 标签管理
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
    
    // 提交表单
    submitForm() {
      this.$refs.productForm.validate(valid => {
        if (!valid) {
          this.$message.warning('请完善表单中的必填信息')
          return false
        }
        
        this.submitting = true
        
        const submitData = { ...this.productForm }
        
        if (this.isEdit) {
          productApi.update(this.editId, submitData)
            .then(response => {
              if (response.code === 0) {
                this.$message.success('商品更新成功！')
                this.$router.push('/product/index')
              } else {
                this.$message.error(response.message || '更新失败')
                this.submitting = false
              }
            })
            .catch(error => {
              console.error('更新商品出错:', error)
              this.$message.error('网络异常，更新失败')
              this.submitting = false
            })
        } else {
          productApi.create(submitData)
            .then(response => {
              if (response.code === 0) {
                this.$message.success('商品添加成功！')
                this.$router.push('/product/index')
              } else {
                this.$message.error(response.message || '添加失败')
                this.submitting = false
              }
            })
            .catch(error => {
              console.error('添加商品出错:', error)
              this.$message.error('网络异常，添加失败')
              this.submitting = false
            })
        }
      })
    },
    
    // 重置表单
    resetForm() {
      if (this.isEdit) {
        this.fetchProductDetail()
      } else {
        this.$refs.productForm.resetFields()
        this.productForm = {
          name: '',
          categoryId: '',
          aromaId: '',
          brief: '',
          description: '',
          price: 0,
          originalPrice: 0,
          stock: 0,
          weight: '500g',
          unit: '盒',
          packaging: [],
          origin: '',
          altitude: '',
          craft: 'charcoal',
          season: 'spring',
          year: '2024',
          brewTemp: '95-100',
          brewTime: '3-5',
          brewCount: '8-10',
          imageUrl: '',
          images: [],
          tags: [],
          isNew: true,
          isHot: false,
          isRecommend: false,
          status: 1,
          sort: 0
        }
        this.coverFileList = []
        this.galleryFileList = []
      }
      this.$message.info('表单已重置')
    },
    
    // 返回
    goBack() {
      this.$router.push('/product/index')
    }
  }
}
</script>

<style lang="scss" scoped>
$tea-primary: #c9a86c;
$tea-primary-light: #b8862d;

.product-detail-container {
  .card-header {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }
  
  .product-form {
    padding: 10px 0;
  }
}

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
      width: 4px;
      height: 18px;
      background: $tea-primary;
      border-radius: 2px;
      margin-right: 10px;
    }
  }
}

.form-hint {
  display: inline-block;
  font-size: 12px;
  color: #909399;
  line-height: 1;
  margin-top: 2px;
}

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

.action-buttons {
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
  
  ::v-deep .el-form-item__content {
    display: flex;
    gap: 12px;
  }
}

::v-deep .el-button--primary {
  background-color: $tea-primary;
  border-color: $tea-primary;
  
  &:hover,
  &:focus {
    background-color: $tea-primary-light;
    border-color: $tea-primary-light;
  }
}

::v-deep .el-radio__input.is-checked .el-radio__inner {
  border-color: $tea-primary;
  background: $tea-primary;
}

::v-deep .el-radio__input.is-checked + .el-radio__label {
  color: $tea-primary;
}

::v-deep .el-switch.is-checked .el-switch__core {
  border-color: $tea-primary;
  background-color: $tea-primary;
}

::v-deep .el-input__inner:focus {
  border-color: $tea-primary;
}
</style>
