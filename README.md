WheezyWaiter uploads
--------------------

YouTube does not have great support for chronologically watching every video from a channel with lots of uploads.

So I made a [website][site] to show all the YouTube videos from WheezyWaiter.


other channels
--------------

In the future, I might generalize this so you can watch videos from any channel you want.

To try it yourself:

1. [Create an API key][createapikey].
2. [Enable your API key][enableapikey].
3. Open [this page][puller].  Paste in your API key, and paste in the Channel ID, and hit Go.
4. Click Download JSON.
5. Open the JSON file, select all, and copy to your clipboard.
6. Open the [player][site].
7. Open the dev tools by hitting F12.  Open the Storage tab.  Under "Local Storage", choose artskydj.github.io.
8. Delete the "videos" key/value, and then add a key/value with a key of "videos" and a value of the data in your clipboard.
9. Refresh the page.


development
-----------

Install node.js/npm.

```sh
npm install
npm test
npm run dev
```
Then open your browser to localhost:8080.


[site]: https://artskydj.github.io/wheezy-waiter-uploads/
[createapikey]: https://console.cloud.google.com/apis/dashboard
[enableapikey]: https://console.developers.google.com/apis/enabled
[puller]: https://artskydj.github.io/wheezy-waiter-uploads/youtube-playlist-puller.html
