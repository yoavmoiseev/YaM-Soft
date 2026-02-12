// Minimal app.js: loads locales, projects, handles language switching, likes and forms.
(function(){
  // Auto-detect browser language
  function detectBrowserLanguage() {
    const stored = localStorage.getItem('lang');
    if(stored) return stored;
    
    try {
      const browserLang = navigator.language || navigator.userLanguage || '';
      const langCode = browserLang.toLowerCase().split('-')[0];
      
      if(langCode === 'ru') return 'ru';
      if(langCode === 'en') return 'en';
      if(langCode === 'he' || langCode === 'iw') return 'he';
      
      return 'he'; // Default to Hebrew
    } catch(e) {
      return 'he'; // Default to Hebrew on error
    }
  }
  
  const defaultLang = detectBrowserLanguage();
  const langSelect = document.getElementById('langSelect');
  const rootEl = document.documentElement;
  let locales = {};

  async function loadLocales(){
    const langs = ['ru','en','he'];
    for(const l of langs){
      const res = await fetch(`locales/${l}.json`);
      locales[l]=await res.json();
    }
  }

  function applyLocale(lang){
    const L = locales[lang] || locales['ru'];
    document.getElementById('siteTitle').textContent = L.site.title;
    document.getElementById('siteTag').textContent = L.site.tag;
    document.getElementById('heroTitle').innerHTML = L.hero.title;
    document.getElementById('heroDesc').textContent = L.hero.desc;
    document.getElementById('projectsTitle').textContent = L.projects.title;
    document.getElementById('contactTitle').textContent = L.contact.title;
    document.getElementById('cvTitle').textContent = L.cv.title;
    document.getElementById('cvDesc').innerHTML = L.cv.desc + ' <a id="cvLink" href="' + L.cv.file + '" download>' + L.cv.link + '</a>';
    document.getElementById('footerText').textContent = L.footer;

    // set dir for hebrew
    if(lang==='he'){rootEl.setAttribute('dir','rtl');} else {rootEl.removeAttribute('dir');}
  }

  // Detect iOS devices (iPhone, iPad)
  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function setHeroImage(lang){
    const candidate = `assets/bg-${lang}.png`;
    document.body.style.backgroundImage = `url('${candidate}')`;
    
    // iOS devices need different background settings due to WebKit limitations
    if(isIOS()){
      document.body.style.backgroundSize = 'contain';
      document.body.style.backgroundPosition = 'center center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'scroll';
    } else {
      // Fit image to full height so the whole photo is visible (no cropping)
      document.body.style.backgroundSize = 'auto 100%';
      document.body.style.backgroundPosition = 'top center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed';
    }
  }

  async function loadProjects(lang){
    const res = await fetch('projects.json');
    const data = await res.json();
    const list = document.getElementById('projectsList');
    list.innerHTML='';
    data.forEach(p=>{
      const card = document.createElement('div'); card.className='project';
      // safe lookups with fallbacks to avoid exceptions when locale entries are missing
      const items = (locales[lang] && locales[lang].projects && locales[lang].projects.items) ? locales[lang].projects.items : {};
      const entry = items[p.key] || {};
      const title = document.createElement('h4'); title.textContent = entry.title || p.key;
      const desc = document.createElement('p'); desc.textContent = entry.desc || '';
      
      // Add demo video if available
      if(p.demoVideo){
        const videoEl = document.createElement('video');
        videoEl.className = 'project-video';
        videoEl.autoplay = true;
        videoEl.muted = true;
        videoEl.loop = true;
        videoEl.playsInline = true;
        const source = document.createElement('source');
        source.src = p.demoVideo;
        source.type = 'video/mp4';
        videoEl.appendChild(source);
        card.appendChild(title);
        card.appendChild(desc);
        card.appendChild(videoEl);
      } else {
        card.appendChild(title);
        card.appendChild(desc);
      }
      
      const actions = document.createElement('div'); actions.className='actions';
      const learnMore = document.createElement('a'); 
      learnMore.className='btn'; 
      learnMore.href=`projects-${lang}.html#${p.id}`; 
      learnMore.textContent=locales[lang].projects.learnMore;
      actions.appendChild(learnMore);
      card.appendChild(actions);
      list.appendChild(card);
    })
  }



  async function init(){
    await loadLocales();
    const lang = defaultLang;
    langSelect.value = lang;
    applyLocale(lang);
    // setup UI and event handlers early so failures loading project data don't block language switching
    setupLanguageVideo(lang);
    setHeroImage(lang);
    langSelect.addEventListener('change', async ()=>{
      try{
        const l = langSelect.value; localStorage.setItem('lang',l); applyLocale(l);
        await loadProjects(l);
        setHeroImage(l);
        setupLanguageVideo(l);
      }catch(e){
        console.error('Error during language change:', e);
        // still apply locale and try to update visuals
        applyLocale(langSelect.value);
        setHeroImage(langSelect.value);
        setupLanguageVideo(langSelect.value);
      }
    })
    try{
      await loadProjects(lang);
    }catch(err){
      console.error('Failed to load projects.json or to render projects:', err);
    }
  }

  // Create or update the corner language video.
  function setupLanguageVideo(lang){
    const header = document.querySelector('.site-header');
    if(!header) return;
    let vid = document.getElementById('langVideo');
    const controls = header.querySelector('.controls');
    if(!controls) return;
    if(!vid){
      vid = document.createElement('video');
      vid.id = 'langVideo';
      vid.className = 'lang-video';
      vid.autoplay = true;
      vid.muted = true; // required for autoplay in many browsers
      vid.loop = true;
      vid.playsInline = true;
      vid.setAttribute('aria-hidden','true');
      // insert before the language select so video appears just before it
      controls.insertBefore(vid, langSelect);
    }

    // pick source file: video/ru.mp4, video/en.mp4, video/he.mp4 (if missing, video element will be empty)
    const src = `video/${lang}.mp4`;
    if(vid.firstChild){
      vid.removeChild(vid.firstChild);
    }
    const source = document.createElement('source');
    source.src = src;
    source.type = 'video/mp4';
    vid.appendChild(source);
    // ensure browser picks up new source
    vid.load();
    vid.playbackRate = 1;
      // sizing: let CSS handle height and aspect ratio (square). Use height:100% and width:auto
      vid.style.height = '100%';
      vid.style.width = 'auto';
      vid.style.maxWidth = '';
      vid.style.flex = '0 0 auto';
      vid.style.alignSelf = 'center';

      // enable interaction: double-click (desktop) and double-tap (mobile) to open modal
      vid.style.pointerEvents = 'auto';
      vid.style.cursor = 'pointer';

      // remove previous handlers if any
      vid.ondblclick = null;
      vid.ontouchend = null;

      vid.ondblclick = function(e){
        openVideoModal(vid);
      };

      // simple double-tap detection for touch devices
      let lastTap = 0;
      vid.ontouchend = function(e){
        const now = Date.now();
        if(now - lastTap < 350){
          openVideoModal(vid);
          lastTap = 0;
        } else {
          lastTap = now;
        }
      };
  }

    // Open modal overlay with an enlarged copy of the language video.
    function openVideoModal(smallVid){
      if(document.getElementById('videoModal')) return; // already open

      const overlay = document.createElement('div');
      overlay.id = 'videoModal';
      overlay.className = 'video-modal';

      const content = document.createElement('div');
      content.className = 'video-modal-content';

      const header = document.createElement('div');
      header.className = 'video-modal-header';
      const titleLink = document.createElement('a');
      titleLink.className = 'video-modal-title';
      titleLink.href = 'https://yamsoft.org';
      titleLink.target = '_blank';
      titleLink.rel = 'noopener noreferrer';
      // Use localized site title when available
      try{
        const lang = (typeof langSelect !== 'undefined' && langSelect && langSelect.value) ? langSelect.value : 'en';
        const localized = (locales && locales[lang] && locales[lang].site && locales[lang].site.title) ? locales[lang].site.title : null;
        titleLink.textContent = (localized || 'YaM SOFT') + ' ©';
      }catch(e){
        titleLink.textContent = 'YaM SOFT ©';
      }
      titleLink.style.color = '#fff';
      titleLink.style.textDecoration = 'none';

      const closeBtn = document.createElement('button');
      closeBtn.className = 'video-modal-close';
      closeBtn.innerHTML = '&#10005;';
      header.appendChild(titleLink);
      header.appendChild(closeBtn);

      const body = document.createElement('div');
      body.className = 'video-modal-body';

      const modalVid = document.createElement('video');
      modalVid.autoplay = true;
      modalVid.muted = true;
      modalVid.loop = true;
      modalVid.playsInline = true;
      modalVid.controls = false;
      modalVid.style.maxWidth = '100%';

      // copy source(s)
      for(const s of smallVid.querySelectorAll('source')){
        const src = document.createElement('source');
        src.src = s.src || s.getAttribute('src');
        src.type = s.type || s.getAttribute('type') || 'video/mp4';
        modalVid.appendChild(src);
      }

      // sync playback position
      try{
        modalVid.currentTime = Math.max(0, smallVid.currentTime || 0);
      }catch(e){/* ignore if not allowed yet */}

      body.appendChild(modalVid);
      content.appendChild(header);
      content.appendChild(body);
      overlay.appendChild(content);
      document.body.appendChild(overlay);

      // try to play
      modalVid.load();
      const playPromise = modalVid.play();
      if(playPromise && playPromise.catch){ playPromise.catch(()=>{/* ignore autoplay block */}); }

      function close(){
        modalVid.pause();
        overlay.remove();
      }

      closeBtn.addEventListener('click', close);
      overlay.addEventListener('click', function(e){ if(e.target === overlay) close(); });
    }

  init().catch(err=>console.error(err));

})();
