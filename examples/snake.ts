import { Event, EventType, Render, SDL, SdlContext } from "@sdl3/sdl3-deno";
import { Font, RendererTextEngine, TtfContext } from "@sdl3/sdl3-deno/ttf";
import type { Color } from "@sdl3/sdl3-deno/structs";

const stepRate = 125;
const snakeBlockSize = 24;
const snakeGameWidth = 24;
const snakeGameHeight = 18;
const snakeWindowWidth = snakeBlockSize * snakeGameWidth;
const snakeWindowHeight = snakeBlockSize * snakeGameHeight;

enum SnakeCell {
  Nothing,
  SRIGHT,
  SUP,
  SLEFT,
  SDOWN,
  FOOD,
}

enum SnakeDirection {
  RIGHT,
  UP,
  LEFT,
  DOWN,
}

interface SnakePos {
  x: number;
  y: number;
}

type SnakeState =
  | "Init"
  | "Playing"
  | "Game Over"
  | "Congratulation"
  | "Pausing";

class SnakeContext {
  cells = Array.from(
    { length: snakeGameWidth * snakeGameHeight },
    () => SnakeCell.Nothing,
  );
  head: SnakePos = {
    x: Math.floor(snakeGameWidth / 2),
    y: Math.floor(snakeGameHeight / 2),
  };
  tail: SnakePos = { x: this.head.x, y: this.head.y };
  next_dir = SnakeDirection.RIGHT;
  inhibit_tail_step = 0;
  occupied_cells = 0;
  state: SnakeState = "Init";
  lastStep: number = 0;

  constructor() {
    this.init();
  }

  init() {
    this.state = "Init";
    this.cells.fill(SnakeCell.Nothing, 0, this.cells.length);
    this.head = {
      x: Math.floor(snakeGameWidth / 2),
      y: Math.floor(snakeGameHeight / 2),
    };
    this.tail = { x: this.head.x, y: this.head.y };
    this.next_dir = SnakeDirection.RIGHT;
  }

  start() {
    this.init();
    this.state = "Playing";
    this.step_count = 0;

    this.inhibit_tail_step = 4;
    this.occupied_cells = 4;
    --this.occupied_cells;
    this.setCell(this.tail, SnakeCell.SRIGHT);
    for (let i = 0; i < 4; i++) {
      this.createFood();
      this.occupied_cells++;
    }
    this.lastStep = Date.now();
  }

  redir(dir: SnakeDirection) {
    const c = this.cellAt(this.head);
    if (
      (dir === SnakeDirection.RIGHT && c !== SnakeCell.SLEFT) ||
      (dir === SnakeDirection.LEFT && c !== SnakeCell.SRIGHT) ||
      (dir === SnakeDirection.UP && c !== SnakeCell.SDOWN) ||
      (dir === SnakeDirection.DOWN && c !== SnakeCell.SUP)
    ) {
      this.next_dir = dir;
      return;
    }
  }

  cellAt({ x, y }: SnakePos): SnakeCell {
    return this.cells[y * snakeGameWidth + x];
  }

  setCell({ x, y }: SnakePos, cell: SnakeCell) {
    this.cells[y * snakeGameWidth + x] = cell;
  }

  cellsFull(): boolean {
    return this.occupied_cells === this.cells.length;
  }

  filterPos(condition: (cell: SnakeCell, i?: number) => boolean): SnakePos[] {
    return this.cells.flatMap((cell, i) => {
      if (condition(cell, i)) {
        return [{ x: i % snakeGameWidth, y: Math.floor(i / snakeGameWidth) }];
      } else {
        return [];
      }
    });
  }

  createFood() {
    while (true) {
      const x = Math.floor(Math.random() * snakeGameWidth);
      const y = Math.floor(Math.random() * snakeGameHeight);
      if (this.cellAt({ x, y }) === SnakeCell.Nothing) {
        this.setCell({ x, y }, SnakeCell.FOOD);
        return;
      }
    }
  }

