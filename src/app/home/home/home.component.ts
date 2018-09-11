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
  drawTimer = null;
  originSourceVideo = './assets/sintel.mp4';
  clips: Array<VideoClip> = [];
  videoSelected: VideoClip;

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

  startScreenshot() {
    if (this.drawTimer == null) {
      this.drawTimer = setInterval((): void => { this.grabScreenshot(); }, 1000);
    }
  }

  stopScreenshot() {
    if (this.drawTimer) {
      clearInterval(this.drawTimer);
      this.drawTimer = null;
    }
  }

  grabScreenshot() {
    this.ctx.drawImage(this.video, 0, 0, this.videoWidth, this.videoHeight);
    return this.canvas.toDataURL('image/png');
  }
  setClips() {
    this.clips = this.clipService.findAll();
  }
  addClip() {
    this.openModal(true, null);
  }
  editClip(clip) {
    this.openModal(false, clip);
  }
  playClip(clip) {
    this.videoSelected = clip;
    this.video.load();
    this.video.play();
  }
  deleteClip(clip) {
    this.clipService.delete(clip);
    this.setClips();
  }
  openModal(isNew, clip) {
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
  generateClip(isNew, result) {
    result.source = this.grabScreenshot();
    isNew ? this.clipService.post(result) : this.clipService.put(result);
    this.setClips();
  }
  // extra
  playAnotherClip(nextOrPrev) {
    let actualClip;
    if (this.videoSelected.clipId === 'complete' && nextOrPrev > 0 && this.clips.length > 0) {
      actualClip = this.clips[0];
    } else {
      const index = this.clips.indexOf(this.videoSelected);
      if (index >= 0 && index <= this.clips.length - 1) {
        actualClip = (index + nextOrPrev) < 0 ? this.videoComplete : this.clips[index + nextOrPrev];
      }
    }
    if (actualClip) {
      this.playClip(actualClip);
    }
  }

}
