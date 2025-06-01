import {
  defineConfig,
  presetAttributify,
  presetWind4,
  transformerDirectives,
} from "unocss";

export default defineConfig({
  presets: [
    presetWind4(),
    presetAttributify({
      prefixedOnly: true,
    }),
  ],
  theme: {
    font: {
      sans: '"Zen Kaku Gothic New", "Noto Sans JP", "Noto Sans CJK JP", sans-serif',
    },
  },
  transformers: [transformerDirectives()],
});
