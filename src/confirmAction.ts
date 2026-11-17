// A single in-page modal keeps destructive actions explicit and keyboard accessible.
export async function confirmAction(message: string, confirmLabel = 'Confirm', title = 'Confirm action'): Promise<boolean> {
  if (document.querySelector('.confirmation-dialog')) return false;
  const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const dialog = document.createElement('dialog');
  dialog.className = 'confirmation-dialog';
  dialog.setAttribute('aria-labelledby', 'confirmation-title');
  dialog.setAttribute('aria-describedby', 'confirmation-message');
  dialog.innerHTML = `
    <form method="dialog">
      <h2 id="confirmation-title"></h2>
      <p id="confirmation-message"></p>
      <div class="confirmation-actions">
        <button class="action-button" value="cancel" autofocus>Cancel</button>
        <button class="action-button confirmation-confirm" value="confirm"></button>
      </div>
    </form>`;
  dialog.querySelector('h2')!.textContent = title;
  dialog.querySelector('p')!.textContent = message;
  dialog.querySelector('.confirmation-confirm')!.textContent = confirmLabel;
  document.body.append(dialog);
  return new Promise((resolve) => {
    const cancelOnNavigation = (): void => dialog.close('cancel');
    window.addEventListener('hashchange', cancelOnNavigation);
    // Keep page-level shortcuts from editing data behind the modal.
    dialog.addEventListener('keydown', (event) => {
      event.stopPropagation();
      if (event.key !== 'Tab') return;
      const cancel = dialog.querySelector<HTMLButtonElement>('button[value="cancel"]')!;
      const confirm = dialog.querySelector<HTMLButtonElement>('button[value="confirm"]')!;
      if (event.shiftKey && document.activeElement === cancel) {
        event.preventDefault();
        confirm.focus();
      } else if (!event.shiftKey && document.activeElement === confirm) {
        event.preventDefault();
        cancel.focus();
      }
    });
    dialog.addEventListener('close', () => {
      const confirmed = dialog.returnValue === 'confirm';
      window.removeEventListener('hashchange', cancelOnNavigation);
      dialog.remove();
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
      resolve(confirmed);
    }, { once: true });
    dialog.showModal();
  });
}

