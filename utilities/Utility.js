export default {

  /**
   * [epsilon description]
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  epsilon: function (value) {
    return Math.abs(value) < 0.000001 ? 0 : value;
  },

  /**
   * [determineLabel description]
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  applyCSSLabel: function (value, label) {
    if (value === 0) {
      return '0px'
    } else if (label === '%') {
      return value * 100 + '%';
    } else if (label === 'px') {
      return value + 'px'
    }
  }
}
