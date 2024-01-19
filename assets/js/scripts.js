'use strict';

const logoLink = document.querySelector('.logo > a');
const menuOverlay = document.querySelector('.menu-overlay');
const menu = document.querySelector('.menu');
const menuMain = menu.querySelector('.menu-main');
const goBack = menu.querySelector('.go-back');
const menuTrigger = document.querySelector('.mobile-menu-trigger');
const closeMenuBtn = menu.querySelector('.mobile-menu-close');
const mobileMenuHead = menu.querySelector('.mobile-menu-head');
const menuMainListItems = document.querySelectorAll('.menu-main > li > a');

// read in the Menu JSON file
let count = 0;
let output = '';
let outputLg = '';
let outputSm = '';
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    // Typical action to be performed when the document is ready:

    let response = JSON.parse(xhttp.responseText);

    response.menuItems.forEach((mI) => {
      outputLg = menuLarge(mI);
    });

    // reset output variable
    output = '';

    response.menuItems.forEach((mI) => {
      outputSm = menuSmall(mI);
    });

    document.getElementsByClassName('menu-main')[0].innerHTML = outputLg;
    document.getElementsByClassName('menu-priority')[0].innerHTML = outputSm;
  }
};
xhttp.open('GET', 'assets/json/menu.json', true);
xhttp.send();

function menuLarge(mI) {
  let curLiId = mI.liId !== '' ? `id="${mI.liId}"` : '';
  let curLiClass = mI.liClass !== '' ? `class="${mI.liClass}"` : '';
  let downArrow =
    mI.liClass === 'menu-item-has-children'
      ? '<i class="fas fa-angle-down"></i>'
      : '';
  let linkAriaLabel =
    mI.liClass === 'menu-item-has-children'
      ? `aria-label="${mI.name} has a sub menu. Click 'enter' to open"`
      : '';

  output += `<li ${curLiId} ${curLiClass}><a href="${mI.link}" id="${mI.aLinkId}" ${linkAriaLabel}>${mI.name} ${downArrow}</a>`;

  let subMenuContainer = '';

  if (mI.subMenuItems && mI.subMenuType === 'photoLinks') {
    subMenuContainer = `
        <div id="${mI.link.substring(
          1
        )}" class="sub-menu mega-menu mega-menu-column-4" aria-expanded="false">`;

    mI.subMenuItems.forEach((_, i) => {
      let subMenuContainerContent = `
                  <div class="list-item text-center">
                    <a href="${mI.subMenuItems[i].link}">
                      <img
                        src="assets/imgs/${mI.subMenuItems[i].imgSrc}.jpg"
                        alt="${mI.subMenuItems[i].title}"
                      />
                      <h4 class="title">${mI.subMenuItems[i].title}</h4>
                    </a>
                  </div>
                `;
      subMenuContainer += subMenuContainerContent;
    });
  }

  if (mI.subMenuItems && mI.subMenuType === 'categorizedLinks') {
    subMenuContainer = `<div id="${mI.link.substring(
      1
    )}" class="sub-menu mega-menu mega-menu-column-4" aria-expanded="false">`;

    let subMenuContainerContent = '';

    mI.subMenuItems.forEach((_, i) => {
      let subMenuContainerInnerContent = '';

      if (mI.subMenuItems[i].contentType === 'text') {
        if (i === 0 || i === 2 || i === 4)
          subMenuContainerInnerContent += `<div class="list-item">`;

        subMenuContainerInnerContent += `<h4 class="title" id="${mI.subMenuItems[i].titleId}">${mI.subMenuItems[i].title}</h4>`;

        let listItemValues = '<ul>';
        mI.subMenuItems[i].links.forEach((_, j) => {
          listItemValues += `<li><a href="${mI.subMenuItems[i].links[j].link}"><span aria-labelledby="${mI.subMenuItems[i].titleId}"></span>${mI.subMenuItems[i].links[j].name}</a></li>`;
        });
        listItemValues += '</ul>';

        subMenuContainerInnerContent += `${listItemValues}`;

        if (i === 1 || i === 3 || i === 4)
          subMenuContainerInnerContent += '</div>';
      }

      if (mI.subMenuItems[i].contentType === 'photo') {
        subMenuContainerInnerContent += '<div class="list-item">';

        let columnValue = `<img src="assets/imgs/${mI.subMenuItems[i].imgSrc}.jpg" alt="${mI.subMenuItems[i].title}" />`;

        subMenuContainerInnerContent += `${columnValue}</div>`;
      }
      subMenuContainerContent += `${subMenuContainerInnerContent}`;
    });

    subMenuContainer += subMenuContainerContent + `</div>`;
  }

  if (mI.subMenuItems && mI.subMenuType === 'singleColumn') {
    subMenuContainer = `<div
    id="${mI.link.substring(
      1
    )}" class="sub-menu single-column-menu" aria-expanded="false">`;

    let subMenuContainerContent = '<ul>';

    mI.subMenuItems.forEach((_, i) => {
      subMenuContainerContent += `<li><a href="${mI.subMenuItems[i].link}">${mI.subMenuItems[i].name}</a><a/li>`;
    });

    subMenuContainer += `${subMenuContainerContent}</ul></div>`;
  }

  output += subMenuContainer + '</li>';
  return output;
}

