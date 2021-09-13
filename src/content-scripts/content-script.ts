/// <reference types="chrome"/>

import {Track} from '@/core/models/track';

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.text === 'report_back') {
    sendResponse('Ok');
  }

  if (msg.text === 'get_tracks') {
    let results = updateSongs();
    sendResponse(results);
  }

  if (msg.text === 'get_playlist_track_count') {
    let results = getPlaylistTrackCount();
    sendResponse(results);
  }

  if (msg.text === 'load_more') {
    scrollToBottomOfPage();
  }

  if (msg.text === 'get_playlist_name') {
    let results = getPlaylistName();
    sendResponse(results);
  }

  if (msg.text === 'get_playlist_thumbnail') {
    let result = getPlaylistThumbnail();
    sendResponse(result);
  }

  if (msg.text === 'has_continuation') {
    let result = document.getElementsByTagName('yt-next-continuation').length > 0;
    sendResponse(result);
  }
});

function updateSongs(): Array<Track> {
  let results = [];
  let playlistContent = document.getElementsByTagName('ytmusic-responsive-list-item-renderer');

  for (let item of playlistContent) {
    let ee = item.getElementsByTagName('yt-formatted-string') as HTMLCollectionOf<HTMLElement>;
    let ytmId = (item.getElementsByTagName('yt-formatted-string')[0].children[0] as HTMLAnchorElement).href;
    results.push(new Track(ee[0].title, ee[1].title, ee[2].title, ee[3].title, '', '', ytmId ? ytmId : '---', ''));
  }
  return results;
}

function scrollToBottomOfPage(): void {
  window.scrollTo(0, document.body.scrollHeight);
}

function getPlaylistName(): string {
  let subtitle = document.getElementsByClassName('title style-scope ytmusic-detail-header-renderer')[0] as HTMLElement;
  return subtitle.innerText;
}

function getPlaylistTrackCount(): string {
  let subtitle = document.getElementsByClassName(
    'second-subtitle style-scope ytmusic-detail-header-renderer'
  )[0] as HTMLElement;
  return subtitle.innerText;
}

function getPlaylistThumbnail(): string {
  let subtitle = document.getElementById('thumbnail')?.getElementsByTagName('img')[0] as HTMLImageElement;
  return subtitle.src;
}
