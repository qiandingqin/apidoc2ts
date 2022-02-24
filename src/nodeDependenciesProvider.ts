import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { IApi, IConfig } from './types';
import Swagger from './extractor/swagger/swagger';
import Render from './render/render';
import InitConfig from './initconf';

/**
 * @description 树视图节点提供
 */
export class NodeDependenciesProvider implements vscode.TreeDataProvider<Dependency> {
  private config: IConfig[] = [];

  constructor(private initconf: InitConfig) {
    this.config = initconf.config;
  }

  // 获取节点
  getTreeItem(element: Dependency): vscode.TreeItem {
    return element;
  }

  // 获取全部子节点
  async getChildren(element?: Dependency): Promise<Dependency[]> {
    if (!this.config) {
      vscode.window.showInformationMessage('获取配置信息失败');
      return Promise.resolve([]);
    }

    // 存在时 且传入的节点为项目节点
    if (element && !element.api) {
      const info: IConfig = element.config;
      const render = new Render(new Swagger(info.url), info, this.initconf);
      const docinfo = await render.getDocument();
      const deps: Dependency[] = [];

      docinfo.apis.forEach(x => {
        const dep = new Dependency(`[${x.method == 'POST' ? 'P' : x.method == 'GET' ? 'G' : ''}] ${x.title}`, info, vscode.TreeItemCollapsibleState.None);
        dep.api = x;
        (dep as any).iconPath = null;
        deps.push(dep);
      });

      // 生成代码
      render.generate();

      return Promise.resolve(deps);
    } else {
      return Promise.resolve(this.getProjects());
    }
  }

  /**
   * @description 获取项目树
   * @returns 
   */
  private getProjects(): Dependency[] {
    const projects = this.config;
    const deps: Dependency[] = projects.map(x => {
      const dep = new Dependency(x.name, x, vscode.TreeItemCollapsibleState.Collapsed);
      // 渲染API类型节点时不设置图标
      // dep.iconPath = {};
      return dep;
    });
    return deps;
  }
}

/**
 * @description 节点
 */
class Dependency extends vscode.TreeItem {
  constructor(
    public name: string,
    public config: IConfig,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(name, collapsibleState);
    this.tooltip = `${name}`;
  }

  public api!: IApi;
  public iconPath = {
    light: path.join(__filename, '..', '..', 'assets', 'icon', 'dark', 'project.svg'),
    dark: path.join(__filename, '..', '..', 'assets', 'icon', 'dark', 'project.svg')
  };

  /**
   * @description 设置图标
   * @param iconame 
   */
  public setIcon(iconame: string = 'api') {
    this.iconPath.light = path.join(__filename, '..', '..', 'assets', 'icon', 'dark', iconame);
    this.iconPath.dark = path.join(__filename, '..', '..', 'assets', 'icon', 'light', iconame);
  }
}