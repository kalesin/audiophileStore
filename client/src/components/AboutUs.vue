<template>
  <div class="aboutUsMain paddingXMain paddingTopMain">
    <div class="sm:w-1/2 w-full">
      <div class="aboutUsText">
        BRINGING YOU THE <span class="text-sec"> BEST </span>
      </div>
      <div class="aboutUsText xl:mb-10 md:mb-4 mb-2"> AUDIO GEAR</div>
      <div class="font-normal xl:text-lg lg:text-base md:text-sm text-xs text-gray-500 md:mr-0 sm:mr-4 mr-0 sm:mb-0 mb-4">
        Located at the heart of New York City, Audiophile is the premier store
        for high end headphones, earphones, speakers, and audio accessories. We
        have a large showroom and luxury demonstration rooms available for you
        to browse and experience a wide range of our products. Stop by our store
        to meet some of the fantastic people who make Audiophile the best place
        to buy your portable audio equipment.
      </div>
    </div>
    <img class="mx-auto rounded-lg xl:h-96 lg:h-80 md:h-68 sm:h-60 h-44" src="/src/assets/shared/desktop/image-best-gear.jpg" />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  computed: {},
  components: {},
};
</script>

<style scoped>
.image{
width: 50%;
}
.aboutUsMain {
  @apply w-full sm:h-1/2 h-auto flex justify-between mx-auto items-center sm:flex-row flex-col;
}
.aboutUsText {
  @apply font-bold xl:text-4xl lg:text-3xl md:text-xl text-base text-center;
}
</style>
