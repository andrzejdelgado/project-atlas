import { getMdxComponents } from "@/mdx-components";

type Kind = "case-studies" | "projects" | "about";

export async function MdxContent({
  kind,
  slug,
}: {
  kind: Kind;
  slug?: string;
}) {
  const components = getMdxComponents();
  const mod =
    kind === "about"
      ? await import(`@/content/about.mdx`)
      : kind === "case-studies"
        ? await import(`@/content/case-studies/${slug}.mdx`)
        : await import(`@/content/projects/${slug}.mdx`);

  const MDX = mod.default;
  return <MDX components={components} />;
}
