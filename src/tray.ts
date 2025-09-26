/**
 * # CategoryTray
 *
 * SDL offers a way to add items to the "system tray" (more correctly called
 * the "notification area" on Windows). On platforms that offer this concept,
 * an SDL app can add a tray icon, submenus, checkboxes, and clickable
 * entries, and register a callback that is fired when the user clicks on
 * these pieces.
 *
 * @module
 */

import * as SDL from "../gen/sdl/tray.ts";

import { callbacks as CB } from "../gen/callbacks/SDL_tray.ts";

import { ptr_view, SdlError } from "./_utils.ts";
import { Surface } from "./surface.ts";

type TrayEntryUnsafeCallback = Deno.UnsafeCallback<typeof CB.SDL_TrayCallback>;

type TrayEntryCallback = (
  userdata: Deno.PointerValue,
  entry: EntryPointer,
) => void;

const entryCb = {
  map: new Array<{
    tray: TrayPointer;
    entry: EntryPointer;
    callback: TrayEntryUnsafeCallback;
  }>(),

  addCallback(
    tray: TrayPointer,
    entry: EntryPointer,
    callback: TrayEntryUnsafeCallback,
  ) {
    const index = this.map.findIndex((i) => i.entry == entry);
    if (index != -1) {
      this.map[index].callback.close();
      this.map[index].callback = callback;
    } else {
      this.map.push({ tray, entry, callback });
    }
  },
  removeEntry(entry: EntryPointer) {
    const index = this.map.findIndex((i) => i.entry == entry);
    if (index !== -1) {
      this.map[index].callback.close();
      this.map.splice(index, 1);
    }
  },
  removeTray(tray: TrayPointer) {
    const r = this.map;
    this.map = [];
    for (const i of r) {
      if (i.tray == tray) {
        i.callback.close();
      } else {
        this.map.push(i);
      }
    }
  },
};

export interface TrayOption {
  icon?: string;
  tooltip?: string;
  menu?: TrayEntryOption[];
}

/**
 * Flags that control the creation of system tray entries.
 *
 * Some of these flags are required; exactly one of them must be specified at
 * the time a tray entry is created. Other flags are optional; zero or more of
 * those can be OR'ed together with the required flag.
 *
 * @since This datatype is available since SDL 3.2.0.
 *
 * @sa SDL_InsertTrayEntryAt
 *
 * @from SDL_tray.h:78
 */
export type TrayEntryFlag = TrayEntryFlagRequired | TrayEntryFlagOptional;

export type TrayEntryFlagRequired =
  | "button" /**< Make the entry a simple button. Required. */
  | "checkbox" /**< Make the entry a checkbox. Required. */
  | "submenu"; /**< Prepare the entry to have a submenu. Required */
export type TrayEntryFlagOptional =
  | "disabled" /**< Make the entry disabled. Optional. */
  | "checked"; /**< Make the entry checked. This is valid only for checkboxes. Optional. */

export interface TrayEntryOption {
  pos?: number;
  label?: string;
  flag?: TrayEntryFlag | TrayEntryFlag[];

  action?: TrayEntryCallback;
  userdata?: Deno.PointerValue;

  disabled?: boolean;

  checked?: boolean;
  submenu?: TrayEntryOption[];
  type?: TrayEntryFlagRequired;
}

type TrayPointer = Deno.PointerValue<"SDL_Tray">;
type MenuPointer = Deno.PointerValue<"SDL_TrayMenu">;
type EntryPointer = Deno.PointerValue<"SDL_TrayEntry">;

/**
 * An opaque handle representing a toplevel system tray object.
 *
 * #example
 * ```typescript
 * const tray = new Tray({
 *   icon: "icon.png",
 *   tooltip: "My App",
 *   menu: [
 *     { label: "Item 1", action: () => console.log("Item 1 clicked") },
 *     { label: "Item 2", action: () => console.log("Item 2 clicked") },
 *     { label: "Item 3", submenu: [
 *       { label: "Subitem 1", action: () => console.log("Subitem 1 clicked") },
 *       { label: "Subitem 2", action: () => console.log("Subitem 2 clicked") },
 *     ] },
 *     {}, // a separator
 *     { label: "quit", action: () => {tray.destroy(); clearInterval(eventPumpInterval); SDL.quit(); } },
 *   ],
 * });
 * ```
 */
