import _ from 'lodash';
import nullSrc from './assets/imgs/null.png';
import qiyeSrc from './assets/imgs/qiye.svg';
import textSrc from './assets/file/test.txt';
import jsSrc from './assets/imgs/js.jpeg';
import myCsv from './assets/file/test02.csv';
import myNotes from './assets/file/note.xml';
import myJson5 from './assets/file/test03.json5';
import './async-module.js';
import './test.js';
import $ from 'jquery';
import './assets/style/app.global.css';
import cssStyles from './assets/style/css_module.css';

function createImgLabel(src) {
  const img = document.createElement('img');
  img.src = src;
  document.body.appendChild(img);
}

function createTextLable(
  resource,
  cssText = 'background: #f99; width: 200px; height: 200px;',
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
    // 这里就是相当于懒加载，只有执行点击事件的时候才会从浏览器请求资源
    /* 魔法注释webpackChunkName: 'addFromMath' 定义这个懒加载模块的名字 */
    // webpackPrefetch: true 定义这个模块是预加载模块会在浏览器空闲的时候加载资源 很优秀
    import(
      /* webpackChunkName: 'addFromMath', webpackPrefetch: true */ './math'
    ).then(({ add }) => {
      console.log(add(3, 6));
    });

    // webpackPreload: true跟懒加载类似 都是在网页执行操作的时候加载
    // import(/* webpackChunkName: 'addFromMath', webpackPreload: true */'./math').then(({add}) => {
    // console.log(add(3,6));
    // })
  },
  false,
);

console.log(myNotes, '====myXml');
console.log(myCsv, '----myCsv');
console.log(myJson5, '==myJson5');

// 这种代码如果在低版本的浏览器就会报错，所以我们需要转化es6代码
console.log(Array.from([1, 2], (x) => x * 2));

console.log(_.join(['what', 'else'], '-'));

const addDivBtn = createButton('点击增加div', 'btn2');
console.log(addDivBtn, ']==addDivBtn');
addDivBtn.addEventListener(
  'click',
  () => {
    const div = document.createElement('div');
    div.classList.add('square');
    document.body.appendChild(div);
  },
  false,
);

console.log($, '====$');

const textDiv = document.createElement('div');
textDiv.classList.add(cssStyles.box);
textDiv.innerHTML = 'hello css module';
document.body.appendChild(textDiv);

if (module.hot) {
  console.log('hello ppppppp');
  module.hot.accept('./test.js', () => {
    /**/
  });
}

// 检测浏览器是否支持service-worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log(`SW:注册成功${registration}`);
      })
      .catch((registrationError) => {
        console.log(`SW:注册失败${registrationError}`);
      });
  });
}
