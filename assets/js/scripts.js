'use strict';

const menu = document.querySelector('.menu');
const menuMain = menu.querySelector('.menu-main');
const goBack = menu.querySelector('.go-back');
const menuTrigger = document.querySelector('.mobile-menu-trigger');
const closeMenu = menu.querySelector('.mobile-menu-close');

let subMenu;

menuMain.addEventListener('click', (e) => {
  if (!menu.classList.contains('active')) {
    return;
  }

  if (e.target.closest('.menu-item-has-children')) {
    const hasChildren = e.target.closest('.menu-item-has-children');
    showSubMenu(hasChildren);
  }
});

goBack.addEventListener('click', () => {
  hideSubMenu();
});

menuTrigger.addEventListener('click', () => {
  toggleMenu();
});

menuTrigger.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    toggleMenu();
    document.querySelector('#home').focus();
  }
});

closeMenu.addEventListener('click', () => {
  toggleMenu();
});

document.querySelector('.menu-overlay').addEventListener('click', () => {
  toggleMenu();
});

function toggleMenu() {
  menu.classList.toggle('active');
  document.querySelector('.menu-overlay').classList.toggle('active');
}

function showSubMenu(hasChildren) {
  subMenu = hasChildren.querySelector('.sub-menu');
  subMenu.classList.add('active');
  subMenu.style.animation = 'slideLeft 0.5s ease forwards';
  const menuTitle =
    hasChildren.querySelector('i').parentNode.childNodes[0].textContent;
  menu.querySelector('.current-menu-title').innerHTML = menuTitle;
  menu.querySelector('.mobile-menu-head').classList.add('active');
}

function hideSubMenu() {
  subMenu.style.animation = 'slideRight 0.5s ease forwards';
  setTimeout(() => {
    subMenu.classList.remove('active');
  }, 300);

  menu.querySelector('.current-menu-title').innerHTML = '';
  menu.querySelector('.mobile-menu-head').classList.remove('active');
}

window.onresize = function () {
  if (this.innerWidth > 991) {
    if (menu.classList.contains('active')) {
      toggleMenu();
    }
  }
};

/* Accessibility */
var megaMenuLinks = document.querySelectorAll('nav a[href^="#"]');

// add eventListener to all the a element in the megaMenu
for (let i = 0; i < megaMenuLinks.length; i++) {
  megaMenuLinks[i].addEventListener('click', handleLinkClick);
}

function handleLinkClick(e) {
  e.preventDefault();
  var target = document.querySelector(`${e.target.getAttribute('href')}`);

  // toggle aria-expanded attribute - this determines if the sub menu is appearing or not
  if (target.getAttribute('aria-expanded') === 'true') {
    target.setAttribute('aria-expanded', 'false');
  } else {
    target.setAttribute('aria-expanded', 'true');
  }

  // store top menu item to give focus later when user closes the sub menu
  lastFocusedElement = document.activeElement;

  // get the first and last sub menu items to keep users looping through the sub menu items
  // all the while the sub menu is open
  var focusableElements = target.querySelectorAll('a');
  firstTabStop = focusableElements[0];
  lastTabStop = focusableElements[focusableElements.length - 1];

  // add a timeout for the focus to work
  setTimeout(() => {
    firstTabStop.focus();
  }, 10);

  // add a keyup eventListener for all links
  var targets = target.querySelectorAll('a');
  for (var i = 0; i < targets.length; i++) {
    targets[i].addEventListener('keyup', handleKeypress);
  }
}

function handleKeypress(e) {
  if (e.keyCode === 9 && !e.shiftKey) {
    // the user is trying to nagivate forward
    if (document.activeElement === lastTabStop) {
      e.preventDefault();

      //setTimeout(() => {
      firstTabStop.focus();
      //}, 2000);
    }
  }

  if (e.keyCode === 9 && e.shiftKey) {
    // the user is trying to nagivate backwards
    if (document.activeElement === firstTabStop) {
      e.preventDefault();
      setTimeout(() => {
        lastTabStop.focus();
      }, 2000);
    }
  }

  if (e.keyCode === 27) {
    // get the sub menu parent element
    const currentTopMenuItem =
      document.activeElement.parentElement.closest('.list-item').parentElement;

    // add aria-expaneded = false
    currentTopMenuItem.setAttribute('aria-expanded', 'false');

    // give sub menu parent element the focus
    setTimeout(() => {
      lastFocusedElement.focus();
    }, 10);
  }
}

var lastFocusedElement;
var firstTabStop;
var lastTabStop;
