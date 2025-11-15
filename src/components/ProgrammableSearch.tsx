import { useEffect } from "react";

const PROGRAMMABLE_SEARCH_SRC = "https://cse.google.com/cse.js?cx=31d1c8a94d6e14a5e";

const ProgrammableSearch = () => {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${PROGRAMMABLE_SEARCH_SRC}"]`
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.src = PROGRAMMABLE_SEARCH_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="w-full">
      <div className="gcse-search" />
    </div>
  );
};

export default ProgrammableSearch;
