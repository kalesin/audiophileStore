<template>
  <div class="flex flex-col md:w-3/5 w-4/5 mx-auto xl:pt-20 md:pt-12 pt-8">
    <div v-if="loggedIn" class="w-full">
      <div class="font-bold productPriText mb-8">
        My shipping details
      </div>
      <form class="mb-8" v-for="(item, index) in savedAddresses" :key="index">
        <div class="productSecText mb-8 text-sec">Address {{ index + 1 }}:</div>
        <div class="flex w-full">
          <div class="flex flex-col mb-4 mr-4 w-1/2">
            <label
              class="labelAddress"
              for="phone"
            >
              Phone
            </label>
            <input
              v-if="editing == index"
              v-model="phone"
              id="phone"
              type="tel"
              placeholder="+38630123456"
              :class="{ 'border-red-500 border-2': message.phone }"
            />
            <div v-else class="textAddress">
              {{ savedAddresses[index].phone }}
            </div>
            <p
              v-if="message.phone && editing == index"
              class="text-red-500 text-xs italic"
            >
              {{ message.phone }}
            </p>
          </div>
          <div class="flex flex-col mb-4 w-1/2">
            <label
              class="labelAddress"
              for="name"
            >
              Name
            </label>
            <input
              v-if="editing == index"
              v-model="name"
              id="name"
              type="text"
              placeholder="John Doe"
              :class="{ 'border-red-500 border-2': message.name }"
            />
            <div v-else class="textAddress">
              {{ savedAddresses[index].name }}
            </div>
            <p
              v-if="message.name && editing == index"
              class="text-red-500 text-xs italic"
            >
              {{ message.name }}
            </p>
          </div>
        </div>
        <div class="flex w-full">
          <div class="flex flex-col mb-4 mr-4 w-1/2">
            <label
              class="labelAddress"
              for="address"
            >
              Address
            </label>
            <input
              v-if="editing == index"
              v-model="address"
              id="address"
              type="text"
              placeholder="Bourbon Street 15h"
              :class="{ 'border-red-500 border-2': message.address }"
            />
            <div v-else class="textAddress">
              {{ savedAddresses[index].address }}
            </div>
            <p
              v-if="message.address && editing == index"
              class="text-red-500 text-xs italic"
            >
              {{ message.address }}
            </p>
          </div>
          <div class="flex flex-col mb-4 w-1/2">
            <label class="labelAddress" for="zip">
              Zip code
            </label>
            <input
              v-if="editing == index"
              v-model="zip"
              id="zip"
              type="text"
              placeholder="1234"
              :class="{ 'border-red-500 border-2': message.zip }"
            />
            <div v-else class="textAddress">
              {{ savedAddresses[index].zip }}
            </div>
            <p
              v-if="message.zip && editing == index"
              class="text-red-500 text-xs italic"
            >
              {{ message.zip }}
            </p>
          </div>
        </div>
        <div class="flex w-full">
          <div class="flex flex-col mb-4 mr-4 w-1/2">
            <label
              class="labelAddress"
              for="city"
            >
              City
            </label>
            <input
              v-if="editing == index"
              v-model="city"
              id="city"
              type="text"
              placeholder="Phoenix"
              :class="{ 'border-red-500 border-2': message.city }"
            />
            <div v-else class="textAddress">
              {{ savedAddresses[index].city }}
            </div>
            <p
              v-if="message.city && editing == index"
              class="text-red-500 text-xs italic"
            >
              {{ message.city }}
            </p>
          </div>
          <div class="flex flex-col mb-4 w-1/2">
            <label
              class="labelAddress"
              for="country"
            >
              Country
            </label>
            <input
              v-if="editing == index"
              v-model="country"
              id="country"
              type="text"
              placeholder="United States"
              :class="{ 'border-red-500 border-2': message.country }"
            />
            <div v-else class="textAddress">
              {{ savedAddresses[index].country }}
            </div>
            <p
              v-if="message.country && editing == index"
              class="text-red-500 text-xs italic"
            >
              {{ message.country }}
            </p>
          </div>
        </div>
        <div class="w-full flex mt-4" v-if="editing == index">
          <div class="mr-4">
            <button @click="save(index)" type="button" class="modalButton">
              Save
            </button>
          </div>
          <div class="mr-4">
            <button @click="cancel(index)" type="button" class="modalButton">
              Cancel
            </button>
          </div>
          <div>
            <button @click="remove(index)" type="button" class="modalButton">
              Delete
            </button>
          </div>
        </div>

        <div v-else>
          <div class="centerButtons">
            <button @click="edit(index)" type="button" class="modalButton">
              Edit
            </button>
          </div>
        </div>
      </form>
      <div class="centerButtons">
        <button @click="addNewAddress()" type="button" class="modalButton">
          Add new address
        </button>
      </div>
    </div>

    <div v-if="!loggedIn" class="font-bold text-lg text-center">
      You have to be logged in to view this page!
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, ref, onMounted, watch, nextTick } from "vue";

