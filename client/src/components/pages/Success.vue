<template>
  <div
    v-if="loggedIn"
    class="w-full flex paddingTopMain paddingXMain flex flex-col"
  >
    <div class="mb-8 text-3xl font-bold text-sec">
      THANK YOU FOR YOUR ORDER!
    </div>
    <div class="text-xl mb-8">
      Thank you for shopping at Audiophile, your order has been successfully
      proccessed! Please check your email to view the order or payment details!
    </div>
    <div id="message"></div>
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
    const loggedIn = computed(() => store.getters.loggedIn);
    store.commit("SET_PAGE", -1);
    onMounted(() => {
      stripeConfirmation();
    });
    function stripeConfirmation() {
      const stripe = Stripe(
        "pk_test_51K3KmZKotfEzrMWMIrcwNFY6jxBR1SKd8VmIB4fhQCshwPSNSA1kv9HE0T9YpiU1tdi9P1aM4drbPEOPnVzKfag600J2O0Jm2w"
      );
      const clientSecret = new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
      );
      const order = new URLSearchParams(window.location.search).get(
        "order"
      );
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        const message = document.querySelector("#message");
        switch (paymentIntent.status) {
          case "succeeded":
            store
              .dispatch("sendOrderEmail", {order_id:order})
              .then((res) => {
                return res;
              })
              .catch((err) => console.log(err));
            message.innerText = "Success! Payment received.";
            break;
          case "processing":
            message.innerText =
              "Payment processing. We'll update you when payment is received.";
            break;
          case "requires_payment_method":
            message.innerText =
              "Payment failed. Please try another payment method.";
            // Redirect your user back to your payment page to attempt collecting
            // payment again
            break;
          default:
            message.innerText = "Something went wrong.";
            break;
        }
      });
    }
    return {
      loggedIn,
    };
  },
};
</script>