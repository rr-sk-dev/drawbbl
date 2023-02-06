import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss'],
})
export class DrawComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.setupCanvas();
  }

  isDrawing = false;

  drawSettings = {
    backgroundColor: 'white',
    color: 'black',
    penWidth: 2,
  };

  restoreArr: any = [];
  index = -1;

  private parentElem!: HTMLDivElement;
  private ctx!: CanvasRenderingContext2D;

  private setupCanvas = () => {
    // Parent Element
    this.parentElem = this.canvasRef.nativeElement
      .parentElement as HTMLDivElement;

    // 2D Context
    this.ctx = this.canvasRef?.nativeElement.getContext('2d', {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;

    // Dimensions
    this.setCanvasDefaultDimensions();

    // Default Styles
    this.setCanvasDefaultStyles();

    // Event Listeners
    this.registerEventListeners();
  };

  private setCanvasDefaultDimensions = () => {
    const parentHeight = this.parentElem.offsetHeight;
    const parentWidth = this.parentElem.offsetWidth;

    const offsetY = this.canvasRef.nativeElement.getBoundingClientRect().top;
    const offsetX = this.canvasRef.nativeElement.getBoundingClientRect().left;

    // Width
    this.canvasRef.nativeElement.width = parentWidth;

    // Height
    this.canvasRef.nativeElement.height = parentHeight - offsetY;
  };

  private setCanvasDefaultStyles = () => {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  };

  private registerEventListeners = () => {
    this.canvasRef.nativeElement.addEventListener(
      'touchstart',
      this.start,
      false
    );

    this.canvasRef.nativeElement.addEventListener(
      'touchmove',
      this.draw,
      false
    );

    this.canvasRef.nativeElement.addEventListener(
      'mousedown',
      this.start,
      false
    );

    this.canvasRef.nativeElement.addEventListener(
      'mousemove',
      this.draw,
      false
    );

    this.canvasRef.nativeElement.addEventListener('touchend', this.stop, false);
    this.canvasRef.nativeElement.addEventListener('mouseup', this.stop, false);
    this.canvasRef.nativeElement.addEventListener('mouseout', this.stop, false);
  };

  private getX = (event: any) => event.clientX || event.touches[0].clientX;

  private getY = (event: any) => event.clientY || event.touches[0].clientY;

  private start = (event: any) => {
    this.isDrawing = true;

    this.ctx.beginPath();
    this.ctx.moveTo(
      this.getX(event) - this.getSelfPosition().x,
      this.getY(event) - this.getSelfPosition().y
    );

    if (event.cancelable) {
      event.preventDefault();
    }
  };

  private draw = (event: any) => {
    if (this.isDrawing) {
      this.ctx.lineTo(
        this.getX(event) - this.getSelfPosition().x,
        this.getY(event) - this.getSelfPosition().y
      );

      this.ctx.strokeStyle = this.drawSettings.color;
      this.ctx.lineWidth = this.drawSettings.penWidth;
      this.ctx.lineCap = 'round';

      (this.ctx as any).lineJoin = '';
      this.ctx.stroke();
    }

    if (event.cancelable) {
      event.preventDefault();
    }
  };

  private stop = (event: any) => {
    if (this.isDrawing) {
      this.ctx.stroke();
      this.ctx.closePath();
      this.isDrawing = false;
    }

    if (event.cancelable) {
      event.preventDefault();
    }

    if (event.type !== 'mouseout' || event.type !== 'touchend') {
      this.restoreArr.push(
        this.ctx.getImageData(
          0,
          0,
          this.canvasRef.nativeElement.width,
          this.canvasRef.nativeElement.height
        )
      );
      this.index += 1;
    }
  };

  private getSelfPosition = () => {
    return {
      x: this.canvasRef.nativeElement.getBoundingClientRect().left,
      y: this.canvasRef.nativeElement.getBoundingClientRect().top,
    };
  };
}
