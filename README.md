# Easy-TSIMS
> A chrome extension to make WFLA's TSIMS more usable

## Installation
After downloading the code, you will have two versions of the distribution: one `/Easy-TSIMS-extension/` and one `/Easy-TSIMS-extension.crx`. **(Take note that `/Easy-TSIMS-extension/` is different from its parent directory `/Easy-TSIMS/`! The latter is just a collection of all the things you may find useful, but the directory itself is pretty useless.)**

Since the extension is not published to chrome webstore, the packed version is likely not going to work, unless you are installing it on a non-chrome browser (e.g. Edge, QQ). Therefore, after navigating to `chrome://extensions`, turn on "developer mode", then select "load unpacked", and select the directory `/Easy-TSIMS-extension/` (the one with `manifest.json` in it). Finally, activate the extension, and check if it works by opening a new tab and navigating to [TSIMS](http://101.230.1.163).

## Trouble-shooting
This extension is still under development. It is *not* guaranteed to be working under all environments. If you find any bug, please contact me in any way and I will be happy to help you debug.

If the hidden tabs fail to show up the first time you install the extension, but you do see the title "To Suffer In My School", that means the extension is installed properly but may not be fully loaded. Consider refreshing the page for at least 3 times over 3 minutes and restarting the browser before concluding that it doesn't work.