export class Tray {
  pointer: TrayPointer;

  constructor({ icon, tooltip, menu }: TrayOption, tray?: TrayPointer) {
    this.pointer = tray !== undefined ? tray : Tray.create(icon, tooltip);
    if (menu && this.pointer) {
      this.createMenu().createSubmenu(this, menu);
    }
  }

  static of(tray: TrayPointer): Tray {
    return new Tray({}, tray);
  }

  /**
   * Create an icon to be placed in the operating system's tray, or equivalent.
   *
   * Many platforms advise not using a system tray unless persistence is a
   * necessary feature. Avoid needlessly creating a tray icon, as the user may
   * feel like it clutters their interface.
   *
   * Using tray icons require the video subsystem.
   *
   * @param icon a surface to be used as icon. May be NULL.
   * @param tooltip a tooltip to be displayed when the mouse hovers the icon in
   *                UTF-8 encoding. Not supported on all platforms. May be NULL.
   * @returns The newly created system tray icon.
   *
   * @threadsafety This function should only be called on the main thread.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_CreateTrayMenu
   * @sa SDL_GetTrayMenu
   * @sa SDL_DestroyTray
   *
   * @from SDL_tray.h:120 SDL_Tray * SDL_CreateTray(SDL_Surface *icon, const char *tooltip);
   */
  static create(icon?: string, tooltip?: string): TrayPointer {
    const s = new Surface(icon);
    const tray = SDL.createTray(s.pointer, tooltip);
    s.destroy();
    if (!tray) throw SdlError(`Failed to create system tray`);
    return tray as TrayPointer;
  }

  /**
   * Destroys a tray object.
   *
   * This also destroys all associated menus and entries.
   *
   * @threadsafety This function should be called on the thread that created the
   *               tray.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_CreateTray
   *
   * @from SDL_tray.h:468 void SDL_DestroyTray(SDL_Tray *tray);
   */
  destroy() {
    if (!this.pointer) return;
    SDL.destroyTray(this.pointer);
    entryCb.removeTray(this.pointer);
    this.pointer = null;
  }

  [Symbol.dispose]() {
    this.destroy();
  }

  /**
   * Updates the system tray icon's icon.
   *
   * @param icon the new icon. May be NULL.
   *
   * @threadsafety This function should be called on the thread that created the
   *               tray.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_CreateTray
   *
   * @from SDL_tray.h:135 void SDL_SetTrayIcon(SDL_Tray *tray, SDL_Surface *icon);
   */
  setIcon(icon?: string) {
    const surface = icon ? new Surface(icon) : null;
    SDL.setTrayIcon(this.pointer, surface?.pointer ?? null);
    surface?.destroy();
  }

  /**
   * Updates the system tray icon's tooltip.
   *
   * @param tooltip the new tooltip in UTF-8 encoding. May be NULL.
   *
   * @threadsafety This function should be called on the thread that created the
   *               tray.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_CreateTray
   *
   * @from SDL_tray.h:150 void SDL_SetTrayTooltip(SDL_Tray *tray, const char *tooltip);
   */
  setTooltip(tooltip?: string) {
    SDL.setTrayTooltip(this.pointer, tooltip);
  }
  /**
   * Create a menu for a system tray.
   *
   * This should be called at most once per tray icon.
   *
   * This function does the same thing as SDL_CreateTraySubmenu(), except that
   * it takes a SDL_Tray instead of a SDL_TrayEntry.
   *
   * A menu does not need to be destroyed; it will be destroyed with the tray.
   *
   * @returns the newly created menu.
   *
   * @threadsafety This function should be called on the thread that created the
   *               tray.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_CreateTray
   * @sa SDL_GetTrayMenu
   * @sa SDL_GetTrayMenuParentTray
   *
   * @from SDL_tray.h:174 SDL_TrayMenu * SDL_CreateTrayMenu(SDL_Tray *tray);
   */
  createMenu(): TrayMenu {
    const menu = SDL.createTrayMenu(this.pointer);
    if (!menu) throw SdlError(`Failed to create menu`);
    return TrayMenu.of(menu);
  }

