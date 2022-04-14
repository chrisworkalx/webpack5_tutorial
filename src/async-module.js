// 这里我们使用动态引入 使得这些文件可以抽离出入口文件
function getComponent() {
  return import('lodash').then(({ default: _ }) => {
    const ele = document.createElement('div');
    ele.innerHTML = _.join(['我是动态加载的组件', '很nice'], '~');
    return ele;
  });
}

getComponent().then((com) => {
  document.body.appendChild(com);
});
