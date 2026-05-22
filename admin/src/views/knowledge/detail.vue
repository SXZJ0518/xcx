<template>
  <div class="knowledge-detail">
    <el-card>
      <div slot="header">
        <span>{{ isEdit ? '编辑文章' : '添加文章' }}</span>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="form-body">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入文章标题" maxlength="60" show-word-limit />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分类" prop="categoryId">
              <el-select v-model="form.categoryId" placeholder="选择分类" style="width:100%">
                <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源">
              <el-input v-model="form.source" placeholder="文章来源（选填）" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="封面图">
          <el-upload 
            class="cover-upload" 
            :action="uploadUrl" 
            :headers="uploadHeaders" 
            :on-success="onCoverSuccess" 
            :before-upload="beforeUpload" 
            :limit="1" 
            :file-list="coverList" 
            list-type="picture-card"
          >
            <i class="el-icon-plus" />
            <div slot="tip" class="tip">建议尺寸 900x500，jpg/png，不超过2MB</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="摘要" prop="summary">
          <el-input 
            v-model="form.summary" 
            type="textarea" 
            :rows="3" 
            placeholder="文章摘要，将显示在列表卡片中" 
            maxlength="200" 
            show-word-limit 
          />
        </el-form-item>

        <el-form-item label="正文" prop="content">
          <el-input 
            v-model="form.content" 
            type="textarea" 
            :rows="16" 
            placeholder="请输入文章正文内容（支持HTML格式）" 
          />
        </el-form-item>

        <el-form-item label="标签">
          <el-tag 
            v-for="(t, i) in form.tags" 
            :key="i" 
            closable 
            size="small" 
            style="margin-right:6px" 
            @close="form.tags.splice(i,1)"
          >{{ t }}</el-tag>
          <el-input 
            v-if="tagVisible" 
            ref="tagInput" 
            v-model="tagValue" 
            size="small" 
            style="width:100px" 
            @keyup.enter.native="addTag" 
            @blur="addTag" 
          />
          <el-button 
            v-else 
            size="small" 
            @click="tagVisible = true; $nextTick(() => $refs.tagInput.focus())"
          >+ 标签</el-button>
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">立即发布</el-radio>
            <el-radio :label="0">存为草稿</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="submit">{{ isEdit ? '保存修改' : '发布文章' }}</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import knowledgeApi from '@/api/knowledge'
import { mapGetters } from 'vuex'

export default {
  name: 'KnowledgeDetail',
  data() {
    return {
      isEdit: false,
      editId: '',
      form: { 
        title: '', 
        categoryId: '', 
        source: '', 
        cover: '', 
        summary: '', 
        content: '', 
        tags: [], 
        status: 1 
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
        content: [{ required: true, message: '请输入正文', trigger: 'blur' }]
      },
      categories: [],
      coverList: [],
      tagVisible: false,
      tagValue: '',
      submitting: false,
      uploadUrl: '/api/admin/upload/knowledge'
    }
  },
  computed: {
    ...mapGetters(['token']),
    uploadHeaders() {
      return { Authorization: `Bearer ${this.token}` }
    }
  },
  created() {
    this.isEdit = this.$route.query.id ? true : false
    if (this.isEdit) {
      this.editId = this.$route.query.id
      this.loadDetail()
    }
    this.loadCategories()
  },
  methods: {
    async loadCategories() {
      try {
        const r = await knowledgeApi.getCategories()
        this.categories = r.data || []
      } catch {
        this.categories = [
          { id: 'c1', name: '茶文化' },
          { id: 'c2', name: '冲泡技巧' },
          { id: 'c3', name: '茶叶鉴别' }
        ]
      }
    },
    async loadDetail() {
      try {
        const r = await knowledgeApi.getDetail(this.editId)
        const d = r.data || r
        this.form = {
          title: d.title || '',
          categoryId: d.categoryId || '',
          source: d.source || '',
          cover: d.cover || '',
          summary: d.summary || '',
          content: d.content || '',
          tags: d.tags || [],
          status: d.status != null ? d.status : 1
        }
        if (d.cover) this.coverList = [{ url: d.cover }]
      } catch {
        this.$message.error('加载文章失败')
      }
    },
    onCoverSuccess(res) {
      if (res.code === 0 || res.url) {
        this.form.cover = (res.data && res.data.url) || res.url
        this.$message.success('上传成功')
      } else {
        this.$message.error(res.message || '上传失败')
      }
    },
    beforeUpload(file) {
      const ok = ['image/jpeg', 'image/png'].includes(file.type) && file.size / 1024 / 1024 < 2
      if (!ok) this.$message.error('仅支持 jpg/png 且不超过 2MB')
      return ok
    },
    addTag() {
      const v = this.tagValue.trim()
      if (v && !this.form.tags.includes(v)) this.form.tags.push(v)
      this.tagVisible = false
      this.tagValue = ''
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return this.$message.warning('请完善必填项')
        this.submitting = true
        try {
          if (this.isEdit) {
            await knowledgeApi.update(this.editId, this.form)
          } else {
            await knowledgeApi.create(this.form)
          }
          this.$message.success(this.isEdit ? '已保存' : '发布成功')
          this.$router.push('/knowledge/index')
        } catch {
          this.$message.error('操作失败')
        }
        this.submitting = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.knowledge-detail {
  .form-body {
    max-width: 860px;
    margin: 0 auto;
  }
  .cover-upload {
    .tip {
      font-size: 12px;
      color: #999;
      margin-top: 6px;
    }
  }
}
</style>
