const {
  gsap: { registerPlugin, set, to, timeline },
  MorphSVGPlugin,
  Draggable } =
window;
registerPlugin(MorphSVGPlugin);

// Used to calculate distance of "tug"
let startX;
let startY;

const AUDIO = {
  CLICK: new Audio('https://assets.codepen.io/605876/click.mp3') };

const STATE = {
  ON: true };

const CORD_DURATION = 0.1;

const CORDS = document.querySelectorAll('.toggle-scene__cord');
const HIT = document.querySelector('.toggle-scene__hit-spot');
const DUMMY = document.querySelector('.toggle-scene__dummy-cord');
const DUMMY_CORD = document.querySelector('.toggle-scene__dummy-cord line');
const PROXY = document.createElement('div');
// set init position
const ENDX = DUMMY_CORD.getAttribute('x2');
const ENDY = DUMMY_CORD.getAttribute('y2');
const RESET = () => {
  set(PROXY, {
    x: ENDX,
    y: ENDY });

};

RESET();

const CORD_TL = timeline({
  paused: true,
  onStart: () => {
    STATE.ON = !STATE.ON;
    set(document.documentElement, { '--on': STATE.ON ? 1 : 0 });
    set([DUMMY, HIT], { display: 'none' });
    set(CORDS[0], { display: 'block' });
    AUDIO.CLICK.play();
  },
  onComplete: () => {
    set([DUMMY, HIT], { display: 'block' });
    set(CORDS[0], { display: 'none' });
    RESET();
  } });


for (let i = 1; i < CORDS.length; i++) {
  CORD_TL.add(
  to(CORDS[0], {
    morphSVG: CORDS[i],
    duration: CORD_DURATION,
    repeat: 1,
    yoyo: true }));


}

Draggable.create(PROXY, {
  trigger: HIT,
  type: 'x,y',
  onPress: e => {
    startX = e.x;
    startY = e.y;
  },
  onDrag: function () {
    set(DUMMY_CORD, {
      attr: {
        x2: this.x,
        y2: this.y } });


  },
  onRelease: function (e) {
    const DISTX = Math.abs(e.x - startX);
    const DISTY = Math.abs(e.y - startY);
    const TRAVELLED = Math.sqrt(DISTX * DISTX + DISTY * DISTY);
    to(DUMMY_CORD, {
      attr: { x2: ENDX, y2: ENDY },
      duration: CORD_DURATION,
      onComplete: () => {
        if (TRAVELLED > 50) {
          CORD_TL.restart();
        } else {
          RESET();
        }
      } });

  } });





//-------------------//
// switch to light mode by dragging the bulb (the mode with bulb state )

let isLightMode = false; // default dark mode
const hitSpot = document.querySelector(".toggle-scene__hit-spot");

// Main function for toggling
function toggleBulbAndTheme() {
  if (isLightMode) {
    // Switch back to dark → bulb ON
    document.body.classList.remove("light-mode");
    document.body.classList.add("bulb-on");
    isLightMode = false;
  } else {
    // Switch to light → bulb OFF
    document.body.classList.add("light-mode");
    document.body.classList.remove("bulb-on");
    isLightMode = true;
  }
}

//  Click event
  hitSpot.addEventListener("click", toggleBulbAndTheme);

//  Drag event
Draggable.create(".toggle-scene__hit-spot", {
  type: "y",
  bounds: { minY: 0, maxY: 80 },
  onRelease: function () {
    if (this.endY > 40) {
      toggleBulbAndTheme(); // reuse same function
    }
    gsap.to(this.target, { y: 0 }); // reset cord
  }
});






//-------------------//
// Animation of the cord with GSAP + STOP the animation when i hover on it

// grab the cord
const cord = document.querySelector('.toggle-scene__cords');

// set pivot at top center
gsap.set(cord, { transformOrigin: 'top center' });

// start from -12 so the swing goes -12 → +12 → -12
gsap.set(cord, { rotation: -12, y: 0 });

// animate swing
let swing = gsap.to(cord, {
  rotation: 12,      // right extreme
  y: 10,             // little vertical drop
  duration: 0.6,     // half-cycle (so full cycle ~1.2s, like your CSS)
  ease: 'sine.inOut',
  repeat: -1,
  yoyo: true
});

// pause/resume on hover
cord.addEventListener("mouseenter", () => swing.pause());
cord.addEventListener("mouseleave", () => swing.resume());






//-------------------//
// save the last theme and bulb state on localstorage in case of reload or change page 


// Persist theme + bulb state (drop-in)
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const body = document.body;
  const hitSpot = document.querySelector('.toggle-scene__hit-spot');

  // Safe setter for CSS var --on
  const setOnVar = (val) => {
    try {
      root.style.setProperty('--on', val ? '1' : '0');
      // If you prefer gsap.set, you can also:
      // if (window.gsap && window.gsap.set) window.gsap.set(root, { '--on': val ? 1 : 0 });
    } catch (e) {
      console.warn('Failed to set --on var', e);
    }
  };

  // Apply theme and update bulb var (no saving)
  function applyTheme(theme, save = false) {
    if (theme === 'light') {
      body.classList.add('light-mode');
      setOnVar(0); // bulb OFF visually in light mode
    } else {
      body.classList.remove('light-mode');
      setOnVar(1); // bulb ON visually in dark mode
    }
    if (save) {
      try { localStorage.setItem('theme', theme); } catch (e) { console.warn('localStorage set failed', e); }
    }
  }

  // Toggle and persist
  function toggleBulbAndTheme() {
    const isLight = body.classList.contains('light-mode');
    applyTheme(isLight ? 'dark' : 'light', true);
  }

  // Restore from localStorage (default to dark)
  try {
    const saved = localStorage.getItem('theme');
    applyTheme(saved === 'light' ? 'light' : 'dark', false);
  } catch (e) {
    // fallback: default to dark
    applyTheme('dark', false);
  }

  // Attach click handler (only if element exists)
  if (hitSpot) {
    hitSpot.addEventListener('click', (ev) => {
      ev.preventDefault();
      toggleBulbAndTheme();
    }, { passive: false });
  } else {
    console.warn('toggle-scene__hit-spot not found — click toggle not attached.');
  }

  // Expose globally so drag/timeline code can call it
  window.toggleBulbAndTheme = toggleBulbAndTheme;

  // Sync theme across tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme') applyTheme(e.newValue === 'light' ? 'light' : 'dark', false);
  });

  console.log('Theme initialized (from localStorage):', localStorage.getItem('theme') || 'dark');
});

