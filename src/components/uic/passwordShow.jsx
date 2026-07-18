import { forwardRef, useRef, useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

export const PasswordField = forwardRef(
  ({ value, onChange, passwordError, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef(null);

    const handleRef = (node) => {
      inputRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const onClickReveal = (e) => {
      e.preventDefault();
      setIsOpen(!isOpen);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    return (
      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm font-semibold text-gray-700" htmlFor="password">
          Password
        </label>
        <div className="relative flex items-center">
          <input
            id="password"
            ref={handleRef}
            name="password"
            type={isOpen ? "text" : "password"}
            autoComplete="current-password"
            required
            value={value}
            onChange={onChange}
            className={`w-full p-2 pr-10 border rounded outline-none transition-colors ${
              passwordError
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-teal-500"
            }`}
            {...props}
          />
          <button
            type="button"
            onClick={onClickReveal}
            className="absolute right-3 text-gray-500 hover:text-gray-700 outline-none"
            aria-label={isOpen ? "Mask password" : "Reveal password"}
          >
            {isOpen ? <HiEyeOff className="text-lg" /> : <HiEye className="text-lg" />}
          </button>
        </div>
        {passwordError && (
          <p className="text-red-500 text-xs mt-1">{passwordError}</p>
        )}
      </div>
    );
  }
);

PasswordField.displayName = "PasswordField";
