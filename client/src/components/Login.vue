<template>
  <div
    v-if="!loggedIn"
    class="
      flex
      items-center
      mr-8
      login
      xl:w-96
      lg:w-72
      md:w-48
      sm:w-32
      w-20
      flex-col
    "
    @click="setModal()"
  >
    <img class="w-8 mb-2" src="/src/assets/login.png" />
    <div class="font-bold hidden lg:flex">Login</div>
  </div>
  <div
    v-else
    class="flex items-center sm:mr-8 mr-2 login flex-col xl:w-60 sm:w-24 w-20"
    @click="setModal()"
  >
    <img class="w-8 mb-2" src="/src/assets/login_positive.png" />
    <div class="font-bold md:text-base text-xs">My Account</div>
  </div>

  <teleport to="body">
    <div v-if="modalOpen" class="modal">
      <form v-if="!loggedIn" class="modalContainer">
        <div v-if="registerActive" class="font-bold text-lg mb-4">Register</div>
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
            :class="{ 'border-red-500 border-2': usernameMsg }"
          />
          <p v-if="usernameMsg" class="text-red-500 text-xs italic">
            {{ usernameMsg }}
          </p>
        </div>
        <div class="flex flex-col mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="password"
          >
            Password
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
        <div class="flex flex-col mb-4" v-if="registerActive">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="password"
          >
            Repeat Password
          </label>
          <input
            v-model="passwordRepeat"
            id="password"
            type="password"
            placeholder="******************"
            :class="{ 'border-red-500 border-2': repeatMsg }"
          />
          <p v-if="repeatMsg" class="text-red-500 text-xs italic">
            {{ repeatMsg }}
          </p>
        </div>
        <div class="w-full" v-if="!registerActive">
          <div class="flex items-center justify-between w-full mb-4">
            <button type="button" @click="login">Sign In</button>
            <router-link :to="`/reset`" @click="openAddress">
              <div
                class="
                  inline-block
                  align-baseline
                  font-bold
                  text-sm text-sec
                  hover:opacity-80
                "
              >
                Forgot Password?
              </div></router-link
            >
          </div>
          <div class="flex justify-center">
            <button @click="register" type="button">Create Account</button>
          </div>
        </div>
        <div class="w-full" v-else>
          <div class="flex justify-center">
            <button @click="submit" type="button">Submit</button>
          </div>
        </div>
      </form>
      <div v-else class="modalContainer">
        <div class="font-bold mb-4">{{ user }}</div>
        <router-link :to="`/address`" @click="openAddress">
          <button class="button mb-4">
            Manage your addresses
          </button></router-link
        >
        <div v-if="success">
          <p
            v-if="repeatMsg"
            class="text-red-500 text-xs italic py-6"
            :class="{ 'text-xl': success }"
          >
            {{ repeatMsg }}
          </p>
        </div>
        <div v-if="!changePassOpen" class="flex justify-center mb-4">
          <button @click="openChangePass(true)" type="button">
            Change password
          </button>
        </div>
        <form v-else class="modalContainer">
          <div class="flex flex-col md:mb-4 mb-2">
            <label
              class="block text-gray-700 text-sm font-bold md:mb-2 mb-1"
              for="password"
            >
              Old Password
            </label>
            <input
              v-model="oldPassword"
              id="oldPassword"
              type="password"
              placeholder="******************"
              :class="{ 'border-red-500 border-2': oldPasswordMsg }"
            />
            <p v-if="oldPasswordMsg" class="text-red-500 text-xs italic">
              {{ oldPasswordMsg }}
            </p>
          </div>
          <div class="flex flex-col md:mb-4 mb-2">
            <label
              class="block text-gray-700 text-sm font-bold md:mb-2 mb-1"
              for="password"
            >
              New Password
            </label>
            <input
              v-model="password"
              id="newPassword"
              type="password"
              placeholder="******************"
              :class="{ 'border-red-500 border-2': passwordMsg }"
            />
            <p v-if="passwordMsg" class="text-red-500 text-xs italic">
              {{ passwordMsg }}
            </p>
          </div>
          <div class="flex flex-col md:mb-4 mb-2">
            <label
              class="block text-gray-700 text-sm font-bold md:mb-2 mb-1"
              for="password"
            >
              Repeat New Password
            </label>
            <input
              v-model="passwordRepeat"
              id="newPasswordRepeat"
              type="password"
              placeholder="******************"
              :class="{ 'border-red-500 border-2': repeatMsg }"
            />
            <p v-if="repeatMsg" class="text-red-500 text-xs italic">
              {{ repeatMsg }}
            </p>
          </div>
          <div class="w-full flex justify-between">
            <div class="flex justify-center mr-4">
              <button @click="submitChangePass" type="button">
                Change password
              </button>
            </div>
            <div class="flex justify-center">
              <button @click="openChangePass(false)" type="button">
                Cancel
              </button>
            </div>
          </div>
        </form>
        <div class="flex justify-center">
          <button @click="logout" type="button">Logout</button>
        </div>
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
    let changePassOpen = ref(false);
    let registerActive = ref(false);
    const store = useStore();
    let loggedIn = computed(() => store.getters.loggedIn);
    let user = computed(() => store.state.user);
    let username = ref("");
    let password = ref("");
    let passwordRepeat = ref("");
    let oldPassword = ref("");

    let usernameMsg = ref("");
    let oldPasswordMsg = ref("");
    let passwordMsg = ref("");
    let repeatMsg = ref("");
    let success = ref(false);

    onMounted(() => {
      let v = JSON.parse(localStorage.getItem("user"));
      if (v) {
        store
          .dispatch("checkToken", {
            token: v.token,
          })
          .then((res) => {
            if (res) {
              store.commit("SET_USER", res.username);
            }
          })
          .catch((err) => console.log(err));
      }
    });
    function openAddress() {
      store.commit("SET_PAGE", -1);
      deactivateModal();
    }
    function openChangePass(value) {
      changePassOpen.value = value;
    }
    function login() {
      store
        .dispatch("loginUser", {
          username: username.value,
          password: password.value,
        })
        .then((res) => {
          console.log(res);
          if (res.status == 400) {
            passwordMsg.value = `${res.data}`;
          } else {
            console.log('aaaaaaaa')
            deactivateModal();
            username.value = "";
            password.value = "";
          }
        })
        .catch((err) => console.log(err));
    }
    function logout() {
      let v = JSON.parse(localStorage.getItem("user"));
      store.dispatch("logoutUser", {
        token: v.token
      });
      deactivateModal();
    }
    function submit() {
      const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      //8 characters, 1 upper, 1 number
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      let validUsername = emailRegex.test(username.value);
      let validPassword = passwordRegex.test(password.value);
      let passwordsMatch = password.value === passwordRepeat.value;
      let validInput = validUsername && validPassword && passwordsMatch;
      if (validInput) {
        store
          .dispatch("registerUser", {
            username: username.value,
            password: password.value,
          })
          .then((res) => {
            console.log(res);
            if (res.status == 400) {
              repeatMsg.value = `${res.data}`;
            } else {
              store.dispatch("loginUser", {
                username: username.value,
                password: password.value,
              });
              deactivateModal();
            }
          })
          .catch((err) => console.log(err));
      } else {
        if (!validUsername) {
          usernameMsg.value = "Username must be in format user@example.com.";
        } else {
          usernameMsg.value = "";
        }
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
    function submitChangePass() {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      let validOldPassword = passwordRegex.test(oldPassword.value);
      let validPassword = passwordRegex.test(password.value);
      let passwordsMatch = password.value === passwordRepeat.value;
      let validInput = validOldPassword && validPassword && passwordsMatch;
      let v = JSON.parse(localStorage.getItem("user"));
      if (validInput) {
        store
          .dispatch("changePassword", {
            token: v.token,
            password: password.value,
            oldpassword: oldPassword.value,
          })
          .then((res) => {
            console.log(res);
            if (res.status == 400) {
              repeatMsg.value = `${res.data}`;
            } else {
              changePassOpen.value = false;
              success.value = true;
              repeatMsg.value = `Password successfully changed!`;
              setTimeout(() => {
                success.value = false;
              }, 3000);
            }
          })
          .catch((err) => console.log(err));
      } else {
        if (!validOldPassword) {
          oldPasswordMsg.value =
            "Must contain 1 number and 1 uppercase. Length > 8.";
        } else {
          oldPasswordMsg.value = "";
        }
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
    function register() {
      registerActive.value = true;
    }
    function setModal() {
      modalOpen.value = true;
      document.body.classList.add("modal-open");
      setTimeout(() => {
        window.addEventListener("mousedown", onClickOutside);
      }, 0);
    }
    function deactivateModal(){
      modalOpen.value = false;
      document.body.classList.remove("modal-open");
    }
    function onClickOutside(e) {
      let parentNode = document.getElementsByClassName("modalContainer");
      if (
        parentNode.length &&
        !parentNode[parentNode.length - 1].contains(e.target)
      ) {
        deactivateModal();
        registerActive.value = false;
        usernameMsg.value = "";
        passwordMsg.value = "";
        repeatMsg.value = "";
        window.removeEventListener("mousedown", onClickOutside);
      }
    }
    return {
      setModal,
      modalOpen,
      username,
      password,
      oldPassword,
      passwordRepeat,
      register,
      registerActive,
      submit,
      login,
      loggedIn,
      usernameMsg,
      oldPasswordMsg,
      passwordMsg,
      repeatMsg,
      user,
      logout,
      openChangePass,
      openAddress,
      changePassOpen,
      submitChangePass,
      success,
    };
  },
  data() {
    return {};
  },
  components: {},
};
</script>

<style scoped>
.login:hover {
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
button {
  @apply bg-sec hover:opacity-80 text-white font-bold py-2 md:px-4 px-2 rounded lg:text-base text-sm;
}
input {
  @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none;
}
.modal {
  @apply absolute inset-0 w-full h-full flex justify-end items-start z-20 pt-32 xl:pr-60 lg:pr-40 md:pr-24 sm:pr-16 px-4;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal .modalContainer {
  @apply flex flex-col items-center bg-white xl:p-8 md:p-6 p-3 rounded-lg;
}
input {
  @apply focus:ring-sec focus:ring-opacity-0;
}
</style>