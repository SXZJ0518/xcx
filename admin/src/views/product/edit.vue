<template>
  <div class="product-edit-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>编辑商品</span>
        <el-button style="float: right" size="mini" @click="$router.go(-1)">返回</el-button>
      </div>
      
      <el-form ref="productForm" :model="productForm" :rules="rules" label-width="120px" class="product-form" v-loading="loading">
        <!-- 基本信息 -->
        <h3 class="form-section-title">基本信息</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="productForm.name" placeholder="请输入商品名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品分类" prop="categoryId">
              <el-cascader
                v-model="productForm.categoryId"
                :options="categoryOptions"
                :props="{ checkStrictly: true, value: 'id', label: 'name' }"
                placeholder="请选择商品分类"
                clearable
                @change="handleCategoryChange"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="商品价格" prop="price">
              <el-input-number 
                v-model="productForm.price" 
                :precision="2" 
                :step="0.01" 
                :min="0" 
                controls-position="right"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="原价" prop="originalPrice">
              <el-input-number 
                v-model="productForm.originalPrice" 
                :precision="2" 
                :step="0.01" 
                :min="0" 
                controls-position="right"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库存数量" prop="stock">
              <el-input-number 
                v-model="productForm.stock" 
                :min="0" 
                controls-position="right"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="计量单位" prop="unit">
              <el-input v-model="productForm.unit" placeholder="如: 盒、罐、包"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品状态" prop="status">
              <el-switch
                v-model="productForm.status"
                :active-value="1"
                :inactive-value="0"
                active-text="上架"
                inactive-text="下架"
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        
        <!-- 商品图片 -->
        <h3 class="form-section-title">商品图片</h3>
        <el-form-item label="主图" prop="imageUrl">
          <el-upload
            class="product-image-uploader"
            action="#"
            :http-request="uploadMainImage"
            :show-file-list="false"
            :before-upload="beforeImageUpload"
          >
            <img v-if="productForm.imageUrl" :src="productForm.imageUrl" class="product-image">
            <i v-else class="el-icon-plus product-image-uploader-icon"></i>
          </el-upload>
          <div class="image-tip">* 建议尺寸：800x800像素，大小不超过2MB</div>
        </el-form-item>
        
        <el-form-item label="图片相册">
          <el-upload
            class="product-image-list"
            action="#"
            :http-request="uploadGalleryImage"
            list-type="picture-card"
            :file-list="galleryFileList"
            :before-upload="beforeImageUpload"
            :on-remove="handleRemoveGallery"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <div class="image-tip">* 最多上传5张图片，建议尺寸：800x800像素，大小不超过2MB</div>
        </el-form-item>
        
        <!-- 商品描述 -->
        <h3 class="form-section-title">商品描述</h3>
        <el-form-item label="简短描述" prop="brief">
          <el-input v-model="productForm.brief" placeholder="简短描述将显示在商品列表中，建议60字以内" type="textarea" :rows="2"></el-input>
        </el-form-item>
        
        <el-form-item label="详细内容">
          <div class="editor-container">
            <el-input v-model="productForm.detail" type="textarea" :rows="6" placeholder="请输入商品详细内容"></el-input>
          </div>
        </el-form-item>
        
        <!-- 商品属性 -->
        <h3 class="form-section-title">商品属性</h3>
        <el-form-item label="商品参数">
          <div v-for="(param, index) in productForm.params" :key="index" class="param-item">
            <el-input v-model="param.name" placeholder="参数名称" class="param-name"></el-input>
            <el-input v-model="param.value" placeholder="参数值" class="param-value"></el-input>
            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="removeParam(index)"></el-button>
          </div>
          <el-button type="primary" icon="el-icon-plus" size="small" @click="addParam">添加参数</el-button>
        </el-form-item>
        
        <el-form-item label="商品标签">
          <el-tag
            :key="index"
            v-for="(tag, index) in productForm.tags"
            closable
            :disable-transitions="false"
            @close="handleTagClose(index)"
            class="product-tag"
          >
            {{tag}}
          </el-tag>
          <el-input
            class="tag-input"
            v-if="tagInputVisible"
            v-model="tagInputValue"
            ref="tagInput"
            size="small"
            @keyup.enter.native="handleTagConfirm"
            @blur="handleTagConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showTagInput">+ 添加标签</el-button>
        </el-form-item>
        
        <!-- 推广设置 -->
        <h3 class="form-section-title">推广设置</h3>
        <el-form-item label="推荐商品">
          <el-switch v-model="productForm.isRecommend" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        
        <el-form-item label="新品">
          <el-switch v-model="productForm.isNew" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        
        <el-form-item label="热卖商品">
          <el-switch v-model="productForm.isHot" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        
        <!-- 表单按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitting">保存</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button @click="$router.go(-1)">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import productApi from '@/api/product'
import categoryApi from '@/api/category'

