<template>
  <div class="relative cart lg:mr-0 mr-8" @click="setModal()">
    <img class="w-6" src="/src/assets/shared/desktop/icon-cart.svg" />
    <div
      class="
        bottom-3
        left-3
        absolute
        bg-sec
        rounded-full
        w-6
        h-6
        flex
        justify-center
        items-center
        text-sm
      "
    >
      {{ cartItems }}
    </div>
  </div>

  <teleport to="body">
    <div v-if="modalOpen" class="modal">
      <div v-if="cart.length != 0" class="modalContainer">
        <div class="flex justify-between w-full mb-6">
          <div class="xl:text-xl md:text-lg text-base font-medium">CART ({{ cartItems }})</div>
          <div class="text-gray-500 underline remove miniNavText" @click="deleteCart">
            Remove All
          </div>
        </div>
        <div
          class="flex justify-between w-full"
          :class="{ 'mt-4': index != 0 && index != cart.length }"
          v-for="(item, index) in cart"
          :key="index"
        >
          <div class="flex items-center font-medium text-md">
            <img class="w-16 h-16 rounded-lg" :src="`${item.image}`" alt="" />
            <div class="flex flex-col mx-4">
              <div class="miniNavText">{{ item.name }}</div>
              <div class="miniNavText text-gray-500">
                $ {{ numberWithCommas(item.price) }}
              </div>
            </div>
          </div>
          <div class="flex h-1/2 my-auto">
            <button
              class="bg-gray-100 text-black modalButton"
              @click="decreaseCounter(index)"
            >
              -
            </button>
            <div
              class="
                p-2
                font-bold
                w-8
                text-center
                flex
                items-center
                justify-center
              "
            >
              {{ item.amount }}
            </div>
            <button
              class="p-2 bg-gray-100 text-black text-sm font-bold"
              @click="increaseCounter(index)"
            >
              +
            </button>
          </div>
        </div>
        <div class="flex justify-between w-full mt-6">
          <div class="text-gray-500 font-thin miniNavText">TOTAL</div>
          <div class="text-black font-bold miniNavText">
            $ {{ numberWithCommas(totalPrice) }}
          </div>
        </div>
        <router-link :to="`/checkout`" @click="openCheckout" v-if="loggedIn">
          <button class="mt-6 bg-sec text-white modalButton">
            CHECKOUT
          </button>
        </router-link>
        <div v-else class="md:text-base sm:text-sm text-xs p-2">
          Please login to proceed to checkout!
        </div>
      </div>
      <div v-else class="modalContainer flex-col flex">
        <img class="w-52 p-4" src="/src/assets/empty.png" alt="" />
        <div class="mt-6">Your cart is empty!</div>
      </div>
    </div>
  </teleport>
</template>

<script>
import { useStore } from "vuex";
import { computed, ref, onMounted, watch } from "vue";

export default {
  setup() {
    let modalOpen = ref(false);
    const store = useStore();
    const loggedIn = computed(() => store.getters.loggedIn);
    const cartItems = computed(() => store.getters.cartItems);
    const totalPrice = computed(() => store.getters.totalPrice);
    const cart = computed(() => store.state.cart);
    onMounted(() => {
      let v = localStorage.getItem("cart");
      if (v) {
        setCart(JSON.parse(v));
      }
    });
    watch(
      () => cart.value,
      () => {
        localStorage.setItem("cart", JSON.stringify(cart.value));
      },
      { deep: true }
    );
    function setCart(value) {
      store.commit("SET_CART", value);
    }
    function deleteCart() {
      store.commit("DELETE_CART");
    }
    function increaseCounter(index) {
      store.dispatch("changeCartAmount", { value: 1, index });
    }
    function decreaseCounter(index) {
      store.dispatch("changeCartAmount", { value: -1, index });
      if (cart.value[index].amount == 0) {
        store.commit("DELETE_CART_ENTRY", index);
      }
    }
    function numberWithCommas(x) {
      return (x/100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function setModal() {
      modalOpen.value = true;
      document.body.classList.add("modal-open");
      setTimeout(() => {
        window.addEventListener("mousedown", onClickOutside);
      }, 0);
    }
    function onClickOutside(e) {
      let parentNode = document.getElementsByClassName("modalContainer");
      if (
        parentNode.length &&
        !parentNode[parentNode.length - 1].contains(e.target)
      ) {
        deactivateModal();
        window.removeEventListener("mousedown", onClickOutside);
      }
    }
    function openCheckout(){
      deactivateModal();

    }
    function deactivateModal(){
      modalOpen.value = false;
      document.body.classList.remove("modal-open");
    }
    return {
      cartItems,
      cart,
      numberWithCommas,
      decreaseCounter,
      increaseCounter,
      totalPrice,
      deleteCart,
      setModal,
      modalOpen,
      openCheckout,
      loggedIn
    };
  }
};
</script>

<style scoped>
.cart:hover {
  cursor: pointer;
}
.remove:hover {
  cursor: pointer;
  color: var(--sec);
  opacity: 0.7;
}
.remove {
  transition: color, opacity 200ms ease-out 0ms;
}
/* .modal {
  @apply absolute inset-0 w-full flex flex-col items-end z-20;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal .modalContainer {
  @apply flex flex-col items-center justify-between bg-white p-8 rounded-lg;
  width: 400px;
  margin-top: 10%;
  margin-right: 5%;
} */

.modal {
  @apply absolute inset-0 w-full h-full flex justify-end items-start z-20 pt-32 xl:pr-60 lg:pr-40 md:pr-24 sm:pr-16 px-4;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal .modalContainer {
  @apply flex flex-col items-center bg-white xl:p-8 md:p-6 p-3 rounded-lg;
}
</style>