<script setup lang="ts">
// eslint-disable-next-line no-unused-vars
import { ref, reactive, inject, watch, Ref } from 'vue';
import zhHtml from '@/plugins/html/zhHtml';
import enHtml from '@/plugins/html/enHtml';

const lang = inject('lang') as any;
console.log(lang.value);
const emit = defineEmits(['update:createStep', 'update']);
defineProps({
  createStep: {
    type: Number,
    default: () => 0
  }
});
const userAgree = ref('');
if (zhHtml.lang === lang.value) {
  userAgree.value = zhHtml.content;
} else {
  userAgree.value = enHtml.content;
}
watch(
  () => lang.value,
  (newVal: string, oldVal: string) => {
    console.log(`new:${newVal},old:${oldVal}`);
    if (zhHtml.lang === newVal) {
      userAgree.value = zhHtml.content;
    } else {
      userAgree.value = enHtml.content;
    }
  }
);
const handleUserOperate = (num: number) => {
  emit('update', num);
};
</script>
<template>
  <h3 class="pb-20px text-title leading-normal text-center">
    {{ $t('login.user') }}
  </h3>
  <el-scrollbar height="330px">
    <div class="m-20px">
      <div v-html="userAgree"></div>
    </div>
  </el-scrollbar>
  <div class="w-full flex justify-between py-20px">
    <el-button class="w-1/3 h-10 text-base" @click="handleUserOperate(0)">
      {{ $t('login.reject') }}
    </el-button>
    <el-button
      type="primary"
      class="w-1/3 h-10 bg-blue text-white border-blue"
      @click="handleUserOperate(2)"
    >
      {{ $t('login.agree') }}
    </el-button>
  </div>
</template>
