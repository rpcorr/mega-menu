'use strict';

const menuOverlay = document.querySelector('.menu-overlay');
const menu = document.querySelector('.menu');
const menuMain = menu.querySelector('.menu-main');
const goBack = menu.querySelector('.go-back');
const menuTrigger = document.querySelector('.mobile-menu-trigger');
const closeMenu = menu.querySelector('.mobile-menu-close');
const mobileMenuHead = menu.querySelector('.mobile-menu-head');
const menuMainListItems = document.querySelectorAll('.menu-main > li > a');

/* For Accessibility */
const megaMenuLinks = document.querySelectorAll('nav a[href^="#"]');

// add eventListener to all the a elements in the megaMenu
for (let i = 0; i < megaMenuLinks.length; i++) {
  megaMenuLinks[i].addEventListener('click', handleLinkClick);
}

let enableFirstLastTabStop = true;
let subMenu;

window.onload = function () {
  checkScreenSize();
};

window.onresize = function () {
  checkScreenSize();
};

menuMain.addEventListener('click', (e) => {
  if (!menu.classList.contains('active')) {
    return;
  }

  if (e.target.closest('.menu-item-has-children')) {
    const hasChildren = e.target.closest('.menu-item-has-children');
    showSubMenu(hasChildren);
  }
});

function checkScreenSize() {
  if (window.innerWidth > 991) {
    // larger screen

    // add menu items to tab order
    addTopMenItemsToTabOrder();

    if (menu.classList.contains('active')) {
      // toggle Menu
      toggleMenu();
    }
  } else {
    // small screen

    removeTopMenuItemsFromTabOrder();

    menuMain.addEventListener('keydown', (e) => {
      // if user is on main menu and clicks esc
      if (e.keyCode === 27 && !mobileMenuHead.classList.contains('active')) {
        // close menu
        menu.classList.remove('active');

        // remove top menu items from tab over
        removeTopMenuItemsFromTabOrder();

        // remove tabindex from close button
        closeMenu.removeAttribute('tabindex');

        // hide overlay
        menuOverlay.classList.remove('active');

        // put focus on mobile menu trigger
        menuTrigger.focus();
      }
    });

    goBack.addEventListener('click', () => {
      closeSubMenu();
    });

    goBack.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) closeSubMenu();
    });

    menuTrigger.addEventListener('click', () => {
      toggleMenu();
      if (menu.classList.contains('active')) {
        // add menu items to tab order
        addTopMenItemsToTabOrder();

        // give home menu the focus
        setTimeout(() => {
          document.querySelector('#home').focus();
        }, 10);
      }
    });

    menuTrigger.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        // add a tabindex to the close button
        closeMenu.setAttribute('tabindex', 0);

        toggleMenu();
        if (menu.classList.contains('active')) {
          // add menu items to tab order
          addTopMenItemsToTabOrder();

          // give home menu the focus
          setTimeout(() => {
            document.querySelector('#home').focus();
          }, 10);
        }
      }
    });

    closeMenu.addEventListener('click', () => {
      toggleMenu();

      // prevent users accessing the menu items when close
      removeTopMenuItemsFromTabOrder();

      // hide submenu
      hideSubMenu();

      // remove tabindex from Close Menu and Go Back buttons
      closeMenu.removeAttribute('tabindex');
      goBack.removeAttribute('tabindex');

      // remove active class from mobile menu head
      mobileMenuHead.classList.remove('active');

      // give menuTrigger the focus
      menuTrigger.focus();
    });

    closeMenu.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        toggleMenu();

        // prevent users accessing the menu items when close
        removeTopMenuItemsFromTabOrder();

        // hide submenu
        hideSubMenu();

        // remove tabindex from Close Menu and Go Back buttons
        closeMenu.removeAttribute('tabindex');
        goBack.removeAttribute('tabindex');

        // remove active class from mobile menu head
        mobileMenuHead.classList.remove('active');

        // give menuTrigger the focus
        menuTrigger.focus();
      }
    });

    document.querySelector('.menu-overlay').addEventListener('click', () => {
      toggleMenu();
    });
  }
}

function toggleMenu() {
  menu.classList.toggle('active');
  document.querySelector('.menu-overlay').classList.toggle('active');
  closeMenu.setAttribute('tabindex', 0);
}

function closeSubMenu() {
  // Ensure Go Back button is not reachable by the keyboard when hidden
  goBack.removeAttribute('tabindex');

  // give keyboard access to top level menu items
  addTopMenItemsToTabOrder();

  // if small screen then hideSubMenu too
  if (window.innerWidth < 991) hideSubMenu();

  //get  active main menu item element to set aria-expanded to false when go back is clicked
  const activeMainMenuElement = document.getElementById(
    lastFocusedElement.getAttribute('href').substring(1)
  );

  // give the last focused main menu item the focus
  setTimeout(() => {
    lastFocusedElement.focus();
  }, 10);
}

function showSubMenu(hasChildren) {
  subMenu = hasChildren.querySelector('.sub-menu');
  subMenu.classList.add('active');
  subMenu.style.animation = 'slideLeft 0.5s ease forwards';
  const menuTitle =
    hasChildren.querySelector('i').parentNode.childNodes[0].textContent;
  menu.querySelector('.current-menu-title').innerHTML = menuTitle;
  mobileMenuHead.classList.add('active');
  // when sub menu is visible ensure main menu item are not reachable
  removeTopMenuItemsFromTabOrder();
  // make the go back button accessible from the keyboard
  goBack.setAttribute('tabindex', 0);
}

function hideSubMenu() {
  //  get  active main menu item element to set aria-expanded to false when close is clicked
  const activeMainMenuElement = document.getElementById(
    lastFocusedElement.getAttribute('href').substring(1)
  );

  activeMainMenuElement.setAttribute('aria-expanded', 'false');

  subMenu.style.animation = 'slideRight 0.5s ease forwards';
  setTimeout(() => {
    subMenu.classList.remove('active');
  }, 300);

  menu.querySelector('.current-menu-title').innerHTML = '';
  mobileMenuHead.classList.remove('active');
}

function addTopMenItemsToTabOrder() {
  // add menu items to tab order
  menuMainListItems.forEach((listItem) => {
    listItem.removeAttribute('tabindex');
  });
}

function removeTopMenuItemsFromTabOrder() {
  // remove menu items from tab order
  menuMainListItems.forEach((listItem) => {
    listItem.setAttribute('tabindex', -1);
  });
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

  if (enableFirstLastTabStop) {
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
  }

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

      if (enableFirstLastTabStop) {
        setTimeout(() => {
          firstTabStop.focus();
        }, 2000);
      }
    }
  }

  if (e.keyCode === 9 && e.shiftKey) {
    // the user is trying to nagivate backwards
    if (document.activeElement === firstTabStop) {
      e.preventDefault();

      if (enableFirstLastTabStop) {
        setTimeout(() => {
          lastTabStop.focus();
        }, 2000);
      }
    }
  }

  if (e.keyCode === 27) {
    // close mobile menu
    closeSubMenu();

    // give sub menu parent element the focus
    setTimeout(() => {
      lastFocusedElement.focus();
    }, 10);
  }
}

var lastFocusedElement;
var firstTabStop;
var lastTabStop;
