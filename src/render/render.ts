import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import Extractor from "../extractor/extractor";
import { writeLog } from '../hepler';
import { IApiInfo, IConfig } from "../types";
import * as ejs from 'ejs'
import InitConfig from '../initconf';
import ejsHelper from '../ejsHelper';
/**
 * @description 渲染器
 */
export default class Render {

  private apiInfo!: IApiInfo;

  constructor(private extractor: Extractor, private conf: IConfig, private initConfig: InitConfig) {}

  // 获取文档信息
  public async getDocument() {
    try {
      this.apiInfo = await this.extractor.getApiInfo();
    } catch (error: any) {
      writeLog(error.message);
      vscode.window.showInformationMessage('获取文档失败 请检查API文档是否能正常访问或使用');
    }

    return this.apiInfo;
  }

  /**
   * @description 生成代码
   */
  public generate() {
    // 读取模板
    const tp_entitys = this.initConfig.tp_entitys;
    const tp_api = this.initConfig.tp_api;

    // 渲染模板
    let str_entitys = '';
    let str_api = '';

    vscode.window.showInformationMessage("开始生成文档代码");

    // 判断是否需要删除原来的文件
    if (this.conf.deleteSource) {
      // TODO
    }

    try {
      str_entitys = ejs.render(fs.readFileSync(tp_entitys).toString(), { ejsHelper, config: this.conf, context: this.apiInfo });
    } catch (error: any) {
      writeLog(error.message);
      vscode.window.showInformationMessage('渲染实体模板失败 请检查ejs是否正确 详情请查看日志');
    }

    // 写实体文件
    this.writeFile(path.join(this.initConfig.workspace, this.conf.output, 'entitys' + (this.conf.suffix || '.ts')), str_entitys);

    // 渲染API列表
    this.apiInfo.apis.forEach(x => {
      try {
        str_api = ejs.render(fs.readFileSync(tp_api).toString(), { ejsHelper, config: this.conf, context: this.apiInfo, api: x });
      } catch (error: any) {
        writeLog(error.message);
        vscode.window.showInformationMessage('渲染API模板失败 请检查ejs是否正确 详情请查看日志');
      }

      // 写API文件
      const filename = path.join(this.initConfig.workspace, this.conf.output, x.path, x.name + x.method + ('.ts'));
      this.writeFile(filename, str_api);
    });

    vscode.window.showWarningMessage("生成成功！请检查生成代码是否符合需求 如特殊接口可自行定义！");
  }

  /**
   * @description 写文件
   */
  public writeFile(url: string, content: string) {
    const parse = path.parse(url);
    const dirSplit = parse.dir.split('\\');
    const dirs = dirSplit.slice(1, dirSplit.length);
    const disk = dirSplit[0] + '\\';
    // 递归创建目录
    const mkdir = (dpath: string, index: number = 0) => {
      const dirindex = dirs[index];

      if (!dirindex) return;

      const dirpath = path.join(dpath, dirs[index]);
      if (!fs.existsSync(dirpath)) {
        fs.mkdirSync(dirpath);
      }

      mkdir(dirpath, ++index);
    }

    mkdir(path.join(disk));

    try {
      fs.writeFileSync(url, content);
    } catch (error: any) {
      writeLog(error.message);
      vscode.window.showInformationMessage('创建文件失败 请检查是否存在目录或是否有访问权限');
    }
  }
}