export default class YtmApi {
  public static request(message: string, callback: any): void {
    chrome.tabs.query({active: true, currentWindow: true, url: 'https://music.youtube.com/*'}, function(tabs) {
      if (tabs.length) {
        if (tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, {text: message}, function(response) {
            callback(response);
          });
        }
      } else {
        callback('Please open youtube music');
      }
    });
  }
}
