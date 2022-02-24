import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { IConfig } from './types';

/**
 * @description 初始化配置文件 目录等
 */
export default class InitConfig {
  /**
   * @description 工作区目录
   */
  public workspace: string = '';

  /**
   * @description 配置文件夹
   */
  public confFolders: string = '';

  /**
   * @description 配置文件路径
   */
  public conJsonPath: string = '';

  /**
   * @description 配置文件信息
   */
  public config: Array<IConfig> = [];

  /**
   * @description ejs模板路径
   */
  public tp_api: string = '';

  /**
   * @description ejs模板路径
   */
  public tp_entitys: string = '';

  constructor() {
    const folders = vscode.workspace.workspaceFolders;

    if (folders?.length != 1) {
      vscode.window.showInformationMessage('没有打开项目或工具暂不支持多项目');
      return
    }

    this.workspace = folders[0].uri.fsPath;
    this.confFolders = this.existsPath('.sw2ts');
    this.conJsonPath = this.existsPath('.sw2ts', 'config.json', true);
    this.tp_api = this.existsPath('.sw2ts', 'tp_api.ejs');
    this.tp_entitys = this.existsPath('.sw2ts', 'tp_entitys.ejs');
  }

  // 检查目录或文件是否存在 不存在则创建
  private existsPath(uri: string, filename?: string, isConf: boolean = false): string {
    const dirpath = path.join(this.workspace, uri);
    const exists = fs.existsSync(dirpath);

    if (!exists) {
      fs.mkdirSync(dirpath);
    }

    if (!filename) return dirpath;

    // 目录存在 并且传入了文件名 且该文件不存在于目录中创建新的
    const filepath = path.join(dirpath, filename);
    

    if (exists && !fs.existsSync(filepath)) {
      const assets = path.join(__dirname, '..', 'assets', 'template', filename);
      const read = fs.readFileSync(assets);
      fs.writeFileSync(filepath, read.toString());
    }

    if (isConf) {
      try {
        this.config = JSON.parse(fs.readFileSync(filepath).toString());
      } catch (error) {
        vscode.window.showInformationMessage('获取配置文件信息失败');
      }
    }

    return filepath;
  }
}