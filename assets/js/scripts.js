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

  navItems = $('#menu-main-menu > li');

  // get width of each item, and list each as visible
  navItems.each(function () {
    navItemWidth.push($(this).outerWidth());
    navItemVisible.push(true);
  });

  // add more link
  $('#menu-main-menu').append(
    '<li id="menu-more" class="menu-item menu-item-has-children" style="display: none;"><a id="menuMoreLink" href="#"></a><ul id="moreSubMenu" class="sub-menu"></ul></li>'
  );
  moreWidth = $('#menu-more').outerWidth();

  const megaMenuLinks = document.querySelectorAll('nav a[href^="#"]');

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
  //   console.log('here I am');
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
    e.preventDefault();
    if (!$(this).parents('.menu-item-has-children').hasClass('visible')) {
      $(this)
        .parents('.menu-item-has-children')
        .siblings('.menu-item-has-children')
        .removeClass('visible');

      // replace fa-angle-down with fa-angle-up
      $(this.children).removeClass('fa-angle-down');
      $(this.children).addClass('fa-angle-up');

      // check if link doesn't have an id - in other words the More link
      if (!$(this).parents('.menu-item-has-children').prevObject[0].id) {
        $(this).parents('.menu-item-has-children').addClass('visible');
      }
    } else {
      // replace fa-angle-up with fa-angle-down
      $(this.children).removeClass('fa-angle-up');
      $(this.children).addClass('fa-angle-down');

      // check if link doesn't have an id - in other words the More link
      if (!$(this).parents('.menu-item-has-children').prevObject[0].id) {
        $(this).parents('.menu-item-has-children').removeClass('visible');
      }
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
      let itemWidth = $(this).outerWidth();
      if (itemWidth > 0) {
        navItemWidth[count] = itemWidth;
      }
    });

    moreWidth = $('#menu-more').outerWidth();

    // hide all submenus
    $('.menu-item-has-children').removeClass('visible');

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
