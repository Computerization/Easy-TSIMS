$(document).ready(function() {
  for (let tab of document.getElementsByClassName("dropdown"))
    if (tab.id != "menu_trascript2") {
      if (tab.hasAttribute("style")) {
        tab.removeAttribute("style");
        tab.children[0].setAttribute("style", "color: lightgray;");
        for (let item of tab.children[1].children) {
          item.removeAttribute("style");
          item.children[0].setAttribute("style", "color: lightgray;");
        }
      }
      if (tab.children.length > 1)
        for (let item of tab.children[1].children)
          if (item.hasAttribute("style")) {
            item.removeAttribute("style");
            item.children[0].setAttribute("style", "color: lightgray;");
          }
    }
})
