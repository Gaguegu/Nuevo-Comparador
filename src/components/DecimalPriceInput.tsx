import React, { useState, useEffect } from 'react';

interface DecimalPriceInputProps {
  id?: string;
  value: number;
  onChange: (val: number) => void;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

/**
 * DecimalPriceInput
 * Specifically engineered for Android mobile manual input:
 * - Comfortable width that easily displays 7-8 digits (e.g. 0,000000) without hiding or clipping
 * - Supports both Spanish comma (,) and dot (.) decimals seamlessly
 * - Uses inputMode="decimal" to open the Android numeric decimal keyboard
 * - Auto-selects text on tap for rapid overwriting without manual backspacing
 */
export const DecimalPriceInput: React.FC<DecimalPriceInputProps> = ({
  id,
  value,
  onChange,
  placeholder = '0,000000',
  className = '',
  ariaLabel,
  disabled = false,
}) => {
  // Local string state to allow natural typing of '0,' or '0.000'
  const [text, setText] = useState<string>(() => {
    if (value === 0) return '';
    return value.toString().replace('.', ',');
  });

  const [isFocused, setIsFocused] = useState(false);

  // Synchronize when external value changes and input is not being actively typed
  useEffect(() => {
    if (!isFocused) {
      if (value === 0) {
        setText('');
      } else {
        setText(value.toString().replace('.', ','));
      }
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    
    // Normalize: only allow digits, single comma or dot, and minus (if applicable)
    // Replace multiple dots/commas
    raw = raw.replace(/[^0-9.,]/g, '');
    
    // Keep at most one decimal separator
    const firstSepIndex = raw.search(/[.,]/);
    if (firstSepIndex !== -1) {
      const sep = raw[firstSepIndex];
      const before = raw.slice(0, firstSepIndex);
      const after = raw.slice(firstSepIndex + 1).replace(/[.,]/g, '');
      raw = `${before}${sep}${after}`;
    }

    setText(raw);

    // Parse and broadcast numeric value
    if (raw === '' || raw === ',' || raw === '.') {
      onChange(0);
    } else {
      const parsed = parseFloat(raw.replace(',', '.'));
      if (!isNaN(parsed)) {
        onChange(parsed);
      }
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    // On Android, select all text so user can immediately type new number
    e.target.select();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (text === '' || text === ',' || text === '.') {
      setText('');
      onChange(0);
    } else {
      const parsed = parseFloat(text.replace(',', '.'));
      if (isNaN(parsed) || parsed === 0) {
        setText('');
        onChange(0);
      } else {
        setText(parsed.toString().replace('.', ','));
      }
    }
  };

  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      pattern="[0-9]*[.,]?[0-9]*"
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      disabled={disabled}
      value={text}
      placeholder={placeholder}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      aria-label={ariaLabel}
      className={`font-mono text-sm font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl px-2.5 py-1.5 text-center focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition w-36 min-w-[130px] placeholder:text-slate-400 placeholder:font-normal ${className}`}
    />
  );
};
