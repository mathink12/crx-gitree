/**
 * 获取元素计算后的属性值
 *   getPropVal(document.querySelector('.paper-container'), 'width') === '843px'
 * @author wangk 2019-09-16T19:41:50+0800
 * @param  {[type]} el   用于获取计算样式的 element
 * @param  {[type]} prop 需要获取的属性, 如 'width', 'height' 等
 * @return {[type]}      [description]
 */
const getPropVal = (el, prop) => {
  if (!el || !prop) {
    return ''
  }

  return window.getComputedStyle(el, null).getPropertyValue(prop)
}

/**
 * 计算默认滚动条的宽(支持浏览器: chrome, firefox, edge)
 * @author wangk 2020-08-10T10:37:32+0800
 * @return {[type]} [description]
 */
const getDefaultScrollbarWidth = () => {
  const div = document.createElement('div')
  const width = 100
  // div.id = 'scrollbarHelper'
  div.style.width = `${width}px`
  div.style.overflow = 'scroll'

  // 为了兼容 firefox 需要在内部插入一个 div 进行计算
  const innerDiv = document.createElement('div')
  div.appendChild(innerDiv)

  document.body.appendChild(div)
  const scrollbarWidth = width - parseInt(getPropVal(innerDiv, 'width'))
  document.body.removeChild(div)
  return scrollbarWidth
}

export {
  getPropVal,
  getDefaultScrollbarWidth
}
