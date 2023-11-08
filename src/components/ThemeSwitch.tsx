import { useEffect, useState } from "react";
import { BsMoon, BsSun } from "react-icons/bs";

type Theme = "light" | "dark";

export function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme>(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  const [isSticky, setIsSticky] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    const htmlElement = document.querySelector("html");
    if (htmlElement) {
      htmlElement.setAttribute("data-theme", theme);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      className={`fixed ${
        isSticky ? "top-2" : "top-[5rem]"
      } right-[1rem] bg-white w-[2.2rem] h-[2.2rem] md:w-[3rem] md:h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.1] active:scale-105 transition-all  dark:bg-gray-950 border-black dark:border-white `}
      onClick={toggleTheme}
    >
      {theme === "light" ? <BsSun /> : <BsMoon />}
    </button>
  );
}
