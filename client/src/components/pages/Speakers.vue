<template>
  <div class="flex flex-col categoriesWidth mx-auto categoriesPaddingBottom delay">
    <div
      class="flex categoriesMarginTop items-center opacity-0"
      v-for="(item, index) in products"
      :key="index"
      :class="{ 'odd': index % 2 == 1, 'even': index % 2 == 0}"
    >
    <img  v-if="index==0"
        class="rounded-lg categoriesImage flex-grow order-last"
        src="/src/assets/product-zx7-speaker/desktop/image-product.jpg"
      />
      <img  v-else-if="index==1"
        class="rounded-lg categoriesImage flex-grow"
        src="/src/assets/product-zx9-speaker/desktop/image-product.jpg"
      />
      <div
        class="h-full w-1/2 flex flex-col items-start my-auto"
        :class="{
          categoriesTextMarginRight: (index + 1) % 2 == 1,
          categoriesTextMarginLeft: (index + 1) % 2 != 1,
        }"
      >
        <div
          v-if="index == 1"
          class="font-light text-sec tracking categoriesNewProductText"
        >
          NEW PRODUCT
        </div>
        <div class="categoriesNameText" :class="{ 'sm:mt-4 mt-2': index == 1 }">
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
    const productId = [3, 4];
    function setProduct(value) {
      store.commit("SET_PRODUCT", value);
    }
    const products = ["ZX7 SPEAKER", "ZX9 SPEAKER"];
    const descriptions = [
      "Stream high quality sound wirelessly with minimal to no loss. The ZX7 speaker uses high-end audiophile components that represents the top of the line powered speakers for home or studio use.",
      "Upgrade your sound system with the all new ZX9 active speaker. It’s a bookshelf speaker system that offers truly wireless connectivity -- creating new possibilities for more pleasing and practical audio setups.",
    ];
    store.commit("SET_PAGE", 2);
    onMounted(() => {
      window.scrollTo(0, 0);
      addDelayObserver();
    });
    return {
      productId,
      setProduct,
      descriptions,
      products
    };
  },
  components: { MiniNavigation },
};
</script>

<style scoped>
.sectionWidth {
  width: 550px;
}
button:hover {
  opacity: 0.6;
}
button {
  transition: opacity 100ms ease-out 0ms;
}
</style>
