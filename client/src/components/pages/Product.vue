<template>
  <router-link
    :to="`/${products[product].type}`"
    @click="setPage(products[product].typePage)"
  >
    <div
      class="
        categoriesTextMarginLeft
        xl:my-20
        md:my-10
        my-6
        text-gray-500
        md:text-md
        text-sm
        font-normal
        capitalize
      "
    >
      ← more {{ products[product].type }}
    </div>
  </router-link>
  <div
    class="
      flex flex-col
      w-full
      paddingXMain
      xl:pb-20
      md:pb-10
      pb-4
      items-center
    "
  >
    <div class="flex items-center opacity-0" id="element0">
      <img
        class="rounded-lg categoriesImage"
        :src="`${products[product].images[0]}`"
      />
      <div
        class="
          h-full
          w-1/2
          flex flex-col
          md:items-start
          items-center
          my-auto
          categoriesTextMarginLeft
        "
      >
        <div class="font-bold productMarginBottom categoriesNameText">
          {{ products[product].name }}
        </div>
        <div class="text-gray-400 categoriesDescText">
          {{ products[product].text }}
        </div>
        <div class="text-black miniNavText xl:py-8 md:py-4 py-2 font-bold">
          $ {{ numberWithCommas(products[product].price) }}
        </div>
        <div class="flex md:flex-row flex-col">
          <div class="flex justify-center">
            <button
              class="p-2 bg-gray-100 text-black text-sm font-bold"
              @click="decreaseCounter()"
            >
              -
            </button>
            <div
              class="
                md:p-2
                p-1
                font-bold
                xl:w-8
                md:w-6
                w-4
                flex
                items-center
                justify-center
                xl:text-base
                md:text-sm
                text-xs
              "
            >
              {{ counter }}
            </div>
            <button
              class="p-2 bg-gray-100 text-black text-sm font-bold"
              @click="increaseCounter()"
            >
              +
            </button>
          </div>
          <button
            class="
              responsiveButtonProduct
              bg-sec
              text-white text-sm
              font-bold
              md:ml-2
              ml-0
              md:mt-0
              mt-2
            "
            @click="
              setCartItem({
                name: products[product].name,
                price: products[product].price,
                amount: counter,
                image: products[product].images[0],
              });
              emitItem(products[product].name);
            "
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
    <div class="flex productMarginTop">
      <div class="flex flex-col md:w-2/3 w-3/5 xl:mr-20 lg:mr-16 md:mr-12 mr-4">
        <div class="text-black categoriesNameText productMarginBottom">
          FEATURES
        </div>
        <div class="text-gray-400 productDescText">
          {{ products[product].featuresText[0] }}
        </div>
        <br />
        <div class="text-gray-400 productDescText">
          {{ products[product].featuresText[1] }}
        </div>
      </div>
      <div class="flex flex-col md:w-1/3 w-2/5">
        <div class="text-black categoriesNameText productMarginBottom">
          IN THE BOX
        </div>
        <div class="flex h-1/2">
          <div class="flex flex-col justify-between">
            <div
              v-for="(item, index) in products[product].inTheBoxText"
              :key="index"
              class="flex"
            >
              <div
                class="
                  text-sec
                  w-8
                  xl:mr-10
                  md:mr-5
                  mr-2
                  font-bold
                  productDescText
                "
              >
                {{ products[product].inTheBoxNumbers[index] }} x
              </div>
              <div class="text-gray-400 productDescText">
                {{ products[product].inTheBoxText[index] }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="productMarginTop flex">
      <div class="flex flex-col">
        <img
          class="h-1/2 rounded-lg productMarginBottom opacity-0"
          :src="`${products[product].images[1]}`"
          id="element1"
        />
        <img
          class="h-1/2 rounded-lg opacity-0"
          :src="`${products[product].images[2]}`"
          id="element2"
        />
      </div>
      <div class="h-full productMarginLeft">
        <img
          class="rounded-lg opacity-0"
          :src="`${products[product].images[3]}`"
          id="element3"
        />
      </div>
    </div>
    <div class="productMarginTop flex flex-col items-center">
      <div class="font-bold categoriesNameText text-black productMarginBottom">
        YOU MAY ALSO LIKE
      </div>
      <div class="flex md:w-3/4 w-full">
        <div
          v-for="(item, index) in randomNumbers"
          :key="index"
          class="flex flex-col items-center"
          :class="{ productMarginRight: [0, 1].includes(index) }"
        >
          <img
            class="rounded-lg productMarginBottom"
            :src="`${products[item].images[0]}`"
          />
          <div
            class="
              font-bold
              miniNavText
              text-center text-black
              productMarginBottom
              h-10
              items-center
              flex
            "
          >
            {{ products[item].name }}
          </div>
          <router-link
            :to="`/products/${item}`"
            @click="
              setProduct(item);
              setPage(-1);
              clearRandomNumbers();
            "
          >
            <button
              class="
                responsiveButtonReccomended
                bg-sec
                text-white text-sm
                font-bold
              "
            >
              SEE PRODUCT
            </button></router-link
          >
        </div>
      </div>
    </div>
  </div>
  <MiniNavigation />
</template>

<script>
import { useStore } from "vuex";
import { computed, ref, onMounted, onRenderTriggered } from "vue";
import router from "../../router";
import MiniNavigation from "../MiniNavigation.vue";
import constants from "../../store/constants.js";

export default {
  setup(props, { emit }) {
    const store = useStore();
    const products = constants.products;
    const product = computed(() => router.currentRoute.value.params.id);
    let counter = ref(1);
    let randomNumbers = ref([]);
    const emitItem = (event) => {
      emit("set-cart-item", event);
    };
    function generate() {
      while (randomNumbers.value.length < 3) {
        var r = Math.floor(Math.random() * 6);
        if (randomNumbers.value.indexOf(r) === -1 && product != r) {
          randomNumbers.value.push(r);
        }
      }
    }
    generate();
    setPage(-1);
    function clearRandomNumbers() {
      randomNumbers.value = [];
      generate();
    }
    function numberWithCommas(x) {
      return (x/100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function setProduct(value) {
      store.commit("SET_PRODUCT", value);
    }
    function increaseCounter() {
      counter.value++;
    }
    function decreaseCounter() {
      if (counter.value > 1) {
        counter.value--;
      }
    }
    function setPage(value) {
      store.commit("SET_PAGE", value);
    }
    function setCartItem(value) {
      store.dispatch("setCartItem", value);
    }
    function addAnimation(entries, observer) {
      entries.forEach((entry) => {
        console.log(entry.target.id, entry.isIntersecting);
        if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
        }
      });
    }
    function addAnimation2(entries, observer) {
      entries.forEach((entry) => {
        console.log(entry.target.id, entry.isIntersecting);
        if (entry.isIntersecting) {
            document
              .querySelector("#element1")
              .classList.add("animate-fade-in-y-up");
            document
              .querySelector("#element2")
              .classList.add("animate-fade-in-x-left");
            document
              .querySelector("#element3")
              .classList.add("animate-fade-in-x-right");
        }
      });
    }
    let options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };
    onMounted(() => {
      let observer = new IntersectionObserver(addAnimation, options);
      observer.observe(document.getElementById(`element0`));
      let observer2 = new IntersectionObserver(addAnimation2, options);
      observer2.observe(document.getElementById(`element1`));
    });
    return {
      product,
      products,
      setProduct,
      counter,
      increaseCounter,
      decreaseCounter,
      randomNumbers,
      numberWithCommas,
      setPage,
      clearRandomNumbers,
      setCartItem,
      emitItem,
    };
  },
  data() {
    return {};
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
  computed: {},
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
.productMarginTop {
  @apply xl:mt-32 lg:mt-24 md:mt-20 sm:mt-16 mt-10;
}
.productMarginBottom {
  @apply xl:mb-8 md:mb-4 mb-2;
}
.productMarginLeft {
  @apply xl:ml-8 md:ml-4 ml-2;
}
.productMarginRight {
  @apply xl:mr-8 md:mr-4 mr-2;
}
.responsiveButtonReccomended {
  @apply lg:p-3 md:p-2 p-1 lg:w-40 md:w-32 w-20 lg:text-base md:text-sm text-xs;
}
</style>
