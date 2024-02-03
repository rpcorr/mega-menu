'use strict';
/* flexbox priority navigation */

// global variables
var navItems = [];
var navItemWidth = [];
var navItemVisible = [];
var moreWidth = 0;
var winWidth = 0;

jQuery(document).ready(function () {
  winWidth = jQuery(window).width();

  navItems = jQuery('#menu-main-menu > li');

  // get width of each item, and list each as visible
  navItems.each(function () {
    var itemWidth = jQuery(this).outerWidth();
    navItemWidth.push(itemWidth);
    navItemVisible.push(true);
  });

  // add more link
  jQuery('#menu-main-menu').append(
    '<li id="menu-more" class="menu-item menu-item-has-children" style="display: none;"><a id="menuMoreLink" href="#">More</a><ul id="moreSubMenu" class="sub-menu"></ul></li>'
  );
  moreWidth = jQuery('#menu-more').outerWidth();

  // toggle sub-menu
  jQuery('#menuMoreLink').click(function (event) {
    event.preventDefault();
    jQuery('.menu-item-has-children:not(#menu-more)').removeClass('visible');
    jQuery(this).parent('.menu-item-has-children').toggleClass('visible');
  });

  // collapse all sub-menus when user clicks off
  jQuery('body').click(function (event) {
    if (!jQuery(event.target).closest('.menu-item').length) {
      jQuery('.menu-item-has-children').removeClass('visible');
    }
  });

  jQuery('.menu-item-has-children a').click(function (e) {
    e.stopPropagation();
  });
  jQuery('.menu-item-has-children ul').click(function (e) {
    e.stopPropagation();
  });
  jQuery('.menu-item-has-children li').click(function (e) {
    e.stopPropagation();
  });

  // toggle all sub-menus
  jQuery('.menu-item-has-children').click(function (event) {
    if (!jQuery(this).hasClass('visible')) {
      jQuery(this).siblings('.menu-item-has-children').removeClass('visible');
      jQuery(this).addClass('visible');
    } else {
      jQuery(this).removeClass('visible');
    }
  });

  // format navigation on page load
  formatNav();

  // watch for difference between touchscreen and mouse
  watchForHover();
});

// format navigation on page resize
var id;
jQuery(window).resize(function () {
  clearTimeout(id);
  id = setTimeout(onResize, 500);
});

function onResize() {
  if (winWidth != jQuery(window).width()) {
    // get width of each item, and list each as visible
    var count = 0;
    navItems.each(function () {
      var itemWidth = jQuery(this).outerWidth();
      if (itemWidth > 0) {
        navItemWidth[count] = itemWidth;
      }
    });

    moreWidth = jQuery('#menu-more').outerWidth();

    // hide all submenus
    jQuery('.menu-item-has-children').removeClass('visible');

    formatNav();

    winWidth = jQuery(window).width();
  }
}

function formatNav() {
  // initial variables
  var room = true;
  var count = 0;
  var tempWidth = 0;
  var totalWidth = 0;
  var containerWidth = jQuery('.menu-main-menu-container').innerWidth();
  var navPadding = 5; // for spacing around items
  var numItems = navItems.length - 1;

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
        jQuery('#menu-more').before(jQuery('#moreSubMenu').children().first());

        navItemVisible[count] = true;

        // if all are visible, hide More
        if (count == numItems) {
          jQuery('#menu-more').hide();
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
          jQuery('nav').addClass('all-hidden');
          jQuery('#menuMoreLink').text('Menu');
        } else {
          jQuery('nav').removeClass('all-hidden');
          jQuery('#menuMoreLink').text('More');
        }

        jQuery('#menu-more').show();
      }

      // move menu item to More dropdown
      jQuery(this).appendTo(jQuery('#moreSubMenu'));

      navItemVisible[count] = false;
    }

    // update count
    count += 1;
  });
}

function watchForHover() {
  var hasHoverClass = false;
  var lastTouchTime = 0;

  function enableHover() {
    // filter emulated events coming from touch events
    if (new Date() - lastTouchTime < 500) return;
    if (hasHoverClass) return;

    jQuery('body').addClass('has-hover');
    hasHoverClass = true;
  }

  function disableHover() {
    if (!hasHoverClass) return;

    jQuery('body').removeClass('has-hover');
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
