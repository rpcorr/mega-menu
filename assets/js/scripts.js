'use strict';

// set global constants
const logoLink = document.querySelector('.logo > a');
const menuOverlay = document.querySelector('.menu-overlay');
const menu = document.querySelector('.menu');
const menuMain = menu.querySelector('.menu-main');
const menuPriority = document.querySelector('.menu-priority');
const goBack = menu.querySelector('.go-back');
const menuTrigger = document.querySelector('.mobile-menu-trigger');
const closeMenuBtn = menu.querySelector('.mobile-menu-close');
const mobileMenuHead = menu.querySelector('.mobile-menu-head');
const menuMainListItems = document.querySelectorAll('.menu-main > li > a');

///
const contactLink = '#contactLink';
const blogLink = '#blogLink';
const packagesLink = '#packagesLink';
const popularLink = '#popularLink';
const homeID = '#home';

///

/* For Accessibility */
const megaMenuLinks = document.querySelectorAll('nav a[href^="#"]');

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
  if (getScreenSize() > 825) {
    // large screens

    if (e.target.closest('.menu-item-has-children')) {
      handleLinkClick(e);
    }
  } else {
    // small screens (mobile menu)

    if (e.target.closest('.menu-item-has-children')) {
      const hasChildren = e.target.closest('.menu-item-has-children');
      showSubMenu(hasChildren);
    }
  }
});

menuPriority.addEventListener('click', (e) => {
  handleLinkClick(e);
});

var lastFocusedElement;
var firstTabStop;
var lastTabStop;

/// FUNCTIONS ARE BELOW

function checkIfMenuIsOpen() {
  toggleMenu();
  if (menu.classList.contains('active')) {
    logoLink.setAttribute('tabindex', -1);
    menuTrigger.setAttribute('tabindex', -1);

    // set the top menu items tab order status
    topMenuItemsTabOrderStatus();
  }
}

