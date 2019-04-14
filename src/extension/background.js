// this is the background code...

// listen for our browerAction to be clicked
chrome.browserAction.onClicked.addListener(function() {
  // for the current tab, inject the "inject.js" file & execute it
  chrome.tabs.executeScript(null, {
    file: 'contentScript.js'
  });
});

//chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//console.log('im outfit', JSON.stringify(message.outfit));
// $.ajax({
//   type: 'POST',
//   contentType: 'application/json; charset=utf-8',
//   dataType: 'json',
//   url: 'http://localhost:8080/spring-css/addOutfit',
//   data: JSON.stringify(message.outfit), // Note it is important
//   success: function(result) {
//     // do what ever you want with data
//   }
// });
//});

function postOutfit(base64) {
  $.ajax({
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    url: 'https://948cede8-7e62-4646-bc2a-e0238d9ea26b.mock.pstmn.io',
    data: JSON.stringify(message.outfit), // Note it is important
    success: function(result) {
      // do what ever you want with data
    }
  });
}

function getBase64Image(img) {
  var canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL('image/png');
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  sendResponse({ farewell: 'goodbye' });

  $.ajax({
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    //dataType: 'json',
    url: 'https://948cede8-7e62-4646-bc2a-e0238d9ea26b.mock.pstmn.io/hello',
    //data: JSON.stringify(request.outfit), // Note it is important
    success: function(result) {
      console.log(result);
      // do what ever you want with data
    }
  });
});
