import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, TemplateRef, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ModalClipComponent } from '../modal-clip/modal-clip.component';
import { ClipService } from '../../shared/services/clip.service';
import { VideoClip } from '../../shared/models/video-clip';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  video;
  canvas;
  ctx;
  @ViewChild('ssContainer') ssContainer: ElementRef;
  videoHeight = null;
  videoWidth;
  originSourceVideo = './assets/sintel.mp4';
  clips: Array<VideoClip> = [];
  videoSelected: VideoClip;
  prevClip = -1;
  nextClip = 1;
  showLoading = false;

  videoComplete: VideoClip = {
    clipId: 'complete',
    source: './assets/fullVideo.png',
    name: 'Video Completo',
    startTime: 0,
    endTime: 52,
    videoClip: this.originSourceVideo
  };

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    public dialog: MatDialog,
    private clipService: ClipService
  ) { }

  ngAfterViewInit() {
    this.renderer.listen(this.video, 'loadedmetadata', (): void => {
      this.initScreenshot();
    });
    this.renderer.listen(this.video, 'pause', (): void => {
      this.canGoNextClip();
    });

    this.renderer.listen('document', 'keyup', (event) => {
      if (event.keyCode === 37) {
        this.playAnotherClip(this.prevClip);
      }
      if (event.keyCode === 39) {
        this.playAnotherClip(this.nextClip);
      }
    });
  }

  ngOnInit() {
    this.video = this.elementRef.nativeElement.querySelector('video');
    this.canvas = this.elementRef.nativeElement.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.videoSelected = this.videoComplete;
    this.setClips();
  }

  initScreenshot() {
    this.videoHeight = this.video.videoHeight;
    this.videoWidth = this.video.videoWidth;
    this.canvas.width = this.videoWidth;
    this.canvas.height = this.videoHeight;
  }

  grabScreenshot(): string {
    this.ctx.drawImage(this.video, 0, 0, this.videoWidth, this.videoHeight);
    return this.canvas.toDataURL('image/png');
  }
  setClips() {
    this.clips = this.clipService.findAll();
    this.clips.unshift(this.videoComplete);
  }
  addClip() {
    this.openModal(true, null);
  }
  editClip(clip: VideoClip) {
    this.openModal(false, clip);
  }
  playClip(clip: VideoClip) {
    this.videoSelected = clip;
    this.video.load();
    this.video.play();
  }
  deleteClip(clip: VideoClip) {
    this.clipService.delete(clip);
    this.setClips();
    this.playClip(this.clips[0]);
  }
  openModal(isNew: boolean, clip: VideoClip) {
    setTimeout(() => {
      const dialogRef = this.dialog.open(ModalClipComponent, {
        data: isNew ? {} : clip,
        width: '500px'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          result.videoClip = this.originSourceVideo + '#t=' + result.startTime + ',' + result.endTime;
          this.videoSelected = result;
          this.video.load();
          setTimeout(() => {
            this.video.oncanplay = this.generateClip(isNew, result);
          }, 500);
        }
      });
    });
  }
  generateClip(isNew: boolean, result: any) {
    result.source = this.grabScreenshot();
    isNew ? this.clipService.post(result) : this.clipService.put(result);
    this.setClips();
  }
  // extra
  playAnotherClip(nextOrPrev) {
    let actualClip, indexClip;
    this.clips.forEach((actClip, ixdClip) => {
      if (actClip.clipId === this.videoSelected.clipId) {
        indexClip = ixdClip;
      }
    });
    if (indexClip >= 0 && indexClip < this.clips.length) {
      actualClip = this.clips[indexClip + nextOrPrev];
    }
    if (actualClip) {
      this.playClip(actualClip);
    }
  }
  canGoNextClip() {
    if (this.video.currentTime >= this.videoSelected.endTime) {
      this.showLoading = true;
      setTimeout(() => {
        this.showLoading = false;
        this.playAnotherClip(this.nextClip);
      }, 3000);
    }
  }
}