  toggle_pause() {
    if (this.state === "Playing") {
      this.state = "Pausing";
    } else if (this.state === "Pausing") {
      this.state = "Playing";
    }
  }

  step_count = 0;

  step() {
    if (this.state !== "Playing") return false;

    this.step_count++;
    this.state = "Game Over";

    // move tail forward
    if (--this.inhibit_tail_step == 0) {
      ++this.inhibit_tail_step;
      const ct = this.cellAt(this.tail);
      this.setCell(this.tail, SnakeCell.Nothing);
      switch (ct) {
        case SnakeCell.SRIGHT:
          this.tail.x++;
          break;
        case SnakeCell.SUP:
          this.tail.y--;
          break;
        case SnakeCell.SLEFT:
          this.tail.x--;
          break;
        case SnakeCell.SDOWN:
          this.tail.y++;
          break;
        default:
          break;
      }
    }

    // move head forward
    const prev_head: SnakePos = { x: this.head.x, y: this.head.y };
    switch (this.next_dir) {
      case SnakeDirection.RIGHT:
        this.head.x++;
        break;
      case SnakeDirection.UP:
        this.head.y--;
        break;
      case SnakeDirection.LEFT:
        this.head.x--;
        break;
      case SnakeDirection.DOWN:
        this.head.y++;
        break;
    }
    if (
      this.head.x < 0 || this.head.x >= snakeGameWidth ||
      this.head.y < 0 || this.head.y >= snakeGameHeight
    ) {
      console.log("hit wall");
      return false;
    }
    const cell = this.cellAt(this.head);
    this.setCell(prev_head, (this.next_dir + 1) as SnakeCell);
    this.setCell(this.head, (this.next_dir + 1) as SnakeCell);
    if (cell !== SnakeCell.FOOD && cell !== SnakeCell.Nothing) {
      console.log("hit self");
      return false;
    }

    if (cell === SnakeCell.FOOD) {
      if (this.cellsFull()) {
        this.state = "Congratulation";
        return false;
      }
      this.createFood();
      this.occupied_cells++;
      this.inhibit_tail_step++;
    }
    this.state = "Playing";
    return true;
  }
}

if (import.meta.main) {
  await main();
}

