import _ from 'lodash';

function Header(str) {
  const combineStr = _.join(['hello guys', 'welcome to my home', str], '🐈');
  const div = document.createElement('div');
  div.innerHTML = combineStr;
  return div;
}

export default Header;
