<template>
  <div
    class="flex flex-col categoriesWidth mx-auto categoriesPaddingBottom delay"
  >
    <div
      class="flex categoriesMarginTop items-center opacity-0"
      v-for="(item, index) in products"
      :class="{ odd: index % 2 == 1, even: index % 2 == 0 }"
      :key="index"
    >
      <img
        v-if="index == 0"
        class="rounded-lg categoriesImage"
        src="/src/assets/product-xx59-headphones/desktop/image-product.jpg"
      />
      <img
        v-else-if="index == 1"
        class="rounded-lg categoriesImage order-last"
        src="/src/assets/product-xx99-mark-one-headphones/desktop/image-product.jpg"
      />
      <img
        v-else-if="index == 2"
        class="rounded-lg categoriesImage"
        src="/src/assets/product-xx99-mark-two-headphones/desktop/image-product.jpg"
      />
      <div
        class="h-full w-1/2 flex flex-col items-start my-auto"
        :class="{
          categoriesTextMarginRight: (index + 1) % 2 == 0,
          categoriesTextMarginLeft: (index + 1) % 2 != 0,
        }"
      >
        <div
          v-if="index == 2"
          class="font-light text-sec tracking categoriesNewProductText"
        >
          NEW PRODUCT
        </div>
        <div class="categoriesNameText" :class="{ 'mt-4': index == 2 }">
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
    const productId = [0, 1, 2];
    const products = [
      "XX59 HEADPHONES",
      "XX99 MARK I HEADPHONES",
      "XX99 MARK II HEADPHONES",
    ];
    const descriptions = [
      "Enjoy your audio almost anywhere and customize it to your specific tastes with the XX59 headphones. The stylish yet durable versatile wireless headset is a brilliant companion at home or on the move.",
      "As the gold standard for headphones, the classic XX99 Mark I offers detailed and accurate audio reproduction for audiophiles, mixing engineers, and music aficionados alike in studios and on the go.",
      "The new XX99 Mark II headphones is the pinnacle of pristine audio. It redefines your premium headphone experience by reproducing the balanced depth and precision of studio-quality sound.",
    ];
    function setProduct(value) {
      store.commit("SET_PRODUCT", value);
    }
    store.commit("SET_PAGE", 1);
    onMounted(() => {
      window.scrollTo(0, 0);
      addDelayObserver();
    });
    return {
      productId,
      setProduct,
      products,
      descriptions,
    };
  },
  components: { MiniNavigation },
};
</script>

<style scoped>
button:hover {
  opacity: 0.6;
}
button {
  transition: opacity 100ms ease-out 0ms;
}
</style>
