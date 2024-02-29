'use strict';
/* flexbox priority navigation */

// global variables
let navItems = [];
const navItemWidth = [];
const navItemVisible = [];
let moreWidth = 0;
let winWidth = 0;
let output = '';
let megaMenuLinks = '';

$(document).ready(function () {
  // read in the Menu JSON file
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Typical action to be performed when the document is ready:

      let lsUser = localStorage.getItem('user');

      let response = JSON.parse(xhttp.responseText);

      if (lsUser === null) {
        let username = $.urlParam('username');
        let userType = $.urlParam('userType');

        for (let i = 0; i < response.users.length; i++) {
          if (username === response.users[i].username) {
            console.log('match');
            console.log(response.users[i].username);
            console.log(response.users[i].userType);

            // store current user in user localstorage variable
            localStorage.setItem('user', response.users[i].username);
            localStorage.setItem('userType', response.users[i].userType);
            // exit loop early
            break;
          }
          // create a login link
          output = '<li><a href="login.html">Login</a></li>';
        }
      } else {
        // there is a user
        const user = {
          username: localStorage.getItem('user'),
          userType: localStorage.getItem('userType'),
        };

        // create the menu base on the user
        response.menuItems.forEach((mI) => {
          output = createMenu(mI, user);
        });

        output += `<li><a href="logout.html">Logout ${user.username}</a></li>`;
      }

      document.getElementById('menu-main-menu').innerHTML = output;

      // // Get the full pathname of the current page
      let pathname = window.location.pathname;

      // Extract the file name from the pathname
      let filename = pathname.split('/').pop();

      // redirect user to the home page after login
      if (localStorage.getItem('user') !== null && filename === 'login.html') {
        //console.log('redirect user to index page');
        window.location.href = 'index.html';
      }

      // select all anchor tags
      megaMenuLinks = document.querySelectorAll('nav a[href^="#"]');

      // add handleLinkClick to eventListener
      for (let i = 0; i < megaMenuLinks.length; i++) {
        megaMenuLinks[i].addEventListener('click', handleLinkClick);
      }

      winWidth = $(window).width();

      $('#menu-main-menu').on('keydown', function (e) {
        if (e.key == 'Escape') {
          closeAllMenus('esc');
        }
      });

      navItems = $('#menu-main-menu > li');

      // add hover class to those with class menu-item-has-children
      navItems.each(function () {
        if ($(this).hasClass('menu-item-has-children')) {
          $(this).addClass('hover');
        }
      });

      // get width of each item, and list each as visible
      navItems.each(function () {
        navItemWidth.push($(this).outerWidth());
        navItemVisible.push(true);
      });

      // add more link
      $('#menu-main-menu').append(
        '<li id="menu-more" class="menu-item menu-item-has-children" style="display: none;"><a id="menuMoreLink" href="#" aria-label="More has a sub menu. Click enter to open"></a><ul id="moreSubMenu" class="sub-menu" aria-expanded="false"></ul></li>'
      );
      moreWidth = $('#menu-more').outerWidth();

      // toggle sub-menu
      $('#menuMoreLink').click(function (event) {
        event.preventDefault();
        $('.menu-item-has-children:not(#menu-more)').removeClass('visible');

        $(this).parent('.menu-item-has-children').toggleClass('visible');

        if ($(this).parent('.menu-item-has-children').hasClass('visible')) {
          // set the arrow to the up position (open)
          $(this)
            .children('i')
            .removeClass('fa-angle-down')
            .addClass('fa-angle-up');

          // update aria-label to close menu
          $(this).attr('aria-label', 'Click Enter to close More sub menu');

          // set the More sub menu aria-expanded attr to true
          $(this).siblings('ul').attr('aria-expanded', true);
        } else {
          // set the arrow to the down position (close)
          $(this)
            .children('i')
            .removeClass('fa-angle-up')
            .addClass('fa-angle-down');

          // update aria-label to open menu
          $(this).attr(
            'aria-label',
            'More has a sub menu. Click enter to open'
          );

          // set the More sub menu aria-expanded attr to false
          $(this).siblings('ul').attr('aria-expanded', false);
          $(this).siblings('div').attr('aria-expanded', false);
        }
      });

      // collapse all sub-menus when user clicks off
      $('body').click(function (event) {
        if (!$(event.target).closest('li').length) {
          $('.menu-item-has-children').removeClass('visible');
        }

        // reset arrows to down position
        resetArrows();

        //  reset aria-labels to Click enter to open
        $('.menu-item-has-children > a').each(function () {
          $(this).attr(
            'aria-label',
            `${$(this).text()}has a sub menu. Click enter to open`
          );
        });
      });

      $('.menu-item-has-children a').click(function (e) {
        e.stopPropagation();
      });

      $('.menu-item-has-children ul').click(function (e) {
        e.stopPropagation();
      });

      $('.menu-item-has-children li').click(function (e) {
        e.stopPropagation();
      });

      // format navigation on page load
      formatNav();

      // watch for difference between touchscreen and mouse
      watchForHover();
    }
  };
  xhttp.open('GET', 'assets/json/menu.json', true);
  xhttp.send();
});

