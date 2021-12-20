<template>
  <div class="w-full h-screen">
    <div
      v-for="(item, index) in alert"
      :key="index"
      class="alert"
      role="alert"
      :style="{ 'margin-top': index * 55 + 8 + 'px' }"
    >
      <img class="alertImage" src="/src/assets/Flat_tick_icon_white.png" />
      <p>Item '{{ item }}' was added to the cart!</p>
      <div class="closeAlert" @click="closeAlert">x</div>
    </div>
    <Banner />
    <router-view @set-cart-item="setAlert" />
    <AboutUs />
    <Footer />
  </div>
</template>

<script>
import Banner from "./components/Banner.vue";
import Footer from "./components/Footer.vue";
import MiniNavigation from "./components/MiniNavigation.vue";
import ProductDisplay from "./components/ProductDisplay.vue";
import AboutUs from "./components/AboutUs.vue";

import { useStore } from "vuex";
import { computed, ref, onMounted, onRenderTriggered } from "vue";

export default {
  setup(props, { emit }) {
    const store = useStore();
    let alert = ref([]);
    let isRootVisible = computed(() => store.state.isRootVisible);

    function setAlert(event) {
      alert.value.push(event);
      console.log(alert.value);

      setTimeout(() => {
        alert.value.shift();
      }, 3500);
    }
    function closeAlert(index) {
      alert.value.splice(index, 1);
    }
    //premaknu v index/router
    return {
      setAlert,
      closeAlert,
      alert,
    };
  },
  name: "App",
  components: {
    Footer,
    Banner,
    MiniNavigation,
    ProductDisplay,
    AboutUs,
  },
};
</script>

<style scoped>
.close:hover {
  opacity: 0.5;
  background-color: #256844;
}
.close {
  cursor: pointer;
  transition: opacity, background-color 100ms ease-out 0ms;
}
.marginTop {
  margin-top: calc(index * 50px);
}
.alert {
  @apply md:text-base sm:text-sm text-xs fixed mt-2 ml-2 px-2 py-1 leading-normal text-white bg-alert-green rounded-lg flex justify-between items-center font-bold z-20;
}
.closeAlert {
  @apply pb-1 mb-3 close ml-2 text-lg w-6 h-6 rounded-md flex justify-center items-center font-normal;
}
.alertImage{
  @apply md:w-6 w-4 md:h-6 h-4 mr-2
}
</style>
