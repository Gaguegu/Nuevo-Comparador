/**
 * Keyboard Navigation Utility for Electricity Comparison Tool
 * 
 * Provides spreadsheet-grade navigation:
 * - INTRO (Enter / Numpad Enter): Advances down the CURRENT commercializadora
 *   (Potencia P1..P6 -> Energía P1..P6), and then continues to the next commercializadora.
 * - SHIFT + INTRO: Moves to the previous period in the current commercializadora.
 * - ARROW DOWN (↓) / ARROW UP (↑): Moves vertically between periods for the same commercializadora.
 * - ARROW RIGHT (→) / ARROW LEFT (←): Moves horizontally across commercializadoras for the same period.
 * - Automatically selects all text in the newly focused input for instant overwriting.
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

/**
 * Returns all active tariff IDs visible on screen in desktop table order (left to right)
 */
function getVisibleTariffIds(container: Document | HTMLElement): string[] {
  const headerInputs = Array.from(
    container.querySelectorAll<HTMLInputElement>(
      'input[data-tariff-id][data-table-section="potencia-header"]'
    )
  ).filter(isVisible);

  return headerInputs
    .map((el) => el.getAttribute('data-tariff-id'))
    .filter((id): id is string => Boolean(id));
}

/**
 * Returns all editable inputs for a single commercializadora in natural entry order:
 * [Header Name, Potencia P1..P6, Energía P1..P6]
 */
function getInputsForSingleTariff(
  tariffId: string,
  container: Document | HTMLElement
): HTMLInputElement[] {
  const inputs: HTMLInputElement[] = [];

  // 1. Header Name (Potencia header)
  const header = container.querySelector<HTMLInputElement>(
    `input[data-tariff-id="${tariffId}"][data-table-section="potencia-header"]`
  );
  if (header && isVisible(header)) inputs.push(header);

  // 2. Potencia P1 to P6
  for (let p = 0; p < 6; p++) {
    const pot = container.querySelector<HTMLInputElement>(
      `input[data-tariff-id="${tariffId}"][data-table-section="potencia"][data-period-idx="${p}"]`
    );
    if (pot && isVisible(pot)) inputs.push(pot);
  }

  // 3. Energía P1 to P6
  for (let p = 0; p < 6; p++) {
    const en = container.querySelector<HTMLInputElement>(
      `input[data-tariff-id="${tariffId}"][data-table-section="energia"][data-period-idx="${p}"]`
    );
    if (en && isVisible(en)) inputs.push(en);
  }

  return inputs;
}

/**
 * Returns the entire ordered list of tariff comparison inputs grouped by column
 */