function handleLinkClick(e) {
  e.preventDefault();

  // link has sub menu
  if ($(this).parents().hasClass('menu-item-has-children'))
    toggleTopLevelMenu($(this));
}

// get params for determining the current user
// input: userType
// returns: userType value (string)
$.urlParam = function (name) {
  var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(
    window.location.href
  );

  if (results == null) {
    return null;
  }
  return decodeURI(results[1]) || 0;
};

// format navigation on page resize
let id;
$(window).resize(function () {
  clearTimeout(id);
  id = setTimeout(onResize, 500);
});

// close all open menus
// input: current menu item or a string
// returns: void
function closeAllMenus(menuItem) {
  // run if the esc key was pressed
  if (menuItem === 'esc') {
    //1.  close all submenus
    $('li').removeClass('visible');

    //2. reset arrows to down position
    resetArrows();

    //3.  reset aria-labels to Click enter to open
    $('.menu-item-has-children > a').each(function () {
      $(this).attr(
        'aria-label',
        `${$(this).text()}has a sub menu. Click enter to open`
      );

      //4. reset ul's or div's aria-expanded attribute to false
      $(this).siblings('ul').attr('aria-expanded', false);
      $(this).siblings('div').attr('aria-expanded', false);
    });

    // exit function early to avoid crash with menuLink.attr('id')
    return;
  }

  // handle case if link is NOT the More link
  if (menuItem.attr('id') === undefined) {
    //1. close all submenus
    $('li').removeClass('visible');
  }

  //2.  reset arrows to down position
  resetArrows();

  //3.  reset aria-labels to Click enter to open
  $('.menu-item-has-children > a').each(function () {
    $(this).attr(
      'aria-label',
      `${$(this).text()}has a sub menu. Click enter to open`
    );

    //4. reset ul's or div's aria-expanded attribute to false
    $(this).siblings('ul').attr('aria-expanded', false);
    $(this).siblings('div').attr('aria-expanded', false);
  });
}

