<template>
  <div v-if="loggedIn" class="paddingXMain containerCheckout">
    <div class="container detailsContainer">
      <div class="mb-8 productSecText">CHECKOUT</div>

      <div class="detailsMainText">BILLING DETAILS</div>
      <div class="radioPadding">
        <div class="flex items-center mr-4 mb-4">
          <label class="labelCheckout" for="billing">
            <input class="checkbox" type="checkbox" checked v-model="checked" />
            My billing details are the same as my shipping details
          </label>
        </div>
        <div class="detailsMainText">SHIPPING ADDRESS</div>
        <div class="flex flex-col">
          <div class="radioPadding radioLeftPadding">
            <div
              class="flex items-center mr-4 mb-4"
              v-for="(item, index) in savedAddresses"
              :key="index"
            >
              <input
                v-if="index == 0"
                @click="activeAddress"
                :id="`radio${index}`"
                type="radio"
                name="radio"
                class="hidden"
                checked
              />
              <input
                v-else
                @click="activeAddress"
                :id="`radio${index}`"
                type="radio"
                name="radio"
                class="hidden"
              />
              <label :for="`radio${index}`" class="labelCheckout">
                <span></span>
                {{ `Address ${index + 1}` }}</label
              >
            </div>
          </div>
        </div>
        <div class="w-full radioPadding">
          <div
            class="w-full flex"
            v-for="(item, index) in addressItems"
            :key="index"
          >
            <div class="w-1/2 marginAddress">
              <label class="labelAddress capitalize" :for="`${item[0]}`">
                {{ item[0] }}
              </label>
              <div class="textAddress">
                {{ savedAddresses[activeAddressIndex][item[0]] }}
              </div>
            </div>
            <div class="w-1/2 marginAddress">
              <label class="labelAddress capitalize" :for="`${item[0]}`">
                {{ item[1] }}
              </label>
              <div class="textAddress">
                {{ savedAddresses[activeAddressIndex][item[1]] }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="!checked">
          <div class="detailsMainText">BILLING ADDRESS</div>
          <div
            class="flex items-center mr-4 mb-4 radioLeftPadding"
            v-for="(item, index) in savedAddresses"
            :key="index"
          >
            <input
              v-if="index == 0"
              @click="activeBilling"
              :id="`billing${index}`"
              type="radio"
              name="billing"
              class="hidden"
              checked
            />
            <input
              v-else
              @click="activeBilling"
              :id="`billing${index}`"
              type="radio"
              name="billing"
              class="hidden"
            />
            <label :for="`billing${index}`" class="labelCheckout">
              <span></span>
              {{ `Address ${index + 1}` }}</label
            >
          </div>
        </div>
      </div>
      <div v-if="!checked" class="w-full radioPadding">
        <div
          class="w-full flex"
          v-for="(item, index) in addressItems"
          :key="index"
        >
          <div class="w-1/2 marginAddress">
            <label class="labelAddress capitalize" :for="`${item[0]}`">
              {{ item[0] }}
            </label>
            <div class="textAddress">
              {{ savedAddresses[activeBillingIndex][item[0]] }}
            </div>
          </div>
          <div class="w-1/2 marginAddress">
            <label class="labelAddress capitalize" :for="`${item[0]}`">
              {{ item[1] }}
            </label>
            <div class="textAddress">
              {{ savedAddresses[activeBillingIndex][item[1]] }}
            </div>
          </div>
        </div>
      </div>
      <div class="detailsMainText">PAYMENT DETAILS</div>
      <form id="payment-form" class="w-full">
        <div id="payment-element">
          <!-- Elements will create form elements here -->
        </div>
        <button id="submit">Submit</button>
        <div id="error-message"></div>
      </form>
    </div>
    <div class="container summaryContainer">
      <div class="mb-6 text-xl font-medium text-right">SUMMARY</div>
      <div
        class="flex justify-between w-full"
        :class="{ 'mt-4': index != 0 && index != cart.length }"
        v-for="(item, index) in cart"
        :key="index"
      >
        <div class="flex items-center font-medium text-md">
          <img class="w-16 h-16 rounded-lg" :src="`${item.image}`" alt="" />
          <div class="flex flex-col ml-4">
            <div>{{ item.name }}</div>
            <div class="text-gray-500">
              $ {{ numberWithCommas(item.price) }}
            </div>
          </div>
        </div>
        <div class="summaryAmount">x{{ item.amount }}</div>
      </div>
      <div class="flex justify-between w-full mt-6">
        <div class="text-gray-500 font-thin">TOTAL</div>
        <div class="text-black font-bold text-lg">
          $ {{ numberWithCommas(totalPrice) }}
        </div>
      </div>
      <div class="flex justify-between w-full mt-6">
        <div class="text-gray-500 font-thin">SHIPPING</div>
        <div class="text-black font-bold text-lg">
          $ {{ numberWithCommas(shippingPrice) }}
        </div>
      </div>
      <div class="w-full border-gray-400 border mt-2"></div>
      <div class="flex justify-between w-full mt-12">
        <div class="text-gray-500 font-thin">GRAND TOTAL</div>
        <div class="text-sec font-bold text-lg">
          $ {{ numberWithCommas(grandTotal) }}
        </div>
      </div>
    </div>
  </div>
  <div v-else class="font-bold text-lg mb-4 text-center py-16">
    You have to be logged in to view this page!
  </div>
</template>
 
<script>
import { useStore } from "vuex";
import { computed, ref, onMounted, watch, nextTick } from "vue";

export default {
  setup() {
    const store = useStore();
    const user = computed(() => store.state.user);
    const cartItems = computed(() => store.getters.cartItems);
    const loggedIn = computed(() => store.getters.loggedIn);
    const totalPrice = computed(() => store.getters.totalPrice);
    const savedAddresses = computed(() => store.state.addresses);
    const shippingPrice = computed(() => (totalPrice.value > 15000 ? 0 : 1500));
    const grandTotal = computed(() => totalPrice.value + shippingPrice.value);
    const cart = computed(() => store.state.cart);
    let selectedAddress = ref(0);
    let activeAddressIndex = ref(0);
    let activeBillingIndex = ref(0);
    let checked = ref(true);

    const addressItems = [
      ["name", "phone"],
      ["address", "zip"],
      ["city", "country"],
    ];

    store.commit("SET_PAGE", -1);

    onMounted(() => {
      setCart();
      setAddress();
      getStripe();
    });
    function getStripe() {
      let t = JSON.parse(localStorage.getItem("user"));
      let c = localStorage.getItem("cart");
      if (t) {
        store
          .dispatch("stripeGetClientSecret", { token: t.token, cart: c })
          .then((res) => {
            const stripe = Stripe(
              "pk_test_51K3KmZKotfEzrMWMIrcwNFY6jxBR1SKd8VmIB4fhQCshwPSNSA1kv9HE0T9YpiU1tdi9P1aM4drbPEOPnVzKfag600J2O0Jm2w"
            );
            const options = {
              clientSecret: res.client_secret,
              appearance: {
                theme: "night",
                variables: {
                  fontFamily: "Manrope, system-ui, sans-serif",
                  fontWeightNormal: "500",
                  borderRadius: "8px",
                  colorBackground: "#0A2540",
                  colorPrimary: "#d87d4a",
                  colorPrimaryText: "#1A1B25",
                  colorText: "black",
                  colorTextSecondary: "white",
                  colorTextPlaceholder: "#727F96",
                  colorIconTab: "white",
                  colorLogo: "dark",
                },
                rules: {
                  ".Input, .Block": {
                    backgroundColor: "transparent",
                    border: "1.5px solid var(--colorBackground)",
                    boxShadow: "none",
                  },
                },
              },
            };
            const elements = stripe.elements(options);
            const paymentElement = elements.create("payment");
            paymentElement.mount("#payment-element");
            //send to stripe
            const form = document.getElementById("payment-form");
            form.addEventListener("submit", async (event) => {
              event.preventDefault();
              store
                .dispatch("createOrder", {
                  total: grandTotal.value,
                  billing: activeBillingIndex.value,
                  shipping: activeAddressIndex.value,
                  username: user.value,
                })
                .then((res) => {
                  const order = res.order_id;
                  stripe.confirmPayment({
                    elements,
                    confirmParams: {
                      //nekako pošlji order id kot parameter v url
                      return_url: `https://stormy-tundra-28859.herokuapp.com/success?order=${order}`,
                    },
                  });
                })
                .then((res) => {
                  if (res) {
                    const messageContainer =
                      document.querySelector("#error-message");
                    messageContainer.textContent = error.message;
                  }
                })
                .catch((err) => console.log(err));
            });
          })
          .catch((err) => console.log(err));
      }
    }
    function activeAddress() {
      for (let i = 0; i < savedAddresses.value.length; i++) {
        let id = document.getElementById(`radio${i}`);
        if (id.checked) {
          activeAddressIndex.value = i;
        }
      }
    }
    function activeBilling() {
      for (let i = 0; i < savedAddresses.value.length; i++) {
        let id = document.getElementById(`billing${i}`);
        if (id.checked) {
          activeBillingIndex.value = i;
        }
      }
    }
    function setCart() {
      let c = JSON.parse(localStorage.getItem("cart"));
      if (c) {
        store.commit("SET_CART", c);
      }
    }
    function setAddress() {
      let a = JSON.parse(localStorage.getItem("addresses"))._value;
      if (a) {
        store.commit("SET_ADDRESS", a);
      }
    }
    function numberWithCommas(x) {
      return (x / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return {
      cartItems,
      cart,
      numberWithCommas,
      totalPrice,
      shippingPrice,
      grandTotal,
      selectedAddress,
      savedAddresses,
      activeBilling,
      activeBillingIndex,
      activeAddress,
      activeAddressIndex,
      addressItems,
      loggedIn,
      checked,
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
button:hover {
  opacity: 0.6;
}
button {
  transition: opacity 100ms ease-out 0ms;
}
.labelCheckout {
  @apply flex items-center cursor-pointer md:text-base sm:text-sm text-xs;
}
.radioPadding {
  @apply md:mb-6 mb-4 flex flex-col;
}
.radioLeftPadding {
  @apply md:ml-8 ml-4;
}
.radioText {
  @apply md:text-base sm:text-sm text-xs;
}
.summaryAmount {
  @apply flex h-1/2 my-auto p-2 font-bold w-8 text-center flex items-center justify-center;
}
.modal {
  @apply absolute inset-0 w-full flex flex-col items-end z-20;
  background-color: rgba(0, 0, 0, 0.5);
}
.detailsMainText {
  @apply xl:text-lg md:text-base text-sm md:mb-6 mb-4 font-medium text-sec;
}
.container {
  @apply flex flex-col items-start justify-between p-8 rounded-xl border-gray-400 border-2;
}
.detailsContainer {
  @apply flex-grow md:mr-8 mr-4 h-auto md:w-2/3 w-full;
}
.summaryContainer {
  @apply h-full md:w-1/3 w-full md:order-last order-first md:mb-0 mb-4;
}
.checkbox {
  @apply text-sec w-6 h-6 mr-2 focus:ring-sec focus:ring-opacity-0 border border-gray-400 rounded;
  filter: hue-rotate(190deg) brightness(1.25);
}
label > span {
  @apply w-6 h-6 inline-block mr-2 rounded-full border border-gray-400 flex-shrink-0;
}
input[type="radio"] + label span {
  transition: background 0.2s, transform 0.2s;
}
input[type="radio"] + label span:hover,
input[type="radio"] + label:hover span {
  transform: scale(1.2);
}
input[type="radio"]:checked + label span {
  background-color: var(--sec);
  box-shadow: 0px 0px 0px 3px white inset;
}
input[type="radio"]:checked + label {
  color: var(--sec);
}
.textAddress {
  @apply flex items-center font-bold lg:text-lg md:text-base text-sm;
}
.labelAddress {
  @apply font-bold md:mb-4 mb-2 text-sec lg:text-lg md:text-base text-sm;
}
.containerCheckout {
  @apply w-full flex xl:mt-20 lg:mt-20 md:mt-16 sm:mt-8 mt-4 md:flex-row flex-col;
}
#submit {
  @apply hover:opacity-80 font-bold mt-4 py-2 md:px-3 px-2 lg:text-base text-sm rounded-lg bg-sec text-white flex mx-auto;
}
.marginAddress {
  @apply md:mb-2 mb-1;
}
</style>