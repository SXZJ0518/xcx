# 茶叶商城小程序 - 微信云开发部署指南

## 📋 项目概述

这是一个基于微信云开发的茶叶商城小程序，包含商品展示、购物车、订单管理等功能。

## 🚀 部署步骤

### 第一步：开通微信云开发

1. 打开微信开发者工具
2. 打开项目：`c:\Users\29142\Desktop\小程序\茶叶小程序前端`
3. 点击顶部菜单栏「云开发」按钮
4. 选择「开通」，按照提示完成云开发开通
5. 创建环境，设置环境名称（如：mall-dev）
6. 复制环境ID（格式类似：mall-3g040b8bc935600c）

### 第二步：修改环境ID

1. 打开 `app.js` 文件
2. 找到第25行，修改环境ID：
```javascript
cloudEnv: '你的环境ID'  // 替换为实际的云开发环境ID
```

### 第三步：上传云函数

#### 3.1 上传 mall 云函数
1. 在微信开发者工具左侧找到 `cloudfunctions` 文件夹
2. 右键点击 `mall` 文件夹
3. 选择「上传并部署：云端安装依赖」
4. 等待部署完成

#### 3.2 上传 initDatabase 云函数
1. 右键点击 `initDatabase` 文件夹
2. 选择「上传并部署：云端安装依赖」
3. 等待部署完成

### 第四步：初始化数据库

#### 4.1 创建数据库集合
1. 点击顶部「云开发」→「数据库」
2. 点击「添加集合」，依次创建以下集合：
   - `user`（用户表）
   - `product`（商品表）
   - `category`（分类表）
   - `order`（订单表）
   - `address`（地址表）
   - `banner`（轮播图表）

#### 4.2 运行数据库初始化脚本
有两种方式初始化数据库：

**方式一：通过云开发控制台**
1. 点击「云开发」→「云函数」
2. 找到 `initDatabase` 函数
3. 点击「测试」
4. 点击「调用测试」
5. 点击「调用」
6. 等待执行完成，查看返回结果

**方式二：在小程序中调用**
1. 在小程序代码中添加临时测试代码调用云函数
2. 运行小程序后会自动初始化数据

### 第五步：配置云存储

1. 点击「云开发」→「存储」
2. 上传商品图片到云存储
3. 可以创建文件夹分类：
   - `banner/` - 轮播图
   - `product/` - 商品图片
   - `avatar/` - 用户头像

### 第六步：修改云数据库权限

1. 点击「云开发」→「数据库」
2. 选择每个集合，点击「权限设置」
3. 设置权限为：「所有用户可读，仅创建者可写」
   - `product`、`category`、`banner`：「所有用户可读，仅管理员可写」
   - `user`、`order`、`address`：「所有用户可读，仅创建者可写」

### 第七步：上传并部署小程序

1. 修改 `app.json` 中的小程序名称（可选）
2. 点击微信开发者工具右上角「上传」按钮
3. 填写版本号和项目备注
4. 登录微信公众平台，进入「开发」→「开发管理」→「开发版本」
5. 提交审核
6. 审核通过后点击「发布」

## 📂 文件结构说明

```
茶叶小程序前端/
├── cloudfunctions/           # 云函数目录
│   ├── mall/                # 主业务云函数
│   │   ├── index.js
│   │   ├── package.json
│   │   └── config.json
│   └── initDatabase/        # 数据库初始化云函数
│       ├── index.js
│       ├── package.json
│       └── config.json
├── pages/                   # 小程序页面
├── components/             # 组件
├── utils/                  # 工具类
│   ├── api.js             # 原API（保留，可切换）
│   ├── cloudAPI.js        # 云函数API（新）
│   └── cache.js
├── images/                 # 图片资源
├── app.js                  # 小程序入口
├── app.json               # 小程序配置
└── project.config.json    # 项目配置
```

## 🔧 数据库集合说明

### user（用户表）
```javascript
{
  _openid: "用户openid",
  nickName: "昵称",
  avatarUrl: "头像地址",
  phone: "手机号",
  level: 1,
  points: 0,
  createTime: Date,
  updateTime: Date
}
```

### product（商品表）
```javascript
{
  name: "商品名称",
  description: "商品描述",
  brief: "商品简介",
  price: 268,
  originalPrice: 328,
  stock: 100,
  sales: 520,
  cover: "封面图",
  images: ["图片数组"],
  categoryId: "分类ID",
  categoryName: "分类名称",
  status: 1,
  isHot: false,
  isNew: false,
  tags: [],
  createTime: Date,
  updateTime: Date
}
```

### category（分类表）
```javascript
{
  name: "分类名称",
  parentId: null,
  level: 1,
  sort: 1,
  status: 1,
  icon: "图标地址",
  createTime: Date,
  updateTime: Date
}
```

### order（订单表）
```javascript
{
  orderNo: "订单号",
  userId: "用户ID",
  items: [/* 订单商品 */],
  totalAmount: 268,
  originalAmount: 328,
  status: 10,  // 10待支付 20已支付 30发货中 40已完成
  address: {/* 收货地址 */},
  remark: "备注",
  createTime: Date,
  updateTime: Date
}
```

### address（地址表）
```javascript
{
  userId: "用户ID",
  name: "收货人",
  phone: "手机号",
  province: "省",
  city: "市",
  district: "区",
  detail: "详细地址",
  isDefault: false,
  createTime: Date,
  updateTime: Date
}
```

### banner（轮播图表）
```javascript
{
  title: "标题",
  image: "图片地址",
  link: "跳转链接",
  type: 1,
  sort: 1,
  status: 1,
  createTime: Date,
  updateTime: Date
}
```

## 🎯 订单状态说明

- `0`：已取消
- `10`：待支付
- `20`：已支付（待发货）
- `30`：已发货（配送中）
- `40`：已完成
- `50`：退款中

## 💡 注意事项

1. **免费额度**：云开发免费版有资源限制，正式商用建议升级
2. **云函数调试**：可以在云开发控制台进行云函数调试
3. **权限设置**：根据实际需求调整数据库权限设置
4. **图片优化**：商品图片建议压缩后上传到云存储
5. **监控日志**：定期查看云开发控制台的日志和监控

## 📞 常见问题

### Q: 云函数部署失败怎么办？
A: 检查以下几点：
- 网络连接是否正常
- 云开发是否已开通
- 云函数代码是否有语法错误

### Q: 数据库初始化后没有数据？
A: 检查：
- 数据库集合是否已创建
- 云函数是否成功调用
- 云函数执行日志是否有报错

### Q: 小程序无法访问云数据库？
A: 检查：
- 数据库权限设置是否正确
- app.js 中的环境ID是否正确
- 云开发是否已成功初始化

## 🔄 切换API方式

项目中保留了两种API调用方式：

1. **云函数方式**（推荐，当前使用）
   - 使用 `utils/cloudAPI.js`
   - 无需后端服务器

2. **REST API方式**（原方式）
   - 使用 `utils/api.js`
   - 需要部署后端服务器

切换方式：修改各页面中引入的API模块即可。

## 📚 相关文档

- [微信云开发官方文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [小程序开发指南](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [云函数开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/functions.html)

---

祝你部署顺利！如有问题，欢迎随时提问。