export default {
  name: 'ProductEdit',
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      loading: false, // 页面加载状态
      submitting: false, // 提交状态
      productForm: {
        name: '',
        categoryId: null,
        categoryName: '',
        price: 0,
        originalPrice: 0,
        stock: 0,
        unit: '',
        status: 1,
        imageUrl: '',
        gallery: [],
        brief: '',
        detail: '',
        params: [],
        tags: [],
        isRecommend: 0,
        isNew: 0,
        isHot: 0
      },
      galleryFileList: [], // 图片相册文件列表
      categoryOptions: [], // 分类选项
      tagInputVisible: false,
      tagInputValue: '',
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请选择商品分类', trigger: 'change' }
        ],
        price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        stock: [
          { required: true, message: '请输入库存数量', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请输入计量单位', trigger: 'blur' }
        ],
        imageUrl: [
          { required: true, message: '请上传商品主图', trigger: 'change' }
        ],
        brief: [
          { required: true, message: '请输入商品简短描述', trigger: 'blur' },
          { max: 200, message: '简短描述不能超过200个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchCategories()
    this.fetchProductDetail()
  },
  methods: {
    // 获取商品详情
    fetchProductDetail() {
      this.loading = true
      
      productApi.getDetail(this.id)
        .then(response => {
          if (response.code === 0 && response.data) {
            const productData = response.data
            
            // 设置表单数据
            this.productForm = {
              id: productData.id,
              name: productData.name,
              categoryId: productData.categoryId,
              categoryName: productData.categoryName,
              price: productData.price,
              originalPrice: productData.originalPrice,
              stock: productData.stock,
              unit: productData.unit,
              status: productData.status,
              imageUrl: productData.imageUrl,
              gallery: productData.gallery || [],
              brief: productData.brief,
              detail: productData.detail,
              params: productData.params || [],
              tags: productData.tags || [],
              isRecommend: productData.isRecommend,
              isNew: productData.isNew,
              isHot: productData.isHot
            }
            
            // 设置图片相册文件列表
            this.galleryFileList = (productData.gallery || []).map((url, index) => ({
              name: `gallery-${index + 1}`,
              url: url
            }))
          } else {
            this.$message.error(response.message || '获取商品详情失败')
            this.$router.go(-1)
          }
          this.loading = false
        })
        .catch(error => {
          console.error('获取商品详情出错:', error)
          this.loading = false
          
          // 模拟数据（实际开发中应该删除）
          this.mockProductDetail()
        })
    },
    
    // 模拟商品数据（实际开发中应该删除）
    mockProductDetail() {
      this.productForm = {
        id: this.id,
        name: '西湖龙井 明前特级',
        categoryId: [1, 3], // 绿茶 > 西湖龙井
        categoryName: '绿茶 > 西湖龙井',
        price: 268,
        originalPrice: 328,
        stock: 100,
        unit: '盒',
        status: 1,
        imageUrl: 'https://img.alicdn.com/imgextra/i4/2201504853048/O1CN01fGEVqY1U6z4Kkrr30_!!2201504853048.jpg',
        gallery: [
          'https://img.alicdn.com/imgextra/i4/2201504853048/O1CN01fGEVqY1U6z4Kkrr30_!!2201504853048.jpg',
          'https://img.alicdn.com/imgextra/i1/2201504853048/O1CN01CJ0AYF1U6z3swZ0FZ_!!2201504853048.jpg'
        ],
        brief: '2024年明前特级西湖龙井，茶叶色泽翠绿，香气高雅，口感鲜爽。',
        detail: '西湖龙井，中国十大名茶之一，产于浙江杭州西湖龙井村周围群山，具有1200多年历史。\n\n特点：外形扁平挺直，色泽嫩绿光润，香气清高，滋味甘醇，叶底细嫩成朵。\n\n冲泡方法：水温80-85℃，投茶量5克，冲泡时间1-2分钟。',
        params: [
          { name: '产地', value: '浙江杭州' },
          { name: '等级', value: '特级' },
          { name: '净含量', value: '250g' },
          { name: '保质期', value: '12个月' }
        ],
        tags: ['明前茶', '绿茶', '特级'],
        isRecommend: 1,
        isNew: 1,
        isHot: 1
      }
      
      // 设置图片相册文件列表
      this.galleryFileList = this.productForm.gallery.map((url, index) => ({
        name: `gallery-${index + 1}`,
        url: url
      }))
    },
    
    // 获取分类列表
    fetchCategories() {
      categoryApi.getAll()
        .then(response => {
          if (response.code === 0) {
            this.categoryOptions = response.data || []
          } else {
            this.$message.error(response.message || '获取分类列表失败')
          }
        })
        .catch(error => {
          console.error('获取分类列表出错:', error)
          
          // 模拟数据（实际开发中应该删除）
          this.mockCategoryOptions()
        })
    },
    
    // 模拟分类数据（实际开发中应该删除）
    mockCategoryOptions() {
      this.categoryOptions = [
        {
          id: 1,
          name: '绿茶',
          children: [
            { id: 3, name: '西湖龙井' },
            { id: 4, name: '碧螺春' },
            { id: 5, name: '黄山毛峰' }
          ]
        },
        {
          id: 2,
          name: '红茶',
          children: [
            { id: 6, name: '正山小种' },
            { id: 7, name: '祁门红茶' }
          ]
        },
        {
          id: 8,
          name: '乌龙茶',
          children: [
            { id: 9, name: '铁观音' },
            { id: 10, name: '大红袍' }
          ]
        },
        {
          id: 11,
          name: '白茶',
          children: [
            { id: 12, name: '白毫银针' }
          ]
        },
        {
          id: 13,
          name: '黑茶',
          children: [
            { id: 14, name: '普洱茶' }
          ]
        }
      ]
    },
    
    // 分类变更
    handleCategoryChange(value) {
      // 这里可以根据选择的分类做一些操作
      console.log('选择的分类:', value)
    },
    
    // 图片上传前的验证
    beforeImageUpload(file) {
      const isImage = file.type.indexOf('image/') === 0
      const isLt2M = file.size / 1024 / 1024 < 2
      
      if (!isImage) {
        this.$message.error('上传的文件只能是图片!')
      }
      if (!isLt2M) {
        this.$message.error('上传的图片大小不能超过 2MB!')
      }
      
      return isImage && isLt2M
    },
    
    // 上传主图
    uploadMainImage(options) {
      const file = options.file
      // 创建一个临时的URL，用于预览
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        // 实际项目中，这里应该调用API上传文件
        this.productForm.imageUrl = reader.result
        this.$message.success('主图上传成功')
      }
    },
    
    // 上传图片相册
    uploadGalleryImage(options) {
      const file = options.file
      // 创建一个临时的URL，用于预览
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        // 限制最多5张图片
        if (this.productForm.gallery.length >= 5) {
          this.$message.warning('最多上传5张图片')
          return
        }
        
        // 实际项目中，这里应该调用API上传文件
        const imageUrl = reader.result
        this.productForm.gallery.push(imageUrl)
        this.galleryFileList.push({
          name: `gallery-${this.galleryFileList.length + 1}`,
          url: imageUrl
        })
        this.$message.success('图片上传成功')
      }
    },
    
    // 移除相册图片
    handleRemoveGallery(file) {
      const index = this.galleryFileList.findIndex(item => item.url === file.url)
      if (index !== -1) {
        this.galleryFileList.splice(index, 1)
        this.productForm.gallery.splice(index, 1)
      }
    },
    
    // 添加商品参数
    addParam() {
      this.productForm.params.push({
        name: '',
        value: ''
      })
    },
    
    // 移除商品参数
    removeParam(index) {
      this.productForm.params.splice(index, 1)
    },
    
    // 显示标签输入框
    showTagInput() {
      this.tagInputVisible = true
      this.$nextTick(() => {
        this.$refs.tagInput.$refs.input.focus()
      })
    },
    
    // 关闭标签
    handleTagClose(index) {
      this.productForm.tags.splice(index, 1)
    },
    
    // 确认添加标签
    handleTagConfirm() {
      const inputValue = this.tagInputValue.trim()
      if (inputValue) {
        // 检查是否已存在相同标签
        if (!this.productForm.tags.includes(inputValue)) {
          this.productForm.tags.push(inputValue)
        }
      }
      this.tagInputVisible = false
      this.tagInputValue = ''
    },
    
    // 提交表单
    submitForm() {
      this.$refs.productForm.validate(valid => {
        if (valid) {
          this.submitting = true
          
          // 删除不需要提交的属性
          const formData = { ...this.productForm }
          
          productApi.update(this.id, formData)
            .then(response => {
              if (response.code === 0) {
                this.$message.success('商品更新成功')
                this.$router.push('/product/list')
              } else {
                this.$message.error(response.message || '商品更新失败')
              }
              this.submitting = false
            })
            .catch(error => {
              console.error('更新商品出错:', error)
              this.$message.error('商品更新失败，请重试')
              this.submitting = false
            })
        } else {
          this.$message.warning('请完善表单信息')
          return false
        }
      })
    },
    
    // 重置表单
    resetForm() {
      this.$refs.productForm.resetFields()
      this.fetchProductDetail() // 重新获取商品详情
    }
  }
}
</script>

<style lang="scss" scoped>
.product-edit-container {
  padding: 20px;
  
  .form-section-title {
    font-size: 16px;
    color: #409EFF;
    margin: 20px 0 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #EBEEF5;
  }
  
  .product-form {
    margin-top: 20px;
  }
  
  .product-image-uploader {
    .product-image {
      width: 200px;
      height: 200px;
      display: block;
      object-fit: cover;
    }
    
    .product-image-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 200px;
      height: 200px;
      line-height: 200px;
      text-align: center;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
    }
    
    .product-image-uploader-icon:hover {
      border-color: #409EFF;
    }
  }
  
  .image-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 5px;
  }
  
  .param-item {
    display: flex;
    margin-bottom: 10px;
    
    .param-name {
      width: 200px;
      margin-right: 10px;
    }
    
    .param-value {
      flex: 1;
      margin-right: 10px;
    }
  }
  
  .product-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }
  
  .tag-input {
    width: 120px;
    margin-right: 10px;
    vertical-align: bottom;
  }
  
  .button-new-tag {
    margin-bottom: 10px;
  }
  
  .editor-container {
    min-height: 200px;
  }
}
</style> 