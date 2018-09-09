import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, TemplateRef, Renderer2 } from '@angular/core';

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

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
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
    const img = new Image();
    img.src = this.canvas.toDataURL('image/png');
    img.width = 120;
    this.renderer.addClass(img, 'img-thumbnail');
    this.renderer.appendChild(this.ssContainer.nativeElement, img);
  }

}
