import { IApiInfo } from "../types";

/**
 * @description 提取器抽象类
 */
export default abstract class Extractor {

  /**
   * @description 获取文档文档信息
   */
  public abstract getApiInfo(): Promise<IApiInfo>
}