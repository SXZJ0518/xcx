<template>
  <div class="contact-container">
    <el-card class="box-card">
      <div slot="header" class="card-header">
        <span>联系方式配置</span>
        <span class="header-desc">配置小程序中展示的联系方式</span>
      </div>
      
      <el-form :model="form" :rules="rules" ref="contactForm" label-width="120px" class="contact-form">
        <el-form-item label="微信号" prop="wechatId">
          <el-input v-model="form.wechatId" placeholder="请输入微信号" clearable>
            <i slot="prefix" class="el-icon-chat-dot-round"></i>
          </el-input>
          <span class="form-tip">小程序"联系我们"按钮将复制此微信号</span>
        </el-form-item>
        
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" clearable>
            <i slot="prefix" class="el-icon-phone"></i>
          </el-input>
          <span class="form-tip">客户点击可直接拨打电话</span>
        </el-form-item>
        
        <el-form-item label="客服邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入客服邮箱" clearable>
            <i slot="prefix" class="el-icon-message"></i>
          </el-input>
        </el-form-item>
        
        <el-form-item label="营业时间" prop="workHours">
          <el-input v-model="form.workHours" placeholder="如：周一至周日 9:00-21:00" clearable>
            <i slot="prefix" class="el-icon-time"></i>
          </el-input>
        </el-form-item>
        
        <el-form-item label="公司地址" prop="address">
          <el-input v-model="form.address" type="textarea" :rows="2" placeholder="请输入公司地址" clearable></el-input>
        </el-form-item>
        
        <el-form-item label="品牌简介" prop="brandDesc">
          <el-input v-model="form.brandDesc" type="textarea" :rows="4" placeholder="请输入品牌简介，将展示在小程序关于页面" maxlength="200" show-word-limit></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitLoading">
            <i class="el-icon-check"></i> 保存配置
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import request from '@/api'

export default {
  name: 'ContactSetting',
  data() {
    return {
      form: {
        wechatId: '',
        phone: '',
        email: '',
        workHours: '',
        address: '',
        brandDesc: ''
      },
      rules: {
        wechatId: [
          { required: true, message: '请输入微信号', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        brandDesc: [
          { max: 200, message: '最多200个字符', trigger: 'blur' }
        ]
      },
      submitLoading: false
    }
  },
  created() {
    this.fetchContact()
  },
  methods: {
    async fetchContact() {
      try {
        const res = await request({
          url: '/api/admin/contact',
          method: 'get'
        })
        if (res.code === 0 && res.data) {
          this.form = { ...this.form, ...res.data }
        }
      } catch (error) {
        console.log('使用默认配置')
      }
    },
    submitForm() {
      this.$refs.contactForm.validate(valid => {
        if (valid) {
          this.submitLoading = true
          request({
            url: '/api/admin/contact',
            method: 'put',
            data: this.form
          }).then(res => {
            if (res.code === 0) {
              this.$message.success('保存成功')
            } else {
              this.$message.error(res.message || '保存失败')
            }
          }).catch(() => {
            this.$message.error('保存失败')
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    },
    resetForm() {
      this.$refs.contactForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.contact-container {
  padding: 20px;
  
  .card-header {
    display: flex;
    align-items: center;
    
    span:first-child {
      font-size: 18px;
      font-weight: 500;
      color: #2d2520;
    }
    
    .header-desc {
      margin-left: 12px;
      font-size: 13px;
      color: #8b7355;
    }
  }
  
  .contact-form {
    max-width: 600px;
    margin-top: 20px;
    
    .form-tip {
      display: block;
      margin-top: 8px;
      font-size: 12px;
      color: #8b7355;
    }
    
    ::v-deep .el-input__inner {
      border-radius: 8px;
    }
    
    ::v-deep .el-textarea__inner {
      border-radius: 8px;
    }
  }
}
</style>
