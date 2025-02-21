import * as React from "react";

const Checkbox = ({ checked = false, onCheckedChange, className = "", ariaLabel = "Checkbox" }) => {
  return (
    <label className={`flex items-center cursor-pointer ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="w-5 h-5 accent-blue-500 cursor-pointer"
        aria-label={ariaLabel}
      />
    </label>
  );
};

export { Checkbox };
