'use strict';
/* flexbox priority navigation */

// global variables
let navItems = [];
const navItemWidth = [];
const navItemVisible = [];
let moreWidth = 0;
let winWidth = 0;

$(document).ready(function () {
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
    '<li id="menu-more" class="menu-item menu-item-has-children" style="display: none;"><a id="menuMoreLink" href="#" aria-label="More has a sub menu. Click enter to open"></a><ul id="moreSubMenu" class="sub-menu"></ul></li>'
  );
  moreWidth = $('#menu-more').outerWidth();

  // select all anchor tags
  const megaMenuLinks = document.querySelectorAll('nav a[href^="#"]');

  // add handleLinkClick to eventListener
  for (let i = 0; i < megaMenuLinks.length; i++) {
    megaMenuLinks[i].addEventListener('click', handleLinkClick);
  }

  // toggle sub-menu
  $('#menuMoreLink').click(function (event) {
    event.preventDefault();
    $('.menu-item-has-children:not(#menu-more)').removeClass('visible');
    $(this).parent('.menu-item-has-children').toggleClass('visible');
  });

  // collapse all sub-menus when user clicks off
  $('body').click(function (event) {
    if (!$(event.target).closest('li').length) {
      $('.menu-item-has-children').removeClass('visible');
    }

    // reset arrows to down position
    $('.fa').removeClass('fa-angle-up');
    $('.fa').addClass('fa-angle-down');
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

  // toggle all sub-menus
  // $('.menu-item-has-children').click(function (e) {
  //   e.preventDefault();
  //   if (!$(this).hasClass('visible')) {
  //     $(this).siblings('.menu-item-has-children').removeClass('visible');
  //     $(this).addClass('visible');
  //   } else {
  //     $(this).removeClass('visible');
  //   }
  // });

  // format navigation on page load
  formatNav();

  // watch for difference between touchscreen and mouse
  watchForHover();

  function handleLinkClick(e) {
    console.log('handleLinkClick');
    e.preventDefault();

    console.log($(this));

    if ($(this).parents().hasClass('menu-item-has-children')) {
      // link has sub menu

      // determine if click link is not "More"
      if ($(this).attr('id') === undefined) {
        // current link has a sub menu
        toggleTopLevelMenu($(this));
      } else {
        // More link is clicked
        toggleTopLevelMenu($(this));
      }
    } else {
      console.log('hello');
      // close menu
    }
  }
});

// format navigation on page resize
let id;
$(window).resize(function () {
  clearTimeout(id);
  id = setTimeout(onResize, 500);
});

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
    $('.fa').removeClass('fa-angle-up');
    $('.fa').addClass('fa-angle-down');

    formatNav();

    winWidth = $(window).width();
  }
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

function closeAllMenus(menuLink) {
  console.log('close all menu');

  if (menuLink.attr('id') === undefined) {
    // close all submenus
    $('li').removeClass('visible');
  }

  // reset arrows to down position
  $('.fa').removeClass('fa-angle-up').addClass('fa-angle-down');

  //  reset aria-labels to Click enter to open
  $('.menu-item-has-children > a').each(function () {
    // console.log($(this));

    $(this).attr(
      'aria-label',
      `${$(this).text()}has a sub menu. Click enter to open`
    );
  });
}

function toggleTopLevelMenu(menuLink) {
  //console.log($(menuLink));

  if (!$(menuLink).parents('.menu-item-has-children').hasClass('visible')) {
    console.log('open menu');

    if (!$(menuLink).attr('id')) {
      //show menu that is not "More"
      $(menuLink).parents('.menu-item-has-children').addClass('visible');

      // toggle arrows
      $(menuLink)
        .children('i')
        .removeClass('fa-angle-down')
        .addClass('fa-angle-up');

      // set the current menu aria-label to close sub menu
      $(menuLink).attr(
        'aria-label',
        `Click Enter to close ${$(menuLink).text()}sub menu`
      );
    } else {
      console.log('more menu');
      // address the arrows
      $(menuLink)
        .children('i')
        .removeClass('fa-angle-down')
        .addClass('fa-angle-up');

      $(menuLink).attr(
        'aria-label',
        `Click Enter to close ${$(menuLink).text()}sub menu`
      );
    }
  } else {
    // before closing menu - check if link has a sub menu

    if ($(menuLink).parent().parent().is('ul#menu-main-menu.menu')) {
      // menu item is the top menu
      console.log('menu item is the the top item');

      // toggle menu visibility
      if (!$(menuLink).parent().hasClass('visible')) {
        $(menuLink).parent().addClass('visible');
      } else {
        closeAllMenus($(menuLink));
      }
    } else {
      console.log('menu item is NOT the top item');

      // determine if menu item has a sub menu
      if ($(menuLink).parent().hasClass('menu-item-has-children')) {
        // add menu visibility
        if (!$(menuLink).parent().hasClass('visible')) {
          $(menuLink).parent().addClass('visible');

          // address the arrows
          $(menuLink)
            .children('i')
            .removeClass('fa-angle-down')
            .addClass('fa-angle-up');

          // set the current menu aria-label to close sub menu
          $(menuLink).attr(
            'aria-label',
            `Click Enter to close ${$(menuLink).text()}sub menu`
          );
        } else {
          console.log('here');
          // remove submenu class visible
          $(menuLink).parent().removeClass('visible');

          // address the arrows
          $(menuLink)
            .children('i')
            .removeClass('fa-angle-up')
            .addClass('fa-angle-down');

          $(menuLink).attr(
            'aria-label',
            `${$(menuLink).text()}has a sub menu. Click enter to open`
          );

          // remove visible class and toggle arrows from all menus under the current one
          $(menuLink)
            .parent()
            .find('li.menu-item-has-children')
            .removeClass('visible');

          $(menuLink)
            .parent()
            .find('li.menu-item-has-children > a > i')
            .removeClass('fa-angle-up')
            .addClass('fa-angle-down');

          // update the link's aria message
          $(menuLink)
            .parent()
            .find('li.menu-item-has-children > a')
            .attr(
              'aria-label',
              `${$(menuLink).text()}has a sub menu. Click enter to open`
            );
        }
      } else {
        closeAllMenus($(menuLink));
      }
    }
  }
}
