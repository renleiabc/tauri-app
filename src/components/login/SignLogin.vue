<script setup lang="ts">
import { ref, reactive, toRefs, onMounted, onBeforeUnmount } from 'vue';
import type { FormInstance, TabsPaneContext } from 'element-plus';
import { ElMessage } from 'element-plus';
import { handleI18n } from 'plugins/i18n';
import { useRouter } from 'vue-router';
import util from '@/plugins/util';
import DialogLogin from './DialogLogin.vue';
import keyring from '@/plugins/keyring';
import store from '@/store';

const current = util.getCache('words');
console.log(current);
const emit = defineEmits(['update:createStep', 'update']);
const router = useRouter();
console.log(router);
const props = defineProps({
  createStep: {
    type: Number,
    default: () => 0
  }
});
const { createStep } = toRefs(props);
console.log(createStep);
const loginFormRef = ref<FormInstance>();
const isPassword = ref(true);
const logining = ref(false);
const isDialog = ref(false);
const isFooter = ref(true);
const importName = ref('words');
const width = ref('40%');
const loginData = reactive({
  // username:''
  password: ''
});
const importForm = reactive({ words: [], value: '' }) as any;
const handleCreate = () => {
  emit('update', 1);
};

const validatePassword = (rule: any, value: any, callback: any) => {
  // const uuid = loginData.username;
  const words = util.getCache('words');
  console.log(words);
  if (value === '') {
    callback(new Error(handleI18n('login.inputPassword')));
  } else if (words === undefined) {
    callback(new Error(handleI18n('login.does')));
  } else if (value !== words.password) {
    callback(new Error(handleI18n('login.errorpass')));
  } else {
    callback();
  }
};
const loginRules = reactive({
  // username: [{ validator: validateUsername, trigger: 'change' }],
  password: [{ validator: validatePassword, trigger: 'blur', required: true }]
});
const handleLoginSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      const current = util.getCache('current');
      console.log(current);
      if (current) {
        const boo = await util.loginSubmitOther(current);
        if (boo) {
          const routeValue = router.replace('/');
          routeValue
            .then(() => {
              window.location.reload();
            })
            .catch(() => {});
        }
      } else {
        const boo = await util.loginSubmit();
        console.log(boo);
        if (boo) {
          const routeValue = router.replace('/');
          routeValue
            .then(() => {
              window.location.reload();
            })
            .catch(() => {});
        }
      }
      console.log('submit!');
    } else {
      console.log('error submit!');
      return false;
    }
  });
};
const handleWatchEnter = (e: KeyboardEvent) => {
  if (loginFormRef.value && e.key === 'Enter') {
    handleLoginSubmit(loginFormRef.value);
  }
};
onMounted(() => document.addEventListener('keydown', handleWatchEnter));
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleWatchEnter);
});
const handleReset = () => {
  importForm.value = '';
  importForm.words = [];
};
const handleImport = () => {
  isDialog.value = true;
  handleReset();
};
const handleClose = () => {
  isDialog.value = false;
  handleReset();
};
const handleCancel = () => {
  isDialog.value = false;
  handleReset();
};
// liberty human aunt mix shed rabbit wait desert health rather athlete kind
const handleConfirm = () => {
  isDialog.value = false;
  const { value } = importForm;
  if (value) {
    const boo = keyring.verifyWords(value);
    console.log(value);
    console.log(boo);
    if (!boo) {
      ElMessage.error(handleI18n('login.wrong'));
    } else {
      emit('update', 4);
      ElMessage({
        showClose: true,
        message: handleI18n('login.wordSuccess'),
        type: 'success'
      });
      store.dispatch('handleActWords', value);
    }
  } else {
    ElMessage.error(handleI18n('login.errorempty'));
  }
  // handleReset();
};
const handleTabsImport = (tab: TabsPaneContext) => {
  const { name } = tab.props;
  console.log(name);
  handleReset();
};

