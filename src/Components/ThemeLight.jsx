// src/Components/ThemeLight.js
import React, { useEffect, useState } from "react";
import { WiMoonAltWaxingGibbous1 } from "react-icons/wi";
import { MdWbSunny } from "react-icons/md";
import { GiSunflower } from "react-icons/gi";
import moon from "../assets/moon-svgrepo-com.svg";
import sun from "../assets/sun-svgrepo-com.svg";
export default function ThemeLight() {
  const [isLight, setIsLight] = useState(() => {
    // on first render check localStorage
    return localStorage.getItem("theme") === "light";
  });

  useEffect(() => {
    if (isLight) {
      document.body.classList.add("light-theme");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light-theme");
      localStorage.setItem("theme", "dark");
    }
  }, [isLight]);

  return (
    <button
      onClick={() => setIsLight((prev) => !prev)}
      className="relative text-3xl cursor-pointer transition duration-300 z-50 group"
    >
      {/* Icon */}
      {isLight ? (
        // <WiMoonAltWaxingGibbous1 className="text-blue-300 group-hover:text-blue-500 transition duration-300" />
        <img src={moon} alt="Moon" className="w-10 h-10 " />
      ) : (
        // <GiSunflower className="text-yellow-300 group-hover:text-yellow-400 transition duration-300" />
        <img src={sun} alt="Sun" className="w-10 h-10  " />
      )}

      {/* Glow effect for Moon */}
      {isLight && (
        <>
          <span
            className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl opacity-0 
                       group-hover:opacity-100 transition duration-500"
          ></span>
          <span
            className="absolute inset-0 rounded-full bg-blue-400/10 blur-2xl opacity-0 
                       group-hover:opacity-100 transition duration-700"
          ></span>
        </>
      )}

      {/* Rays effect for Sun */}
      {!isLight && (
        <>
          <span
            className="absolute inset-0 rounded-full bg-yellow-400/40 blur-xl opacity-0 
                       group-hover:opacity-100 transition duration-500"
          ></span>
          <span
            className="absolute inset-0 rounded-full bg-yellow-500/20 blur-2xl opacity-0 
                       group-hover:opacity-100 transition duration-700"
          ></span>
        </>
      )}
    </button>
  );
}