function menuSmall(mI) {
  //let curLiId = mI.liId !== '' ? `id="${mI.liId}"` : '';
  let curLiClass = mI.liClass !== '' ? `class="${mI.liClass}"` : '';
  let downArrow =
    mI.liClass === 'menu-item-has-children'
      ? '<i class="fas fa-angle-down"></i>'
      : '';
  let linkAriaLabel =
    mI.liClass === 'menu-item-has-children'
      ? `aria-label="${mI.name} has a sub menu. Click 'enter' to open"`
      : '';

  output += `<li ${curLiClass}><a ${
    mI.name === 'Home' ? 'id = "homeLinkSm"' : ''
  } href="${mI.link}${
    mI.liClass === 'menu-item-has-children' ? 'Sm' : ''
  }" id="${mI.aLinkId}${
    mI.liClass === 'menu-item-has-children' ? 'Sm' : ''
  }" ${linkAriaLabel}>${mI.name} ${downArrow}</a>`;

  let subMenuContainer = '';

  if (mI.subMenuItems && mI.subMenuType === 'photoLinks') {
    subMenuContainer = `
        <div id="${mI.link.substring(
          1
        )}Sm" class="sub-menu mega-menu mega-menu-column-4" aria-expanded="false">`;

    mI.subMenuItems.forEach((_, i) => {
      let subMenuContainerContent = `
                  <div class="list-item text-center">
                    <a href="${mI.subMenuItems[i].link}Sm">
                      <img
                        src="assets/imgs/${mI.subMenuItems[i].imgSrc}.jpg"
                        alt="${mI.subMenuItems[i].title}"
                      />
                      <h4 class="title">${mI.subMenuItems[i].title}</h4>
                    </a>
                  </div>
                `;
      subMenuContainer += subMenuContainerContent;
    });
  }

  if (mI.subMenuItems && mI.subMenuType === 'categorizedLinks') {
    subMenuContainer = `<div id="${mI.link.substring(
      1
    )}Sm" class="sub-menu mega-menu mega-menu-column-2" aria-expanded="false">`;

    let subMenuContainerContent = '';

    mI.subMenuItems.forEach((_, i) => {
      let subMenuContainerInnerContent = '';

      if (mI.subMenuItems[i].contentType === 'text') {
        if (i === 0 || i === 3)
          subMenuContainerInnerContent += `<div class="list-item">`;

        subMenuContainerInnerContent += `<h4 class="title" id="${mI.subMenuItems[i].titleId}">${mI.subMenuItems[i].title}</h4>`;

        let listItemValues = '<ul>';
        mI.subMenuItems[i].links.forEach((_, j) => {
          listItemValues += `<li><a href="${mI.subMenuItems[i].links[j].link}"><span aria-labelledby="${mI.subMenuItems[i].titleId}"></span>${mI.subMenuItems[i].links[j].name}</a></li>`;
        });
        listItemValues += '</ul>';

        subMenuContainerInnerContent += `${listItemValues}`;

        if (i === 2 || i === 4) subMenuContainerInnerContent += '</div>';
      }

      subMenuContainerContent += `${subMenuContainerInnerContent}`;
    });

    subMenuContainer += subMenuContainerContent + `</div>`;
  }

  if (mI.subMenuItems && mI.subMenuType === 'singleColumn') {
    subMenuContainer = `<div
    id="${mI.link.substring(
      1
    )}Sm" class="sub-menu single-column-menu" aria-expanded="false">`;

    let subMenuContainerContent = '<ul>';

    mI.subMenuItems.forEach((_, i) => {
      subMenuContainerContent += `<li><a href="${mI.subMenuItems[i].link}">${mI.subMenuItems[i].name}</a><a/li>`;
    });

    subMenuContainer += `${subMenuContainerContent}</ul></div>`;
  }

  output += subMenuContainer + '</li>';

  return output;
}

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

