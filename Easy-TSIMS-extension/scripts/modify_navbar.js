let obs = new MutationObserver((mutations, obs) => {
  for (mutation of mutations) {
    if (mutation.addedNodes.length == 30) {
      let scr = document.createElement("script");
      scr.src = chrome.runtime.getURL("scripts/better_cas_add_record_info.js");
      let page = document.getElementsByClassName("page-container")[0];
      page.insertBefore(scr, page.getElementsByTagName("script")[4]);
      obs.disconnect();
    }
  }
})

// let dropdownObs = new MutationObserver((mutations, obs) => {
//   for (mutation of mutations) {
//     if (mutation.addedNodes.length > 5) {
//       let dropdown = document.getElementById("select_item_term");
//       if (dropdown != null) {
//         let options = dropdown.children;
//         console.log(options);
//         console.log(options.length);
//         dropdown.children[1].selected = true;
//       }
//     }
//   }
// })

function pageJump(name) {
  document.title = "TSIMS | " + name;
  // dropdownObs.observe(document.body, { childList: true, subtree: true, attributes: false, characterData: false });
  if (name == "活动记录") {
    obs.observe(document.body, { childList: true, subtree: true, attributes: false, characterData: false });
  }
}

$(document).ready(() => {
  for (let tab of document.getElementsByClassName("dropdown")) {
    if (tab.id != "menu_trascript2") {
      if (tab.hasAttribute("style")) {
        tab.removeAttribute("style");
        tab.children[0].setAttribute("style", "color: lightgray;");
        for (let item of tab.children[1].children) {
          item.removeAttribute("style");
          item.children[0].setAttribute("style", "color: lightgray;");
        }
      }
      if (tab.children.length > 1) {
        for (let item of tab.children[1].children) {
          item.onclick = (event) => {
            pageJump(event.path[1].children[0].innerText)
          };
          if (item.hasAttribute("style")) {
            item.removeAttribute("style");
            item.children[0].setAttribute("style", "color: lightgray;");
          }
        }
      } else {
        tab.onclick = (event) => {
          pageJump(event.path[1].children[0].innerText)
        };
      }
    }
  }
})
