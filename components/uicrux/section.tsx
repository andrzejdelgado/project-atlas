type Props = {
  id: string;
  children: React.ReactNode;
};

export function Section({ id, children }: Props) {
  return (
    <h2
      id={id}
      className="mt-14 scroll-mt-24 text-2xl font-semibold tracking-tight first:mt-10"
    >
      {children}
    </h2>
  );
}

export function Subsection({ id, children }: Props) {
  return (
    <h3
      id={id}
      className="mt-10 scroll-mt-24 text-lg font-semibold tracking-tight"
    >
      {children}
    </h3>
  );
}
