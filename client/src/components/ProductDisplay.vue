<template>
  <div
    class="
      w-full
      paddingXMain
      flex flex-col
      justify-between
      pb-6
      sm:pb-20
      paddingTopMain
    "
  >
    <div class="speakerFirstContainer z-10">
      <svg
        class="absolute opacity-0 speakerFirstSvg"
        viewBox="-350 0 1400 1400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          stroke="#FFF"
          fill="none"
          stroke-width="3"
          fill-rule="evenodd"
          opacity=".2"
        >
          <circle cx="472" cy="472" r="235.5" />
          <circle cx="472" cy="472" r="270.5" />
          <circle cx="472" cy="472" r="471.5" />
        </g>
      </svg>
      <img
        class="speakerFirstImage opacity-0"
        src="../assets/category-speakers/desktop/image-zx9.png"
      />
      <div class="speakerFirstText sectionWidth opacity-0">
        <div class="font-medium productPriText md:my-4 my-2 text-white">
          ZX9 SPEAKER
        </div>
        <div class="text-gray-200 mb-4 text-base">
          Upgrade to premium speakers that are phenomenally built to deliver
          truly remarkable sound.
        </div>
        <router-link
          :to="`/products/4`"
          @click="
            setProduct(4);
            setPage(-1);
          "
        >
          <button class="responsiveButton font-medium">
            SEE PRODUCT
          </button></router-link
        >
      </div>
    </div>
    <div class="speakerSecondContainer speakerBackground opacity-0 z-0">
      <div class="flex flex-col items-center justify-center z-10 marginLeft">
        <div class="font-medium productSecText mb-12 text-black">
          ZX7 SPEAKER
        </div>
        <router-link
          :to="`/products/3`"
          @click="
            setProduct(3);
            setPage(-1);
          "
        >
          <button class="responsiveButton font-medium">
            SEE PRODUCT
          </button></router-link
        >
      </div>
    </div>
    <div class="earphonesContainer">
      <img
        src="../assets/home/desktop/image-earphones-yx1.jpg"
        class="earphonesImage opacity-0"
      />
      <div class="earphonesText opacity-0">
        <div class="font-medium productSecText lg:mb-12 mb-4 text-black">
          YX1 EARPHONES
        </div>
        <router-link
          :to="`/products/5`"
          @click="
            setProduct(5);
            setPage(-1);
          "
        >
          <button class="responsiveButton font-medium">
            SEE PRODUCT
          </button></router-link
        >
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
    function setProduct(value) {
      store.commit("SET_PRODUCT", value);
    }
    function addAnimation1(entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-x-left");
        }
      });
    }
    function addAnimation2(entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("animate-fade-in-x-right");
          }, 1000);
        }
      });
    }
    function addAnimation3(entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("animate-fade-in-y-down");
          }, 1000);
        }
      });
    }
    function addAnimation4(entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("animate-fade-in-long");
          }, 1000);
        }
      });
    }
    function addAnimation5(entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("animate-fade-in-y-up");
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
      let observer1 = new IntersectionObserver(addAnimation1, options);
      observer1.observe(document.getElementsByClassName(`earphonesImage`)[0]);
      let observer2 = new IntersectionObserver(addAnimation2, options);
      observer2.observe(document.getElementsByClassName(`earphonesText`)[0]);
      let observer3 = new IntersectionObserver(addAnimation3, options);
      observer3.observe(
        document.getElementsByClassName(`speakerFirstImage`)[0]
      );
      let observer4 = new IntersectionObserver(addAnimation5, options);
      observer4.observe(
        document.getElementsByClassName(`speakerSecondContainer`)[0]
      );
      let observer5 = new IntersectionObserver(addAnimation4, options);
      observer5.observe(document.getElementsByClassName(`speakerFirstText`)[0]);
      let observer6 = new IntersectionObserver(addAnimation4, options);
      observer6.observe(document.getElementsByClassName(`speakerFirstSvg`)[0]);
    });
    return {
      setPage,
      setProduct,
    };
  },
  data() {
    return {};
  },
  methods: {},
  computed: {},
  components: {},
};
</script>

<style scoped>
.sectionWidth {
  box-sizing: content-box;
  position: absolute;
  left: 500px;
  width: calc(100% - 550px);
}
@media screen and (max-width: 1024px) {
  .sectionWidth {
    left: 350px;
    width: calc(100% - 350px);
  }
}
@media screen and (max-width: 768px) {
  .sectionWidth {
    left: 20px;
    right: 20px;
    width: calc(100% - 40px);
    text-align: justify;
  }
}
.speakerFirstContainer {
  @apply w-full bg-sec rounded-lg relative mb-10 overflow-hidden flex justify-end;
  height: 35rem;
}
.speakerFirstImage {
  @apply lg:left-32 sm:left-16 left-4 lg:top-48 md:top-80 top-80 absolute lg:w-80 w-52;
}
.speakerFirstText {
  @apply flex flex-col md:justify-center justify-start mt-16 md:mt-0 h-full z-10 overflow-hidden;
}
.speakerBackground {
  background-image: url("../assets/home/desktop/image-speaker-zx7.jpg");
  background-size: cover;
  background-repeat: no-repeat;
}
.speakerSecondContainer {
  @apply w-full flex rounded-lg justify-start lg:h-80 md:h-60 h-40 mb-10;
}
.earphonesContainer {
  @apply w-full flex rounded-lg flex-col lg:flex-row;
  height: 28rem;
}
.earphonesImage {
  @apply h-full lg:w-1/2 w-full rounded-lg mr-10;
}
.earphonesText {
  @apply mt-4 lg:mt-0 flex flex-col items-center justify-center z-10 rounded-lg bg-gray-100 lg:h-full h-1/4 lg:w-1/2 w-full lg:py-0 py-4;
}
.marginLeft {
  margin-left: 20%;
}
.paddingLeft {
  padding-left: 400px;
}
button:hover {
  background-color: black;
  color: white;
}
button {
  transition: background-color 100ms ease-out 0ms;
}
</style>