async function main() {
  using _sdl = new SdlContext();
  using _ttf = new TtfContext();
  using _wr = Render.createWindowAndRenderer(
    "Snake",
    snakeWindowWidth,
    snakeWindowHeight,
    BigInt(SDL.WINDOW.ALWAYS_ON_TOP),
  );
  const { render } = _wr;

  using textEngine = RendererTextEngine.create(render.pointer);
  using font = Font.open("./examples/olivessanspimientolight.ttf", 24);

  using textFps = textEngine.createText(font, "fps");
  textFps.setColor({ r: 128, g: 0, b: 0, a: 255 });

  let lastFrameTime = Date.now();
  let frameNo = 0;
  let lastFrameNo = frameNo;
  let fps = 0;
  function drawFps() {
    frameNo++;
    const now = Date.now();
    if (now - lastFrameTime > 1000) {
      fps = Math.floor((frameNo - lastFrameNo) * 1000 / (now - lastFrameTime));
      lastFrameTime = now;
      lastFrameNo = frameNo;
    }
    textFps.setString(`${frameNo} fps:${fps}`);
    textFps.drawRenderer(10, 10);
  }

  const snake = new SnakeContext();

  function drawBlock(render: Render, pos: SnakePos[], color: Color) {
    render.setDrawColor(color.r, color.g, color.b, color.a);
    const rects = pos.map((p) => ({
      x: p.x * snakeBlockSize,
      y: p.y * snakeBlockSize,
      w: snakeBlockSize,
      h: snakeBlockSize,
    }));
    render.fillRects(rects);
  }

  function stateInfo(): string {
    switch (snake.state) {
      case "Init":
        return "Press any key to start";
      case "Playing":
        return "";
      case "Pausing":
        return "Press ESC to quit, other to resume";
      case "Game Over":
      case "Congratulation":
        return "Press ESC to quit, other to restart";
    }
  }
  using textState = textEngine.createText(font, "");
  textState.setColor({ r: 255, g: 0, b: 0, a: 255 });
  using textInfo = textEngine.createText(font, "");
  textInfo.setColor({ r: 255, g: 255, b: 0, a: 255 });
  let lastState: SnakeState | undefined = undefined;
  function drawState() {
    if (lastState !== snake.state) {
      lastState = snake.state;
      textInfo.setString(stateInfo());
      textState.setString(snake.state === "Init" ? "" : snake.state);
    }
    const textInfoSize = textInfo.size;
    const textStateSize = textState.size;
    textInfo.drawRenderer(
      snakeWindowWidth / 2 - textInfoSize.w / 2,
      snakeWindowHeight / 2 - textInfoSize.h / 2,
    );
    textState.drawRenderer(
        snakeWindowWidth / 2 - textStateSize.w / 2,
        snakeWindowHeight / 2 - textInfoSize.h / 2 - textStateSize.h,
    );
  }

  function drawFrame() {
    const now = Date.now();

    while (now - snake.lastStep > stepRate) {
      snake.lastStep += stepRate;
      if (!snake.step()) {
        break;
      }
    }

    render.setDrawColor(12, 12, 12, 255);
    render.clear();

    if (snake.state !== "Init") {
      drawBlock(
        render,
        snake.filterPos((c) => c === SnakeCell.FOOD),
        { r: 128, g: 128, b: 0, a: 255 },
      );
      drawBlock(
        render,
        snake.filterPos((c) => c !== SnakeCell.FOOD && c !== SnakeCell.Nothing),
        { r: 0, g: 128, b: 0, a: 255 },
      );
      drawBlock(render, [snake.head], { r: 0, g: 255, b: 0, a: 255 });
      drawBlock(render, [snake.tail], { r: 0, g: 64, b: 0, a: 255 });
    }
    drawFps();

    if (snake.state !== "Playing") {
      drawState();
    }

    render.present();
  }

  for await (const event of Event.iter(1000 / 60, drawFrame)) {
    switch (event.type) {
      case EventType.QUIT:
        console.log(event.quit);
        break;
      case EventType.KEY_DOWN:
        {
          if (snake.state === "Init") {
            snake.start();
            continue;
          }
          const e = event.keyboard;
          if (snake.state === "Pausing") {
            if (e.scancode === SDL.SCANCODE.ESCAPE) {
              event.pushQuit({});
            } else {
              snake.toggle_pause();
            }
            continue;
          } else if (snake.state !== "Playing") {
            if (e.scancode === SDL.SCANCODE.ESCAPE) {
              event.pushQuit({});
            } else {
              snake.start();
            }
            continue;
          }

          switch (e.scancode) {
            case SDL.SCANCODE.Q:
              if ((e.mod & SDL.KMOD.LCTRL) !== 0) {
                event.pushQuit({});
              }
              break;
            case SDL.SCANCODE.ESCAPE:
              snake.toggle_pause();
              textState.setString(snake.state);
              textInfo.setString(stateInfo());
              break;
            case SDL.SCANCODE.R:
              snake.start();
              break;
            case SDL.SCANCODE.UP:
              snake.redir(SnakeDirection.UP);
              break;
            case SDL.SCANCODE.DOWN:
              snake.redir(SnakeDirection.DOWN);
              break;
            case SDL.SCANCODE.LEFT:
              snake.redir(SnakeDirection.LEFT);
              break;
            case SDL.SCANCODE.RIGHT:
              snake.redir(SnakeDirection.RIGHT);
              break;
          }
        }
        break;
      case EventType.MOUSE_BUTTON_UP:
        snake.toggle_pause();
        break;
      case EventType.KEY_UP:
      case EventType.MOUSE_MOTION:
        break;
      default:
        console.log(event.common);
        break;
    }
  }
}
