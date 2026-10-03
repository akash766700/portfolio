import type { SylvaLivingWorldVariant } from "./types";
import {
  SCENE_ONLY_MARKUP,
  SCENE_ONLY_STYLE,
  VARIANT_LABELS,
  VARIANT_STYLES,
} from "./styles";
import {
  applySakuraSunsetVariant,
  applyMapleAutumnVariant,
  applySequoiaMistVariant,
} from "./variants";
import innerGreenSource from "./sources/inner-green-3d.html?raw";
import threeRuntime from "./sources/inner-green-assets/three.min.js?raw";
import { innerGreenSourceStr } from "./sources/inner-green-source-str";
import { threeRuntimeStr } from "./sources/inner-green-assets/three-runtime-str";

export function buildSceneDocument(
  reducedMotion: boolean,
  variant: SylvaLivingWorldVariant,
) {
  const sourceCode =
    typeof innerGreenSource === "string" && innerGreenSource.length > 1000
      ? innerGreenSource
      : innerGreenSourceStr;
  const runtimeCode =
    typeof threeRuntime === "string" && threeRuntime.length > 1000
      ? threeRuntime
      : threeRuntimeStr;

  const presentationStart = sourceCode.indexOf('<main class="hero" id="hero">');
  const runtimeStart = sourceCode.indexOf(
    '<script src="inner-green-assets/three.min.js"></script>',
  );

  if (
    presentationStart < 0 ||
    runtimeStart < 0 ||
    runtimeStart <= presentationStart
  ) {
    throw new Error(
      "Sylva scene adapter could not isolate the authored Three.js scene.",
    );
  }

  let documentSource =
    `${sourceCode.slice(0, presentationStart)}${SCENE_ONLY_MARKUP(VARIANT_LABELS[variant])}\n\n${sourceCode.slice(runtimeStart)}`
      .replace(
        "<title>Sylva — Into the living world</title>",
        `<title>${VARIANT_LABELS[variant]}</title>`,
      )
      .replace(
        "</head>",
        `${SCENE_ONLY_STYLE}${VARIANT_STYLES[variant] ?? ""}</head>`,
      )
      .replace(
        '<script src="inner-green-assets/three.min.js"></script>',
        `<script data-threeui-three-runtime>${runtimeCode}</script>`,
      );

  if (variant === "sakura-sunset")
    documentSource = applySakuraSunsetVariant(documentSource);
  if (variant === "maple-autumn")
    documentSource = applyMapleAutumnVariant(documentSource);
  if (variant === "sequoia-mist")
    documentSource = applySequoiaMistVariant(documentSource);

  documentSource = documentSource.replace(
    "renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.6 : 2));",
    "renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));",
  );

  if (reducedMotion) {
    documentSource = documentSource.replace(
      "(function loop() { requestAnimationFrame(loop); tick(); })();",
      "(function loop() { if (!REDUCED) requestAnimationFrame(loop); tick(); })();",
    );
  }

  return documentSource;
}
