"use client";

// Dev-only inline MDX editor.
// Double-click any editable element inside the wrapped article, swap it for
// a textarea pre-filled with the RAW MARKDOWN source from the .mdx file.
// Toolbar adds Bold / Italic / Link wrapping for the current selection.
// Save (writes via /api/edit-mdx) or Cancel (restores the original).

import * as React from "react";
import ReactDOM from "react-dom";
import { Bold, Italic, Link2, Plus, Trash2 } from "lucide-react";

const EDITABLE_SELECTOR = "p, h1, h2, h3, h4, li";

const SKIP_ANCESTOR_SELECTOR =
  "nav, header[role], [role='dialog'], [role='tablist'], button, .chat-shell, [data-no-edit]";

type EditingState = {
  target: HTMLElement;
  rect: DOMRect;
  renderedText: string;
  initialSource: string;
};

type HoverTarget = {
  target: HTMLElement;
  rect: DOMRect;
  renderedText: string;
};

type Props = {
  /** Path under content/, e.g. "case-studies/saturn-heavy.mdx". */
  sourcePath: string;
  children: React.ReactNode;
};

type Hint = { rect: DOMRect; message: string };

export function EditableArticle({ sourcePath, children }: Props) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [editing, setEditing] = React.useState<EditingState | null>(null);
  const enabled = process.env.NODE_ENV === "development";
  const [loadingTarget, setLoadingTarget] = React.useState<HTMLElement | null>(
    null,
  );
  const [hint, setHint] = React.useState<Hint | null>(null);
  const [hoverTarget, setHoverTarget] = React.useState<HoverTarget | null>(
    null,
  );
  const [confirmDelete, setConfirmDelete] = React.useState<HoverTarget | null>(
    null,
  );
  const [undoState, setUndoState] = React.useState<{
    prevSource: string;
    id: number;
  } | null>(null);
  const hoverTimerRef = React.useRef<number | null>(null);

  const clearHideTimer = React.useCallback(() => {
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  const scheduleHide = React.useCallback(() => {
    if (hoverTimerRef.current !== null) return;
    hoverTimerRef.current = window.setTimeout(() => {
      setHoverTarget(null);
      hoverTimerRef.current = null;
    }, 150);
  }, []);

  React.useEffect(() => {
    if (!hint) return;
    const t = setTimeout(() => setHint(null), 2800);
    return () => clearTimeout(t);
  }, [hint]);

  React.useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    if (!root) return;

    async function onDblClick(e: MouseEvent) {
      const targetEl = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        EDITABLE_SELECTOR,
      );
      if (!targetEl) return;
      if (!root || !root.contains(targetEl)) return;
      if (targetEl.closest(SKIP_ANCESTOR_SELECTOR)) return;

      const renderedText = extractEditableText(targetEl);
      if (!renderedText) return;

      e.preventDefault();
      e.stopPropagation();

      setLoadingTarget(targetEl);
      try {
        const res = await fetch("/api/edit-mdx", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            action: "lookup",
            path: sourcePath,
            rendered: renderedText,
          }),
        });
        if (res.ok) {
          const data = (await res.json()) as { source: string };
          setEditing({
            target: targetEl,
            rect: targetEl.getBoundingClientRect(),
            renderedText,
            initialSource: data.source,
          });
        } else {
          // No match in the .mdx — this text lives in a React component.
          // Don't open the editor; show a transient hint instead.
          setHint({
            rect: targetEl.getBoundingClientRect(),
            message:
              "This text isn't in an .mdx file — it lives in a React component. Edit the source file directly.",
          });
        }
      } catch {
        setHint({
          rect: targetEl.getBoundingClientRect(),
          message: "Couldn't reach the edit endpoint — is the dev server running?",
        });
      } finally {
        setLoadingTarget(null);
      }
    }

    document.addEventListener("dblclick", onDblClick);
    return () => document.removeEventListener("dblclick", onDblClick);
  }, [enabled, sourcePath]);

  React.useEffect(() => {
    if (!enabled) return;
    if (editing) return;
    if (confirmDelete) return;

    const root = rootRef.current;
    if (!root) return;

    const onMouseOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      const p = el?.closest<HTMLElement>("p");
      if (!p || !root.contains(p) || p.closest(SKIP_ANCESTOR_SELECTOR)) {
        scheduleHide();
        return;
      }
      clearHideTimer();
      setHoverTarget((prev) =>
        prev?.target === p
          ? prev
          : {
              target: p,
              rect: p.getBoundingClientRect(),
              renderedText: extractEditableText(p),
            },
      );
    };

    const onMouseLeave = () => {
      scheduleHide();
    };

    root.addEventListener("mouseover", onMouseOver);
    root.addEventListener("mouseleave", onMouseLeave);
    return () => {
      root.removeEventListener("mouseover", onMouseOver);
      root.removeEventListener("mouseleave", onMouseLeave);
      clearHideTimer();
    };
  }, [enabled, editing, confirmDelete, clearHideTimer, scheduleHide]);

  async function handleDelete(t: HoverTarget) {
    // Dismiss the confirm popover synchronously so a stray second click
    // can't fire another delete on the same target.
    setConfirmDelete(null);
    setHoverTarget(null);
    clearHideTimer();
    try {
      const res = await fetch("/api/edit-mdx", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          path: sourcePath,
          rendered: t.renderedText,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        setHint({
          rect: t.rect,
          message: text || `Delete failed with status ${res.status}`,
        });
        return;
      }
      const data = (await res.json()) as {
        ok: boolean;
        prevSource?: string;
      };
      // Optimistic hide. Don't detach with .remove() — React's reconciler
      // tracks this node and will try to remove it on the next HMR render;
      // detaching it ourselves causes "removeChild ... is not a child".
      const el = t.target;
      el.style.opacity = "0";
      el.style.height = "0";
      el.style.marginTop = "0";
      el.style.marginBottom = "0";
      el.style.paddingTop = "0";
      el.style.paddingBottom = "0";
      el.style.overflow = "hidden";
      el.style.pointerEvents = "none";
      if (data.prevSource) {
        setUndoState({ prevSource: data.prevSource, id: Date.now() });
      }
    } catch {
      setHint({
        rect: t.rect,
        message:
          "Couldn't reach the edit endpoint — is the dev server running?",
      });
    }
  }

  async function handleInsert(t: HoverTarget) {
    setHoverTarget(null);
    clearHideTimer();
    try {
      const res = await fetch("/api/edit-mdx", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "insert",
          path: sourcePath,
          rendered: t.renderedText,
          content: "New paragraph.",
          position: "after",
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        setHint({
          rect: t.rect,
          message: text || `Insert failed with status ${res.status}`,
        });
      }
      // HMR re-renders the page with the new paragraph appended.
    } catch {
      setHint({
        rect: t.rect,
        message:
          "Couldn't reach the edit endpoint — is the dev server running?",
      });
    }
  }

  async function handleUndo() {
    if (!undoState) return;
    const snapshot = undoState;
    setUndoState(null);
    try {
      await fetch("/api/edit-mdx", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "restore",
          path: sourcePath,
          source: snapshot.prevSource,
        }),
      });
      // HMR will follow up with a re-render that puts the paragraph back.
    } catch {
      // Restore failed — surface the snapshot again so the user can retry.
      setUndoState(snapshot);
    }
  }

  return (
    <div ref={rootRef} data-mdx-editor-root>
      {children}
      {loadingTarget && !editing ? (
        <LoadingHint target={loadingTarget} />
      ) : null}
      {hint && !editing ? (
        <NotEditableHint hint={hint} onDismiss={() => setHint(null)} />
      ) : null}
      {editing ? (
        <EditorOverlay
          key={editing.initialSource}
          editing={editing}
          sourcePath={sourcePath}
          onClose={() => setEditing(null)}
        />
      ) : null}
      {!editing && confirmDelete ? (
        <DeleteConfirmPopover
          target={confirmDelete}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => handleDelete(confirmDelete)}
        />
      ) : !editing && hoverTarget ? (
        <>
          <DeleteButton
            target={hoverTarget}
            onClick={() => setConfirmDelete(hoverTarget)}
            onCancelHide={clearHideTimer}
            onScheduleHide={scheduleHide}
          />
          <AddButton
            target={hoverTarget}
            onClick={() => handleInsert(hoverTarget)}
            onCancelHide={clearHideTimer}
            onScheduleHide={scheduleHide}
          />
        </>
      ) : null}
      {undoState ? (
        <UndoToast
          key={undoState.id}
          onUndo={handleUndo}
          onDismiss={() => setUndoState(null)}
        />
      ) : null}
    </div>
  );
}