const watchInputWords = (index: number) => {
  const words = [];
  const res = importForm.words as any;
  console.log(res[index]);
  if (res[index]) {
    const value = res[index].replace(/^\s+|\s+$/g, '');
    if (value.split(' ').length === 12) {
      const item = value.split(' ');
      for (let i = 1; i <= 12; i += 1) {
        res[i] = item[i - 1];
      }
    }
    for (const key in res) {
      if (res[key]) {
        words.push(res[key]);
      }
    }
    if (words.length === 12) {
      importForm.value = words.join(' ');
    }
  }
};
</script>
<template>
  <h1 class="text-title leading-normal">{{ $t('login.welcome') }}</h1>
  <h3 class="text-title leading-normal">{{ $t('login.lead') }}</h3>
  <el-form
    ref="loginFormRef"
    :model="loginData"
    status-icon
    :rules="loginRules"
    label-width="100px"
    class="wallet-form"
    label-position="top"
    @submit.prevent
  >
    <!--  <el-form-item prop="username" class="mb-5">
      <template #label>
        <span class="text-tinge">{{ $t('login.account') }}</span>
      </template>
      <el-input
        ref="securitydiscword"
        v-model="loginData.username"
        class="placeholder-place"
        type="text"
        disabled
        :placeholder="$t('login.createWallet')"
        autocomplete="off"
        clearable
      /> -->
    <!-- <el-select
        v-model="loginData.username"
        class="placeholder-place h-40px"
        :placeholder="$t('login.choose')"
        style="width: 100%"
        :no-data-text="$t('data.no')"
      >
        <el-option
          v-for="(item, keyid) in accountList"
          :key="item.value"
          :label="item.nickname"
          :value="keyid"
          class="login-select"
        >
          <div class="login-content-box-option">
            <span>{{ item.nickname }}</span>
            <i
              class="el-icon-close"
              @click.stop="handleDeleteAccount(keyid)"
            ></i>
          </div>
        </el-option>
      </el-select> -->
    <!--   </el-form-item> -->
    <el-form-item prop="password" class="mb-5">
      <template #label>
        <span class="text-tinge">{{ $t('login.signPassword') }}</span>
      </template>
      <el-input
        ref="securitydiscword"
        v-model="loginData.password"
        class="placeholder-place"
        type="password"
        :show-password="isPassword"
        autocomplete="off"
        :placeholder="$t('login.inputPassword')"
        clearable
      />
    </el-form-item>
    <el-form-item>
      <div class="w-full">
        <el-button
          type="primary"
          :disabled="logining"
          class="w-full h-10 bg-blue text-white"
          @click="handleLoginSubmit(loginFormRef)"
        >
          {{ logining ? $t('logging') : $t('login.sign') }}
        </el-button>
      </div>
    </el-form-item>
    <div class="flex justify-around">
      <a class="text-blue" href="javascript:;">
        <span @click="handleCreate">{{ $t('login.build') }}</span>
      </a>
      <a class="text-blue" href="javascript:;">
        <span @click="handleImport">{{ $t('login.import') }}</span>
      </a>
      <!--  <a class="text-blue" href="javascript:;">
        <span @click="handleCreate">{{ $t('login.add') }}</span>
      </a> -->
    </div>
  </el-form>
  <dialog-login
    :title="$t('login.impwall')"
    :is-dialog="isDialog"
    :is-footer="isFooter"
    :width="width"
    @close="handleClose"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  >
    <template #default>
      <div class="login-tabs">
        <el-tabs v-model="importName" @tab-click="handleTabsImport">
          <el-tab-pane :label="$t('login.words')" name="words">
            <div class="flex flex-wrap justify-between h-words">
              <el-input
                v-for="(i, index) in 12"
                :key="index"
                v-model="importForm.words[i]"
                type="text"
                class="w-1/5 m-2"
                @keyup="watchInputWords(i)"
                @blur="watchInputWords(i)"
                @keydown="watchInputWords(i)"
              ></el-input>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('login.text')" name="text">
            <div class="h-words">
              <el-input
                v-model="importForm.value"
                rows="5"
                :placeholder="$t('login.inputtext')"
                show-word-limit
                type="textarea"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
  </dialog-login>
</template>
