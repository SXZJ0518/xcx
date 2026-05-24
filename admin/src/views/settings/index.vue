<template>
  <div class="settings-container">
    <el-card>
      <div slot="header">
        <span>站点设置</span>
      </div>
      
      <el-tabs v-model="activeTab" type="border-card">
        <!-- 品牌信息 -->
        <el-tab-pane label="品牌信息" name="brand">
          <el-form :model="brandForm" :rules="brandRules" ref="brandFormRef" label-width="120px">
            <el-form-item label="品牌名称" prop="brandName">
              <el-input v-model="brandForm.brandName" placeholder="请输入品牌名称" maxlength="50" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="品牌Slogan" prop="slogan">
              <el-input v-model="brandForm.slogan" placeholder="请输入品牌Slogan" maxlength="100" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="品牌Logo">
              <el-upload
                class="logo-upload"
                :http-request="uploadLogo"
                :before-upload="beforeImageUpload"
                :limit="1"
                :file-list="logoFileList"
                list-type="picture-card"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <div class="upload-tip">建议尺寸 200x200，支持 jpg/png 格式，大小不超过 2MB</div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveBrand" :loading="saving.brand">保存品牌信息</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 联系方式 -->
        <el-tab-pane label="联系方式" name="contact">
          <el-form :model="contactForm" :rules="contactRules" ref="contactFormRef" label-width="140px">
            <el-form-item label="微信号" prop="wechatId">
              <el-input v-model="contactForm.wechatId" placeholder="请输入微信号">
                <i slot="prefix" class="el-icon-chat-dot-round"></i>
              </el-input>
              <div class="form-tip">小程序"联系我们"按钮将复制此微信号</div>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="contactForm.phone" placeholder="请输入联系电话">
                <i slot="prefix" class="el-icon-phone"></i>
              </el-input>
              <div class="form-tip">客户点击可直接拨打电话</div>
            </el-form-item>
            <el-form-item label="客服邮箱" prop="email">
              <el-input v-model="contactForm.email" placeholder="请输入客服邮箱">
                <i slot="prefix" class="el-icon-message"></i>
              </el-input>
            </el-form-item>
            <el-form-item label="营业时间" prop="workHours">
              <el-input v-model="contactForm.workHours" placeholder="如：周一至周日 9:00-21:00">
                <i slot="prefix" class="el-icon-time"></i>
              </el-input>
            </el-form-item>
            <el-form-item label="产地" prop="address">
              <el-input v-model="contactForm.address" placeholder="请输入产地地址" maxlength="100" show-word-limit></el-input>
              <div class="form-tip">显示在「我的」页面的信息栏</div>
            </el-form-item>
            <el-form-item label="发货地" prop="shipFrom">
              <el-input v-model="contactForm.shipFrom" placeholder="如：广东·汕头" maxlength="100" show-word-limit></el-input>
              <div class="form-tip">显示在「我的」页面的信息栏</div>
            </el-form-item>
            
            <el-divider content-position="left">商品详情页联系区域配置</el-divider>
            
            <el-form-item label="联系标题" prop="productContactTitle">
              <el-input v-model="contactForm.productContactTitle" placeholder="如：品茶咨询" maxlength="20" show-word-limit></el-input>
              <div class="form-tip">显示在商品详情页联系区域的大标题</div>
            </el-form-item>
            <el-form-item label="联系描述" prop="productContactDesc">
              <el-input v-model="contactForm.productContactDesc" placeholder="如：添加微信，了解更多详情" maxlength="50" show-word-limit></el-input>
              <div class="form-tip">显示在标题下方的描述文字</div>
            </el-form-item>
            <el-form-item label="按钮文字" prop="productContactBtnText">
              <el-input v-model="contactForm.productContactBtnText" placeholder="如：复制微信号" maxlength="10" show-word-limit></el-input>
              <div class="form-tip">复制微信号按钮上显示的文字</div>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveContact" :loading="saving.contact">保存联系方式</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 品牌故事 -->
        <el-tab-pane label="品牌故事" name="about">
          <el-form :model="aboutForm" ref="aboutFormRef" label-width="120px">
            <el-form-item label="关于我们">
              <el-input 
                v-model="aboutForm.aboutUs" 
                type="textarea" 
                :rows="10" 
                placeholder="请输入品牌故事/关于我们的内容（支持HTML格式）"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveAbout" :loading="saving.about">保存品牌故事</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 轮播图管理 -->
        <el-tab-pane label="轮播图管理" name="banner">
          <div class="banner-section">
            <div class="section-header">
              <el-button type="primary" icon="el-icon-plus" @click="handleAddBanner">添加轮播图</el-button>
            </div>
            
            <el-table :data="bannerList" border stripe v-loading="bannerLoading">
              <el-table-column label="图片" width="150" align="center">
                <template slot-scope="scope">
                  <img :src="scope.row.imageUrl" class="banner-thumb" @click="previewImage(scope.row.imageUrl)">
                </template>
              </el-table-column>
              <el-table-column prop="title" label="标题" min-width="150"></el-table-column>
              <el-table-column prop="link" label="链接" min-width="200" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="scope.row.link">{{ scope.row.link }}</span>
                  <span v-else class="text-muted">-</span>
                </template>
              </el-table-column>
              <el-table-column prop="sort" label="排序" width="80" align="center"></el-table-column>
              <el-table-column prop="status" label="状态" width="100" align="center">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.status"
                    :active-value="1"
                    :inactive-value="0"
                    @change="handleBannerStatusChange(scope.row)"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                  ></el-switch>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="handleEditBanner(scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="handleDeleteBanner(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            
            <el-empty v-if="!bannerLoading && bannerList.length === 0" description="暂无轮播图" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 轮播图编辑对话框 -->
    <el-dialog :title="bannerDialogTitle" :visible.sync="bannerDialogVisible" width="500px">
      <el-form :model="bannerForm" :rules="bannerRules" ref="bannerFormRef" label-width="100px">
        <el-form-item label="轮播图" prop="imageUrl">
          <el-upload
            class="banner-upload"
            :http-request="uploadBannerImage"
            :before-upload="beforeImageUpload"
            :limit="1"
            :file-list="bannerImageList"
            list-type="picture-card"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <div class="upload-tip">建议尺寸 750x400，支持 jpg/png 格式，大小不超过 2MB</div>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="bannerForm.title" placeholder="请输入轮播图标题" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="bannerForm.link" placeholder="请输入跳转链接（选填）"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="bannerForm.sort" :min="0" :max="9999"></el-input-number>
          <span class="form-hint">数值越大越靠前</span>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="bannerForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bannerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBannerForm" :loading="saving.banner">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 图片预览 -->
    <el-dialog :visible.sync="previewVisible" append-to-body width="600px">
      <img :src="previewUrl" style="width: 100%; display: block;">
    </el-dialog>
  </div>
</template>

<script>
import settingsApi from '@/api/settings'
import bannerApi from '@/api/banner'
import { mapGetters } from 'vuex'
import { uploadImage } from '@/utils/upload'

export default {
  name: 'Settings',
  data() {
    return {
      activeTab: 'brand',
      saving: {
        brand: false,
        contact: false,
        about: false,
        banner: false
      },
      
      // 品牌信息
      brandForm: {
        brandName: '',
        slogan: '',
        logo: ''
      },
      brandRules: {
        brandName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' }
        ]
      },
      logoFileList: [],
      
      // 联系方式
      contactForm: {
        wechatId: '',
        phone: '',
        email: '',
        workHours: '',
        address: '',
        shipFrom: '广东·汕头',
        productContactTitle: '品茶咨询',
        productContactDesc: '添加微信，了解更多详情',
        productContactBtnText: '复制微信号'
      },
      contactRules: {
        wechatId: [
          { required: true, message: '请输入微信号', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      },
      
      // 品牌故事
      aboutForm: {
        aboutUs: ''
      },
      
      // 轮播图
      bannerLoading: false,
      bannerList: [],
      bannerDialogVisible: false,
      bannerDialogTitle: '添加轮播图',
      isEditBanner: false,
      editBannerId: null,
      bannerForm: {
        imageUrl: '',
        title: '',
        link: '',
        sort: 0,
        status: 1
      },
      bannerRules: {
        imageUrl: [
          { required: true, message: '请上传轮播图', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ]
      },
      bannerImageList: [],
      
      // 图片预览
      previewVisible: false,
      previewUrl: ''
    }
  },
  computed: {
    ...mapGetters(['token']),
    uploadHeaders() {
      return { Authorization: `Bearer ${this.token}` }
    }
  },
  created() {
    this.fetchSettings()
    this.fetchBanners()
  },
  methods: {
    // 获取站点设置
    async fetchSettings() {
      try {
        const res = await settingsApi.getSettings()
        if (res.code === 0 && res.data) {
          const data = res.data
          // 品牌信息
          if (data.brand) {
            this.brandForm = { ...data.brand }
            if (data.brand.logo) {
              this.logoFileList = [{ url: data.brand.logo }]
            }
          }
          // 联系方式
          if (data.contact) {
            this.contactForm = { ...data.contact }
          }
          // 品牌故事
          if (data.about) {
            this.aboutForm = { ...data.about }
          }
        }
      } catch (error) {
        console.error('获取设置失败:', error)
      }
    },
    
    // 保存品牌信息
    saveBrand() {
      this.$refs.brandFormRef.validate(async valid => {
        if (valid) {
          this.saving.brand = true
          try {
            const res = await settingsApi.updateBrand(this.brandForm)
            if (res.code === 0) {
              this.$message.success('保存成功')
            } else {
              this.$message.error(res.message || '保存失败')
            }
          } catch {
            this.$message.error('保存失败')
          }
          this.saving.brand = false
        }
      })
    },
    
    // 保存联系方式
    saveContact() {
      this.$refs.contactFormRef.validate(async valid => {
        if (valid) {
          this.saving.contact = true
          try {
            const res = await settingsApi.updateContact(this.contactForm)
            if (res.code === 0) {
              this.$message.success('保存成功')
            } else {
              this.$message.error(res.message || '保存失败')
            }
          } catch {
            this.$message.error('保存失败')
          }
          this.saving.contact = false
        }
      })
    },
    
    // 保存品牌故事
    async saveAbout() {
      this.saving.about = true
      try {
        const res = await settingsApi.updateAbout(this.aboutForm)
        if (res.code === 0) {
          this.$message.success('保存成功')
        } else {
          this.$message.error(res.message || '保存失败')
        }
      } catch {
        this.$message.error('保存失败')
      }
      this.saving.about = false
    },
    
    // Logo 上传
    uploadLogo(options) {
      const { file, onSuccess, onError } = options
      uploadImage(file, 'settings')
        .then(data => {
          this.brandForm.logo = data.url
          this.$message.success('Logo上传成功')
          onSuccess({ code: 0, data })
        })
        .catch(err => {
          this.$message.error(err.message || '上传失败')
          onError(err)
        })
    },
    
    // 轮播图上传
    uploadBannerImage(options) {
      const { file, onSuccess, onError } = options
      uploadImage(file, 'banners')
        .then(data => {
          this.bannerForm.imageUrl = data.url
          this.$message.success('轮播图上传成功')
          onSuccess({ code: 0, data })
        })
        .catch(err => {
          this.$message.error(err.message || '上传失败')
          onError(err)
        })
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
    
    // 获取轮播图列表
    async fetchBanners() {
      this.bannerLoading = true
      try {
        const res = await bannerApi.getList()
        if (res.code === 0) {
          this.bannerList = res.data.list || []
        }
      } catch (error) {
        console.error('获取轮播图失败:', error)
        // 模拟数据
        this.bannerList = [
          { id: 1, imageUrl: 'https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=750&h=400&fit=crop', title: '春茶上市', link: '/pages/product/detail?id=1', sort: 3, status: 1 },
          { id: 2, imageUrl: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=750&h=400&fit=crop', title: '特惠活动', link: '/pages/product/list', sort: 2, status: 1 },
          { id: 3, imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=750&h=400&fit=crop', title: '新品推荐', link: '', sort: 1, status: 1 }
        ]
      }
      this.bannerLoading = false
    },
    
    // 添加轮播图
    handleAddBanner() {
      this.isEditBanner = false
      this.editBannerId = null
      this.bannerDialogTitle = '添加轮播图'
      this.bannerForm = {
        imageUrl: '',
        title: '',
        link: '',
        sort: 0,
        status: 1
      }
      this.bannerImageList = []
      this.bannerDialogVisible = true
      this.$nextTick(() => {
        this.$refs.bannerFormRef && this.$refs.bannerFormRef.clearValidate()
      })
    },
    
    // 编辑轮播图
    handleEditBanner(row) {
      this.isEditBanner = true
      this.editBannerId = row.id
      this.bannerDialogTitle = '编辑轮播图'
      this.bannerForm = {
        imageUrl: row.imageUrl,
        title: row.title,
        link: row.link || '',
        sort: row.sort || 0,
        status: row.status
      }
      this.bannerImageList = row.imageUrl ? [{ url: row.imageUrl }] : []
      this.bannerDialogVisible = true
      this.$nextTick(() => {
        this.$refs.bannerFormRef && this.$refs.bannerFormRef.clearValidate()
      })
    },
    
    // 删除轮播图
    handleDeleteBanner(row) {
      this.$confirm(`确定要删除轮播图「${row.title}」吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await bannerApi.delete(row.id)
          if (res.code === 0) {
            this.$message.success('删除成功')
            this.fetchBanners()
          } else {
            this.$message.error(res.message || '删除失败')
          }
        } catch {
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },
    
    // 轮播图状态变更
    async handleBannerStatusChange(row) {
      const status = row.status
      const statusText = status === 1 ? '启用' : '禁用'
      try {
        const res = await bannerApi.updateStatus(row.id, status)
        if (res.code === 0) {
          this.$message.success(`已${statusText}`)
        } else {
          row.status = status === 1 ? 0 : 1
          this.$message.error(res.message || '操作失败')
        }
      } catch {
        row.status = status === 1 ? 0 : 1
        this.$message.error('操作失败')
      }
    },
    
    // 提交轮播图表单
    submitBannerForm() {
      this.$refs.bannerFormRef.validate(async valid => {
        if (valid) {
          this.saving.banner = true
          try {
            let res
            if (this.isEditBanner) {
              res = await bannerApi.update(this.editBannerId, this.bannerForm)
            } else {
              res = await bannerApi.create(this.bannerForm)
            }
            if (res.code === 0) {
              this.$message.success(this.isEditBanner ? '更新成功' : '添加成功')
              this.bannerDialogVisible = false
              this.fetchBanners()
            } else {
              this.$message.error(res.message || '操作失败')
            }
          } catch {
            this.$message.error('操作失败')
          }
          this.saving.banner = false
        }
      })
    },
    
    // 预览图片
    previewImage(url) {
      if (url) {
        this.previewUrl = url
        this.previewVisible = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$teaGold: #c9a86c;

.settings-container {
  .form-tip {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
  }
  
  .upload-tip {
    font-size: 12px;
    color: #999;
    margin-top: 8px;
  }
  
  .logo-upload,
  .banner-upload {
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
  
  .banner-section {
    .section-header {
      margin-bottom: 20px;
    }
    
    .banner-thumb {
      width: 100px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
      cursor: pointer;
      
      &:hover {
        opacity: 0.8;
      }
    }
    
    .text-muted {
      color: #999;
    }
  }
  
  .form-hint {
    margin-left: 10px;
    font-size: 12px;
    color: #999;
  }
  
  ::v-deep .el-button--primary {
    background: linear-gradient(135deg, $teaGold 0%, #b8995a 100%);
    border: none;
    
    &:hover {
      opacity: 0.9;
    }
  }
}
</style>
