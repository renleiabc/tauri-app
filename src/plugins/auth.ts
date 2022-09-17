import { ref, Ref } from 'vue';
// eslint-disable-next-line no-unused-vars
import { ElMessage, ElMessageBox } from 'element-plus';
import util from './util';
import { handleGetObjUrl } from './common';
// eslint-disable-next-line no-unused-vars
import { handleI18n } from './i18n';
// eslint-disable-next-line no-unused-vars
const securitydiscword = ref() as Ref<HTMLElement>;
// eslint-disable-next-line no-unused-vars
const entertradepassCheckbox = ref() as Ref<HTMLElement>;
// eslint-disable-next-line no-unused-vars
const entertradepassInput = ref() as Ref<HTMLElement>;
export default {
  getWallets(uid: string) {
    const list = util.getCache('wallets');
    const arrList = list ? JSON.parse(util.decryptAES(list, 'Aa123456')) : {};
    Object.keys(arrList).forEach((key) => {
      arrList[key].nickname = decodeURIComponent(arrList[key].nickname);
    });
    return uid ? arrList[uid] : arrList;
  },
  getChainUrl() {
    let url = handleGetObjUrl().nodeserver;
    const networkId = util.getCache('networkId');
    const networks = util.getCache('networks');
    if (networkId) {
      const otherNetwork: any = util.searchArr(
        networks,
        'networkId',
        networkId
      );
      if (otherNetwork) {
        url = otherNetwork.ip;
      }
    }
    return url;
  }
};
