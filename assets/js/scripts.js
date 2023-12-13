'use strict';

const menu = document.querySelector('.menu');
const menuMain = document.querySelector('.menu-main');

let subMenu;

menuMain.addEventListener('click', (e) => {
  if (e.target.closest('.menu-item-has-children')) {
    const hasChildren = e.target.closest('.menu-item-has-children');
    showSubMenu(hasChildren);
  }
});

function showSubMenu(hasChildren) {
  subMenu = hasChildren.querySelector('.sub-menu');
  subMenu.classList.add('active');
  subMenu.style.animation = 'slideLeft 0.5s ease forwards';
  const menuTitle =
    hasChildren.querySelector('i').parentNode.childNodes[0].textContent;
  menu.querySelector('.current-menu-title').innerHTML = menuTitle;
  menu.querySelector('.mobile-menu-head').classList.add('active');
}