  /**
   * Gets a previously created tray menu.
   *
   * You should have called SDL_CreateTrayMenu() on the tray object. This
   * function allows you to fetch it again later.
   *
   * This function does the same thing as SDL_GetTraySubmenu(), except that it
   * takes a SDL_Tray instead of a SDL_TrayEntry.
   *
   * A menu does not need to be destroyed; it will be destroyed with the tray.
   *
   * @returns the newly created menu.
   *
   * @threadsafety This function should be called on the thread that created the
   *               tray.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_CreateTray
   * @sa SDL_CreateTrayMenu
   *
   * @from SDL_tray.h:222 SDL_TrayMenu * SDL_GetTrayMenu(SDL_Tray *tray);
   */
  get menu(): TrayMenu {
    return TrayMenu.of(SDL.getTrayMenu(this.pointer) as MenuPointer);
  }

  /**
   * Sets a callback to be invoked when the entry is selected.
   *
   * @param entry the entry to be updated.
   * @param callback a callback to be invoked when the entry is selected.
   * @param userdata an optional pointer to pass extra data to the callback when
   *                 it will be invoked.
   *
   * @threadsafety This function should be called on the thread that created the
   *               tray.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetTrayEntries
   * @sa SDL_InsertTrayEntryAt
   *
   * @from SDL_tray.h:440 void SDL_SetTrayEntryCallback(SDL_TrayEntry *entry, SDL_TrayCallback callback, void *userdata);
   */
  setEntryCallback(
    entry: EntryPointer,
    callback: TrayEntryCallback,
    userdata: Deno.PointerValue = null,
  ) {
    const c = new Deno.UnsafeCallback(
      CB.SDL_TrayCallback,
      callback as (
        userdata: Deno.PointerValue,
        entry: Deno.PointerValue,
      ) => void,
    );
    SDL.setTrayEntryCallback(entry, c.pointer, userdata);
    entryCb.addCallback(this.pointer, entry, c);
  }

  static update() {
    SDL.updateTrays();
  }
}

/**
 * An opaque handle representing an entry on a system tray object.
 */
export class TrayEntry {
  constructor(public pointer: EntryPointer) {}

  static of(pointer: EntryPointer): TrayEntry {
    return new TrayEntry(pointer);
  }

  /**
   * Gets the menu containing a certain tray entry.
   *
   * @returns the parent menu.
   *
   * @threadsafety This function should be called on the thread that created the
   *               tray.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_InsertTrayEntryAt
   *
   * @from SDL_tray.h:483 SDL_TrayMenu * SDL_GetTrayEntryParent(SDL_TrayEntry *entry);
   */
  get parentMenu(): TrayMenu {
    return TrayMenu.of(SDL.getTrayEntryParent(this.pointer));
  }

  /**
   * Create a submenu for a system tray entry.
   *
   * This should be called at most once per tray entry.
   *
   * This function does the same thing as SDL_CreateTrayMenu, except that it
   * takes a SDL_TrayEntry instead of a SDL_Tray.
   *
   * A menu does not need to be destroyed; it will be destroyed with the tray.
   *
   * @returns the newly created menu.
   *
   * @threadsafety This function should be called on the thread that created the
   *               tray.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_InsertTrayEntryAt
   * @sa SDL_GetTraySubmenu
   * @sa SDL_GetTrayMenuParentEntry
   *
   * @from SDL_tray.h:198 SDL_TrayMenu * SDL_CreateTraySubmenu(SDL_TrayEntry *entry);
   */
  createSubmenu(): TrayMenu {
    const menu = SDL.createTraySubmenu(this.pointer) as MenuPointer;
    if (!menu) throw SdlError(`Failed to create sub menu`);
    return new TrayMenu(menu);
  }

