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
  let count = 0;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Typical action to be performed when the document is ready:

      let response = JSON.parse(xhttp.responseText);

      response.menuItems.forEach((mI) => {
        output = createMenu(mI);
      });

      document.getElementById('menu-main-menu').innerHTML = output;

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
        }
      });

      // collapse all sub-menus when user clicks off
      $('body').click(function (event) {
        if (!$(event.target).closest('li').length) {
          $('.menu-item-has-children').removeClass('visible');
        }

        // reset arrows to down position
        $('.fa').removeClass('fa-angle-up').addClass('fa-angle-down');

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

  function handleLinkClick(e) {
    e.preventDefault();

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
      // close menu - program never reach here????
      console.log('hello');
    }
  }
});

// format navigation on page resize
let id;
$(window).resize(function () {
  clearTimeout(id);
  id = setTimeout(onResize, 500);
});

function createMenu(mI) {
  let liClass =
    mI.liClass === 'menu-item-has-children'
      ? 'class="menu-item-has-children"'
      : '';

  let downArrow =
    mI.liClass === 'menu-item-has-children'
      ? '<i class="fa fa-angle-down"></i>'
      : '';

  output += `<li ${liClass}><a href="${mI.link}">${mI.name} ${downArrow}</a>`;

  if (mI.subMenuItems && mI.subMenuType === 'regularLinks') {
    output += '<ul class="sub-menu" aria-expanded="false">';
    mI.subMenuItems.forEach((_, i) => {
      if (mI.subMenuItems[i].subMenuItems) {
        // a second level menu is present
        output += `<li class="menu-item-has-children">
        <a href="${mI.subMenuItems[i].link}">${mI.subMenuItems[i].name} <i class="fa fa-angle-down"></i></a>`;
        let secondLevel;

        secondLevel = '<ul class="sub-menu" aria-expanded="false">';

        mI.subMenuItems[i].subMenuItems.forEach((_, j) => {
          if (mI.subMenuItems[i].subMenuItems[j].subMenuItems) {
            // a third level is present
            secondLevel += `<li class="menu-item-has-children"><a href="${mI.subMenuItems[i].subMenuItems[j].link}">${mI.subMenuItems[i].subMenuItems[j].name} <i class="fa fa-angle-down"></i></a>`;
            let thirdLevel;

            thirdLevel = '<ul class="sub-menu" aria-expanded="false">';

            // loop through the links
            mI.subMenuItems[i].subMenuItems[j].subMenuItems.forEach((_, k) => {
              thirdLevel += `<li><a href="${mI.subMenuItems[i].subMenuItems[j].subMenuItems[k].link}">${mI.subMenuItems[i].subMenuItems[j].subMenuItems[k].name}</a></li>`;
            });

            thirdLevel += '</ul>';

            secondLevel += `${thirdLevel}</li>`;
          } else {
            secondLevel += `<li>
          <a href="${mI.subMenuItems[i].subMenuItems[j].link}" target="_blank">
            ${mI.subMenuItems[i].subMenuItems[j].name}</i>
          </a></li>`;
          }
        });

        output += `${secondLevel}</ul></li>`;
      } else {
        output += `<li>
      <a href="${mI.subMenuItems[i].link}">${mI.subMenuItems[i].name}</a>
    </li>`;
      }
    });
    output += '</ul>';
  }

  if (mI.subMenuItems && mI.subMenuType === 'photoLinks') {
    output +=
      '<div class="sub-menu-div mega-menu mega-menu-column-4" aria-expanded="false">';

    mI.subMenuItems.forEach((_, i) => {
      output += `<div class="list-item text-center">
                <a href="${mI.subMenuItems[i].link}">
                  <img src="assets/imgs/${mI.subMenuItems[i].imgSrc}.jpg" alt="${mI.subMenuItems[i].title}" />
                  <p>${mI.subMenuItems[i].title}</p>
                </a>
              </div>`;
    });

    output += '</div>';
  }

  if (mI.subMenuItems && mI.subMenuType === 'categorizedLinks') {
    output +=
      '<div class="sub-menu-div mega-menu mega-menu-column-4" aria-expanded="false">';

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

    output += `${subMenuContainerContent}</div>`;
  }
  output += `</li>`;

  return output;
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
    $('.fa').removeClass('fa-angle-up').addClass('fa-angle-down');

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
  // close all menus
  // run if the esc key was pressed
  if (menuLink === 'esc') {
    // close all submenus
    $('li').removeClass('visible');

    // reset arrows to down position
    $('.fa').removeClass('fa-angle-up').addClass('fa-angle-down');

    //  reset aria-labels to Click enter to open
    $('.menu-item-has-children > a').each(function () {
      $(this).attr(
        'aria-label',
        `${$(this).text()}has a sub menu. Click enter to open`
      );
    });

    // exit function early to avoid crash with menuLink.attr('id')
    return;
  }

  // handle case if link is NOT the More link
  if (menuLink.attr('id') === undefined) {
    // close all submenus
    $('li').removeClass('visible');
  }

  // reset arrows to down position
  $('.fa').removeClass('fa-angle-up').addClass('fa-angle-down');

  //  reset aria-labels to Click enter to open
  $('.menu-item-has-children > a').each(function () {
    $(this).attr(
      'aria-label',
      `${$(this).text()}has a sub menu. Click enter to open`
    );

    // reset ul's or div's aria-expanded attribute to false
    $(this).siblings('ul').attr('aria-expanded', false);
    $(this).siblings('div').attr('aria-expanded', false);
  });
}

