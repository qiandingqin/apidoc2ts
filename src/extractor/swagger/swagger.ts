import * as vscode from 'vscode';
import * as https from 'https'
import * as http from 'http'
import * as path from 'path'
import { IApi, IApiInfo, IEntityInfo, IPropertie } from "../../types";
import Extractor from "../extractor";

/**
 * @description swagger 文档提取器
 */
export default class Swagger extends Extractor {

  constructor(private url: string) {
    super();
  }

  /**
   * @description 获取API文档资源
   */
  private getApiDocResources<T>(): Promise<T> {
    return new Promise((resolve, reject) => {
      const network = this.url.indexOf('https') == -1 ? http : https;
      const req = network.request(this.url, (res) => {
        const datas: any = [];

        if (res.statusCode != 200) {
          vscode.window.showErrorMessage("同步文档失败！信息：" + res.statusCode);
          reject(res);
          return;
        }

        res.on('data', chunk => {
          datas.push(chunk);
        })

        res.on('end', () => {
          const buffer = Buffer.concat(datas);
          const body = buffer.toString();
          resolve(JSON.parse(body));
        });
      });

      req.on('error', (err) => {
        vscode.window.showErrorMessage("同步文档失败！信息：" + err.message);
        reject(err);
      });

      req.end();
    });
  }

  // 过滤实体
  private filterEntitys(entitys: any): any[] {
    
    const filter: IEntityInfo[] = [];

    for (const key in entitys) {
      const entity = entitys[key];
      const find = filter.find(x => x.title == entity.title);

      // 将带有 书名号的过滤掉
      if (entity.title.indexOf('«') != -1) continue;
      // 已存在的实体 document.definitions.User.properties
      if (find) continue;

      filter.push({title: entity.title, properties: this.resetPropertie(entity)});
    }

    return filter;
  }

  // 过滤API列表
  private filterApis(paths: any): any[] {
    const apis: IApi[] = [];

    for (const key in paths) {
      const api = paths[key];

      // 该对象下存在 get , post 等请求方式的对象 每种请求方式都应当生成一组API
      for (const m in api) {
        const obj = api[m];
        const parse = path.parse(key);

        apis.push({
          name: parse.name,
          title: obj.summary,
          desc: obj.description,
          path: parse.dir,
          contentType: obj.consumes ? obj.consumes[0] || '' : '',
          method: m.toUpperCase(),
          request: this.resetRequestPropertie(obj.parameters || []),
          response: []
        });
      }
    }

    return apis;
  }

  // 重置API参数属性
  private resetRequestPropertie(parameters: any[]) {
    const o: any = {};
    const required = parameters.filter(x => !x.required).map(x => x.name);
    parameters.forEach(x => {
      o[x.name] = {
        desc: x.description,
        type: x.type,
        in: x.in,
        $ref: x.schema ? x.schema.$ref : ''
      }
    });
    const entity: any = {properties: o};
    if (required.length) entity.required = required;
    return this.resetPropertie(entity);
  }

  // 重置属性
  private resetPropertie(entity: any): Array<IPropertie> {
    const psropertie = entity.properties;
    const ps: Array<IPropertie> = [];

    for (const key in psropertie) {
      const member = psropertie[key];

      // 字段存在时需处理必填 该字段不存在时默认都为true 在required限制数组中如查询不到当前key 表示非必填项
      let required = true;
      if (entity.required !== undefined && !entity.required.includes(key)) {
        required = false;
      }

      ps.push({
        title: key,
        desc: member.description || member.desc || '',
        type: this.getType(member),
        in: member.in || '',
        required
      });
    }

    return ps;
  }

  /**
   * @description 获取类型转换
   */
  public getType(member: any): string {
    const t = member.type;
    const $ref = member.$ref || (member.items ? member.items.$ref : null);
    const rPath = $ref ? $ref.split('/') : [];
    const r = rPath[rPath.length - 1] || '';
    const rType = member.items && member.items.type ? this.getType({type: member.items.type}) : 'any';
    let type;

    switch (t) {
      case 'object':
        type = 'any';
        break;

      case 'string':
        type = 'string';
        break;

      case 'integer':
        type = 'number';
        break;

      case 'array':
        type = 'Array<'+ (r || rType) +'>';
        break;

      case 'boolean':
        type = 'boolean';
        break;

      case 'file':
        type = 'File';
        break;
    
      default:
        type = r || rType;
        break;
    }

    return type;
  }

  public async getApiInfo(): Promise<IApiInfo> {
    let document: any;
    let api: IApiInfo = {} as any;

    try {
      document = await this.getApiDocResources<any>();
    } catch (error) {
      return api;
    }

    api.title = document.info.title;
    api.description = document.info.description;
    api.version = document.info.version;
    api.prefix = document.basePath.replace(/\-/g, '_').replace(/\//g, '');
    api.entitys = this.filterEntitys(document.definitions);
    api.apis = this.filterApis(document.paths);
    return api;
  }

}