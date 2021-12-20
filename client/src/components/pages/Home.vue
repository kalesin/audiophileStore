<template>
  <MiniNavigation /> <ProductDisplay/>
</template>

<script>
import MiniNavigation from "../MiniNavigation.vue";
import ProductDisplay from "../ProductDisplay.vue";

export default {
  name: "App",
  components: {
    MiniNavigation,
    ProductDisplay,
  },
};
</script>
