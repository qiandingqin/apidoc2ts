// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import InitCommands from './Initcommands';
import InitConfig from './initconf';
import InitView from './initview';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// 初始化目录配置文件
	let initconf = new InitConfig();
	// 初始化界面视图
	let initview = new InitView(initconf);
	// 初始化命令
	let initcmd = new InitCommands();

	// 初始化扩展
	const initExtension = () => {
		initconf = new InitConfig();
		initview = new InitView(initconf);
		initview.init();
	}

	// 注册刷新项目命令
	vscode.commands.registerCommand('apidocsw2ts.refresh', () => {
		initExtension();
	});

	// 打开配置文件命令
	vscode.commands.registerCommand('apidocsw2ts.setting', () => {
		vscode.window.showTextDocument(vscode.Uri.file(initconf.conJsonPath));
	});

	// 打开模板文件命令
	vscode.commands.registerCommand('apidocsw2ts.template', () => {
		vscode.window.showTextDocument(vscode.Uri.file(initconf.tp_api));
		// vscode.window.showTextDocument(vscode.Uri.file(initconf.tp_entitys));
	});

	// 激活时初始化一次
	initExtension();

	// 监听同步接口完成后更新视图
	// initcmd.xxx = () => {}
}

export function deactivate() {}