function UndoToast({
  onUndo,
  onDismiss,
}: {
  onUndo: () => void;
  onDismiss: () => void;
}) {
  React.useEffect(() => {
    const t = window.setTimeout(onDismiss, 10000);
    return () => window.clearTimeout(t);
  }, [onDismiss]);

  return ReactDOM.createPortal(
    <div
      role="status"
      aria-live="polite"
      data-no-edit="true"
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 98,
      }}
      className="bg-card/95 border-border/70 inline-flex items-center gap-3 rounded-md border px-3.5 py-2 shadow-xl"
    >
      <Trash2 className="text-destructive size-3.5" aria-hidden="true" />
      <span className="text-foreground/90 text-xs">Paragraph deleted</span>
      <button
        type="button"
        onClick={onUndo}
        className="text-foreground hover:bg-foreground/5 rounded-md px-2 py-1 text-xs font-medium transition-colors"
      >
        Undo
      </button>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="text-muted-foreground hover:text-foreground rounded-md px-1 py-0.5 text-xs transition-colors"
      >
        ×
      </button>
    </div>,
    document.body,
  );
}

function DeleteButton({
  target,
  onClick,
  onCancelHide,
  onScheduleHide,
}: {
  target: HoverTarget;
  onClick: () => void;
  onCancelHide: () => void;
  onScheduleHide: () => void;
}) {
  return ReactDOM.createPortal(
    <button
      type="button"
      data-no-edit="true"
      aria-label="Delete paragraph"
      title="Delete paragraph"
      onMouseDown={(e) => e.preventDefault()}
      onMouseEnter={onCancelHide}
      onMouseLeave={onScheduleHide}
      onClick={onClick}
      style={{
        position: "absolute",
        top: target.rect.top + window.scrollY,
        left: Math.max(
          8,
          target.rect.left + window.scrollX - 40,
        ),
        zIndex: 70,
      }}
      className="border-destructive/40 bg-card/95 text-destructive hover:bg-destructive/15 inline-flex size-8 items-center justify-center rounded-md border shadow-lg transition-colors"
    >
      <Trash2 className="size-4" />
    </button>,
    document.body,
  );
}

