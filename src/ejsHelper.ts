/**
 * @description ejs内部函数
 */
export default class ejsHelper {
  /**
   * @description 首字母大写
   */
  static firstUpper(str: string) {
    if (!str.trim()) return '';
    // 处理下划线
    const s = str.replace(/(_)([a-z]{1})/g, ($1) => $1.toUpperCase().replace(/\_/g, ''));
    return s[0].toUpperCase() + s.substring(1);
  }

  /**
   * @description 检查是否基础类型
   * @param str 
   */
  static checkBaseType(str: string) {
    return ['string', 'number', 'boolean', 'File', 'any'].includes(str);
  }
}