import { createStore } from 'vuex'
import axios from 'redaxios';

const herokuUrl = "https://stormy-tundra-28859.herokuapp.com/";

const store = createStore({
    state: {
        user: null,
        cart: [],
        page: 0,
        product: 0,
        addresses: [{}],
        isRootVisible: false,
        order: {}
    },
    getters: {
        cartItems(state) {
            const { amounts } = { amounts: state.cart.map(a => a.amount) };
            return amounts.length != 0 ? amounts.reduce((x, y) => x + y) : 0;
        },
        totalPrice(state) {
            const { prices } = { prices: state.cart.map(a => Math.round(a.price * a.amount)) };
            return prices.length != 0 ? prices.reduce((x, y) => x + y) : 0;
        },
        loggedIn(state) {
            return !!state.user;
        },
        cartOrderAmounts(state) {
            let newCart = []
            for (let i = 0; i < state.cart.length; i++) {
                const object = state.cart[i]
                //destructure into object with just names and amounts
                let newObject = (({ name, amount }) => ({ name, amount }))(object);
                //merge both keys into one
                let newItem = {}
                newItem[newObject.name] = newObject.amount;
                newCart.push(newItem)
            }
            return newCart;
        }
    },
    mutations: {
        SET_USER(state, value) {
            state.user = value;
        },
        SET_IS_ROOT_VISIBLE(state, value) {
            state.isRootVisible = value;
        },
        SET_PAGE(state, value) {
            state.page = value;
        },
        SET_PRODUCT(state, value) {
            state.product = value;
        },
        SET_CART(state, value) {
            state.cart = value;
        },
        SET_CART_ITEM(state, value) {
            state.cart.push(value);
        },
        INCREMENT_CART_AMOUNT(state, { value, index }) {
            state.cart[index].amount += value;
        },
        DELETE_CART_ENTRY(state, index) {
            state.cart.splice(index, 1);
        },
        DELETE_CART(state) {
            state.cart.splice(0, state.cart.length);
        },
        SET_ADDRESS(state, value) {
            state.addresses = value;
        },
        ADD_ADDRESS(state, value) {
            state.addresses.push(value);
        },
        DELETE_ADDRESS_ENTRY(state, index) {
            state.addresses.splice(index, 1);
        },
        EDIT_ADDRESS_ENTRY(state, { index, value }) {
            state.addresses.splice(index, 1, value);
        }
    },
    actions: {
        setCartItem({ state, commit }, value) {
            //destructure array of objects in cart to array of names of objects
            const { names } = { names: state.cart.map(a => a.name) };
            let index = names.indexOf(value.name);
            if (index != -1) {
                state.cart[index].amount += value.amount;
            } else {
                commit('SET_CART_ITEM', value)
            }
        },
        changeCartAmount({ state, commit }, { value, index }) {
            commit('INCREMENT_CART_AMOUNT', { value: value, index })
        },
        async registerUser({ state, commit }, { username, password }) {
            let address = `${herokuUrl}register`
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                }
            }
            let data = {
                "username": username,
                "password": password
            }
            return axios.post(address, data, config)
                .then(res => {
                    return res;
                })
                .catch(error => { return error })
        },
        async loginUser({ state, commit }, { username, password }) {
            let address = `${herokuUrl}login`
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                }
            }
            let data = {
                "username": username,
                "password": password
            }
            return axios.post(address, data, config).then(res => {
                if (typeof res === 'object') {
                    commit('SET_USER', res.data.username)
                    localStorage.setItem('user', JSON.stringify(res.data))
                }
                return res;
            }).catch(error => { return error })
        },
        async logoutUser({ state, commit }, { token }) {
            let address = `${herokuUrl}logout`
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                }
            }
            let data = {
                "token": token
            }
            return axios.post(address, data, config)
                .then(res => {
                    if (res) {
                        commit('SET_USER', null)
                        localStorage.removeItem('user')
                    }
                })
                .catch(error => { return error })
        },
        async changePassword({ state, commit }, { token, password, oldpassword }) {
            let address = `${herokuUrl}changepassword`
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                }
            }
            let data = {
                "token": token,
                "oldpassword": oldpassword,
                "password": password
            }
            return axios.post(address, data, config)
                .then(res => {
                    return res;
                })
                .catch(error => { return error })
        },
        async resetPasswordEmail({ state, commit }, { username }) {
            let address = `${herokuUrl}email`
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                }
            }
            let data = {
                "username": username
            }
            return axios.post(address, data, config)
                .then(res => {
                    return res;
                })
                .catch(error => { return error })
        },
        async resetPassword({ state, commit }, { token, password }) {
            let address = `${herokuUrl}resetpassword`
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                }
            }
            let data = {
                "token": token,
                "password": password
            }
            return axios.post(address, data, config)
                .then(res => {
                    return res;
                })
                .catch(error => { return error })
        },
        async checkToken({ state, commit }, { token }) {
            let address = `${herokuUrl}token?token=${token}`
            return axios({
                method: 'get',
                url: address
            }).then(res => {
                return res.data
            }).catch(error => console.log(error.data))
        },
        async stripeGetClientSecret({ state, commit }, { token, cart }) {
            let address = `${herokuUrl}secret?token=${token}&cart=${cart}`
            return axios({
                method: 'get',
                url: address
            }).then(res => {
                return res.data
            }).catch(error => console.log(error.data))
        },
        async createOrder({ state, getters, commit }, { total, billing, shipping, username }) {
            let address = `${herokuUrl}order`
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                }
            }
            let data = {
                "order_total": total,
                "shipping_address": state.addresses[shipping],
                "items": getters.cartOrderAmounts,
                "username": username
            }
            if (billing != shipping) {
                data.billing_address = state.addresses[billing]
            }
            return axios.post(address, data, config)
                .then(res => {
                    commit('SET_ORDER_ID', res)
                    return res.data;
                })
                .catch(error => { return error })
        },
        async sendOrderEmail({ state, commit }, { order_id }) {
            let address = `${herokuUrl}orderemail`
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                }
            }
            let data = {
                "order_id": order_id
            }
            return axios.post(address, data, config)
                .then(res => {
                    return res;
                })
                .catch(error => { return error })
        },
    }
})

export default store;