  /**
   * Gets a previously created tray entry submenu.
   *
   * You should have called SDL_CreateTraySubmenu() on the entry object. This
   * function allows you to fetch it again later.
   *
   * This function does the same thing as SDL_GetTrayMenu(), except that it
   * takes a SDL_TrayEntry instead of a SDL_Tray.
   *
   * A menu does not need to be destroyed; it will be destroyed with the tray.
   *
   * @returns the newly created menu.
   *
   * @threadsafety This function should be called on the thread that created the
   *               tray.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_InsertTrayEntryAt
   * @sa SDL_CreateTraySubmenu
   *
   * @from SDL_tray.h:246 SDL_TrayMenu * SDL_GetTraySubmenu(SDL_TrayEntry *entry);
   */
  get submenu(): TrayMenu {
    return TrayMenu.of(SDL.getTraySubmenu(this.pointer) as MenuPointer);
  }

  /**
   * Removes a tray entry.
   *
   * @threadsafety This function should be called on the thread that created the
   *               tray.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetTrayEntries
   * @sa SDL_InsertTrayEntryAt
   *
   * @from SDL_tray.h:281 void SDL_RemoveTrayEntry(SDL_TrayEntry *entry);
   */
  remove() {
    SDL.removeTrayEntry(this.pointer);
    entryCb.removeEntry(this.pointer);
    this.pointer = null;
  }

  /**
   * Sets the label of an entry.
   *
   * An entry cannot change between a separator and an ordinary entry; that is,
   * it is not possible to set a non-NULL label on an entry that has a NULL
   * label (separators), or to set a NULL label to an entry that has a non-NULL
   * label. The function will silently fail if that happens.
   *
   * @param label the new label for the entry in UTF-8 encoding.
   *
   * @threadsafety This function should be called on the thread that created the
   *               tray.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetTrayEntries
   * @sa SDL_InsertTrayEntryAt
   * @sa SDL_GetTrayEntryLabel
   *
   * @from SDL_tray.h:331 void SDL_SetTrayEntryLabel(SDL_TrayEntry *entry, const char *label);
   */
  setLabel(label: string) {
    SDL.setTrayEntryLabel(this.pointer, label);
  }

  /**
   * Gets the label of an entry.
   *
   * If the returned value is NULL, the entry is a separator.
   *
   * @returns the label of the entry in UTF-8 encoding.
   *
   * @threadsafety This function should be called on the thread that created the
   *               tray.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetTrayEntries
   * @sa SDL_InsertTrayEntryAt
   * @sa SDL_SetTrayEntryLabel
   *
   * @from SDL_tray.h:350 const char * SDL_GetTrayEntryLabel(SDL_TrayEntry *entry);
   */
  get label(): string | null {
    return SDL.getTrayEntryLabel(this.pointer);
  }

  /**
   * Sets whether or not an entry is checked.
   *
   * The entry must have been created with the SDL_TRAYENTRY_CHECKBOX flag.
   *
   * @param checked true if the entry should be checked; false otherwise.
   *
   * @threadsafety This function should be called on the thread that created the
   *               tray.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetTrayEntries
   * @sa SDL_InsertTrayEntryAt
   * @sa SDL_GetTrayEntryChecked
   *
   * @from SDL_tray.h:369 void SDL_SetTrayEntryChecked(SDL_TrayEntry *entry, bool checked);
   */
  setChecked(checked: boolean = true) {
    SDL.setTrayEntryChecked(this.pointer, checked);
  }

  /**
   * Gets whether or not an entry is checked.
   *
   * The entry must have been created with the SDL_TRAYENTRY_CHECKBOX flag.
   *
   * @returns true if the entry is checked; false otherwise.
   *
   * @threadsafety This function should be called on the thread that created the
   *               tray.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetTrayEntries
   * @sa SDL_InsertTrayEntryAt
   * @sa SDL_SetTrayEntryChecked
   *
   * @from SDL_tray.h:388 bool SDL_GetTrayEntryChecked(SDL_TrayEntry *entry);
   */
  get checked(): boolean {
    return SDL.getTrayEntryChecked(this.pointer);
  }

