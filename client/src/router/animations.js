import store from '../store/store.js';
function addOddAnimation(entries, observer) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            if (store.state.isRootVisible) {
                entry.target.classList.add("animate-fade-in-x-left");
            }
        }
    });
}
function addEvenAnimation(entries, observer) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            if (store.state.isRootVisible) {
                entry.target.classList.add("animate-fade-in-x-right");
            }
        }
    });
}
function addAnimations() {
    let observer1 = new IntersectionObserver(addOddAnimation, options);
    document.querySelectorAll('.odd').forEach(el => {
        observer1.observe(el)
    });
    let observer2 = new IntersectionObserver(addEvenAnimation, options);
    document.querySelectorAll('.even').forEach(el => {
        observer2.observe(el)
    });
}
//zafade-a parent element in po 0.1s aniamciji se izvedejo še druge animacije
function addDelayAnimation(entries, observer) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.addEventListener("animationend", () => {
                store.commit("SET_IS_ROOT_VISIBLE", true);
                addAnimations();
            });
            entry.target.classList.add("animate-fade-in-short");
        }
    });
}
let options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
};
function addDelayObserver() {
    setTimeout(() => {
        if (document.querySelectorAll('.delay')[0]) {
            let observer = new IntersectionObserver(addDelayAnimation, options);
            observer.observe(document.querySelectorAll('.delay')[0])
        }
    }, 0);
}
export { addDelayObserver };