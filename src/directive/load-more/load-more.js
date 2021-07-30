export default {
  /*
    bind 钩子函数，第一次绑定时调用，可以在这里做初始化设置
    el: 作用的 dom 对象
    binding.value: 传给指令的值，也就是我们要 copy 的值
  */
  bind(el, binding) {
    // 获取element-ui定义好的scroll盒子
    const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
    el.handler = () => {
      const CONDITION = SELECTWRAP_DOM.scrollHeight - SELECTWRAP_DOM.scrollTop <= SELECTWRAP_DOM.clientHeight
      if (CONDITION) {
        binding.value()
      }
    }
    SELECTWRAP_DOM.addEventListener('scroll', el.handler)
  },
  // 指令与元素解绑的时候，移除事件绑定
  unbind(el) {
    el.removeEventListener('scroll', el.handler);
  },
};