// create menus base on user type
// input: current menu item and current user
// returns: a string that builds the menu
function createMenu(mI, user) {
  // define liClass
  const liClass =
    mI.subMenuType != undefined ? 'class="menu-item-has-children"' : '';

  // define downArrow
  const downArrow =
    mI.subMenuType != undefined ? '<i class="fa fa-angle-down"></i>' : '';

  // define ariaLabel
  const ariaLabel =
    mI.subMenuType != undefined
      ? `aria-label="${mI.name} has a sub menu. Click enter to open"`
      : '';

  // define hRefTarget
  const hRefTarget = determineHREFTarget(mI);

  // define ariaCurrent
  let ariaCurrent = '';

  if (isCurrentPage(mI.link)) ariaCurrent = 'aria-current="page"';

  // define if hRef has a submenu
  let hRef = mI.link;
  if (mI.subMenuItems) hRef = '#';

  if (
    findValueInArray(user.userType, $(mI.availableFor)) ||
    user.userType === 'admin'
  ) {
    output += `<li ${liClass}><a href="${hRef}" ${ariaLabel} ${hRefTarget} ${ariaCurrent}>${mI.name} ${downArrow}</a>`;

    if (mI.subMenuItems && mI.subMenuType === 'regularLinks') {
      output += '<ul class="sub-menu" aria-expanded="false">';
      mI.subMenuItems.forEach((_, i) => {
        // define hRefTarget
        const hRefTarget = determineHREFTarget(mI.subMenuItems[i]);

        // reset ariaCurrent
        ariaCurrent = '';

        // define if hRef has a submenu
        let hRef = mI.subMenuItems[i].link;
        if (mI.subMenuItems[i]) hRef = '#';

        if (isCurrentPage(mI.subMenuItems[i].link))
          ariaCurrent = 'aria-current="page"';

        if (
          findValueInArray(user.userType, $(mI.subMenuItems[i].availableFor)) ||
          user.userType === 'admin'
        ) {
          if (mI.subMenuItems[i].subMenuItems) {
            // a second level menu is present
            output += `<li class="menu-item-has-children">
            <a href="${hRef}" ${ariaCurrent}>${mI.subMenuItems[i].name} <i class="fa fa-angle-down"></i></a>`;
            let secondLevel;

            secondLevel = '<ul class="sub-menu" aria-expanded="false">';

            mI.subMenuItems[i].subMenuItems.forEach((_, j) => {
              // define hRefTarget
              const hRefTarget = determineHREFTarget(
                mI.subMenuItems[i].subMenuItems[j]
              );

              // define if hRef has a submenu
              let hRef = mI.subMenuItems[i].subMenuItems[j].link;
              if (mI.subMenuItems[i].subMenuItems[j]) hRef = '#';

              if (
                findValueInArray(
                  user.userType,
                  $(mI.subMenuItems[i].subMenuItems[j].availableFor)
                ) ||
                user.userType === 'admin'
              ) {
                if (mI.subMenuItems[i].subMenuItems[j].subMenuItems) {
                  // a third level is present
                  secondLevel += `<li class="menu-item-has-children"><a href="${hRef}">${mI.subMenuItems[i].subMenuItems[j].name} <i class="fa fa-angle-down"></i></a>`;
                  let thirdLevel;

                  thirdLevel = '<ul class="sub-menu" aria-expanded="false">';

                  // loop through the links
                  mI.subMenuItems[i].subMenuItems[j].subMenuItems.forEach(
                    (_, k) => {
                      // define hRefTarget
                      const hRefTarget = determineHREFTarget(
                        mI.subMenuItems[i].subMenuItems[j].subMenuItems[k]
                      );

                      // define ariaCurrent
                      const ariaCurrent = '';

                      if (
                        isCurrentPage(
                          mI.subMenuItems[i].subMenuItems[j].subMenuItems[k]
                            .link
                        )
                      )
                        ariaCurrent = 'aria-current="page"';

                      if (
                        findValueInArray(
                          user.userType,
                          $(
                            mI.subMenuItems[i].subMenuItems[j].subMenuItems[k]
                              .availableFor
                          )
                        ) ||
                        user.userType === 'admin'
                      ) {
                        thirdLevel += `<li><a href="${mI.subMenuItems[i].subMenuItems[j].subMenuItems[k].link}" ${hRefTarget}${ariaCurrent}>${mI.subMenuItems[i].subMenuItems[j].subMenuItems[k].name}</a></li>`;
                      }
                    }
                  );

                  thirdLevel += '</ul>';

                  secondLevel += `${thirdLevel}</li>`;
                } else {
                  secondLevel += `<li>
        <a href="${mI.subMenuItems[i].subMenuItems[j].link}" ${hRefTarget}>
          ${mI.subMenuItems[i].subMenuItems[j].name}
        </a></li>`;
                }
              }
            });

            output += `${secondLevel}</ul></li>`;
          } else {
            output += `<li>
          <a href="${mI.subMenuItems[i].link}" ${hRefTarget}>${mI.subMenuItems[i].name}</a>
        </li>`;
          }
        }
      });
      output += '</ul>';
    }

    if (mI.subMenuItems && mI.subMenuType === 'photoLinks') {
      output +=
        '<div class="sub-menu-div mega-menu mega-menu-column-4" aria-expanded="false">';

      mI.subMenuItems.forEach((_, i) => {
        const hRefTarget = determineHREFTarget(mI);

        const ariaCurrent = '';

        if (isCurrentPage(mI.subMenuItems[i].link))
          ariaCurrent = 'aria-current="page"';

        if (
          findValueInArray(user.userType, $(mI.subMenuItems[i].availableFor)) ||
          user.userType === 'admin'
        ) {
          output += `<div class="list-item text-center">
                  <a href="${mI.subMenuItems[i].link}" ${hRefTarget} ${ariaCurrent}>
                    <img src="assets/imgs/${mI.subMenuItems[i].imgSrc}.jpg" alt="${mI.subMenuItems[i].name}" />
                    <p>${mI.subMenuItems[i].name}</p>
                  </a>
                </div>`;
        }
      });

      output += '</div>';
    }

    if (mI.subMenuItems && mI.subMenuType === 'categorizedLinks') {
      output +=
        '<div class="sub-menu-div mega-menu mega-menu-column-4" aria-expanded="false">';

      let subMenuContainerContent = '';

      mI.subMenuItems.forEach((_, i) => {
        let subMenuContainerInnerContent = '';

        if (mI.subMenuItems[i].contentType === 'link') {
          if (i === 0 || i === 2 || i === 4)
            subMenuContainerInnerContent += `<div class="list-item">`;

          subMenuContainerInnerContent += `<h4 class="title" id="${mI.subMenuItems[i].titleId}">${mI.subMenuItems[i].title}</h4>`;

          let listItemValues = '<ul>';
          mI.subMenuItems[i].links.forEach((_, j) => {
            // define hRefTarget
            const hRefTarget = determineHREFTarget(mI.subMenuItems[i].links[j]);

            // define ariaCurrent
            const ariaCurrent = '';

            if (isCurrentPage(mI.link)) ariaCurrent = 'aria-current="page"';

            listItemValues += `<li><a href="${mI.subMenuItems[i].links[j].link}" ${hRefTarget}${ariaCurrent}><span aria-labelledby="${mI.subMenuItems[i].titleId}"></span>${mI.subMenuItems[i].links[j].name}</a></li>`;
          });
          listItemValues += '</ul>';

          subMenuContainerInnerContent += `${listItemValues}`;

          if (i === 1 || i === 3 || i === 4)
            subMenuContainerInnerContent += '</div>';
        }

        if (mI.subMenuItems[i].contentType === 'photo') {
          subMenuContainerInnerContent += '<div class="list-item">';

          let columnValue = `<img src="assets/imgs/${mI.subMenuItems[i].imgSrc}.jpg" alt="${mI.subMenuItems[i].alt}" />`;

          subMenuContainerInnerContent += `${columnValue}</div>`;
        }
        subMenuContainerContent += `${subMenuContainerInnerContent}`;
      });

      output += `${subMenuContainerContent}</div>`;
    }
  } else {
    // user is not present
  }

  output += `</li>`;

  return output;
}