export default {
  setup(context) {
    const store = useStore();
    let user = computed(() => store.state.user);
    let loggedIn = computed(() => store.getters.loggedIn);
    let savedAddresses = computed(() => store.state.addresses);

    let name = ref("");
    let phone = ref("");
    let address = ref("");
    let zip = ref("");
    let city = ref("");
    let country = ref("");

    let message = ref({
      name: "",
      phone: "",
      address: "",
      zip: "",
      city: "",
      country: "",
    });

    let editing = ref(-1);

    store.commit("SET_PAGE", -1);
    onMounted(() => {
      let v = JSON.parse(localStorage.getItem("addresses"));
      console.log(v);
      if (v) {
        store.commit("SET_ADDRESS", v._value);
      }
    });
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
      } else {
      }
    }
    function save(index) {
      let addObject = {
        name: name.value,
        phone: phone.value,
        address: address.value,
        zip: zip.value,
        city: city.value,
        country: country.value,
      };

      for (let key in addObject) {
        if (addObject[key] == "") {
          console.log("key", message.value[key]);
          message.value[key] = `${key} can't be empty!`;
        } else {
          message.value[key] = "";
        }
      }
      if (!Object.values(addObject).includes("")) {
        store.commit("EDIT_ADDRESS_ENTRY", { index, value: addObject });
        localStorage.setItem("addresses", JSON.stringify(savedAddresses));
        editing.value = -1;
      }
    }
    function edit(index) {
      editing.value = index;
      let editedAddress = savedAddresses.value[index];
      console.log(editedAddress);

      name.value = editedAddress.name;
      phone.value = editedAddress.phone;
      address.value = editedAddress.address;
      zip.value = editedAddress.zip;
      city.value = editedAddress.city;
      country.value = editedAddress.country;
      //reset message
      for (let key in message.value) {
        message.value[key] = ``;
      }
    }
    function cancel(index) {
      if (!Object.values(savedAddresses.value[index]).includes("")) {
        editing.value = -1;
      } else {
        editing.value = -1;
        store.commit("DELETE_ADDRESS_ENTRY", index);
      }
    }
    function remove(index) {
      store.commit("DELETE_ADDRESS_ENTRY", index);
      editing.value = -1;
    }
    function addNewAddress() {
      let index = savedAddresses.value.length;
      let addObject = { name, phone, address, zip, city, country };
      for (let key in addObject) {
        key = "";
      }
      store.commit("ADD_ADDRESS", addObject);
      editing.value = index;
      nextTick(() => document.getElementById("phone").focus());
    }
    return {
      loggedIn,
      name,
      phone,
      address,
      city,
      zip,
      country,
      save,
      savedAddresses,
      edit,
      editing,
      addNewAddress,
      cancel,
      remove,
      message,
    };
  },
  data() {
    return {};
  },
  components: {},
};
</script>

<style scoped>
p:first-letter {
  text-transform: capitalize;
}
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
  @apply bg-sec hover:opacity-80 text-white font-bold py-2 px-4 rounded;
}
.centerButtons {
  @apply w-full flex mt-4 md:justify-start justify-center;
}
input {
  @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none;
}
.textAddress {
  @apply flex items-center font-bold lg:text-lg md:text-base text-sm;
}
.labelAddress {
  @apply font-bold md:mb-4 mb-2 text-gray-400 lg:text-lg md:text-base text-sm;
}
</style>