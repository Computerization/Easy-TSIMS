# Easy-TSIMS

> A chrome extension to make WFLA's TSIMS more usable

This extension was created by Joshua Chen ([@Josh-Cena](https://github.com/Josh-Cena). It is now under the maintenance of the [WFLA Computerization club](https://github.com/Computerization).

## Installation

After downloading the code, you will have two versions of the distribution: one `/Easy-TSIMS-extension/` and one `/Easy-TSIMS-extension.crx`. **(Take note that `/Easy-TSIMS-extension/` is different from its parent directory `/Easy-TSIMS/`! The latter is just a collection of all the things you may find useful, but the directory itself is pretty useless.)**

Since the extension is not published to chrome webstore, the packed version is likely not going to work, unless you are installing it on a non-chrome browser (e.g. Edge). Therefore, after navigating to `chrome://extensions`, turn on "developer mode", then select "load unpacked", and select the directory `/Easy-TSIMS-extension/` (the one with `manifest.json` in it). Finally, activate the extension, and check if it works by opening a new tab and navigating to [TSIMS](http://101.230.1.163).

## Trouble-shooting

This extension is still under development. It is _not_ guaranteed to be working under all environments. If you find any bug, please [file an issue](https://github.com/Computerization/Easy-TSIMS/issues/new).

If the hidden tabs fail to show up the first time you install the extension, but you do see the title "To Suffer In My School", that means the extension is installed properly but may not be fully loaded. Consider refreshing the page for at least 3 times over 3 minutes and restarting the browser before concluding that it doesn't work.

## Release notes

- 1.0: Initial launch
- 1.1 CAS update
  - 1.1.0: Add "CAS overview" function
  - 1.1.1: Rewrite "CAS progress bar"
    - 1.1.1.1: Make extension usable on new URL to TSIMS
  - [WIP] 1.1.2: Dropdown menu auto select
- 1.2 Grade update
  - 1.2.0: Add "What if" function in semester grade report
- 2.0 Migrate to Manifest V3

## More information

Here is a brief introduction article: https://mp.weixin.qq.com/s/y--UoBa6jJjQJwMl0jpn4g
