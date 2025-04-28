/**
 * @description: 日期工具类
 */
export const dateUtils = {
  /**
   * @description: 格式化日期
   * @param {string} fmt 格式
   * @param {Date} date 日期
   * @return {string} 格式化后的日期
   * @example: dateUtils.format('yyyy-MM-dd', new Date())
   */
  format(fmt: string, date: Date): string {
    let ret;
    const opt = {
      'Y+': date.getFullYear().toString(), // 年
      'M+': (date.getMonth() + 1).toString(), // 月
      'D+': date.getDate().toString(), // 日
      'H+': date.getHours().toString(), // 时
      'm+': date.getMinutes().toString(), // 分
      's+': date.getSeconds().toString(), // 秒
    };
    for (let k in opt) {
      ret = new RegExp('(' + k + ')').exec(fmt);
      if (ret) {
        fmt = fmt.replace(
          ret[1],
          ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'),
        );
      }
    }
    return fmt;
  },

  // 默认日期转换
  // YYYY-MM-DD HH:mm:ss
  // parms: 2025-04-05T13:50:32.000+00:00
  defaultFormat(date: string): string {
    return dateUtils.format('YYYY-MM-DD HH:mm:ss', new Date(date));
  },
};
