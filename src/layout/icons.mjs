// Inline line icons (original artwork, 24x24, 1.5px stroke). Decorative by default.

const paths = {
  building:
    '<path d="M4 21V6.5L12 3l8 3.5V21"/><path d="M2.5 21h19"/><path d="M9 21v-4h6v4"/><path d="M8.5 9h1.5M14 9h1.5M8.5 12.5h1.5M14 12.5h1.5"/>',
  briefcase:
    '<rect x="3" y="7.5" width="18" height="12" rx="1.5"/><path d="M9 7.5V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5v2"/><path d="M3 12.5h18"/><path d="M11 12.5v1.5h2v-1.5"/>',
  ledger:
    '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M8.5 7.5h7"/><path d="M8.5 11.5h1.5M12 11.5h1M15 11.5h.5M8.5 14.5h1.5M12 14.5h1M15 14.5h.5M8.5 17.5h1.5M12 17.5h3.5"/>',
  document:
    '<path d="M7 3h7.5L19 7.5V21H7a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 7 3z"/><path d="M14.5 3v4.5H19"/><path d="M9 12h6M9 15h6M9 18h3.5"/>',
  scales:
    '<path d="M12 3.5v17"/><path d="M8 20.5h8"/><path d="M5.5 6.5h13"/><path d="M5.5 6.5l-3 7a3 3 0 0 0 6 0l-3-7z"/><path d="M18.5 6.5l-3 7a3 3 0 0 0 6 0l-3-7z"/>',
  phone:
    '<path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.5 1.5A16.5 16.5 0 0 1 5 5a1.5 1.5 0 0 1 1.5-1.5z"/>',
  pin:
    '<path d="M12 21s-6.5-5.5-6.5-11a6.5 6.5 0 0 1 13 0c0 5.5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.25"/>',
  arrow: '<path d="M5 12h14"/><path d="M13.5 6.5L19 12l-5.5 5.5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
};

export const icon = (name, { size = 24, className = '' } = {}) =>
  `<svg class="icon ${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name] || ''}</svg>`;