function findValueInArray(value, arr) {
  let bFound = false;

  for (let i = 0; i < arr.length; i++) {
    let name = arr[i];
    if (name == value) {
      bFound = true;
      break;
    }
  }
  return bFound;
}

function formatNav() {
  // initial variables
  let room = true;
  let count = 0;
  let tempWidth = 0;
  let totalWidth = 0;
  const containerWidth = $('.menu-main-menu-container').innerWidth();
  const navPadding = 5; // for spacing around items
  const numItems = navItems.length - 1;

  // for each menu item
  navItems.each(function () {
    // get width of menu with that item
    tempWidth = totalWidth + navItemWidth[count] + navPadding;

    // if the menu item will fit
    if (
      (tempWidth < containerWidth - moreWidth - navPadding ||
        (tempWidth < containerWidth && count == numItems)) &&
      room == true
    ) {
      // update current menu width
      totalWidth = tempWidth;

      // show menu item
      if (navItemVisible[count] != true) {
        // move back to main menu
        $('#menu-more').before($('#moreSubMenu').children().first());

        navItemVisible[count] = true;

        // if all are visible, hide More
        if (count == numItems) {
          $('#menu-more').hide();
        }
      }
    }
    // if the menu item will not fit
    else {
      // if there is now no room, show more dropdown
      if (room == true) {
        room = false;

        // change text to "Menu" if no links are showing
        if (count == 0) {
          $('nav').addClass('all-hidden');
          $('#menuMoreLink').html('Menu <i class="fa fa-angle-down"></i>');
        } else {
          $('nav').removeClass('all-hidden');
          $('#menuMoreLink').html('More <i class="fa fa-angle-down"></i>');
        }

        $('#menu-more').show();
      }

      // remove hover class for items under "More"
      $(this).removeClass('hover');

      // move menu item to More dropdown
      $(this).appendTo($('#moreSubMenu'));

      navItemVisible[count] = false;
    }

    // update count
    count += 1;
  });
}

