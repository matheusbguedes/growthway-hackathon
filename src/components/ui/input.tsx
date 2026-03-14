import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, containerClassName, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePassword = () => setShowPassword(!showPassword);

    return (
      <div className={cn("flex flex-col space-y-2", containerClassName)}>
        {label && (
          <Label
            htmlFor={props.id}
            className={cn("mb-1 text-zinc-400", props.disabled && "opacity-40")}
          >
            {label}
          </Label>
        )}
        <div className="relative">
          <input
            type={
              type === "password" ? (showPassword ? "text" : "password") : type
            }
            className={cn(
              `flex h-10 w-full rounded-xl border bg-transparent px-3 py-1 text-base shadow-sm outline-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
                error ? "border-red-500" : "border-input"
              }`,
              type === "password" && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-500 cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