function getAllTariffInputsByColumn(container: Document | HTMLElement): HTMLInputElement[] {
  const tariffIds = getVisibleTariffIds(container);
  const result: HTMLInputElement[] = [];
  for (const tId of tariffIds) {
    result.push(...getInputsForSingleTariff(tId, container));
  }
  return result;
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

    const tariffId = input.getAttribute('data-tariff-id');
    const tableSection = input.getAttribute('data-table-section');
    const periodIdxStr = input.getAttribute('data-period-idx');

    // =========================================================================
    // 1. INTRO / ENTER KEY NAVIGATION
    // =========================================================================
    if (e.key === 'Enter') {
      e.preventDefault();
      input.blur();

      // If user is inside the Desktop Comparison Table
      if (tariffId && tableSection) {
        // Handle energy header specifically: pressing Enter moves to Energía P1 of this tariff
        if (tableSection === 'energia-header') {
          const firstEnergiaInput = container.querySelector<HTMLInputElement>(
            `input[data-tariff-id="${tariffId}"][data-table-section="energia"][data-period-idx="0"]`
          );
          if (firstEnergiaInput && isVisible(firstEnergiaInput)) {
            focusAndSelect(firstEnergiaInput);
            return;
          }
        }

        const columnOrderedInputs = getAllTariffInputsByColumn(container);
        const currentIndex = columnOrderedInputs.indexOf(input);

        if (currentIndex !== -1) {
          const nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1;
          if (nextIndex >= 0 && nextIndex < columnOrderedInputs.length) {
            focusAndSelect(columnOrderedInputs[nextIndex]);
            return;
          }
        }
      }

      // Default linear navigation for ConsumoView, ImpuestosView, Modals, etc.
      const visibleInputs = getFocusableInputs(container);
      const currentIndex = visibleInputs.indexOf(input);

      if (currentIndex !== -1) {
        const nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1;
        if (nextIndex >= 0 && nextIndex < visibleInputs.length) {
          const nextInput = visibleInputs[nextIndex];
          focusAndSelect(nextInput);
        }
      }
      return;
    }

    // =========================================================================
    // 2. ARROW KEYS IN DESKTOP TARIFF COMPARISON TABLE
    // =========================================================================
    if (tariffId && tableSection && periodIdxStr !== null) {
      const currentPeriod = parseInt(periodIdxStr, 10);

      // --- ARROW DOWN (↓) ---
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        input.blur();

        if (tableSection === 'potencia-header') {
          // From Name to Potencia P1
          const target = container.querySelector<HTMLInputElement>(
            `input[data-tariff-id="${tariffId}"][data-table-section="potencia"][data-period-idx="0"]`
          );
          if (target && isVisible(target)) return focusAndSelect(target);
        } else if (tableSection === 'energia-header') {
          // From Energía Name to Energía P1
          const target = container.querySelector<HTMLInputElement>(
            `input[data-tariff-id="${tariffId}"][data-table-section="energia"][data-period-idx="0"]`
          );
          if (target && isVisible(target)) return focusAndSelect(target);
        } else if (tableSection === 'potencia') {
          if (currentPeriod < 5) {
            const target = container.querySelector<HTMLInputElement>(
              `input[data-tariff-id="${tariffId}"][data-table-section="potencia"][data-period-idx="${currentPeriod + 1}"]`
            );
            if (target && isVisible(target)) return focusAndSelect(target);
          } else {
            // Potencia P6 -> Energía P1
            const target = container.querySelector<HTMLInputElement>(
              `input[data-tariff-id="${tariffId}"][data-table-section="energia"][data-period-idx="0"]`
            );
            if (target && isVisible(target)) return focusAndSelect(target);
          }
        } else if (tableSection === 'energia') {
          if (currentPeriod < 5) {
            const target = container.querySelector<HTMLInputElement>(
              `input[data-tariff-id="${tariffId}"][data-table-section="energia"][data-period-idx="${currentPeriod + 1}"]`
            );
            if (target && isVisible(target)) return focusAndSelect(target);
          }
        }
        return;
      }

      // --- ARROW UP (↑) ---
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        input.blur();

        if (tableSection === 'energia') {
          if (currentPeriod > 0) {
            const target = container.querySelector<HTMLInputElement>(
              `input[data-tariff-id="${tariffId}"][data-table-section="energia"][data-period-idx="${currentPeriod - 1}"]`
            );
            if (target && isVisible(target)) return focusAndSelect(target);
          } else {
            // Energía P1 -> Potencia P6
            const target = container.querySelector<HTMLInputElement>(
              `input[data-tariff-id="${tariffId}"][data-table-section="potencia"][data-period-idx="5"]`
            );
            if (target && isVisible(target)) return focusAndSelect(target);
          }
        } else if (tableSection === 'potencia') {
          if (currentPeriod > 0) {
            const target = container.querySelector<HTMLInputElement>(
              `input[data-tariff-id="${tariffId}"][data-table-section="potencia"][data-period-idx="${currentPeriod - 1}"]`
            );
            if (target && isVisible(target)) return focusAndSelect(target);
          } else {
            // Potencia P1 -> Potencia Header Name
            const target = container.querySelector<HTMLInputElement>(
              `input[data-tariff-id="${tariffId}"][data-table-section="potencia-header"]`
            );
            if (target && isVisible(target)) return focusAndSelect(target);
          }
        }
        return;
      }

      // --- ARROW RIGHT (→) - Move to same period in NEXT commercializadora ---
      if (e.key === 'ArrowRight') {
        const valLen = input.value.length;
        const isAllSelected = input.selectionStart === 0 && input.selectionEnd === valLen;
        const isAtEnd = input.selectionStart === valLen;

        if (isAllSelected || isAtEnd) {
          const visibleTariffIds = getVisibleTariffIds(container);
          const curIndex = visibleTariffIds.indexOf(tariffId);
          if (curIndex !== -1 && curIndex < visibleTariffIds.length - 1) {
            const nextTariffId = visibleTariffIds[curIndex + 1];
            const target = container.querySelector<HTMLInputElement>(
              `input[data-tariff-id="${nextTariffId}"][data-table-section="${tableSection}"][data-period-idx="${periodIdxStr}"]`
            );
            if (target && isVisible(target)) {
              e.preventDefault();
              input.blur();
              return focusAndSelect(target);
            }
          }
        }
      }

      // --- ARROW LEFT (←) - Move to same period in PREVIOUS commercializadora ---
      if (e.key === 'ArrowLeft') {
        const valLen = input.value.length;
        const isAllSelected = input.selectionStart === 0 && input.selectionEnd === valLen;
        const isAtStart = input.selectionStart === 0 && input.selectionEnd === 0;

        if (isAllSelected || isAtStart) {
          const visibleTariffIds = getVisibleTariffIds(container);
          const curIndex = visibleTariffIds.indexOf(tariffId);
          if (curIndex > 0) {
            const prevTariffId = visibleTariffIds[curIndex - 1];
            const target = container.querySelector<HTMLInputElement>(
              `input[data-tariff-id="${prevTariffId}"][data-table-section="${tableSection}"][data-period-idx="${periodIdxStr}"]`
            );
            if (target && isVisible(target)) {
              e.preventDefault();
              input.blur();
              return focusAndSelect(target);
            }
          }
        }
      }
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}
