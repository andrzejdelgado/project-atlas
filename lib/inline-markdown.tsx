import * as React from "react";

export function renderInlineMarkdown(text: string): React.ReactNode {
  if (!text) return text;

  const tokens: React.ReactNode[] = [];
  const pattern = /\*\*([^*]+?)\*\*|\*([^*]+?)\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      tokens.push(<strong key={key++}>{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      tokens.push(<em key={key++}>{match[2]}</em>);
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }

  return tokens.length === 0 ? text : <>{tokens}</>;
}