function resetArrows() {
  $('.fa').removeClass('fa-angle-up').addClass('fa-angle-down');
}

function onResize() {
  if (winWidth != $(window).width()) {
    // get width of each item, and list each as visible
    let count = 0;
    navItems.each(function () {
      // add hover class to those with class menu-item-has-children
      if ($(this).hasClass('menu-item-has-children')) {
        $(this).addClass('hover');
      }

      let itemWidth = $(this).outerWidth();
      if (itemWidth > 0) {
        navItemWidth[count] = itemWidth;
      }
    });

    moreWidth = $('#menu-more').outerWidth();

    // hide all submenus
    $('.menu-item-has-children').removeClass('visible');

    // reset arrows to down position
    resetArrows();

    formatNav();

    winWidth = $(window).width();
  }
}

function toggleTopLevelMenu(menuLink) {
  // CLOSE ALL MENUS EXCEPT FOR THE CURRENT IF OPEN
  if (!$(menuLink).parents('.menu-item-has-children').hasClass('visible')) {
    // 1-a. remove visible class from all menus items except the current
    $('li.menu-item-has-children')
      .not(menuLink.closest('li'))
      .removeClass('visible');

    // 1-b. reset arrows
    resetArrows();

    // 1-c. update aria label to close menu
    let focusedLink = $('li.menu-item-has-children > a:focus');

    $('li.menu-item-has-children > a')
      .not(focusedLink)
      .each(function () {
        $(this).attr(
          'aria-label',
          `${$(this).text()}has a sub menu. Click enter to open`
        );
      });

    // 1-d. reset sub-menu aria-expanded to false
    $('li.menu-item-has-children > a')
      .not(focusedLink)
      .siblings('ul')
      .attr('aria-expanded', false);

    $('li.menu-item-has-children > a')
      .not(focusedLink)
      .siblings('.sub-menu-div')
      .attr('aria-expanded', false);

    //-------------------------------------------------------------

    // 2. OPEN CURRENT MENU
    // 2-a. set visible class to menu's parent
    $(menuLink).parents('.menu-item-has-children').addClass('visible');

    // 2-b. set the arrow to upwards position
    $(menuLink)
      .children('i')
      .removeClass('fa-angle-down')
      .addClass('fa-angle-up');

    // 2-c. update aria label to close sub menu
    $(menuLink).attr(
      'aria-label',
      `Click Enter to close ${$(menuLink).text()}sub menu`
    );

    // 2-d. set sub menu aria-expanded to true
    $(menuLink).siblings('ul').attr('aria-expanded', true);
    $(menuLink).siblings('div').attr('aria-expanded', true);
  } else {
    // BEFORE CLOSING MENU - CHECK IF LINK HAS A SUB MENU
    if ($(menuLink).parent().parent().is('ul#menu-main-menu.menu')) {
      // link is the top menu, so do close
      // menu item is the top menu
      closeAllMenus($(menuLink));
    } else {
      // menu item is NOT the top item

      // 3. OPEN secondary menu
      if (!$(menuLink).parent().hasClass('visible')) {
        // 3-a. set visible class to menu's parent
        $(menuLink).parents('.menu-item-has-children').addClass('visible');

        // 3-b. set the arrow to upwards position
        $(menuLink)
          .children('i')
          .removeClass('fa-angle-down')
          .addClass('fa-angle-up');

        // 3-c. set the aria-label to close sub menu
        $(menuLink).attr(
          'aria-label',
          `Click Enter to close ${$(menuLink).text()}sub menu`
        );

        // 3-d. set sub menu aria-expanded to true
        $(menuLink).siblings('ul').attr('aria-expanded', true);
        $(menuLink).siblings('div').attr('aria-expanded', true);
      } else {
        // 4. CLOSE secondary menu

        // 4-a. remove visible class from sub menu
        $(menuLink).parent('.menu-item-has-children').removeClass('visible');

        // 4-b. set the arrow to downwards position
        $(menuLink)
          .children('i')
          .removeClass('fa-angle-up')
          .addClass('fa-angle-down');

        // 4-c. set the aria label to open menu
        $(menuLink).attr(
          'aria-label',
          `${$(menuLink).text()}has a sub menu. Click enter to open`
        );

        // 4-d. reset sub-menu aria-expanded to false
        $(menuLink).siblings('ul').attr('aria-expanded', false);

        // 4-e. reset sibiling submenus attributes as well
        closeSiblingSubMenus(menuLink);
      }
    }
  }
}

