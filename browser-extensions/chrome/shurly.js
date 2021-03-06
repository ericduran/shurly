// A generic onclick callback function.
function genericOnClick(info, tab) {
  var url = shurlyGetUrl(info);
  shurlyGetShortUrl(url);
}

// Create a contextMenu item and assign an onclick event to it.
var shurlyLink = chrome.contextMenus.create({
  "title": "shUrly",
  "contexts": ["page","link","image"],
  "onclick": genericOnClick
});

chrome.browserAction.onClicked.addListener(function(tab) {
  if (tab.url != undefined) {
    shurlyGetShortUrl(tab.url);
  }
});

function shurlyGetUrl(info) {
  if (info.srcUrl != undefined) {
    // Its an image
    return info.srcUrl;
  }
  else if (info.linkUrl != undefined) {
    // Its a link
    return info.linkUrl;
  }
  else {
    // It has to be the page, either way, we're going to return the page url/
    return info.pageUrl;
  }
}

function shurlyGetShortUrl(url) {
  var xhr = new XMLHttpRequest();
  //The domain should be configurable.
  var shUrl = "http://lb.cm/shurly/api/shorten?longUrl=" + url + "&format=txt";
  xhr.open("GET", shUrl, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.responseText) {
        copyToClipboard(xhr.responseText);
      }
    }
  }
  xhr.send();
}

/**
 * Automagically save to clipboard.
 * We need to do a small pop-up bubble, that fades out in 2 sec.
 */
function copyToClipboard(text){
  var input = document.getElementById('clipboard');
  input.value = text;
  input.focus();
  input.select();
  document.execCommand('Copy');
  
  // Create a simple text notification:
  var notification = webkitNotifications.createNotification(
    'lullabotx85.png',  // icon url - can be relative
    'shUrly',  // notification title
    'URL Copied to clipboard: ' + text  // notification body text
  );
  
  // Show the notification.
  notification.show();
}