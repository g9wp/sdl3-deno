            /* this define makes the normal SDL_main entry point stuff work...we just provide SDL_main() instead of the app. */
export const SDL_MAIN_CALLBACK_STANDARD = 1;

    /* rename users main() function to SDL_main() so it can be called from the wrappers above */
export const main = SDL_main;