function watchForHover() {
  let hasHoverClass = false;
  let lastTouchTime = 0;

  function enableHover() {
    // filter emulated events coming from touch events
    if (new Date() - lastTouchTime < 500) return;
    if (hasHoverClass) return;

    $('body').addClass('has-hover');
    hasHoverClass = true;
  }

  function disableHover() {
    if (!hasHoverClass) return;

    $('body').removeClass('has-hover');
    hasHoverClass = false;
  }

  function updateLastTouchTime() {
    lastTouchTime = new Date();
  }

  document.addEventListener('touchstart', updateLastTouchTime, true);
  document.addEventListener('touchstart', disableHover, true);
  document.addEventListener('mousemove', enableHover, true);

  enableHover();
}

function closeSiblingSubMenus(menuLink) {
  // 1. remove visible class from sub menu
  $(menuLink).parent().find('li.menu-item-has-children').removeClass('visible');

  // 2. set the arrow to downwards position
  $(menuLink)
    .parent()
    .find('li.menu-item-has-children > a > i')
    .removeClass('fa-angle-up')
    .addClass('fa-angle-down');

  // 3. update links aria-label
  $(menuLink)
    .parent()
    .find('li.menu-item-has-children > a')
    .each(function () {
      $(this).attr(
        'aria-label',
        `${$(this).text()}has a sub menu. Click enter to open`
      );
    });

  // 4. set sub-menu container aria-expanded to false
  $(menuLink).siblings().find('ul').attr('aria-expanded', false);
}

function determineHREFTarget(mI) {
  return mI.link.charAt(0) !== '#' &&
    (mI.link.indexOf('http') !== -1 || mI.link.indexOf('.pdf') !== -1)
    ? 'target="_blank"'
    : '';
}

function isCurrentPage(page) {
  if (window.location.href.indexOf(page) !== -1 || page === 'index.html')
    return true;
}
