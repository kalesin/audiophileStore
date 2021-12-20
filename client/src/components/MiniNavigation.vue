<template>
  <div class="flex w-full paddingTopMain opacity-0" id="miniNav">
    <div class="flex justify-between mx-auto sm:w-3/4 w-full sm:px-0 px-4">
      <div
        v-for="(item, index) in categories"
        :key="index"
        class="h-40 sm:h-44 md:h-52 lg:h-60 w-1/3 xl:m-4 md:m-2 m-1 bg-gray-100"
      >
        <router-link :to="`/${item}`" @click="setPage(index + 1)">
          <div class="flex justify-center items-center h-full">
            <img
              v-if="index == 0"
              class="miniNavImage"
              src="/src/assets/category-headphones/desktop/image-xx99-mark-two.png"
            />
            <img
              v-else-if="index == 1"
              class="miniNavImage"
              src="/src/assets/category-speakers/desktop/image-zx9.png"
            />
            <img
              v-else-if="index == 2"
              class="miniNavImage"
              src="/src/assets/category-earphones/desktop/image-yx1-earphones.png"
            />
            <div class="flex flex-col z-10 mt-10">
              <div class="text-center font-medium miniNavText uppercase">
                {{ categories[index] }}
              </div>

              <div class="text-center flex justify-center items-center">
                <div class="font-bold text-sec miniNavText">SHOP</div>
                <svg
                  class="color-sec ml-2"
                  width="8"
                  height="12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.322 1l5 5-5 5"
                    stroke="#D87D4A"
                    stroke-width="2"
                    fill="none"
                    fill-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { onMounted } from "vue";
export default {
  setup() {
    const store = useStore();
    function setPage(value) {
      store.commit("SET_PAGE", value);
    }
    const categories = ["headphones", "speakers", "earphones"];
    function addDelayAnimation(entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
        }
      });
    }
    let options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };
    onMounted(() => {
      setTimeout(() => {
        let observer = new IntersectionObserver(addDelayAnimation, options);
        observer.observe(document.querySelectorAll("#miniNav")[0]);
      }, 0);
    });
    return {
      setPage,
      categories,
    };
  },
};
</script>
