import { Palette } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
  ];

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-2">
        <Palette className="w-4 h-4" />
        <span className="hidden sm:inline capitalize">{theme}</span>
      </div>
      <div className="dropdown-content bg-base-200 text-base-content rounded-box h-[70vh] max-h-96 w-56 overflow-y-auto mt-4 shadow-2xl">
        <div className="grid grid-cols-1 gap-3 p-3">
          {themes.map((t) => (
            <button
              key={t}
              className={`outline-base-content overflow-hidden rounded-lg text-left ${
                theme === t ? "outline outline-2 outline-offset-2" : ""
              }`}
              onClick={() => setTheme(t)}
            >
              <div
                data-theme={t}
                className="bg-base-100 text-base-content w-full cursor-pointer font-sans"
              >
                <div className="grid grid-cols-5 grid-rows-3">
                  <div className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                    <div className="flex-grow text-sm font-bold capitalize">
                      {t}
                    </div>
                    <div className="flex flex-shrink-0 flex-wrap gap-1">
                      <div className="bg-primary w-2 rounded" />
                      <div className="bg-secondary w-2 rounded" />
                      <div className="bg-accent w-2 rounded" />
                      <div className="bg-neutral w-2 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector; 