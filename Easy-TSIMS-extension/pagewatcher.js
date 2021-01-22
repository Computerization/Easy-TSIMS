new MutationObserver(function(mutations) {
  for (let mutation of mutations) {
    if (mutation.addedNodes.length > 2) {
      chrome.storage.local.get("pagename", function(result) {
        let lastpage = result.pagename;
        if (typeof lastpage != "string" || lastpage.length == 0)
          lastpage = "Homepage";
        let curpage = document.getElementsByTagName("h1")[0]?.innerText;
        if (typeof curpage != "string" || curpage.length == 0)
          curpage = "Homepage";
        if (curpage != lastpage) {
          chrome.storage.local.set({pagename: curpage});
          document.title = "TSIMS | " + curpage;
          if (curpage == "活动记录") {
            let scr = document.createElement("script");
            scr.src = chrome.runtime.getURL("better_cas_add_record_info.js");
            for (el of document.getElementsByTagName("script")) {
              if (el.src == "http://101.230.1.163/ajax/cas_add_record_info.js")
                el.parentNode.insertBefore(scr, el.nextSibling);
            }
          }
        }
      });
    }
  }
}).observe(document, { attributes: false, childList: true, subtree: true });
