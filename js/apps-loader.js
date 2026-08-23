// Auto-load apps from manifest.json
document.addEventListener('DOMContentLoaded', async function() {
  try {
    const response = await fetch('/apps/manifest.json');
    const data = await response.json();
    
    const container = document.getElementById('apps-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    data.apps.forEach((app, index) => {
      const appCard = createAppCard(app, index);
      container.appendChild(appCard);
    });
  } catch (error) {
    console.error('Failed to load apps:', error);
  }
});

function createAppCard(app, index) {
  const card = document.createElement('div');
  card.className = 'app-card';
  
  // Logo HTML (kung may logo)
  const logoHTML = app.logo ? `
    <div class="app-logo" style="text-align: center; margin-bottom: 16px;">
      <img src="${app.logo}" alt="${app.name}" style="width: 64px; height: 64px; border-radius: 12px; object-fit: cover;">
    </div>
  ` : '';
  
  // Mockup section
  let mockupItems = '';
  if (app.mockup_items) {
    app.mockup_items.forEach(item => {
      const lowClass = item.low ? ' low' : '';
      mockupItems += `
        <div class="mockup-row">
          <span class="n${lowClass}">${item.name}</span>
          <span class="s${lowClass}">${item.stock}</span>
        </div>
      `;
    });
  }
  
  const mockupHTML = `
    <div class="mockup">
      <div class="mockup-bar">
        ${app.name}
        <span class="badge-mini">${app.badge || 'APP'}</span>
      </div>
      ${mockupItems}
    </div>
  `;
  
  // Info section
  const infoHTML = `
    <div class="app-info">
      ${logoHTML}
      <div class="app-eyebrow">${app.category || ''}</div>
      <h3>${app.name}</h3>
      <p>${app.description || ''}</p>
      <div class="app-price">${app.price || ''}<span>${app.price_note || ''}</span></div>
      <div class="app-ctas">
        <a href="${app.downloads?.android || '#'}" class="btn btn-primary" onclick="trackEvent('download_apk_${app.id}')">
          Download for Android
        </a>
        <a href="${app.downloads?.windows || '#'}" class="btn btn-ghost" onclick="trackEvent('download_exe_${app.id}')">
          Download for Windows
        </a>
      </div>
    </div>
  `;
  
  card.innerHTML = mockupHTML + infoHTML;
  return card;
}