  /**
   * Sets whether or not an entry is enabled.
   *
   * @param entry the entry to be updated.
   * @param enabled true if the entry should be enabled; false otherwise.
   *
   * @threadsafety This function should be called on the thread that created the
   *               tray.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetTrayEntries
   * @sa SDL_InsertTrayEntryAt
   * @sa SDL_GetTrayEntryEnabled
   *
   * @from SDL_tray.h:405 void SDL_SetTrayEntryEnabled(SDL_TrayEntry *entry, bool enabled);
   */
  setEnabled(enabled: boolean = true) {
    SDL.setTrayEntryEnabled(this.pointer, enabled);
  }
  /**
   * Gets whether or not an entry is enabled.
   *
   * @returns true if the entry is enabled; false otherwise.
   *
   * @threadsafety This function should be called on the thread that created the
   *               tray.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetTrayEntries
   * @sa SDL_InsertTrayEntryAt
   * @sa SDL_SetTrayEntryEnabled
   *
   * @from SDL_tray.h:422 bool SDL_GetTrayEntryEnabled(SDL_TrayEntry *entry);
   */
  get enabled(): boolean {
    return SDL.getTrayEntryEnabled(this.pointer);
  }

  /**
   * Sets a callback to be invoked when the entry is selected.
   *
   * @param callback a callback to be invoked when the entry is selected.
   * @param userdata an optional pointer to pass extra data to the callback when
   *                 it will be invoked.
   *
   * @threadsafety This function should be called on the thread that created the
   *               tray.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_GetTrayEntries
   * @sa SDL_InsertTrayEntryAt
   *
   * @from SDL_tray.h:440 void SDL_SetTrayEntryCallback(SDL_TrayEntry *entry, SDL_TrayCallback callback, void *userdata);
   */
  setCallback(
    tray: Tray,
    callback: TrayEntryCallback,
    userdata: Deno.PointerValue = null,
  ) {
    tray.setEntryCallback(this.pointer, callback, userdata);
  }

  /**
   * Simulate a click on a tray entry.
   *
   * @threadsafety This function should be called on the thread that created the
   *               tray.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @from SDL_tray.h:452 void SDL_ClickTrayEntry(SDL_TrayEntry *entry);
   */
  click() {
    SDL.clickTrayEntry(this.pointer);
  }
}

/**
 * An opaque handle representing a menu/submenu on a system tray object.
 */
export class TrayMenu {
  constructor(public pointer: MenuPointer) {}

  createSubmenu(tray: Tray, entries?: TrayEntryOption[]) {
    if (!entries || entries.length === 0) return;
    if (!this.pointer) {
      throw new Error(
        "Invalid TrayMenu pointer, possibly missing submenu flag",
      );
    }
    for (
      const {
        pos,
        label,
        flag,
        action,
        userdata,
        submenu,
        disabled,
        checked,
        type,
      } of entries
    ) {
      const flagType = (s: TrayEntryFlag): number => {
        switch (s) {
          case "button":
            return SDL.TRAYENTRY.BUTTON;
          case "checkbox":
            return SDL.TRAYENTRY.CHECKBOX;
          case "submenu":
            return SDL.TRAYENTRY.SUBMENU;
          case "disabled":
            return SDL.TRAYENTRY.DISABLED;
          case "checked":
            return SDL.TRAYENTRY.CHECKED;
          default:
            return 0;
        }
      };
      let f = !flag
        ? 0
        : typeof flag === "string"
        ? flagType(flag)
        : flag.reduce((acc, cur) => acc | flagType(cur), 0);

      if (type === "button") f |= SDL.TRAYENTRY.BUTTON;
      if (type === "checkbox" || checked !== undefined) {
        f |= SDL.TRAYENTRY.CHECKBOX;
      }
      if (type === "submenu" || submenu !== undefined) {
        f |= SDL.TRAYENTRY.SUBMENU;
      }
      if (checked) f |= SDL.TRAYENTRY.CHECKED;
      if (disabled) f |= SDL.TRAYENTRY.DISABLED;

      const e = this.insertEntryAt(pos ?? -1, label, f);

      if (action) {
        e.setCallback(tray, action, userdata ?? null);
      }

      if (submenu) {
        e.createSubmenu().createSubmenu(tray, submenu);
      }
    }
  }

  static of(pointer: MenuPointer): TrayMenu {
    return new TrayMenu(pointer);
  }

