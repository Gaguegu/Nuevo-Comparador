/**
 * Keyboard Navigation Utility for Electricity Comparison Tool
 * 
 * Provides Excel-like navigation:
 * - INTRO (Enter / Numpad Enter): Advances to the next editable input field.
 * - SHIFT + INTRO: Moves to the previous editable input field.
 * - ARROW DOWN / UP: In tables with multiple periods/rows, smoothly navigates vertically.
 * - Automatically selects all text in the newly focused input for immediate overwriting.
 */

function isVisible(el: HTMLElement): boolean {
  if (el.offsetWidth > 0 || el.offsetHeight > 0) return true;
  const rects = el.getClientRects();
  return rects.length > 0 && rects[0].width > 0 && rects[0].height > 0;
}

export function getFocusableInputs(container: Document | HTMLElement = document): HTMLInputElement[] {
  const selector =
    'input:not([type="hidden"]):not([disabled]):not([readonly]):not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"])';
  const all = Array.from(container.querySelectorAll<HTMLInputElement>(selector));
  return all.filter(isVisible);
}

export function focusAndSelect(input: HTMLInputElement) {
  input.focus();
  try {
    input.select();
  } catch {}
  requestAnimationFrame(() => {
    if (document.activeElement === input) {
      try {
        input.select();
      } catch {}
    }
  });
}

export function setupEnterKeyNavigation(): () => void {
  const handleKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target || target.tagName !== 'INPUT') return;

    const input = target as HTMLInputElement;
    const type = (input.type || 'text').toLowerCase();
    if (['button', 'submit', 'reset', 'checkbox', 'radio', 'file', 'image'].includes(type)) {
      return;
    }

    // If inside a <form onSubmit>, allow normal form submit
    if (input.closest('form')) {
      return;
    }

    // Modal containment: if inside a modal dialog, navigate only within that modal
    const modal = input.closest<HTMLElement>('[role="dialog"], .fixed');
    const container = modal || document;

    // --- ARROW DOWN / ARROW UP in desktop table (Column-wise navigation) ---
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const tariffId = input.getAttribute('data-tariff-id');
      const tableSection = input.getAttribute('data-table-section'); // 'potencia' | 'energia'
      const periodIdxStr = input.getAttribute('data-period-idx');

      if (tariffId && tableSection && periodIdxStr !== null) {
        const currentIdx = parseInt(periodIdxStr, 10);
        const targetIdx = e.key === 'ArrowDown' ? currentIdx + 1 : currentIdx - 1;
        const targetInput = container.querySelector<HTMLInputElement>(
          `input[data-tariff-id="${tariffId}"][data-table-section="${tableSection}"][data-period-idx="${targetIdx}"]`
        );

        if (targetInput && isVisible(targetInput)) {
          e.preventDefault();
          input.blur();
          focusAndSelect(targetInput);
          return;
        }
      }
    }

    // --- INTRO (Enter) NAVIGATION ---
    if (e.key === 'Enter') {
      e.preventDefault();

      // Blur current input to ensure React onBlur & onChange format/commit
      input.blur();

      const visibleInputs = getFocusableInputs(container);
      const currentIndex = visibleInputs.indexOf(input);

      if (currentIndex !== -1) {
        const nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1;
        if (nextIndex >= 0 && nextIndex < visibleInputs.length) {
          const nextInput = visibleInputs[nextIndex];
          focusAndSelect(nextInput);
        }
      }
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}
