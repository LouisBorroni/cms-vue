<template>
  <div class="min-h-screen bg-gray-50 w-full">
    <Navbar :cartCount="cart.length" @logout="logout" @go-cart="goCart" />
    <main class="py-8 px-4 w-full">
      <h1 class="text-3xl font-bold mb-8 text-primary-600">Menu</h1>
      <div class="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
        <div v-for="article in articles" :key="article.id" class="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col w-full">
          <img :src="article.image_url || 'https://via.placeholder.com/400x200'" alt="Image" class="w-full h-48 object-cover" />
          <div class="p-5 flex-1 flex flex-col">
            <div class="flex justify-between items-center mb-2">
              <h2 class="text-xl font-semibold text-gray-800">{{ article.name }}</h2>
              <span class="text-lg font-bold text-primary-600">{{ formatPrice(article.price) }} €</span>
            </div>
            <p class="text-gray-600 mb-4 flex-1">{{ article.description }}</p>
            <button @click="addToCart(article)" class="mt-auto w-full py-2 px-4 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition">Ajouter au panier</button>
          </div>
        </div>
      </div>
      <!-- Snackbar/Notification -->
      <transition name="fade">
        <div v-if="snackbar" class="fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-50">
          <span class="mr-4">{{ snackbarMessage }}</span>
          <button @click="snackbar = false" class="focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import { useRouter } from "vue-router";

const articles = ref([]);
const cart = ref([]);
const snackbar = ref(false);
const snackbarMessage = ref("");
const router = useRouter();

const fetchArticles = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/articles");
    articles.value = await res.json();
  } catch (e) {
    console.error(e);
  }
};

const saveCartToLocalStorage = () => {
  localStorage.setItem("cart", JSON.stringify(cart.value));
};

const loadCartFromLocalStorage = () => {
  const stored = localStorage.getItem("cart");
  if (stored) {
    try {
      cart.value = JSON.parse(stored);
    } catch {
      cart.value = [];
    }
  }
};

const addToCart = (article) => {
  if (!cart.value.some((item) => item.id === article.id)) {
    cart.value.push(article);
    saveCartToLocalStorage();
    snackbarMessage.value = `"${article.name}" ajouté au panier`;
    snackbar.value = true;
    setTimeout(() => snackbar.value = false, 2000);
  } else {
    snackbarMessage.value = `"${article.name}" est déjà dans le panier`;
    snackbar.value = true;
    setTimeout(() => snackbar.value = false, 2000);
  }
};

const formatPrice = (price) => Number(price).toFixed(2);

const logout = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      router.push("/login");
    } else {
      alert("Erreur lors de la déconnexion");
    }
  } catch {
    alert("Erreur réseau");
  }
};

const goCart = () => {
  router.push("/cart");
};

const checkAuth = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/auth/me", {
      credentials: "include",
    });
    if (res.status === 401) {
      router.push("/login");
    }
  } catch {
    console.log(err)
  }
};

onMounted(() => {
  fetchArticles();
  loadCartFromLocalStorage();
  checkAuth();
});
</script>

<style scoped>
.text-primary-600 {
  color: #16a34a;
}
.bg-primary-600 {
  background-color: #16a34a;
}
.hover\:bg-primary-700:hover {
  background-color: #15803d;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
