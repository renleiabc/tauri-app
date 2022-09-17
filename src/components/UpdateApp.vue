<script setup lang="ts">
import { ref, reactive } from 'vue';
import { invoke } from '@tauri-apps/api/tauri';
import { checkUpdate, installUpdate } from '@tauri-apps/api/updater';
import { relaunch } from '@tauri-apps/api/process';
import DialogDefault from './DialogDefault.vue';

const isUpdate = ref(false);
const isLoad = ref(false);
const progress = ref();
const appInfo = reactive({ info: {} }) as any;
const isTauri = async () => {
  const isTauri = await invoke('is_tauri');
  console.log(`%c${isTauri}`, 'color: red;font-size:20px');
  if (isTauri === 'tauri') {
    try {
      const { shouldUpdate, manifest } = await checkUpdate();
      console.log(shouldUpdate, manifest);
      if (shouldUpdate) {
        isUpdate.value = true;
        appInfo.info = manifest;
      } else {
        isUpdate.value = false;
      }
    } catch (error) {
      console.log(error);
    }
  }
};
isTauri();
const handleClose = () => {
  invoke('close_tauri');
};
const handleConfirm = async () => {
  // util.showLoading();
  // display dialog
  isUpdate.value = false;
  isLoad.value = true;
  await installUpdate();
  isLoad.value = false;
  // util.closeLoading();
  // install complete, restart app
  await relaunch();
};
</script>
<template>
  <dialog-default
    :is-dialog="isUpdate"
    :title="$t('about.update')"
    @cancel="handleClose"
    @close="handleClose"
    @confirm="handleConfirm"
  >
    <template #default>
      <div class="flex">
        <span>{{ $t('about.check') }}：</span>
        <span class="mr-1">{{ appInfo.info.body }}</span>
        <span>v{{ appInfo.info.version }}</span>
        {{ progress }}
      </div>
    </template>
  </dialog-default>
  <el-dialog
    v-model="isLoad"
    class="dialog-load"
    width="30%"
    center
    align-center
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    destroy-on-close
    fullscreen
  >
    <div class="loadingThree">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </el-dialog>
</template>
