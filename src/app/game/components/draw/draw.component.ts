import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss'],
})
export class DrawComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('undo', { static: true })
  undoBtn!: ElementRef<HTMLSpanElement>;

  @ViewChild('clear', { static: true })
  clearBtn!: ElementRef<HTMLSpanElement>;

  @ViewChild('colorPicker', { static: true })
  colorPicker!: ElementRef<HTMLInputElement>;

  @ViewChild('penWidth', { static: true })
  penWidth!: ElementRef<HTMLInputElement>;

  @HostListener('window:resize')
  resizeCanvas() {
    this.resetCanvasDimension();
    this.resetCanvasStyles();
  }

  private context!: CanvasRenderingContext2D;

  defaultSettings = {
    bgColor: 'white',
    color: '#DD3636',
    penWidth: 3,
    lineCap: 'round',
  };

  private isDrawing = false;

  private restoreArr: any = [];
  private index = -1;

  ngAfterViewInit(): void {
    this.render();
  }

  private render = () => {
    // 2D Context
    this.context = this.canvasRef.nativeElement.getContext('2d', {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;

    // Default Dimensions
    this.resetCanvasDimension();

    // Default Styles
    this.resetCanvasStyles();

    // Event Listeners
    this.registerEventListeners();
  };

  /**
   * Resets the canvas height and width.
   */
  private resetCanvasDimension = () => {
    // Height
    this.canvasRef.nativeElement.height =
      this.getParentDimensions(this.canvasRef.nativeElement).height -
      document.getElementsByClassName('actions')[0].clientHeight -
      2; // actions border

    // Width
    this.canvasRef.nativeElement.width =
      this.getParentDimensions(this.canvasRef.nativeElement).width -
      this.getElementPosition(this.canvasRef.nativeElement).x;
  };

  /**
   * Resets the canvas default styles.
   */
  private resetCanvasStyles = () => {
    this.context.fillStyle = this.defaultSettings.bgColor;
    this.context.fillRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
  };

  /**
   * Register all the events related to the drawing logic.
   */
  private registerEventListeners = () => {
    this.canvasRef.nativeElement.addEventListener(
      'touchstart',
      this.start,
      false
    );
    this.canvasRef.nativeElement.addEventListener(
      'mousedown',
      this.start,
      false
    );
    this.canvasRef.nativeElement.addEventListener(
      'touchmove',
      this.draw,
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

    this.undoBtn.nativeElement.addEventListener('click', this.undo);
    this.clearBtn.nativeElement.addEventListener('click', this.clear);

    this.colorPicker.nativeElement.addEventListener('change', (ev) => {
      this.defaultSettings.color = (ev?.target as any).value;
    });

    this.penWidth.nativeElement.addEventListener('change', (ev) => {
      this.defaultSettings.penWidth = (ev?.target as any).value;
    });
  };

  /**
   * Starts drawing.
   * @param event
   */
  private start = (event: MouseEvent | TouchEvent) => {
    this.isDrawing = true;

    this.context.beginPath();

    if (event instanceof TouchEvent) {
      this.context.moveTo(
        this.getTouchEventPositions(event).x -
          this.getElementPosition(this.canvasRef.nativeElement).x,
        this.getTouchEventPositions(event).y -
          this.getElementPosition(this.canvasRef.nativeElement).y
      );
    } else {
      this.context.moveTo(
        this.getMouseEventPositions(event).x -
          this.getElementPosition(this.canvasRef.nativeElement).x,
        this.getMouseEventPositions(event).y -
          this.getElementPosition(this.canvasRef.nativeElement).y
      );
    }

    this.context.strokeStyle = this.defaultSettings.color;
    this.context.lineWidth = this.defaultSettings.penWidth;
    this.context.lineCap = this.defaultSettings.lineCap as CanvasLineCap;

    (this.context as any).lineJoin = '';
    this.context.stroke();
  };

  /**
   *
   * @param event
   */
  private draw = (event: MouseEvent | TouchEvent) => {
    if (this.isDrawing) {
      if (event instanceof TouchEvent) {
        this.context.lineTo(
          this.getTouchEventPositions(event).x -
            this.getElementPosition(this.canvasRef.nativeElement).x,
          this.getTouchEventPositions(event).y -
            this.getElementPosition(this.canvasRef.nativeElement).y
        );
      } else {
        this.context.lineTo(
          this.getMouseEventPositions(event).x -
            this.getElementPosition(this.canvasRef.nativeElement).x,
          this.getMouseEventPositions(event).y -
            this.getElementPosition(this.canvasRef.nativeElement).y
        );
      }

      this.context.strokeStyle = this.defaultSettings.color;
      this.context.lineWidth = this.defaultSettings.penWidth;
      this.context.lineCap = this.defaultSettings.lineCap as CanvasLineCap;

      (this.context as any).lineJoin = '';
      this.context.stroke();
    }

    if (event.cancelable) {
      event.preventDefault();
    }
  };

  /**
   *
   * @param event
   */
  private stop = (event: MouseEvent | TouchEvent) => {
    if (this.isDrawing) {
      this.context.stroke();
      this.context.closePath();
      this.isDrawing = false;
    }

    if (event.cancelable) {
      event.preventDefault();
    }

    if (
      (event as MouseEvent).type !== 'mouseout' ||
      (event as TouchEvent).type !== 'touchend'
    ) {
      this.restoreArr.push(
        this.context.getImageData(
          0,
          0,
          this.canvasRef.nativeElement.width,
          this.canvasRef.nativeElement.height
        )
      );
      this.index += 1;
    }
  };

  private undo = (ev: MouseEvent) => {
    if (this.index <= 0) {
      this.clear();
    } else {
      this.index -= 1;
      this.restoreArr.pop();
      this.context.putImageData(this.restoreArr[this.index], 0, 0);
    }
  };

  private clear = () => {
    this.context.fillStyle = this.defaultSettings.bgColor;
    this.context.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
    this.context.fillRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );

    this.restoreArr = [];
    this.index = -1;
  };

  private getElementPosition = (elem: HTMLElement) => {
    return {
      x: elem.getBoundingClientRect().left,
      y: elem.getBoundingClientRect().top,
    };
  };

  /**
   * Returns an object with both height and width of the parent of the given element.
   * @param elem
   * @returns
   */
  private getParentDimensions = (elem: HTMLElement) => {
    return {
      height: elem.parentElement?.offsetHeight as number,
      width: elem.parentElement?.offsetWidth as number,
    };
  };

  /**
   * Returns the click coordinates of a touch event.
   * @param event
   * @returns
   */
  private getTouchEventPositions = (event: TouchEvent) => {
    return { x: event.touches[0].clientX, y: event.touches[0].clientY };
  };

  /**
   * Returns the click coordinates of a mouse event.
   * @param event
   * @returns
   */
  private getMouseEventPositions = (event: MouseEvent) => {
    return { x: event.clientX, y: event.clientY };
  };
}
