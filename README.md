[shell_img]: https://gstatic.com/cloudssh/images/open-btn.png

<img src="https://github.com/Mellowed/get-liked/blob/main/public/icons/512i.png" alt="Google Cloud Platform logo" title="Google Cloud Platform" align="right" height="96" width="96"/>

# get-liked

[Open in chrome store](https://chrome.google.com/webstore/detail/get-liked/nchjpidipjlipchkpecddgjhlanecfmj?hl=en&authuser=0)

## Table of Contents

* [Introduction](#introduction)
  * [What](#What)
  * [Why](#Why)
  * [How](#how)
  * [Demo](#demo)
    * [Using Google API](#using-google-api) 
* [Build](#build)
  * [Prerequisites](prerequisites)
  * [Cloud Shell](#cloud-shell)  
  * [Project Setup](#project-setup)
    * [set Client IDs](#set-client-ids)
    * [Compiles and hot-reloads for development](#compiles-and-hot-reloads-for-development)    
    * [Compiles and minifies for production](#compiles-and-minifies-for-production)    
    * [Load Extention](#load-extention)        
# Introduction

### What

Transfer youtube music playlist or liked songs to spotify.

### Why

I needed a way to transfer my liked songs from Youtube Music to Spotify. 
Inevitable scope creep and curiosity lead to a chrome extention that could transfer libraries and/or liked songs to Spotify. 

### How

 Option 1
 1) Provide readonly access to your Youtube Music account. 
 2) Add playlist tracks to a temporary playist. 
 3) Provide Access to your spotify account spotify. 
 4) Link tracks by using spotify search api.
 5) Create the new playlist in spotify. 

 Option 2 *for those of us who prefer not to provide access to our google accounts.
 1) Scrape youtube music playlist.
 2) Add playlist tracks to a temporary playist. 
 3) Provide Access to your spotify account. 
 4) Link tracks by using spotify search api.
 5) Create the new playlist in spotify. 

### Demo

<details>
  <summary>Expand Demo</summary>
 
  #### Using Google API
 
![](https://github.com/Mellowed/get-liked/blob/main/images/Demo.gif)

</details>

-----

# Build

## Prerequisites

* Cloned Repo
* [Spotify Client ID](https://developer.spotify.com/dashboard/applications)
* [Chrome Extention Client ID](https://chrome.google.com/webstore/devconsole)
* [Google Cloud Platform OAuth 2 client](https://console.cloud.google.com/apis/credentials)

## Cloud Shell

[![Open in Cloud Shell][shell_img]](https://ssh.cloud.google.com/cloudshell/editor?cloudshell_git_repo=https%3A%2F%2Fgithub.com%2FMellowed%2Fget-liked)

## Project Setup
```
npm install
```

### Set Client IDs
```
Update your client id within the manifest and spotifyApi
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Load Extention

1) Open chrome extensions by typing chrome://extensions/ into Chrome's Omnibox or navigate via the chrome menu.
2) Select 'Load unpacked'. 
3) Select the dist file generated by 'npm run build'.

