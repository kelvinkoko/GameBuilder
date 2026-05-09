import type { ReactNode } from "react";
import { sounds } from "../audio/sounds";

type Variant = "primary" | "accent" | "good" | "info" | "ghost";

type Props = {
  icon?: string;
  label?: string;
  onClick?: () => void;
  variant?: Variant;
  disabled?: boolean;
  iconOnly?: boolean;
  title?: string;
  children?: ReactNode;
};

export function BigButton({
  icon,
  label,
  onClick,
  variant = "primary",
  disabled,
  iconOnly,
  title,
  children
}: Props) {
  const cls = `${iconOnly ? "iconbtn" : "bigbtn"} ${
    variant === "primary" ? "" : variant
  }`;
  return (
    <button
      className={cls}
      disabled={disabled}
      title={title ?? label}
      aria-label={title ?? label}
      onClick={() => {
        if (disabled) return;
        sounds.pop();
        onClick?.();
      }}
    >
      {icon && <span className="ico">{icon}</span>}
      {!iconOnly && label && <span className="label">{label}</span>}
      {children}
    </button>
  );
}