function AddButton({
  target,
  onClick,
  onCancelHide,
  onScheduleHide,
}: {
  target: HoverTarget;
  onClick: () => void;
  onCancelHide: () => void;
  onScheduleHide: () => void;
}) {
  return ReactDOM.createPortal(
    <button
      type="button"
      data-no-edit="true"
      aria-label="Add paragraph below"
      title="Add paragraph below"
      onMouseDown={(e) => e.preventDefault()}
      onMouseEnter={onCancelHide}
      onMouseLeave={onScheduleHide}
      onClick={onClick}
      style={{
        position: "absolute",
        top: target.rect.top + window.scrollY + 36,
        left: Math.max(8, target.rect.left + window.scrollX - 40),
        zIndex: 70,
      }}
      className="border-border/60 bg-card/95 text-foreground/80 hover:text-foreground hover:bg-foreground/10 inline-flex size-8 items-center justify-center rounded-md border shadow-lg transition-colors"
    >
      <Plus className="size-4" />
    </button>,
    document.body,
  );
}

function DeleteConfirmPopover({
  target,
  onCancel,
  onConfirm,
}: {
  target: HoverTarget;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return ReactDOM.createPortal(
    <div
      role="alertdialog"
      aria-label="Confirm delete paragraph"
      data-no-edit="true"
      onMouseDown={(e) => e.preventDefault()}
      style={{
        position: "absolute",
        top: target.rect.top + window.scrollY,
        left: Math.max(
          8,
          target.rect.left + window.scrollX - 40,
        ),
        zIndex: 96,
      }}
      className="border-destructive/40 bg-card/95 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 shadow-xl"
    >
      <Trash2
        className="text-destructive size-3.5"
        aria-hidden="true"
      />
      <span className="text-foreground/90 text-xs">Delete?</span>
      <button
        type="button"
        onClick={onCancel}
        autoFocus
        className="text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-md px-1.5 py-0.5 text-xs transition-colors"
      >
        No
      </button>
      <button
        type="button"
        onClick={onConfirm}
        className="bg-destructive text-white hover:bg-destructive/90 rounded-md px-1.5 py-0.5 text-xs font-medium transition-colors"
      >
        Yes
      </button>
    </div>,
    document.body,
  );
}

function NotEditableHint({
  hint,
  onDismiss,
}: {
  hint: Hint;
  onDismiss: () => void;
}) {
  return ReactDOM.createPortal(
    <div
      role="status"
      data-no-edit="true"
      onClick={onDismiss}
      style={{
        position: "absolute",
        top: hint.rect.bottom + window.scrollY + 6,
        left: hint.rect.left + window.scrollX,
        maxWidth: Math.max(hint.rect.width, 280),
        zIndex: 95,
      }}
      className="bg-card/95 border-border/70 text-foreground/85 cursor-pointer rounded-md border px-3 py-2 text-xs shadow-xl"
    >
      {hint.message}
    </div>,
    document.body,
  );
}

function extractEditableText(el: HTMLElement): string {
  if (el.tagName === "LI" && el.closest(".tldr-list")) {
    let text = "";
    for (const node of Array.from(el.childNodes)) {
      if (
        node instanceof HTMLElement &&
        node.classList.contains("tldr-tags")
      ) {
        break;
      }
      text += node.textContent ?? "";
    }
    return text.trim();
  }
  return (el.textContent ?? "").trim();
}

function LoadingHint({ target }: { target: HTMLElement }) {
  const rect = target.getBoundingClientRect();
  return ReactDOM.createPortal(
    <div
      data-no-edit="true"
      style={{
        position: "absolute",
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
        zIndex: 80,
        pointerEvents: "none",
      }}
      className="bg-foreground/[0.04] rounded-md"
    />,
    document.body,
  );
}

type OverlayProps = {
  editing: EditingState;
  sourcePath: string;
  onClose: () => void;
};

type LinkPopover =
  | null
  | {
      mode: "create" | "edit";
      selectionStart: number;
      selectionEnd: number;
      text: string;
      url: string;
      existingFullMatch?: string;
    };

function EditorOverlay({ editing, sourcePath, onClose }: OverlayProps) {
  const [value, setValue] = React.useState(editing.initialSource);
  const [status, setStatus] = React.useState<"idle" | "saving" | "error">(
    "idle",
  );
  const [error, setError] = React.useState<string | null>(null);
  const [linkPopover, setLinkPopover] = React.useState<LinkPopover>(null);
  const taRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    const target = editing.target;
    const prev = target.style.visibility;
    target.style.visibility = "hidden";
    return () => {
      target.style.visibility = prev;
    };
  }, [editing.target]);

  React.useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
    autoGrow(ta);
  }, []);

  React.useEffect(() => {
    const ta = taRef.current;
    if (ta) autoGrow(ta);
  }, [value]);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      if (e.key === "Escape") {
        e.preventDefault();
        if (linkPopover) setLinkPopover(null);
        else onClose();
      } else if (meta && e.key === "Enter") {
        e.preventDefault();
        save();
      } else if (meta && e.key.toLowerCase() === "b") {
        e.preventDefault();
        wrap("**", "**");
      } else if (meta && e.key.toLowerCase() === "i") {
        e.preventDefault();
        wrap("*", "*");
      } else if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openLink();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, linkPopover]);

  function applyChange(
    next: string,
    selectionStart?: number,
    selectionEnd?: number,
  ) {
    setValue(next);
    requestAnimationFrame(() => {
      const ta = taRef.current;
      if (!ta) return;
      ta.focus();
      if (selectionStart != null && selectionEnd != null) {
        ta.setSelectionRange(selectionStart, selectionEnd);
      }
    });
  }

  function wrap(before: string, after: string) {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? value.length;
    const end = ta.selectionEnd ?? start;
    const selected = value.slice(start, end);

    // Toggle: if selection is already wrapped, unwrap.
    if (
      selected.startsWith(before) &&
      selected.endsWith(after) &&
      selected.length >= before.length + after.length
    ) {
      const inner = selected.slice(before.length, selected.length - after.length);
      const next = value.slice(0, start) + inner + value.slice(end);
      applyChange(next, start, start + inner.length);
      return;
    }

    // Toggle: if neighbours already have markers, unwrap.
    const before2 = value.slice(Math.max(0, start - before.length), start);
    const after2 = value.slice(end, end + after.length);
    if (before2 === before && after2 === after) {
      const next =
        value.slice(0, start - before.length) +
        selected +
        value.slice(end + after.length);
      applyChange(next, start - before.length, end - before.length);
      return;
    }

    // Default: wrap.
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    applyChange(next, start + before.length, end + before.length);
  }

  function openLink() {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? start;

    // Inspect a generous window around the selection to detect an
    // existing [text](url) we can edit instead of nesting a new one.
    const windowStart = Math.max(0, start - 200);
    const windowText = value.slice(windowStart, end + 200);
    const linkRegex = /\[([^\]]+)\]\(([^)]*)\)/g;
    for (const m of windowText.matchAll(linkRegex)) {
      const absStart = windowStart + (m.index ?? 0);
      const absEnd = absStart + m[0].length;
      if (absStart <= start && absEnd >= end) {
        setLinkPopover({
          mode: "edit",
          selectionStart: absStart,
          selectionEnd: absEnd,
          text: m[1],
          url: m[2],
          existingFullMatch: m[0],
        });
        return;
      }
    }

    const selected = value.slice(start, end);
    setLinkPopover({
      mode: "create",
      selectionStart: start,
      selectionEnd: end,
      text: selected,
      url: "",
    });
  }

  function applyLink() {
    if (!linkPopover) return;
    const { selectionStart, selectionEnd, text, url } = linkPopover;
    if (!url) {
      setLinkPopover(null);
      return;
    }
    const visibleText = text.length > 0 ? text : "link";
    const replacement = `[${visibleText}](${url})`;
    const next =
      value.slice(0, selectionStart) + replacement + value.slice(selectionEnd);
    setLinkPopover(null);
    applyChange(
      next,
      selectionStart + 1,
      selectionStart + 1 + visibleText.length,
    );
  }

  function removeLink() {
    if (!linkPopover) return;
    const { selectionStart, selectionEnd, text } = linkPopover;
    const next = value.slice(0, selectionStart) + text + value.slice(selectionEnd);
    setLinkPopover(null);
    applyChange(next, selectionStart, selectionStart + text.length);
  }

  // When two paragraphs share the same source text, replace by DOM position
  // so the right occurrence is updated. The index is the count of preceding
  // editable elements (within the same editor root) whose extracted text
  // matches the one being edited.
  function computeOccurrenceIndex(): number {
    const root = editing.target.closest<HTMLElement>(
      "[data-mdx-editor-root]",
    );
    if (!root) return 0;
    const editable = Array.from(
      root.querySelectorAll<HTMLElement>(EDITABLE_SELECTOR),
    );
    let index = 0;
    for (const el of editable) {
      if (el === editing.target) return index;
      if (el.closest(SKIP_ANCESTOR_SELECTOR)) continue;
      if (extractEditableText(el) === editing.renderedText) index++;
    }
    return index;
  }

  async function attemptSave(original: string): Promise<Response> {
    return fetch("/api/edit-mdx", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action: "save",
        path: sourcePath,
        original,
        replacement: value,
        occurrence: computeOccurrenceIndex(),
      }),
    });
  }

  async function save() {
    if (value === editing.initialSource) {
      onClose();
      return;
    }
    setStatus("saving");
    setError(null);
    try {
      let res = await attemptSave(editing.initialSource);
      // If the source moved between open and save (e.g. the file was edited
      // elsewhere, or a previous save shifted the surrounding lines), the
      // original we stored on open no longer matches. Re-lookup against the
      // current source using the rendered text and retry once.
      if (res.status === 404) {
        try {
          const lookup = await fetch("/api/edit-mdx", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              action: "lookup",
              path: sourcePath,
              rendered: editing.renderedText,
            }),
          });
          if (lookup.ok) {
            const data = (await lookup.json()) as { source: string };
            if (data.source && data.source !== editing.initialSource) {
              res = await attemptSave(data.source);
            }
          }
        } catch {
          // Fall through with the original 404 response.
        }
      }
      if (!res.ok) {
        const text = await res.text();
        let message =
          text || `Save failed with status ${res.status}`;
        if (res.status === 404) {
          message =
            "Couldn't find this text in the source — the file may have changed since you opened the editor. Refresh the page and try again.";
        }
        throw new Error(message);
      }
      patchDom(editing.target, editing.renderedText, value);
      onClose();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  const style: React.CSSProperties = {
    position: "absolute",
    top: editing.rect.top + window.scrollY,
    left: editing.rect.left + window.scrollX,
    width: editing.rect.width,
    zIndex: 90,
  };

  return ReactDOM.createPortal(
    <div
      role="dialog"
      aria-label="Edit text"
      data-no-edit="true"
      style={style}
      className="space-y-2"
    >
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border-foreground/30 bg-card/95 text-foreground/95 focus:border-foreground/50 w-full resize-none rounded-md border px-3 py-2 font-mono text-sm leading-relaxed shadow-xl outline-none focus:ring-0"
        style={{ minHeight: editing.rect.height }}
        spellCheck
      />
      {error ? (
        <p className="text-destructive border-destructive/30 bg-card/95 rounded-md border px-3 py-2 text-xs">
          {error}
        </p>
      ) : null}
      <div className="bg-card/95 border-border/70 flex flex-wrap items-center gap-2 rounded-md border px-2 py-1.5 shadow-xl">
        <div className="flex items-center gap-1">
          <ToolbarButton
            label="Bold (Cmd/Ctrl+B)"
            onClick={() => wrap("**", "**")}
          >
            <Bold className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton
            label="Italic (Cmd/Ctrl+I)"
            onClick={() => wrap("*", "*")}
          >
            <Italic className="size-3.5" />
          </ToolbarButton>
          <ToolbarButton label="Link (Cmd/Ctrl+K)" onClick={openLink}>
            <Link2 className="size-3.5" />
          </ToolbarButton>
        </div>
        <p className="text-muted-foreground/70 flex-1 truncate px-1 font-mono text-2xs uppercase tracking-mini">
          {sourcePath}
        </p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onClose}
            disabled={status === "saving"}
            className="text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-md px-2.5 py-1 text-xs transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={status === "saving" || value === editing.initialSource}
            className="bg-foreground text-background hover:bg-foreground/90 rounded-md px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50"
          >
            {status === "saving" ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
      {linkPopover ? (
        <LinkEditor
          popover={linkPopover}
          onChange={(patch) =>
            setLinkPopover((p) => (p ? { ...p, ...patch } : p))
          }
          onApply={applyLink}
          onRemove={linkPopover.mode === "edit" ? removeLink : undefined}
          onCancel={() => setLinkPopover(null)}
        />
      ) : null}
    </div>,
    document.body,
  );
}

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="text-muted-foreground hover:text-foreground hover:bg-foreground/5 inline-flex size-7 items-center justify-center rounded-md transition-colors"
    >
      {children}
    </button>
  );
}

