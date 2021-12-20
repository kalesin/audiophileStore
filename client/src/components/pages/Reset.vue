<template>
  <div v-if="!loggedIn">
    <div class="w-full flex-col flex items-center mt-10" v-if="enterNew">
      <div class="font-bold text-2xl mb-8">Reset password</div>
      <div class="flex flex-col mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="password"
        >
          New Password
        </label>
        <input
          v-model="password"
          id="password"
          type="password"
          placeholder="******************"
          :class="{ 'border-red-500 border-2': passwordMsg }"
        />
        <p v-if="passwordMsg" class="text-red-500 text-xs italic">
          {{ passwordMsg }}
        </p>
      </div>
      <div class="flex flex-col mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="password"
        >
          Repeat New Password
        </label>
        <input
          v-model="passwordRepeat"
          id="repeatPassword"
          type="password"
          placeholder="******************"
          :class="{ 'border-red-500 border-2': repeatMsg }"
        />
        <p v-if="repeatMsg" class="text-red-500 text-xs italic">
          {{ repeatMsg }}
        </p>
      </div>
      <div class="flex justify-center">
        <button @click="submit" type="button">Submit</button>
      </div>
    </div>
    <div class="w-full flex-col flex items-center mt-10" v-else>
      <div class="font-bold text-2xl mb-8">Reset password</div>
      <div class="flex flex-col mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="username"
        >
          Username
        </label>
        <input
          v-model="username"
          id="username"
          type="text"
          placeholder="user@example.com"
          :class="{ 'border-red-500 border-2': passwordMsg }"
        />
        <p v-if="usernameMsg" class="text-red-500 text-xs italic">
          {{ usernameMsg }}
        </p>
      </div>
      <div class="flex justify-center">
        <button @click="submitEmail" type="button">Send reset email</button>
      </div>
    </div>
  </div>

  <div v-else class="font-bold text-lg mb-4 w-full flex justify-center mt-10">
    You are already logged in!
  </div>
</template>
<script>
import { useStore } from "vuex";
import { computed, ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

export default {
  setup(context) {
    const store = useStore();
    const router = useRouter();
    let loggedIn = computed(() => store.getters.loggedIn);
    let enterNew = ref(false);

    let username = ref("");
    let password = ref("");
    let passwordRepeat = ref("");

    let passwordMsg = ref("");
    let repeatMsg = ref("");
    let usernameMsg = ref("");

    store.commit("SET_PAGE", -1);
    onMounted(() => {
      console.log("router", router.currentRoute);
      let token = router.currentRoute.value.query.token;
      if (token) {
        enterNew.value = true;
        localStorage.setItem("resetToken", token);
      } else {
        console.log("Can't find token");
      }
    });
    function submit() {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      let validPassword = passwordRegex.test(password.value);
      let passwordsMatch = password.value === passwordRepeat.value;
      let validInput = validPassword && passwordsMatch;
      if (validInput) {
        let resetToken = localStorage.getItem("resetToken");
        store
          .dispatch("resetPassword", {
            token: resetToken,
            password: password.value,
          })
          .then((res) => {
            console.log(res);
            if (res.status == 400) {
              repeatMsg.value = `${res.data}`;
            } else {
              repeatMsg.value = `Password successfully changed!`;
              setTimeout(() => {
                router.push({
                  path: "/home"
                });
                store.commit("SET_PAGE", 0);
              }, 2000);
            }
          })
          .catch((err) => console.log(err));
      } else {
        if (!validPassword) {
          passwordMsg.value =
            "Must contain 1 number and 1 uppercase. Length > 8.";
        } else {
          passwordMsg.value = "";
        }
        if (!passwordsMatch || passwordRepeat.value == "") {
          repeatMsg.value = "Passwords must match.";
        } else {
          repeatMsg.value = "";
        }
      }
    }
    function submitEmail() {
      const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      let validUsername = emailRegex.test(username.value);
      if (validUsername) {
        store
          .dispatch("resetPasswordEmail", {
            username: username.value,
          })
          .then((res) => {
            console.log(res);
            if (res.status == 400) {
              usernameMsg.value = `${res.data}`;
            } else {
              usernameMsg.value = `Email successfully sent!`;
            }
          })
          .catch((err) => console.log(err));
      } else {
        if (!validUsername) {
          usernameMsg.value = "Username must be in format user@example.com.";
        } else {
          usernameMsg.value = "";
        }
      }
    }
    return {
      password,
      passwordRepeat,
      submit,
      enterNew,
      username,
      passwordMsg,
      repeatMsg,
      usernameMsg,
      submitEmail,
      loggedIn,
    };
  },
};
</script>

<style scoped>
.login:hover {
  cursor: pointer;
}
button {
  @apply bg-sec hover:opacity-80 text-white font-bold py-2 px-4 rounded;
}
input {
  @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none;
}
</style>