function checkScreenSize() {
  if (window.innerWidth > 825) {
    // larger screen

    // add menu items to tab order
    topMenuItemsTabOrderStatus();

    if (menu.classList.contains('active')) {
      // toggle Menu
      toggleMenu();
    }
  } else {
    // small screen

    // remove main menu items from tab order based on screen size
    if (window.innerWidth <= 825 && window.innerWidth > 751) {
      // contact is hidden
      document.querySelector(contactLink).setAttribute('tabindex', '-1');
    }

    if (window.innerWidth <= 750 && window.innerWidth >= 681) {
      // contact and blog are hidden'
      document.querySelector(contactLink).setAttribute('tabindex', '-1');
      document.querySelector(blogLink).setAttribute('tabindex', '-1');
    }

    if (window.innerWidth <= 680 && window.innerWidth > 625) {
      // contact, blog, and packages are hidden
      document.querySelector(contactLink).setAttribute('tabindex', '-1');
      document.querySelector(blogLink).setAttribute('tabindex', '-1');
      document.querySelector(packagesLink).setAttribute('tabindex', '-1');
    }

    if (window.innerWidth <= 625 && window.innerWidth > 550) {
      // contact, blog, packages, popular are hidden
      document.querySelector(contactLink).setAttribute('tabindex', '-1');
      document.querySelector(blogLink).setAttribute('tabindex', '-1');
      document.querySelector(packagesLink).setAttribute('tabindex', '-1');
      document.querySelector(popularLink).setAttribute('tabindex', '-1');
    }

    if (window.innerWidth <= 550) {
      // contact, blog, packages, popular, and home are hidden
      document.querySelector(contactLink).setAttribute('tabindex', '-1');
      document.querySelector(blogLink).setAttribute('tabindex', '-1');
      document.querySelector(packagesLink).setAttribute('tabindex', '-1');
      document.querySelector(popularLink).setAttribute('tabindex', '-1');
      document.querySelector(homeID).setAttribute('tabindex', '-1');
    }

    menuMain.addEventListener('keydown', (e) => {
      // if user is on main menu and clicks esc
      if (e.keyCode === 27 && !mobileMenuHead.classList.contains('active')) {
        // close menu
        menu.classList.remove('active');

        // remove top menu items from tab order
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

function closeMenu() {
  toggleMenu();

  // set menu trigger tabindex to 0
  menuTrigger.setAttribute('tabindex', 0);

  // remove logoLink tabindex attribute
  logoLink.removeAttribute('tabindex');

  // determine which small menu links links tabindex attribute is removed for small screens

  if (window.innerWidth <= 825 && window.innerWidth > 751) {
    // contact menu is hidden
    document.querySelector(`${homeID}LinkSm`).removeAttribute('tabindex');
    document.querySelector(`${popularLink}Sm`).removeAttribute('tabindex');
    document.querySelector(`${packagesLink}Sm`).removeAttribute('tabindex');
    document.querySelector(`${blogLink}Sm`).removeAttribute('tabindex');
    document.querySelector(contactLink).setAttribute('tabindex', '-1');
  }

  if (window.innerWidth <= 750 && window.innerWidth >= 681) {
    // contact, blog menu are hidden
    document.querySelector(`${homeID}LinkSm`).removeAttribute('tabindex');
    document.querySelector(`${popularLink}Sm`).removeAttribute('tabindex');
    document.querySelector(`${packagesLink}Sm`).removeAttribute('tabindex');
    document.querySelector(blogLink).setAttribute('tabindex', '-1');
    document.querySelector(contactLink).setAttribute('tabindex', '-1');
  }

  if (window.innerWidth <= 680 && window.innerWidth > 625) {
    // contact, blog, packages menu are hidden
    document.querySelector(`${homeID}LinkSm`).removeAttribute('tabindex');
    document.querySelector(`${popularLink}Sm`).removeAttribute('tabindex');
    document.querySelector(packagesLink).setAttribute('tabindex', '-1');
    document.querySelector(blogLink).setAttribute('tabindex', '-1');
    document.querySelector(contactLink).setAttribute('tabindex', '-1');
  }

  if (window.innerWidth <= 625 && window.innerWidth > 550) {
    // contact, blog, packages, popular menu are hidden
    document.querySelector(`${homeID}LinkSm`).removeAttribute('tabindex');
    document.querySelector(popularLink).setAttribute('tabindex', '-1');
    document.querySelector(packagesLink).setAttribute('tabindex', '-1');
    document.querySelector(blogLink).setAttribute('tabindex', '-1');
    document.querySelector(contactLink).setAttribute('tabindex', '-1');
  }

  if (window.innerWidth <= 550) {
    // home contact, blog, packages, popular menu are hidden
    document.querySelector(homeID).setAttribute('tabindex', '-1');
    document.querySelector(popularLink).setAttribute('tabindex', '-1');
    document.querySelector(packagesLink).setAttribute('tabindex', '-1');
    document.querySelector(blogLink).setAttribute('tabindex', '-1');
    document.querySelector(contactLink).setAttribute('tabindex', '-1');
  }

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
  topMenuItemsTabOrderStatus();

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

function getScreenSize() {
  return screen.width;
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
  const target = document.querySelector(`${e.target.getAttribute('href')}`);
  let parentMenuText = '';

  // toggle aria-expanded attribute - this determines if the sub menu is appearing or not
  if (target.getAttribute('aria-expanded') === 'true') {
    // assign text when sub menu is open
    parentMenuText = target.parentElement.innerText.split(' ')[0];

    target.setAttribute('aria-expanded', 'false');
    e.target.setAttribute(
      'aria-label',
      `${parentMenuText} has a sub menu. Click enter to open.`
    );
  } else {
    // assign text when sub menu is closed
    parentMenuText = target.parentElement.innerText;

    target.setAttribute('aria-expanded', 'true');
    e.target.setAttribute(
      'aria-label',
      `Click enter to close ${parentMenuText} sub menu`
    );
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

function topMenuItemsTabOrderStatus() {
  // remove tab index base on status
  if (window.innerWidth <= 825 && window.innerWidth > 751) {
    // contact is keyboard accessible
    document.querySelector(contactLink).removeAttribute('tabindex');

    if (menu.classList.contains('active')) {
      // side panel is open remove priory menu items from tab order
      document.querySelector(`${homeID}LinkSm`).setAttribute('tabindex', '-1');
      document.querySelector(`${popularLink}Sm`).setAttribute('tabindex', '-1');
      document
        .querySelector(`${packagesLink}Sm`)
        .setAttribute('tabindex', '-1');
      document.querySelector(`${blogLink}Sm`).setAttribute('tabindex', '-1');
    }

    document.querySelector(contactLink).focus();
  }

  if (window.innerWidth <= 750 && window.innerWidth >= 681) {
    // contact and blog are keyboard accessible
    document.querySelector(contactLink).removeAttribute('tabindex');
    document.querySelector(blogLink).removeAttribute('tabindex');

    if (menu.classList.contains('active')) {
      // side panel is open remove priory menu items from tab order
      document.querySelector(`${homeID}LinkSm`).setAttribute('tabindex', '-1');
      document.querySelector(`${popularLink}Sm`).setAttribute('tabindex', '-1');
      document
        .querySelector(`${packagesLink}Sm`)
        .setAttribute('tabindex', '-1');
    }

    document.querySelector(blogLink).focus();
  }

  if (window.innerWidth <= 680 && window.innerWidth > 625) {
    // contact, blog, and packages are keyboard accessible
    document.querySelector(contactLink).removeAttribute('tabindex');
    document.querySelector(blogLink).removeAttribute('tabindex');
    document.querySelector(packagesLink).removeAttribute('tabindex');

    if (menu.classList.contains('active')) {
      // side panel is open remove priory menu items from tab order
      document.querySelector(`${homeID}LinkSm`).setAttribute('tabindex', '-1');
      document.querySelector(`${popularLink}Sm`).setAttribute('tabindex', '-1');
    }

    document.querySelector(packagesLink).focus();
  }

  if (window.innerWidth <= 625 && window.innerWidth > 550) {
    // contact, blog, packages, popular are keyboard accessible
    document.querySelector(contactLink).removeAttribute('tabindex');
    document.querySelector(blogLink).removeAttribute('tabindex');
    document.querySelector(packagesLink).removeAttribute('tabindex');
    document.querySelector(popularLink).removeAttribute('tabindex');

    if (menu.classList.contains('active')) {
      // side panel is open remove priory menu items from tab order
      document.querySelector(`${homeID}LinkSm`).setAttribute('tabindex', '-1');
    }

    document.querySelector(popularLink).focus();
  }

  if (window.innerWidth <= 550) {
    // contact, blog, packages, popular, and home are keyboard accessible
    document.querySelector(contactLink).removeAttribute('tabindex');
    document.querySelector(blogLink).removeAttribute('tabindex');
    document.querySelector(packagesLink).removeAttribute('tabindex');
    document.querySelector(popularLink).removeAttribute('tabindex');
    document.querySelector(homeID).removeAttribute('tabindex');
    document.querySelector(homeID).focus();
  }
}