function toggleTopLevelMenu(menuLink) {
  if (!$(menuLink).parents('.menu-item-has-children').hasClass('visible')) {
    // open menu

    if (!$(menuLink).attr('id')) {
      //show menu that is not "More"
      $(menuLink).parents('.menu-item-has-children').addClass('visible');

      // set the arrow to the up position (open)
      $(menuLink)
        .children('i')
        .removeClass('fa-angle-down')
        .addClass('fa-angle-up');

      // set the current menu aria-label to close sub menu
      $(menuLink).attr(
        'aria-label',
        `Click Enter to close ${$(menuLink).text()}sub menu`
      );

      // set sub-menu container aria-expanded to true
      $(menuLink).siblings('ul').attr('aria-expanded', true);
      $(menuLink).siblings('div').attr('aria-expanded', true);
    } else {
      // handle the MORE menu

      // set the arrow to the up position (open)
      $(menuLink)
        .children('i')
        .removeClass('fa-angle-down')
        .addClass('fa-angle-up');

      $(menuLink).attr(
        'aria-label',
        `Click Enter to close ${$(menuLink).text()}sub menu`
      );

      // set sub-menu container aria-expanded to true
      $(menuLink).siblings('ul').attr('aria-expanded', true);
    }
  } else {
    // before closing menu - check if link has a sub menu
    if ($(menuLink).parent().parent().is('ul#menu-main-menu.menu')) {
      // menu item is the top menu
      closeAllMenus($(menuLink));
    } else {
      // menu item is NOT the top item

      // determine if menu item has a sub menu
      if ($(menuLink).parent().hasClass('menu-item-has-children')) {
        // add menu visibility
        if (!$(menuLink).parent().hasClass('visible')) {
          $(menuLink).parent().addClass('visible');

          // set the arrow to the up position (open)
          $(menuLink)
            .children('i')
            .removeClass('fa-angle-down')
            .addClass('fa-angle-up');

          // set the current menu aria-label to close sub menu
          $(menuLink).attr(
            'aria-label',
            `Click Enter to close ${$(menuLink).text()}sub menu`
          );

          // set sub-menu container aria-expanded to true
          $(menuLink).siblings('ul').attr('aria-expanded', true);
        } else {
          // close all levels of sub menu

          // remove submenu class visible
          $(menuLink).parent().removeClass('visible');

          // set the arrow to the down position (close)
          $(menuLink)
            .children('i')
            .removeClass('fa-angle-up')
            .addClass('fa-angle-down');

          // set aria-label to {menu item} as a sub menu. Click enter to open
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

          // set sub-menu container aria-expanded to false
          $(menuLink).siblings('ul').attr('aria-expanded', false);
        }
      } else {
        closeAllMenus($(menuLink));
      }
    }
  }
}
