let casObs = new MutationObserver((mutations, self) => {
  for (let mutation of mutations) {
    if (mutation.addedNodes.length === 30) {
      let scr = document.createElement("script");
      scr.src = chrome.runtime.getURL("scripts/better_cas_add_record_info.js");
      let page = document.getElementsByClassName("page-container")[0];
      page.insertBefore(scr, page.getElementsByTagName("script")[4]);
      self.disconnect();
    }
  }
})

let dropdownObs = new MutationObserver((mutations, self) => {
  for (let mutation of mutations) {
    let dropdown = document.getElementById("select_item_term");
    if (dropdown.children[1]) {
      // dropdown.children[1].selected = true;
      self.disconnect();
    }
  }
})

function pageJump(name) {
  document.title = "TSIMS | " + name;
  let pagesWithDropdown = ["成绩查询", "成长报告", "CAS评价", "反思与记录"];
  if (pagesWithDropdown.includes(name)) {
    dropdownObs.observe(document.body, { childList: true, subtree: true, attributes: false, characterData: false });
  }
  if (name === "活动记录") {
    casObs.observe(document.body, { childList: true, subtree: true, attributes: false, characterData: false });
  }
}

jQuery(() => {
  for (let tab of document.getElementsByClassName("dropdown")) {
    if (tab.id !== "menu_trascript2") {
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
          item.addEventListener("click", () => pageJump(item.innerText));
          if (item.hasAttribute("style")) {
            item.removeAttribute("style");
            item.children[0].setAttribute("style", "color: lightgray;");
          }
        }
      } else {
        tab.addEventListener("click", () => pageJump(tab.innerText));
      }
    }
  }
})
