import nullSrc from '../src/assets/imgs/null.png';
import qiyeSrc from '../src/assets/imgs/qiye.svg';
import textSrc from '../src/assets/file/test.txt';
import jsSrc from '../src/assets/imgs/js.jpeg';
import '../src/assets/style/index.css';
import myCsv from '../src/assets/file/test02.csv';
import myNotes from '../src/assets/file/note.xml';
import myJson5 from '../src/assets/file/test03.json5';
import _ from 'lodash';
import './async-module.js';

function createImgLabel(src) {
  const img = document.createElement('img');
  img.src = src;
  document.body.appendChild(img);
}

function createTextLable(
  resource,
  cssText = 'background: #f99; width: 200px; height: 200px;'
) {
  const div = document.createElement('div');
  div.textContent = resource;
  div.style.cssText = cssText;
  document.body.appendChild(div);
}

function createFontLabel(fontUrl) {
  const div = document.createElement('div');
  div.classList.add('icon');
  div.innerHTML = fontUrl;
  document.body.appendChild(div);
}

function createButton(title, id) {
  const btn = document.createElement('button');
  btn.setAttribute('id', id);
  btn.textContent = title || '点击按钮';
  document.body.appendChild(btn);
  return btn;
}
createImgLabel(nullSrc);
createImgLabel(qiyeSrc);

createTextLable(textSrc);
createImgLabel(jsSrc);

createFontLabel('&#xe655;');

const addButton = createButton('点击加法', 'btn1');
addButton.addEventListener(
  'click',
  () => {
    //这里就是相当于懒加载，只有执行点击事件的时候才会从浏览器请求资源
    /* 魔法注释webpackChunkName: 'addFromMath' 定义这个懒加载模块的名字*/
    //webpackPrefetch: true 定义这个模块是预加载模块会在浏览器空闲的时候加载资源 很优秀
    import(
      /* webpackChunkName: 'addFromMath', webpackPrefetch: true */ './math'
    ).then(({ add }) => {
      console.log(add(3, 6));
    });

    //webpackPreload: true跟懒加载类似 都是在网页执行操作的时候加载
    // import(/* webpackChunkName: 'addFromMath', webpackPreload: true */'./math').then(({add}) => {
    // 	console.log(add(3,6));
    // })
  },
  false
);

console.log(myNotes, '====myXml');
console.log(myCsv, '----myCsv');
console.log(myJson5, '==myJson5');

//这种代码如果在低版本的浏览器就会报错，所以我们需要转化es6代码
console.log(Array.from([1, 2], x => x * 2));

console.log(_.join(['what', 'else'], '-'));
