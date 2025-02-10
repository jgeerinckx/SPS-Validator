import { color } from "@material-tailwind/react/types/components/spinner";
import { useState, useEffect } from "react";

function useSpinnerColor(defaultColor: color = "blue") {
  const [spinnerColor, setSpinnerColor] = useState<color| undefined>(undefined);

  useEffect(() => {
    const updateColor = () => {
      setSpinnerColor(document.documentElement.classList.contains("dark") ? defaultColor : undefined);
    };

    updateColor();

    const observer = new MutationObserver(updateColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, [defaultColor]);

  return spinnerColor;
}

export default useSpinnerColor;
