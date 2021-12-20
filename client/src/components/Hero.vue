<template>
<div class="flex"><div
      class="
        h-full
        w-1/3
        flex flex-col
        items-start
        justify-center
        z-10
        opacity-0
      "
      id="element0"
    >
      <div class="font-light text-gray-500 tracking">NEW PRODUCT</div>
      <div class="productPriText my-4">XX99 Mark II Headphones</div>
      <div class="text-gray-400 mb-4 md:text-lg sm:text-base text-xs">
        Experience natural, lifelike audio and exceptional build quality made
        for the passionate music enthusiast.
      </div>
      <router-link
        :to="`/products/2`"
        @click="
          setProduct(2);
          setPage(-1);
        "
      >
        <button class="responsiveButton bg-sec font-bold">
          SEE PRODUCT
        </button></router-link
      >
    </div>
    <img
      id="element1"
      class="heroImage opacity-0"
      src="/src/assets/home/desktop/image-hero2.jpg"
    /></div>
    
</template>

<script>
import { useStore } from "vuex";
import { computed, ref, onMounted } from "vue";

export default {
  setup() {
    const store = useStore();
    const page = computed(() => store.state.page);
    function setPage(value) {
      store.commit("SET_PAGE", value);
    }
    function setProduct(value) {
      store.commit("SET_PRODUCT", value);
    }
    function addAnimation(entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-long");
        }
      });
    }
    function addAnimation2(entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("animate-fade-in-long");
          }, 1000);
        }
      });
    }
    let options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };
    onMounted(() => {
      for (let i = 0; i < 2; i++) {
        if (i % 2 != 0) {
          let observer = new IntersectionObserver(addAnimation, options);
          observer.observe(document.getElementById(`element${i}`));
        } else {
          let observer = new IntersectionObserver(addAnimation2, options);
          observer.observe(document.getElementById(`element${i}`));
        }
      }
    });
    return {
      page,
      setPage,
      setProduct,
    };
  },
  data() {
    return {
      categories: ["headphones", "speakers", "earphones"],
    };
  },
};
</script>
