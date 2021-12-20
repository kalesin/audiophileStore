<template>
  <div class="flex flex-col categoriesWidth mx-auto categoriesPaddingBottom delay">
    <div
      class="flex categoriesMarginTop items-center opacity-0"
      v-for="(item, index) in products"
      :class="{ 'odd': index % 2 == 1, 'even': index % 2 == 0}"
      :key="index"
    >
      <img
        class="rounded-lg categoriesImage order-last"
        src="/src/assets/product-yx1-earphones/desktop/image-product.jpg"
      />
      <div
        class="
          h-full
          w-1/2
          flex flex-col
          items-start
          my-auto
          categoriesTextMarginRight
        "
      >
        <div
          v-if="index == 0"
          class="font-light text-sec tracking categoriesNewProductText"
        >
          NEW PRODUCT
        </div>
        <div class="categoriesNameText" :class="{ 'sm:mt-4 mt-2': index == 0 }">
          {{ products[index] }}
        </div>
        <div class="categoriesDescText">
          {{ descriptions[index] }}
        </div>
        <router-link
          :to="`/products/${productId[index]}`"
          @click="setProduct(productId[index])"
        >
          <button
            class="responsiveButtonProduct bg-sec text-white text-sm font-bold"
          >
            SEE PRODUCT
          </button></router-link
        >
      </div>
    </div>
  </div>
  <MiniNavigation />
</template>

<script>
import MiniNavigation from "../MiniNavigation.vue";
import { useStore } from "vuex";
import { computed, ref, onMounted } from "vue";
import { addDelayObserver } from "../../router/animations.js";

export default {
  setup() {
    const store = useStore();
    const productId = [5];
    function setProduct(value) {
      store.commit("SET_PRODUCT", value);
    }
    const products = ["YX1 WIRELESS EARPHONES"];
    const descriptions = [
      "Tailor your listening experience with bespoke dynamic drivers from the new YX1 Wireless Earphones. Enjoy incredible high-fidelity sound even in noisy environments with its active noise cancellation feature.",
    ];
    store.commit("SET_PAGE", 3);
    onMounted(() => {
      window.scrollTo(0, 0);
      addDelayObserver();
    });
    return {
      productId,
      setProduct,
      products,
      descriptions
    };
  },
  methods: {},
  computed: {},
  components: { MiniNavigation },
};
</script>

<style scoped>
.sectionWidth {
  width: 50%;
  height: 50%;
}
button:hover {
  opacity: 0.6;
}
button {
  transition: opacity 100ms ease-out 0ms;
}
</style>
