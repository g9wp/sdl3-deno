import { Event, EventType, Render, SDL, SdlContext } from "@sdl3/sdl3-deno";
import { Font, RendererTextEngine, TtfContext } from "@sdl3/sdl3-deno/ttf";

if (import.meta.main) {
  await main();
}

async function main() {
  using _sdl = new SdlContext();
  using _ttf = new TtfContext();
  using _wr = Render.createWindowAndRenderer("Event", 640, 480, BigInt(SDL.WINDOW.RESIZABLE),);
  const { render } = _wr;

  using textEngine = RendererTextEngine.create(render.pointer);
  using font = Font.open("./examples/olivessanspimientolight.ttf", 24);

  using textEvent = textEngine.createText(font, "event");
  textEvent.setColor({ r: 0, g: 128, b: 0, a: 255 });

  function drawEvent(e: { type: number }) {
    const t = {name: EventType[e.type] ?? "", ...e};
    console.log(t);
    textEvent.setString(JSON.stringify(t, (_, v) => typeof v === 'bigint' ? v.toString() : v, 4));
  }

  function drawFrame() {
    render.setDrawColor(0, 0, 0, 255);
    render.clear();

    textEvent.drawRenderer(10, 30);

    render.present();
  }

  for await (const event of Event.iter(1000 / 60, drawFrame)) {
    switch (event.type) {
      case EventType.QUIT:
        drawEvent(event.quit);
        break;
      case EventType.MOUSE_MOTION:
        drawEvent(event.mouseMotion);
        break;
      case EventType.MOUSE_BUTTON_DOWN:
      case EventType.MOUSE_BUTTON_UP:
        drawEvent(event.mouseButton);
        break;
      case EventType.KEY_DOWN:
      case EventType.KEY_UP: {
        const e = event.keyboard;
        drawEvent(e);
        if (e.scancode === SDL.SCANCODE.ESCAPE) {
          event.pushQuit({});
          continue;
        }
        break;
      }
      default:
        drawEvent(event.detail);
        break;
    }
  }
}
