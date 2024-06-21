import clsx from "clsx";
import { PropsWithChildren, forwardRef } from "react";

type Props = PropsWithChildren<
  {
    display?: "inline" | "block" | "full";
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>;
const Button = forwardRef(function (props: Props, ref: React.Ref<HTMLButtonElement>) {
  const { display = "inline", disabled, className, children, ...rest } = props;

  return (
    <button
      ref={ref}
      className={clsx("btn", { disabled: disabled }, className)}
      {...rest}
      disabled={disabled}
    >
      <span className="button__content">{children}</span>
    </button>
  );
});

export default Button;