// Determine if it is the desktop menu or mobile menu
menuMain.addEventListener('click', (e) => {
  // desktop view
  if (!menu.classList.contains('active')) {
    return;
  }

  // mobile view
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

        // remove tabindex from close menu button
        closeMenuBtn.removeAttribute('tabindex');

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
      checkIfMenuIsOpen();
    });

    menuTrigger.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        // add a tabindex to the close menu button
        closeMenuBtn.setAttribute('tabindex', 0);

        checkIfMenuIsOpen();
      }
    });

    closeMenuBtn.addEventListener('click', () => {
      closeMenu();
    });

    closeMenuBtn.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) closeMenu();
    });

    document.querySelector('.menu-overlay').addEventListener('click', () => {
      toggleMenu();
    });
  }
}

function getScreenSize() {
  return screen.width;
}

function addTopMenItemsToTabOrder() {
  // add menu items to tab order
  menuMainListItems.forEach((listItem) => {
    listItem.removeAttribute('tabindex');
  });
}

function checkIfMenuIsOpen() {
  toggleMenu();
  if (menu.classList.contains('active')) {
    logoLink.setAttribute('tabindex', -1);
    menuTrigger.setAttribute('tabindex', -1);

    // add menu items to tab order
    addTopMenItemsToTabOrder();

    if (getScreenSize() <= 825 && getScreenSize() > 750) {
      console.log('here');
      document.querySelector('#contactLink').focus();
      document.querySelector('#homeLinkSm').setAttribute('tabindex', '-1');
      document.querySelector('#popularLinkSm').setAttribute('tabindex', '-1');
      document.querySelector('#packagesLinkSm').setAttribute('tabindex', '-1');
      document.querySelector('#blogLinkSm').setAttribute('tabindex', '-1');
    } else if (getScreenSize() <= 750 && getScreenSize() > 680) {
      document.querySelector('#homeLinkSm').setAttribute('tabindex', '-1');
      document.querySelector('#popularLinkSm').setAttribute('tabindex', '-1');
      document.querySelector('#packagesLinkSm').setAttribute('tabindex', '-1');
      setTimeout(() => {
        document.querySelector('#blogLink').focus();
      }, 10);
    } else if (getScreenSize() <= 680 && getScreenSize() > 625) {
      document.querySelector('#homeLinkSm').setAttribute('tabindex', '-1');
      document.querySelector('#popularLinkSm').setAttribute('tabindex', '-1');
      setTimeout(() => {
        document.querySelector('#packagesLink').focus();
      }, 10);
    } else if (getScreenSize() <= 625 && getScreenSize() > 550) {
      document.querySelector('#homeLinkSm').setAttribute('tabindex', '-1');
      setTimeout(() => {
        document.querySelector('#popularLink').focus();
      }, 10);
    } else {
      // give home menu the focus
      setTimeout(() => {
        document.querySelector('#home').focus();
      }, 10);
    }
  }
}

