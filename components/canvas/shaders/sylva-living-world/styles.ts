import type { SylvaLivingWorldVariant } from "./types";

export const SCENE_ONLY_MARKUP = (
  label: string,
) => `<main class="hero" id="hero">
  <canvas id="scene" role="img" aria-label="${label}"></canvas>
  <div class="stage" id="stage" aria-hidden="true"></div>
</main>`;

export const SCENE_ONLY_STYLE = `<style data-threeui-sylva-scene>
html,
body {
  width: 100% !important;
  height: 100% !important;
  min-height: 0 !important;
  margin: 0 !important;
  overflow: hidden !important;
}

body {
  position: relative !important;
  background: #4a4d44 !important;
}

.hero {
  height: 100% !important;
  min-height: 0 !important;
}

#scene {
  pointer-events: auto !important;
  opacity: 1 !important;
}
.guides, .guides * {
  display: none !important;
}
</style>`;

export const SAKURA_SUNSET_STYLE = `<style data-threeui-sylva-sakura-sunset>
html,
body {
  background: #3c2c36 !important;
}

/* The backdrop carries one pool of light and nothing else — the same way the
   authored world reads a near-flat field corner to corner. No sun, no bands:
   the boughs and the blossom are the subject, and everything that models them
   comes from the light they sit in. */
.hero {
  background:
    radial-gradient(66% 56% at 26% 90%, rgba(255, 226, 212, 0.125) 0%, rgba(255, 226, 212, 0) 74%),
    radial-gradient(74% 64% at 92% 2%, rgba(18, 10, 18, 0.30) 0%, rgba(18, 10, 18, 0) 72%),
    #3c2c36 !important;
}

/* the floor of light the boughs hang over */
.hero::after {
  background:
    radial-gradient(76% 48% at 44% 118%, rgba(255, 218, 208, 0.28) 0%, rgba(255, 208, 200, 0.095) 44%, rgba(255, 202, 196, 0) 86%),
    linear-gradient(180deg, rgba(255, 214, 206, 0) 56%, rgba(255, 210, 202, 0.030) 78%, rgba(255, 214, 206, 0.078) 100%) !important;
}
</style>`;

export const MAPLE_AUTUMN_STYLE = `<style data-threeui-sylva-maple-autumn>
html,
body {
  background: #313a41 !important;
}

/* The same near-flat field the authored world uses, in the cold half of the
   year: a slate dusk with one pool of low light in it. Red leaf wants a cool
   ground behind it — on a warm field the whole frame goes to rust. */
.hero {
  background:
    radial-gradient(66% 56% at 26% 90%, rgba(255, 216, 176, 0.115) 0%, rgba(255, 216, 176, 0) 74%),
    radial-gradient(74% 64% at 92% 2%, rgba(10, 15, 20, 0.30) 0%, rgba(10, 15, 20, 0) 72%),
    #313a41 !important;
}

/* the floor of light the boughs hang over */
.hero::after {
  background:
    radial-gradient(76% 48% at 44% 118%, rgba(255, 206, 158, 0.24) 0%, rgba(255, 194, 150, 0.08) 44%, rgba(255, 188, 146, 0) 86%),
    linear-gradient(180deg, rgba(255, 206, 160, 0) 56%, rgba(255, 200, 156, 0.028) 78%, rgba(255, 206, 160, 0.070) 100%) !important;
}
</style>`;

export const SEQUOIA_MIST_STYLE = `<style data-threeui-sylva-sequoia-mist>
html,
body {
  background: #5f6d63 !important;
}

/* A redwood grove is read through its air, not against a night sky: the field
   is a pale drift of fog with the light coming down through it, and the same
   haze the scene mixes its distance into. Everything reads as a silhouette
   standing in front of the fog rather than a lit thing on a dark ground. */
.hero {
  background:
    radial-gradient(70% 60% at 34% 12%, rgba(226, 234, 220, 0.30) 0%, rgba(226, 234, 220, 0) 72%),
    radial-gradient(76% 66% at 88% 96%, rgba(30, 40, 32, 0.26) 0%, rgba(30, 40, 32, 0) 74%),
    #5f6d63 !important;
}

/* the shaft of light the boughs hang in */
.hero::after {
  background:
    radial-gradient(60% 74% at 40% -12%, rgba(238, 244, 230, 0.30) 0%, rgba(232, 240, 224, 0.09) 46%, rgba(228, 238, 220, 0) 84%),
    linear-gradient(180deg, rgba(226, 236, 218, 0.055) 0%, rgba(226, 236, 218, 0) 46%, rgba(24, 32, 26, 0.055) 100%) !important;
}
</style>`;

export const VARIANT_LABELS: Record<SylvaLivingWorldVariant, string> = {
  "living-green": "Interactive procedural moss root world",
  "sakura-sunset": "Interactive mossy Sakura boughs in blossom at dusk",
  "maple-autumn": "Interactive mossy Maple boughs in autumn leaf at dusk",
  "sequoia-mist":
    "Interactive mossy Sequoia boughs in foliage through grove fog",
};

export const VARIANT_BACKGROUNDS: Record<SylvaLivingWorldVariant, string> = {
  "living-green": "#4a4d44",
  "sakura-sunset": "#3c2c36",
  "maple-autumn": "#313a41",
  "sequoia-mist": "#5f6d63",
};

export const VARIANT_STYLES: Partial<Record<SylvaLivingWorldVariant, string>> =
  {
    "sakura-sunset": SAKURA_SUNSET_STYLE,
    "maple-autumn": MAPLE_AUTUMN_STYLE,
    "sequoia-mist": SEQUOIA_MIST_STYLE,
  };
