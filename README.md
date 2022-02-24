# apidocsw2ts README

## swagger swaggerAPI文档实体代码生成工具

该项目目前仅针对自己业务项目使用

### 配置文件示例
```
[
  {
    "name": "口译2.0 授权服务",
    <!-- API地址 -->
    "url": "http://192.168.1.9:8090/cjky-security/v2/api-docs",
    <!-- 输出目录 -->
    "output": "src/apis/security",
    <!-- 输出后缀 -->
    "suffix": ".d.ts",
    <!-- 生成代码前是否删除之前的 -->
    "deleteSource": true
  },
  {
    "name": "口译2.0 用户班级管理服务",
    "url": "http://192.168.1.9:8090/cjky-user/v2/api-docs",
    "output": "src/apis/classify",
    "suffix": ".d.ts",
    "deleteSource": true
  },
  {
    "name": "语音 NLP服务",
    "url": "http://192.168.1.9:8090/cjky-user/v2/api-docs",
    "output": "src/apis/classify",
    "suffix": ".d.ts",
    "deleteSource": true
  }
]
```