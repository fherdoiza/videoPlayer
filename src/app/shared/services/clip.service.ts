import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClipService {

  constructor() { }
  findAll() {
    let data = sessionStorage['clips'];
    if (data && data !== 'undefined') {
      data = JSON.parse(data);
    }
    return data;
  }

  get(clipId) {
    const data = sessionStorage[clipId];
    let value = null;
    if (data && data !== 'undefined') {
      value = JSON.parse(data);
    }
    return value;
  }

  post(data) {
    let clipsData = sessionStorage['clips'];
    if (clipsData && clipsData !== 'undefined') {
      clipsData = JSON.parse(clipsData);
    } else {
      clipsData = [];
    }
    const date = new Date();
    data.clipId = 'clip-' + date.getTime();
    clipsData.push(data);
    sessionStorage.setItem('clips', JSON.stringify(clipsData));
  }

  put(data) {
    let clipsData = sessionStorage['clips'];
    if (clipsData && clipsData !== 'undefined') {
      clipsData = JSON.parse(clipsData);
    } else {
      clipsData = [];
    }
    clipsData = clipsData.map(function (clip) { return clip.clipId === data.clipId ? data : clip; });
    sessionStorage.setItem('clips', JSON.stringify(clipsData));
  }

  delete(clip) {
    let clipsData = sessionStorage['clips'];
    if (clipsData && clipsData !== 'undefined') {
      clipsData = JSON.parse(clipsData);
      clipsData.forEach((actualClip, i) => {
        if (actualClip.clipId === clip.clipId) {
          clipsData.splice(i, 1);
        }
      });
      sessionStorage.setItem('clips', JSON.stringify(clipsData));
    }
  }
}
