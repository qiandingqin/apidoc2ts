/**
 * @description 配置文件
 */
export interface IConfig {
  /**
   * @description 文档名
   */
  name: string

  /**
   * @description 文档地址
   */
  url: string

  /**
   * @description 输出文件夹路径
   */
  output: string

  /**
   * @description 输出文件后缀 默认.ts
   */
  suffix: string

  /**
   * @description 生成时是否删除之前的API
   */
  deleteSource: boolean
}

/**
 * @description 获取API文档信息处理之后返回的数据参数接口 
 */
export interface IApiInfo {
  /**
   * @description 文档标题
   */
  title: string

  /**
   * @description 文档描述
   */
  description: string

  /**
   * @description 文档版本
   */
  version: string

  /**
   * @description API前缀
   */
  prefix: string

  /**
   * @description 实体列表
   */
  entitys: IEntityInfo[]

  /**
   * @description API列表
   */
  apis: IApi[]
}

/**
 * @description 渲染提供给视图的上下文 该信息主要是提供给视图渲染使用
 */
export interface IRenderContext {

}

/**
 * @description 实体信息
 */
export interface IEntityInfo {
  /**
   * @description 实体名称
   */
  title: string

  /**
   * @description 实体成员属性
   */
  properties: Array<IPropertie>
}

/**
 * @description 成员属性信息
 */
export interface IPropertie {
  /**
   * @description 属性名
   */
  title: string

  /**
   * @description 属性描述
   */
  desc: string

  /**
   * @description 属性类型
   */
  type: string

  /**
   * @description 是否必填
   */
  required: boolean

  /**
   * @description 入参方式 body query formdata
   */
  in?: string
}

/**
 * @description API接口参数
 */
export interface IApi {
  /**
   * @description 接口名
   */
  name: string

  /**
   * @description 接口标题
   */
  title: string

  /**
   * @description 接口描述
   */
  desc: string

  /**
   * @description 接口路径
   */
  path: string

  /**
   * @description 请求方式
   */
  contentType: string

  /**
   * @description 请求类型
   */
  method: string

  /**
   * @description 响应参数
   */
  response: any[]

  /**
   * @description 请求参数
   */
  request: any[]
}