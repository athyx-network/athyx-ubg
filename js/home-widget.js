// Home page status widget: plain-text time, battery, weather
(function(){
  const container = document.createElement('div');
  container.className = 'status-widget';
  container.innerHTML = `
    <div class="item battery">
      <div class="label">Battery</div>
      <div class="value" id="battery-percent">--%</div>
    </div>
    <div class="item time">
      <div class="label">Time</div>
      <div class="value" id="status-time">--:--</div>
    </div>
    <div class="item weather">
      <div class="label">Weather</div>
      <div class="value" id="status-weather">Loading...</div>
    </div>
  `;
  // append widget
  document.body.appendChild(container);

  // create and show full-page loading overlay (also try to apply to parent shell)
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.textContent = 'Loading';
  document.body.appendChild(overlay);
  document.body.classList.add('loading-active');

  // Try to add overlay and active class to parent (so sidebar/shell also blur)
  let parentOverlay = null;
  try {
    if (window.parent && window.parent !== window && window.parent.document) {
      const pdoc = window.parent.document;
      // avoid duplicating overlay if parent already has one
      parentOverlay = pdoc.querySelector('.loading-overlay');
      if (!parentOverlay) {
        parentOverlay = pdoc.createElement('div');
        parentOverlay.className = 'loading-overlay';
        parentOverlay.textContent = 'Loading';
        pdoc.body.appendChild(parentOverlay);
      }
      pdoc.body.classList.add('loading-active');
    }
  } catch (e) {
    parentOverlay = null;
  }

  // Time
  function pad(n){return n<10? '0'+n : n}
  function updateTime(){
    const d = new Date();
    const h = pad(d.getHours());
    const m = pad(d.getMinutes());
    document.getElementById('status-time').textContent = `${h}:${m}`;
  }
  updateTime();
  setInterval(updateTime, 1000);

  // Battery: text-only (percent), append ' (charging)' when applicable
  function updateBatteryDisplay(level, charging){
    const pct = Math.round(level*100);
    const el = document.getElementById('battery-percent');
    el.textContent = pct + '%';
  }
  if (navigator.getBattery) {
    navigator.getBattery().then(bat=>{
      updateBatteryDisplay(bat.level, bat.charging);
      bat.addEventListener('levelchange', ()=> updateBatteryDisplay(bat.level, bat.charging));
      bat.addEventListener('chargingchange', ()=> updateBatteryDisplay(bat.level, bat.charging));
    }).catch(()=>{
      document.getElementById('battery-percent').textContent = 'n/a';
    });
  } else {
    document.getElementById('battery-percent').textContent = 'n/a';
  }

  // Weather via Open-Meteo: only temperature text
  function finishLoading(){
    // remove loading-active class to trigger unblur transition
    if(document.body.classList.contains('loading-active')){
      document.body.classList.remove('loading-active');
    }
    try {
      if (window.parent && window.parent !== window && window.parent.document) {
        window.parent.document.body.classList.remove('loading-active');
      }
    } catch (e) {}

    // fade out overlays then remove after transition
    const ol = document.querySelector('.loading-overlay');
    if(ol){
      ol.style.opacity = '0';
      setTimeout(()=>{ ol.remove(); }, 380);
    }
    if(parentOverlay){
      try{
        parentOverlay.style.opacity = '0';
        setTimeout(()=>{ parentOverlay.remove(); }, 380);
      }catch(e){}
    }
  }

  function fetchWeather(lat, lon){
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
    fetch(url).then(r=>r.json()).then(data=>{
      if(data && data.current_weather){
        const c = data.current_weather;
        const tmp = Math.round(c.temperature);
        document.getElementById('status-weather').textContent = `${tmp}°C`;
      } else {
        document.getElementById('status-weather').textContent = 'n/a';
      }
      finishLoading();
    }).catch(()=>{
      document.getElementById('status-weather').textContent = 'n/a';
      finishLoading();
    });
  }

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos=>{
      fetchWeather(pos.coords.latitude, pos.coords.longitude);
    }, err=>{
      document.getElementById('status-weather').textContent = 'location denied';
      finishLoading();
    }, {timeout:10000});
  } else {
    document.getElementById('status-weather').textContent = 'n/a';
    finishLoading();
  }
})();