function LinkEditor({
  popover,
  onChange,
  onApply,
  onRemove,
  onCancel,
}: {
  popover: NonNullable<LinkPopover>;
  onChange: (patch: Partial<NonNullable<LinkPopover>>) => void;
  onApply: () => void;
  onRemove?: () => void;
  onCancel: () => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="bg-card/95 border-border/70 space-y-2 rounded-md border px-3 py-3 shadow-xl">
      <div className="flex flex-col gap-1.5">
        <label className="text-muted-foreground font-mono text-2xs uppercase tracking-mini">
          Link text
        </label>
        <input
          type="text"
          value={popover.text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="visible text"
          className="border-border/60 bg-background/40 focus:border-foreground/40 rounded-md border px-2 py-1 text-sm outline-none"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-muted-foreground font-mono text-2xs uppercase tracking-mini">
          URL
        </label>
        <input
          ref={inputRef}
          type="url"
          value={popover.url}
          onChange={(e) => onChange({ url: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onApply();
            }
          }}
          placeholder="https://"
          className="border-border/60 bg-background/40 focus:border-foreground/40 rounded-md border px-2 py-1 font-mono text-xs outline-none"
        />
      </div>
      <div className="flex items-center justify-end gap-1.5 pt-1">
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 mr-auto rounded-md px-2.5 py-1 text-xs transition-colors"
          >
            Remove link
          </button>
        ) : null}
        <button
          type="button"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-md px-2.5 py-1 text-xs transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onApply}
          disabled={!popover.url}
          className="bg-foreground text-background hover:bg-foreground/90 rounded-md px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50"
        >
          {popover.mode === "edit" ? "Update" : "Add link"}
        </button>
      </div>
    </div>
  );
}

function autoGrow(ta: HTMLTextAreaElement) {
  ta.style.height = "auto";
  ta.style.height = `${ta.scrollHeight + 2}px`;
}

// Optimistic DOM update so the user sees the edit instantly. Renders the new
// source to plain text (markdown stripped) and writes it back to the target.
// HMR will follow up with a canonical re-render.
function patchDom(
  target: HTMLElement,
  _previousRendered: string,
  newSource: string,
) {
  const rendered = renderSourceForDom(newSource);
  if (target.tagName === "LI" && target.closest(".tldr-list")) {
    let replaced = false;
    for (const node of Array.from(target.childNodes)) {
      if (
        node instanceof HTMLElement &&
        node.classList.contains("tldr-tags")
      ) {
        break;
      }
      if (node.nodeType === Node.TEXT_NODE) {
        if (!replaced) {
          node.textContent = rendered;
          replaced = true;
        } else {
          node.textContent = "";
        }
      }
    }
    return;
  }
  target.textContent = rendered;
}

function renderSourceForDom(s: string): string {
  return s
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&mdash;/g, "—")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/<\/?(em|strong|i|b|code|span)[^>]*>/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
