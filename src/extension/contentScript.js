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

function generateFollowearDiv(selector, outfit) {
  var followear_div = document.createElement('div');
  followear_div.className = 'followear';
  followear_div.id = 'flwr';
  var button = document.createElement('button');
  button.id = 'flbtn';
  var text = document.createTextNode('followear');
  var img = document.createElement('img');

  var url = chrome.runtime.getURL('images/fw.PNG');
  img.setAttribute('src', url);
  img.setAttribute('width', '25');
  img.setAttribute('height', '25');

  //button.appendChild(img);
  followear_div.appendChild(img);
  $(selector).append(followear_div);
  var fl = $(selector).find('#flwr');

  // var cs = getComputedStyle($('#flwr')[0]);
  // for (var i = 0; i < cs.length; i++) {
  //   fl.css(cs[i], 'inherit');
  // }
  fl.css({
    float: 'right'
  });

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
    generateFollowearDiv($(this), outfit);
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
    generateFollowearDiv($(this), outfit);
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
    generateFollowearDiv($(this), outfit);
  });
}

(function() {
  switch (window.location.hostname) {
    case 'www.net-a-porter.com':
      selector = $('ul.products').find('.description');
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
  }
})();
