function generateOutfit(
  user_id,
  image_src,
  image_description,
  price,
  designer,
  website,
  href
) {
  var outfit = {
    user_id: user_id,
    image_src: image_src,
    image_description: image_description,
    designer: designer,
    price: price,
    website: website,
    href: href
  };
  return outfit;
}

function generateFollowearDiv(selector, outfit, website) {
  var followear_div = document.createElement('div');
  followear_div.className = 'followear';
  followear_div.id = 'flwr';
  var button = document.createElement('button');
  button.id = 'flbtn';

  var img = document.createElement('img');

  var url = chrome.runtime.getURL('images/fw.PNG');
  img.setAttribute('src', url);
  img.setAttribute('width', '25');
  img.setAttribute('height', '25');

  //button.appendChild(img);

  switch (website) {
    case 'netaporter':
      followear_div.appendChild(img);
      $(selector).append(followear_div);
      var fl = $(selector).find('#flwr');
      fl.css({
        // float: 'right',
        // bottom: '10px'
      });
      break;
    case 'asos':
      var followear_span = document.createElement('span');
      followear_span.className = 'followear';
      followear_span.id = 'flwr';
      followear_span.appendChild(img);
      $(selector).append(followear_span);
      // var p_class = $(selector).find('p._6RF5CVD');
      // p_class.append(span);
      var fl = $(selector).find('#flwr');

      // p_class.css({
      //   display: 'inline'
      // });
      fl.css({
        float: 'right',
        position: 'absolute',
        bottom: '15px',
        right: '10px'
      });
      break;
    case 'matchesfashion':
      // followear_div.appendChild(img);
      var followear_span = document.createElement('span');
      followear_span.className = 'followear';
      followear_span.id = 'flwr';
      followear_span.appendChild(img);
      var innder_div = $(selector).find('.lister__item__inner');
      // innder_div.append(followear_div);
      innder_div.append(followear_span);
      var fl = $(selector).find('#flwr');
      fl.css({ bottom: '5px' });
      break;
    case 'zara':
      var url = chrome.runtime.getURL('images/fw.PNG');
      img.setAttribute('src', url);
      img.setAttribute('width', '20px');

      followear_div.appendChild(img);
      $(selector).append(followear_div);
      var fl = $(selector).find('#flwr');
      fl.css({
        float: 'right',
        position: 'absolute',
        bottom: '35px',
        display: 'inline'
      });
      break;
  }

  $(img).click(function() {
    chrome.runtime.sendMessage({ outfit: outfit }, function(response) {
      console.log(response);
    });
  });
}

function netaporter(selector) {
  var i;
  selector.each(function(i) {
    var user_id = 0;
    var href = $(this)
      .find('div.product-image a')
      .attr('href');
    var price = $(this)
      .find('span.price')
      .text();
    var designer = $(this)
      .find('span.designer')
      .text();
    price = price.trim();
    designer = designer.trim();
    var description = $(this)
      .find('div.description a')
      .attr('title');
    var website = window.location.hostname.toString();
    var main_src = $(this)
      .find('img')
      .attr('src');
    var second_src = $(this)
      .find('img')
      .attr('data-image-outfit');

    var outfit = generateOutfit(
      user_id,
      main_src,
      description,
      price,
      designer,
      website,
      href
    );
    generateFollowearDiv($(this), outfit, 'netaporter');
  });
}

function matchesfashion(selector) {
  var i;
  selector.each(function(i) {
    var user_id = 0;
    var website = window.location.hostname.toString();
    var href = $(this)
      .find('div.lister__item__inner a')
      .attr('href');
    var src = $(this)
      .find('img.lazy')
      .attr('src');
    var description = $(this)
      .find('div.lister__item__details')
      .text();
    var price = $(this)
      .find('span.lister__item__price-full')
      .text();
    var designer = $(this)
      .find('div.lister__item__title')
      .text();

    var outfit = generateOutfit(
      user_id,
      src,
      description,
      price,
      designer,
      website,
      href
    );
    generateFollowearDiv($(this), outfit, 'matchesfashion');
  });
}

function asos(selector) {
  selector.each(function() {
    var user_id = 0;
    var href = $(this)
      .find('a._3x-5VWa')
      .attr('href');
    var description = $('a._3x-5VWa').attr('aria-label');
    var price = $(this)
      .find('._342BXW_')
      .text();
    var designer = 'asos';
    var website = window.location.hostname.toString();
    var src = $(this)
      .find('img')
      .attr('src');

    var outfit = generateOutfit(
      user_id,
      src,
      description,
      price,
      designer,
      website,
      href
    );
    generateFollowearDiv($(this), outfit, 'asos');
  });
}

function zara(selector) {
  selector.each(function() {
    var user_id = 0;
    var href = $(this)
      .find('a.item _item')
      .attr('href');
    var description = $(this)
      .find('name _item')
      .attr('tabindex');
    var price = $(this)
      .find('.price _product-price')
      .text();
    var designer = 'zara';
    var website = window.location.hostname.toString();
    var src = $(this)
      .find('img')
      .attr('src');

    var outfit = generateOutfit(
      user_id,
      src,
      description,
      price,
      designer,
      website,
      href
    );
    generateFollowearDiv($(this), outfit, 'zara');
  });
}

(function() {
  switch (window.location.hostname) {
    case 'www.net-a-porter.com':
      selector = $('ul.products').find('li');
      netaporter(selector);

      break;
    case 'www.asos.com':
      selector = $('._2oHs74P');
      asos(selector);
      break;
    case 'www.matchesfashion.com':
      selector = $('ul.lister__wrapper').find('li.lister__item');
      matchesfashion(selector);

      break;
    case 'www.zara.com':
      console.log('im in zaraaaa');
      //first_selector = $('li.product _product');
      //console.log('im first selector', first_selector);
      //zara(first_selector);
      // console.log('im in first selector');
      second_selector = $('.nth-child3n');
      zara(second_selector);
      console.log('im in second selector', second_selector);
      // third_selector = $('.product _product double _doubleChanged');
      // zara(third_selector);
      // console.log('im in third selector');
      // fourth_selector = $('.product _product nth-child2n nth-child3n');
      // zara(fourth_selector);
      // console.log('im in fourth selector');
      // fifth_selector = $('.product _product nth-child3n');
      // zara(fifth_selector);
      // console.log('im in fifth selector');
      break;
  }
})();