  /**
   * Gets the tray for which this menu is the first-level menu, if the current
   * menu isn't a submenu.
   *
   * Either this function or SDL_GetTrayMenuParentEntry() will return non-NULL
   * for any given menu.
   *
   * @returns the parent tray, or NULL if this menu is a submenu.
   *
   * @threadsafety This function should be called on the thread that created the
   *               tray.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_CreateTrayMenu
   * @sa SDL_GetTrayMenuParentEntry
   *
   * @from SDL_tray.h:523 SDL_Tray * SDL_GetTrayMenuParentTray(SDL_TrayMenu *menu);
   */
  get parentTray(): TrayPointer {
    return SDL.getTrayMenuParentTray(this.pointer) as TrayPointer;
  }

  /**
   * Gets the entry for which the menu is a submenu, if the current menu is a
   * submenu.
   *
   * Either this function or SDL_GetTrayMenuParentTray() will return non-NULL
   * for any given menu.
   *
   * @returns the parent entry, or NULL if this menu is not a submenu.
   *
   * @threadsafety This function should be called on the thread that created the
   *               tray.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_CreateTraySubmenu
   * @sa SDL_GetTrayMenuParentTray
   *
   * @from SDL_tray.h:503 SDL_TrayEntry * SDL_GetTrayMenuParentEntry(SDL_TrayMenu *menu);
   */
  get parentEntry(): TrayEntry {
    return TrayEntry.of(
      SDL.getTrayMenuParentEntry(this.pointer) as EntryPointer,
    );
  }

  /**
   * Returns a list of entries in the menu, in order.
   *
   * @returns a list of entries within the given menu. The
   *          pointer becomes invalid when any function that inserts or deletes
   *          entries in the menu is called.
   *
   * @threadsafety This function should be called on the thread that created the
   *               tray.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_RemoveTrayEntry
   * @sa SDL_InsertTrayEntryAt
   *
   * @from SDL_tray.h:266 const SDL_TrayEntry ** SDL_GetTrayEntries(SDL_TrayMenu *menu, int *count);
   */
  get entries(): TrayEntry[] {
    const { ret: a } = SDL.getTrayEntries(this.pointer);
    if (!a) return [];

    const entries: TrayEntry[] = [];
    const d = ptr_view(a);
    let i = 0;
    while (true) {
      // FIXME: suppose pointer size is 8 bytes
      const p = d.getPointer(i);
      if (p === null) {
        break;
      }
      i += 8;
      entries.push(TrayEntry.of(p as EntryPointer));
    }
    return entries;
  }

  /**
   * Insert a tray entry at a given position.
   *
   * If label is NULL, the entry will be a separator. Many functions won't work
   * for an entry that is a separator.
   *
   * An entry does not need to be destroyed; it will be destroyed with the tray.
   *
   * @param pos the desired position for the new entry. Entries at or following
   *            this place will be moved. If pos is -1, the entry is appended.
   * @param label the text to be displayed on the entry, in UTF-8 encoding, or
   *              NULL for a separator.
   * @param flags a combination of flags, some of which are mandatory.
   * @returns the newly created entry, or NULL if pos is out of bounds.
   *
   * @threadsafety This function should be called on the thread that created the
   *               tray.
   *
   * @since This function is available since SDL 3.2.0.
   *
   * @sa SDL_TrayEntryFlags
   * @sa SDL_GetTrayEntries
   * @sa SDL_RemoveTrayEntry
   * @sa SDL_GetTrayEntryParent
   *
   * @from SDL_tray.h:309 SDL_TrayEntry * SDL_InsertTrayEntryAt(SDL_TrayMenu *menu, int pos, const char *label, SDL_TrayEntryFlags flags);
   */
  insertEntryAt(
    pos: number,
    label: string | undefined,
    flags: number,
  ): TrayEntry {
    return TrayEntry.of(
      SDL.insertTrayEntryAt(
        this.pointer,
        pos,
        label,
        flags,
      ),
    );
  }

  static clearCb_() {
    entryCb.map.forEach((i) => i.callback.close());
    entryCb.map = [];
  }
}
