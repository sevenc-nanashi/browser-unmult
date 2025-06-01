<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { unmultImage } from "./process.ts";

const selectedImage = ref<string | null>(null);
const unmultedImage = ref<string | null>(null);
const backgroundImage = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    selectedImage.value = URL.createObjectURL(file);
    unmultedImage.value = null; // Reset unmulted image on new file selection
  }
};

const onProcessImage = async () => {
  if (!selectedImage.value) return;

  const { background, image } = await unmultImage(selectedImage.value);
  unmultedImage.value = image;
  backgroundImage.value = background;
};

// Paste Functionality
const onPaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items;
  if (items) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          selectedImage.value = URL.createObjectURL(file);
          unmultedImage.value = null; // Reset unmulted image on new file selection
          event.preventDefault(); // Prevent the default paste behavior
          return;
        }
      }
    }
  }
};

onMounted(() => {
  document.addEventListener("paste", onPaste);
});

onUnmounted(() => {
  document.removeEventListener("paste", onPaste);
});
</script>

<template>
  <input
    ref="fileInput"
    type="file"
    accept="image/*"
    class="hidden"
    @change="onFileChange"
  />
  <main un-flex="~ col" un-gap="2" un-p="4" un-max-w="md:2xl" un-mx="auto">
    <h1 un-text="2xl" un-font="bold">unmult on browser</h1>
    <p>画像の黒背景を透過するアプリ。オフラインで動作します。</p>
    <p>
      <a
        href="https://github.com/sevenc-nanashi/browser-unmult"
        target="_blank"
        rel="noopener noreferrer"
        un-text="blue-500 hover:blue-400"
        un-underline
        >GitHub</a
      >でソースコードを確認できます。
    </p>
    <hr un-color="gray-300" />
    <div un-flex="~" un-gap="2">
      <button
        un-bg="blue-300 hover:blue-200"
        un-cursor="pointer"
        un-p="x-4 y-2"
        un-rounded
        un-shadow="md"
        un-transition="colors"
        un-duration="100"
        @click="fileInput?.click()"
      >
        ファイルを選択
      </button>
      <button
        un-bg="green-500 hover:green-400"
        un-cursor="pointer"
        un-p="x-4 y-2"
        un-rounded
        un-shadow="md"
        un-transition="colors"
        un-duration="100"
        @click="onProcessImage"
        :disabled="!selectedImage"
      >
        透過処理を実行
      </button>
      <a
        :href="unmultedImage || '#'"
        target="_blank"
        download="unmulted_image.png"
        :un-opacity="unmultedImage ? '100' : '50'"
        :un-bg="unmultedImage ? 'yellow-500 hover:yellow-400' : 'gray-300'"
        :un-cursor="unmultedImage ? 'pointer' : 'not-allowed'"
        un-p="x-4 y-2"
        un-rounded
        un-shadow="md"
        un-transition="colors"
        un-duration="100"
        @click="onProcessImage"
      >
        ダウンロード
      </a>
    </div>
    <section un-flex="~ col" un-gap="2">
      <div v-if="selectedImage">
        <h2 un-text="xl" un-font="bold">選択された画像</h2>
        <img
          :src="selectedImage"
          alt="Selected Image"
          un-max-w="full"
          un-h="auto"
          un-drop-shadow="md"
          un-mt="2"
        />
      </div>
      <div v-if="backgroundImage && unmultedImage">
        <h2 un-text="xl" un-font="bold">透過処理後の画像</h2>
        <div un-relative un-mt="2">
          <img
            :src="backgroundImage"
            alt="Unmulted Image"
            class="max-w-full h-auto"
            un-max-w="full"
            un-h="auto"
            un-drop-shadow="md"
            un-mt="2"
          />
          <img
            :src="unmultedImage"
            un-absolute
            un-top="0"
            un-left="0"
            un-max-w="full"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped></style>
