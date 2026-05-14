"use client";

import * as React from "react";

type Props = {
  html: string;
  className?: string;
};

export function ShadowEmbed({ html, className = "ude-content" }: Props) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll("script").forEach((oldScript) => {
      const fresh = document.createElement("script");
      for (const attr of Array.from(oldScript.attributes)) {
        fresh.setAttribute(attr.name, attr.value);
      }
      fresh.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(fresh, oldScript);
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
