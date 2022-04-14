// 模块联邦引入的组件或者方法需要异步导入进来
/**
 *
 *
 * getHeader是我在webpack.config.js中定义的
 * remotes: {
		getHeader: 'headerhttp://localhost:8080/remoteEntry.js'
	}
 *

	header是远端提供资源的地址名
	exposes: {
		'./header': '../src/federationFun/header.js'
	},
 *
*/
import('nav/DashboardApp').then((Header) => {
  const body = document.createElement('div');
  body.style.cssText = 'background-color: #f40; color: #fff;';
  body.appendChild(Header.default('我是小白，谢谢大佬🧍‍♂️'));
  document.body.appendChild(body);
});

console.log('我是模块化联邦');
