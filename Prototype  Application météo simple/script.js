// دالة مساعدة باش نجيب العناصر بسهولة
const el = (id) => document.getElementById(id);

// العناصر الرئيسية
const input = el('q');
const button = el('go');
const out = el('out');

// الحدث ديال الزر
button.addEventListener('click', async () => {
  const city = input.value.trim();
  if (!city) {
    out.innerHTML = `<div class="error">⛔ المرجو إدخال اسم مدينة!</div>`;
    return;
  }

  out.innerHTML = `<div class="loading">⏳ جاري تحميل الطقس لـ <b>${city}</b>...</div>`;

  try {
    // 1️⃣ نجيب الإحداثيات ديال المدينة
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`);
    const geoData = await geoRes.json();

    if (!geoData.length) {
      out.innerHTML = `<div class="error">❌ لم يتم العثور على المدينة "${city}".</div>`;
      return;
    }

    const place = geoData[0];
    const lat = place.lat;
    const lon = place.lon;

    // 2️⃣ نجيب بيانات الطقس من open-meteo
    const meteoRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`
    );
    const meteoData = await meteoRes.json();

    const cw = meteoData.current_weather;
    const temp = cw.temperature;
    const wind = cw.windspeed;
    const code = cw.weathercode;
    const timezone = meteoData.timezone;
    const humidity = meteoData.hourly.relative_humidity_2m[0];

    // دالة صغيرة باش نجيب الساعة المحلية
    const localHourKey = () => new Date().toISOString().slice(0, 16);

    // ترجمة الرمز ديال الطقس
    const weatherLabel = (code) => {
      const map = {
        0: ['☀️', 'صحو'],
        1: ['🌤️', 'غائم جزئياً'],
        2: ['⛅', 'غائم'],
        3: ['☁️', 'غائم كلياً'],
        45: ['🌫️', 'ضباب'],
        48: ['🌫️', 'ضباب متجمد'],
        51: ['🌦️', 'رذاذ خفيف'],
        61: ['🌧️', 'أمطار خفيفة'],
        63: ['🌧️', 'أمطار متوسطة'],
        65: ['🌧️', 'أمطار قوية'],
        71: ['🌨️', 'ثلوج خفيفة'],
        73: ['🌨️', 'ثلوج'],
        75: ['❄️', 'ثلوج كثيفة'],
        95: ['⛈️', 'عواصف رعدية']
      };
      return map[code] || ['❓', 'غير معروف'];
    };

    const [emoji, label] = weatherLabel(code);

    // 3️⃣ عرض البيانات على الصفحة
    out.innerHTML = `
      <div class="card" role="status" aria-live="polite">
        <div style="flex:0 0 90px;text-align:center">
          <div style="font-size:36px">${emoji}</div>
          <div class="small meta">${label}</div>
        </div>
        <div style="flex:1">
          <div style="display:flex;align-items:baseline;gap:10px">
            <div class="big">${temp}°C</div>
            <div class="meta">${place.display_name.split(',')[0] || place.display_name}</div>
          </div>
          <div style="margin-top:6px" class="small meta">
            الساعة: ${localHourKey().replace('T', ' ')} — المنطقة الزمنية: ${timezone}
          </div>

          <div class="details">
            <div class="chip">
              <div style="font-weight:700">${humidity}</div>
              <div class="small">الرطوبة</div>
            </div>
            <div class="chip">
              <div style="font-weight:700">${wind} km/h</div>
              <div class="small">الريح</div>
            </div>
            <div class="chip">
              <div style="font-weight:700">${cw.temperature} °C</div>
              <div class="small">درجة الحرارة</div>
            </div>
          </div>
        </div>
      </div>
    `;

  } catch (e) {
    out.innerHTML = `<div class="error">⚠️ خطأ أثناء جلب البيانات. حاول مجدداً.</div>`;
    console.error(e);
  }
});

// 4️⃣ باش يخدم زر Enter
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') button.click();
});

// small: prefill with user's city? (optional) — not auto-detect to keep it si