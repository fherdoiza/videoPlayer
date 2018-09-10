import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, TemplateRef, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ModalClipComponent } from '../modal-clip/modal-clip.component';
import { ClipService } from '../../shared/services/clip.service';

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

  clips: any = [];
  videoSelected = {
    originSource: './assets/sintel.mp4',
    source: './assets/sintel.mp4#t=6,20'
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
    this.renderer.listen(this.video, 'playing', (): void => {
      this.startScreenshot();
    });
    this.renderer.listen(this.video, 'pause', (): void => {
      this.stopScreenshot();
    });
    this.renderer.listen(this.video, 'ended', (): void => {
      this.stopScreenshot();
    });
  }

  ngOnInit() {
    this.video = this.elementRef.nativeElement.querySelector('video');
    this.canvas = this.elementRef.nativeElement.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');

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
    /*this.ctx.drawImage(this.video, 0, 0, this.videoWidth, this.videoHeight);
    this.clips.push({
      source: this.canvas.toDataURL('image/png')
    });*/
    /*const img = new Image();
    img.src = this.canvas.toDataURL('image/png');
    img.width = 120;
    this.renderer.addClass(img, 'img-thumbnail');
    this.renderer.appendChild(this.ssContainer.nativeElement, img);*/
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
          isNew ? this.clipService.post(result) : this.clipService.put(result);
          this.videoSelected.source = this.videoSelected.originSource + '#t=' + result.timeStart + ',' + result.timeEnd;
          this.video.load();
          this.setClips();
        }
      });
    });
  }
}
