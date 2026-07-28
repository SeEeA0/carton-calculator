document.addEventListener('DOMContentLoaded', () => {
  // 1. 다크모드 초기화 및 토글 버튼 생성
  const topActions = document.querySelector('.top-actions');
  if (topActions) {
    const themeBtn = document.createElement('button');
    themeBtn.className = 'theme-toggle';
    themeBtn.type = 'button';
    
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeBtn.textContent = currentTheme === 'dark' ? '☀️ 라이트모드' : '🌙 다크모드';

    themeBtn.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      let newTheme = theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeBtn.textContent = newTheme === 'dark' ? '☀️ 라이트모드' : '🌙 다크모드';
    });
    
    topActions.prepend(themeBtn);
  }

  // 2. 모바일 사이드바 토글 기능
  const menuBtn = document.querySelector('[data-menu]');
  const sidebar = document.querySelector('.sidebar');
  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // 3. 체크리스트 상태 관리 및 진행률 계산
  const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
  const progressFill = document.querySelector('[data-progress-fill]');
  const progressText = document.querySelector('[data-progress-text]');
  const resetBtn = document.querySelector('[data-reset]');
  const printBtn = document.querySelector('[data-print]');

  const pageKey = 'guide_check_' + location.pathname.split('/').pop();

  function loadChecklist() {
    const saved = localStorage.getItem(pageKey);
    if (saved) {
      const state = JSON.parse(saved);
      checkboxes.forEach((cb, idx) => {
        if (state[idx] !== undefined) cb.checked = state[idx];
      });
    }
    updateProgress();
  }

  function saveChecklist() {
    const state = Array.from(checkboxes).map(cb => cb.checked);
    localStorage.setItem(pageKey, JSON.stringify(state));
    updateProgress();
  }

  function updateProgress() {
    if (!checkboxes.length) return;
    const total = checkboxes.length;
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const percent = Math.round((checked / total) * 100);
    
    if (progressFill) progressFill.style.width = percent + '%';
    if (progressText) progressText.textContent = `${checked} / ${total} 완료 (${percent}%)`;
  }

  checkboxes.forEach(cb => {
    cb.addEventListener('change', saveChecklist);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('체크리스트를 초기화하시겠습니까?')) {
        localStorage.removeItem(pageKey);
        checkboxes.forEach(cb => cb.checked = false);
        updateProgress();
      }
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  loadChecklist();
});