import * as vscode from 'vscode';
import InitConfig from './initconf';
import { NodeDependenciesProvider } from './nodeDependenciesProvider';

/**
 * @description 初始化视图
 */
export default class InitView {
  private conf: InitConfig;

  constructor(conf: InitConfig) {
    this.conf = conf;
  }

  /**
   * @description 注册树视图容器
   */
  public init() {
    vscode.window.createTreeView('apidocsw2ts-view', {
      treeDataProvider: new NodeDependenciesProvider(this.conf)
    });
  }
}