const toast = document.querySelector('.toast');
const copyTargets = document.querySelectorAll('[data-copy]');
let toastTimer = null;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 1800);
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  const success = document.execCommand('copy');
  document.body.removeChild(textarea);
  return success;
}

copyTargets.forEach((link) => {
  link.addEventListener('click', async () => {
    const text = link.dataset.copy;
    if (!text) return;
    try {
      await copyText(text);
      showToast('복사됨 · 카톡 검색창에 besta12 붙여넣기');
    } catch (error) {
      showToast('복사에 실패했습니다. 수동으로 입력해 주세요.');
    }
  });
});
