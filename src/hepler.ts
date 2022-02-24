import * as fs from 'fs'
import * as path from 'path'
import * as vscode from 'vscode'

/**
 * @description 写日志
 */
export const writeLog = (content: string) => {
  const dir = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0]?.uri.fsPath : '';
  const d = new Date();
  const filenmae = `log-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}.txt`;
  const uri = path.join(dir, '.sw2ts', filenmae);
  const str = `[${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}]: ${content}\r\n`;

  if (!dir) return;
  if (!fs.existsSync(uri)) {
    fs.writeFileSync(uri, str);
  } else {
    fs.appendFileSync(uri, str);
  }
}