import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import Image, { type ImageProps } from "next/image";
import { ArrowUpRight } from "lucide-react";

export function getMdxComponents(
  components: MDXComponents = {},
): MDXComponents {
  return {
    h1: ({ children, ...p }) => (
      <h1
        className="mt-8 scroll-m-20 text-3xl font-semibold tracking-tight"
        {...p}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...p }) => (
      <h2
        className="mt-10 scroll-m-20 text-2xl font-semibold tracking-tight"
        {...p}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...p }) => (
      <h3
        className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight"
        {...p}
      >
        {children}
      </h3>
    ),
    p: ({ children, ...p }) => (
      <p className="text-foreground/85 mt-4 leading-7" {...p}>
        {children}
      </p>
    ),
    a: ({ href = "", children, ...p }) => {
      const isExternal = /^https?:\/\//.test(href);
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground decoration-muted-foreground/50 hover:decoration-foreground group inline underline underline-offset-4 transition-colors duration-200"
            {...p}
          >
            {children}
            <ArrowUpRight
              aria-hidden="true"
              className="text-muted-foreground/70 group-hover:text-foreground ml-0.5 inline size-[0.85em] -translate-y-[0.05em] transition-all duration-200 group-hover:-translate-y-[0.15em] group-hover:translate-x-[0.05em]"
            />
          </a>
        );
      }
      return (
        <Link
          href={href}
          className="text-foreground decoration-muted-foreground/50 hover:decoration-foreground underline underline-offset-4 transition-colors duration-200"
          {...p}
        >
          {children}
        </Link>
      );
    },
    ul: ({ children, ...p }) => (
      <ul className="text-foreground/85 mt-4 list-disc space-y-1 pl-6" {...p}>
        {children}
      </ul>
    ),
    ol: ({ children, ...p }) => (
      <ol
        className="text-foreground/85 mt-4 list-decimal space-y-1 pl-6"
        {...p}
      >
        {children}
      </ol>
    ),
    blockquote: ({ children, ...p }) => (
      <blockquote
        className="border-border text-muted-foreground mt-6 border-l-2 pl-6 italic"
        {...p}
      >
        {children}
      </blockquote>
    ),
    code: ({ children, ...p }) => (
      <code
        className="bg-muted text-foreground rounded-md px-1.5 py-0.5 font-mono text-[0.9em]"
        {...p}
      >
        {children}
      </code>
    ),
    pre: ({ children, ...p }) => (
      <pre
        className="border-border bg-muted/40 mt-4 overflow-x-auto rounded-xl border p-4 text-sm"
        {...p}
      >
        {children}
      </pre>
    ),
    hr: (p) => <hr className="border-border my-10" {...p} />,
    img: (props) => {
      const { alt = "", ...rest } = props as ImageProps;
      return (
        <Image
          alt={alt}
          sizes="(max-width: 840px) 100vw, 840px"
          width={1600}
          height={900}
          className="border-border my-6 rounded-xl border"
          {...rest}
        />
      );
    },
    ...components,
  };
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return getMdxComponents(components);
}
