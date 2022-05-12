/**
 * 将所有相邻的空白字符转换为一个空格。
 *
 * 举例：collapseWhitespace('  String   \t libraries are   \n\n\t fun\n!  ') // 'String libraries are fun !'
 * @param {string} st 处理数据
 * @return {string} 处理好数据
 */
export const collapseWhitespace = (st: string) => st.replace(/[\s\xa0]+/g, ' ')
  .replace(/^\s+|\s+$/g, '');