function closeMenu() {
  toggleMenu();

  // set menu trigger tabindex to 0
  menuTrigger.setAttribute('tabindex', 0);

  // remove logoLink tabindex attribute
  logoLink.removeAttribute('tabindex');

  // determine which small menu links links tabindex attribute is removed for small screens
  if (getScreenSize() <= 825 && getScreenSize() > 750) {
    document.querySelector('#homeLinkSm').removeAttribute('tabindex');
    document.querySelector('#popularLinkSm').removeAttribute('tabindex');
    document.querySelector('#packagesLinkSm').removeAttribute('tabindex');
    document.querySelector('#blogLinkSm').removeAttribute('tabindex');
  } else if (getScreenSize() <= 750 && getScreenSize() > 680) {
    document.querySelector('#homeLinkSm').removeAttribute('tabindex');
    document.querySelector('#popularLinkSm').removeAttribute('tabindex');
    document.querySelector('#packagesLinkSm').removeAttribute('tabindex');
  } else if (getScreenSize() <= 680 && getScreenSize() > 625) {
    document.querySelector('#homeLinkSm').removeAttribute('tabindex');
    document.querySelector('#popularLinkSm').removeAttribute('tabindex');
  } else if (getScreenSize() <= 625 && getScreenSize() > 550) {
    document.querySelector('#homeLinkSm').removeAttribute('tabindex');
  }

  // prevent users accessing the menu items when close
  removeTopMenuItemsFromTabOrder();

  // hide secondary menu
  hideSecondaryMenu();

  // remove tabindex from Close Menu and Go Back buttons
  closeMenuBtn.removeAttribute('tabindex');
  goBack.removeAttribute('tabindex');

  // remove active class from mobile menu head
  mobileMenuHead.classList.remove('active');

  setLinksAriaLabelsToOpenSubMenu();

  // give menuTrigger the focus
  menuTrigger.focus();
}

function closeSubMenu() {
  // Ensure Go Back button is not reachable by the keyboard when hidden
  goBack.removeAttribute('tabindex');

  // give keyboard access to top level menu items
  addTopMenItemsToTabOrder();

  // if small screen then hideSecondaryMenu too
  if (window.innerWidth < 991) hideSecondaryMenu();

  //get  active main menu item element to set aria-expanded to false when go back is clicked
  if (lastFocusedElement.hasAttribute('href')) {
    const activeMainMenuElement = document.getElementById(
      lastFocusedElement.getAttribute('href').substring(1)
    );
  }

  // set links aria labels to "open sub menu"
  setLinksAriaLabelsToOpenSubMenu();

  // give the last focused main menu item the focus
  setTimeout(() => {
    lastFocusedElement.focus();
  }, 10);
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

function handleLinkClick(e) {
  e.preventDefault();
  var target = document.querySelector(`${e.target.getAttribute('href')}`);

  // toggle aria-expanded attribute - this determines if the sub menu is appearing or not
  if (target.getAttribute('aria-expanded') === 'true') {
    target.setAttribute('aria-expanded', 'false');
    e.target.setAttribute('aria-label', 'Click enter to open sub menu');
  } else {
    target.setAttribute('aria-expanded', 'true');
    e.target.setAttribute('aria-label', 'Click enter to close sub menu');
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

function hideSecondaryMenu() {
  if (mobileMenuHead.classList.contains('active')) {
    //  get  active main menu item element to set aria-expanded to false when close is clicked

    lastFocusedElement = document.activeElement;

    if (lastFocusedElement.hasAttribute('href')) {
      const activeMainMenuElement = document.getElementById(
        lastFocusedElement.getAttribute('href').substring(1)
      );
      activeMainMenuElement.setAttribute('aria-expanded', 'false');
    }

    subMenu.style.animation = 'slideRight 0.5s ease forwards';
    setTimeout(() => {
      subMenu.classList.remove('active');
    }, 300);

    menu.querySelector('.current-menu-title').innerHTML = '';
    mobileMenuHead.classList.remove('active');
  }
}

function removeTopMenuItemsFromTabOrder() {
  // remove menu items from tab order
  menuMainListItems.forEach((listItem) => {
    listItem.setAttribute('tabindex', -1);
  });
}

function setLinksAriaLabelsToOpenSubMenu() {
  // get all links that has a sub menu
  const menuItemsWithSubMenu = document.querySelectorAll(
    '.menu-item-has-children > a'
  );

  // set each menuItemsWithSubMenu aria label to Click 'enter' to open
  for (let i = 0; i < menuItemsWithSubMenu.length; i++) {
    menuItemsWithSubMenu[i].setAttribute(
      'aria-label',
      `${menuItemsWithSubMenu[i].text} has a sub menu. Click 'enter' to open`
    );
  }
}

function showSubMenu(hasChildren) {
  if (hasChildren.hasAttribute('id') && hasChildren.id === 'blogMenu')
    document.getElementById('blog').setAttribute('aria-expanded', 'true');

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

function toggleMenu() {
  menu.classList.toggle('active');
  document.querySelector('.menu-overlay').classList.toggle('active');
  closeMenuBtn.setAttribute('tabindex', 0);
}

var lastFocusedElement;
var firstTabStop;
var lastTabStop;
