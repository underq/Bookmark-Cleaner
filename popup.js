function cleanBookmarks() {
  chrome.bookmarks.getTree(
    function(bookmarkTreeNodes) {
      dumpTreeNodes(bookmarkTreeNodes);
    });
}

function dumpTreeNodes(bookmarkNodes) {
  for (i = 0; i < bookmarkNodes.length; i++) {
    listBookmarkUrl(bookmarkNodes[i]);
  }
}

function listBookmarkUrl(bookmarkNode) {
  var listHtml = $('ul#bookmarks');
  if (bookmarkNode.title && bookmarkNode.url && isValidUrl(bookmarkNode.url)) {
    $.ajax({
      url: bookmarkNode.url,
      timeout:5000,
    }).fail(function (jqXHR, textStatus) {
      var anchor = $('<a>');
      anchor.attr('href', bookmarkNode.url);
      anchor.text(bookmarkNode.title);
      anchor.click(function() {
        chrome.tabs.create({url: bookmarkNode.url});
      });
      var info = $('<span>');
      info.attr('class', 'text-danger');
      info.text('[' + jqXHR.status + ' ' +  jqXHR.statusText + '] ');
      var info = info.add(anchor);
      listHtml.append($('<li>').append(info));
    });
  }

  if (bookmarkNode.children && bookmarkNode.children.length > 0) {
    dumpTreeNodes(bookmarkNode.children);
  }
}

function isValidUrl(url) {
  var regexp = 'localhost|chrome://';
  if (url.search(regexp) === -1) {
    return true;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  cleanBookmarks();
});

document.getElementById("uninstall").addEventListener('click', function() {
  var options = {'showConfirmDialog': true};
  chrome.management.uninstallSelf(options);
});

$(document).ajaxStop(function () {
  $('#loading').hide();
  $('#uninstall').removeClass('hidden');
});
