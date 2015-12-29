var list = new Array();

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
  if (bookmarkNode.title && bookmarkNode.url) {
    $.ajax({
      url: bookmarkNode.url,
      timeout:5000,
    }).fail(function (jqXHR, textStatus) {
      console.log(jqXHR.statusCode())
      list.push(bookmarkNode);
    });
  }

  if (bookmarkNode.children && bookmarkNode.children.length > 0) {
    dumpTreeNodes(bookmarkNode.children);
  }
}

function isExternalUrl() {

}

document.addEventListener('DOMContentLoaded', function () {
  cleanBookmarks();
  console.log(list);
});
