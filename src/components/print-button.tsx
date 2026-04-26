"use client";

type PrintButtonProps = {
  href?: string;
};

export function PrintButton({ href }: PrintButtonProps) {
  if (!href) {
    return (
      <button className="button button-primary" onClick={() => window.print()} type="button">
        Print now
      </button>
    );
  }

  return (
    <a className="button button-primary" href={href} rel="noreferrer" target="_blank">
      Open PDF to Print
    </a>
  );
}
