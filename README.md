# sdl3-deno

Deno FFI bindings for SDL3 libraries with TypeScript wrappers.

[![JSR](https://jsr.io/badges/@sdl3/sdl3-deno)](https://jsr.io/@sdl3/sdl3-deno)
[![GitHub](https://img.shields.io/github/license/g9wp/sdl3-deno)](https://github.com/g9wp/sdl3-deno/blob/main/LICENSE)

## Overview

`sdl3-deno` provides Deno FFI (Foreign Function Interface) bindings for SDL3 libraries, along with TypeScript wrappers.

## Features

- Full FFI bindings with original doc comment
- Type-safe TypeScript wrappers
- Cross-platform support (Windows, macOS, Linux)
- Simple, Deno-style API

## Installation

1. `deno add jsr:@sdl3/sdl3-deno` or Clone the repository
2. Install [SDL3 runtime libraries](https://github.com/libsdl-org) and set the `DENO_SDL3_PATH` environment variable (or install them into the `./sdl3` directory) [`gen/_util.ts`]

It's recommended to use an environment file [`deno run -A --env-file=.env example.ts`](https://docs.deno.com/runtime/reference/env_variables/)

```.env
DENO_SDL3_PATH=/path/to/sdl3
```

3. Import modules as needed


```typescript
import { Event, EventType, Render, SDL, SdlContext } from "@sdl3/sdl3-deno";
import { Font, RendererTextEngine, TtfContext } from "@sdl3/sdl3-deno/ttf";

// Raw bindings
import * as SDL from "@sdl3/sdl3-deno/SDL";
import * as IMG from "@sdl3/sdl3-deno/IMG";
import * as TTF from "@sdl3/sdl3-deno/TTF";

// wrappers
import { SDL, Dialog, openUrl } from "@sdl3/sdl3-deno";
import { Tray } from "@sdl3/sdl3-deno/tray";
import * as Dialog from "@sdl3/sdl3-deno/dialog";
import * as MessageBox from "@sdl3/sdl3-deno/messagebox";
import { Event, EventType } from "@sdl3/sdl3-deno/events";

// some modules are not yet published - you can use them directly from source by cloning the repository
import * as macros from './gen/macros/mod.ts';

```

## Examples


1. tray: [examples/tray.ts](./examples/tray.ts)

```typescript
import { Tray } from "@sdl3/sdl3-deno/tray";
import * as SDL from "@sdl3/sdl3-deno/SDL";

if (!SDL.init(SDL.INIT.VIDEO | SDL.INIT.EVENTS)) throw new Error("SDL init video and events failed");
const pumpInterval = setInterval(SDL.pumpEvents, 1000 / 60); // ignore all event

const tray = new Tray({
  icon: "./examples/search.svg",
  tooltip: "a tooltip",
  menu: [
    {
      label: "a label",
      action: () => {
        console.log("Tray entry clicked!");
      },
    },
    {
      label: "Quit",
      flag: "button",
      action: () => {
        console.log("quit");
        tray.destroy();
        clearInterval(pumpInterval);
        SDL.quit();
      },
    },
  ],
});

```


2. event: [examples/event.ts](./examples/event.ts)

```typescript
import { Event, EventType, Render, SDL, SDLK, SdlContext } from "@sdl3/sdl3-deno";
import { Font, RendererTextEngine, TtfContext } from "@sdl3/sdl3-deno/ttf";


using _sdl = new SdlContext();
using _ttf = new TtfContext();
using _wr = Render.createWindowAndRenderer("Event", 640, 480, BigInt(SDL.WINDOW.RESIZABLE));
const { render } = _wr;

using textEngine = RendererTextEngine.create(render.pointer);
using font = Font.open("./examples/olivessanspimientolight.ttf", 24);

using textEvent = textEngine.createText(font, "event");
textEvent.setColor({ r: 0, g: 128, b: 0, a: 255 });

function drawEvent(e: any) {
  console.log(e);
  textEvent.setString(JSON.stringify(e, (_, v) => typeof v === 'bigint' ? v.toString() : v, 4));
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
    case EventType.KEY_DOWN:
    case EventType.KEY_UP: {
      const e = event.keyboard;
      drawEvent(e);
      if (e.key === SDLK.ESCAPE) {
        event.pushQuit({});
        continue;
      }
      break;
    }
    default:
      drawEvent(event.common);
      break;
  }
}
```

3. snake game: [examples/snake.ts](./examples/snake.ts)

## API Documentation

The TypeScript definitions in this package are carefully crafted to match the original SDL documentation as closely as possible. This provides several benefits:

1. **IDE Support** - Get full API documentation through your IDE's hint system (VS Code, WebStorm, etc.)
2. **Type Safety** - All functions and parameters are properly typed
3. **Documentation Access** - View complete documentation either through:
   - IDE tooltips
   - JSR documentation at [jsr:@sdl3/sdl3-deno](https://jsr.io/@sdl3/sdl3-deno)
   - Original SDL3 documentation

Key features of the TypeScript definitions:

- All functions include their original SDL doc comments
- Enums and constants match SDL's naming conventions
- Complex types are properly represented
- Platform-specific differences are documented
- Callback signatures are type-safe

### main export
- `@sdl3/sdl3-deno` SDL and SDL_image
- `@sdl3/sdl3-deno/ttf` SDL_ttf

### Raw FFI bindings
The raw FFI bindings can be found at the `gen` directory.

These bindings are automatically generated by scripts, with the majority of functions and enums being exported to the main module. Certain platform-specific definitions might be excluded during generation, primarily due to issues with macro processing.

- `@sdl3/sdl3-deno/SDL` SDL bindings
- `@sdl3/sdl3-deno/IMG` SDL_image bindings
- `@sdl3/sdl3-deno/TTF` SDL_ttf bindings
- `@sdl3/sdl3-deno/structs`
- `@sdl3/sdl3-deno/enums`
- `@sdl3/sdl3-deno/callbacks`

### wrappers
The wrappers can be found at the `src` directory.

- `@sdl3/sdl3-deno/tray` This allows Deno applications to interact with native system tray features in a cross-platform way
- `@sdl3/sdl3-deno/messagebox`  a simple message box API, which is useful for simple alerts or choices
- `@sdl3/sdl3-deno/dialog` file dialogs, to let users select files with native GUI interfaces
- `@sdl3/sdl3-deno/events` provides event handling capabilities including polling and pushing events
- `@sdl3/sdl3-deno/render`,`@sdl3/sdl3-deno/video`: provides render/window interfaces
- `@sdl3/sdl3-deno/ttf` provides font or text renderer

## Credits Or Inspiration
- [SDL Development Team](https://github.com/libsdl-org) for providing the SDL C libraries
- [littledivy/deno_sdl2](https://github.com/littledivy/deno_sdl2) for inspiration on building Deno bindings
- [maia-s/sdl3-sys-rs](https://github.com/maia-s/sdl3-sys-rs) for inspiration on parsing SDL C header files
- [smack0007/SDL_ts](https://github.com/smack0007/SDL_ts) as a similar SDL2 project

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT
