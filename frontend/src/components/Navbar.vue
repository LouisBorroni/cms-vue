<template>
  <nav class="w-full bg-white shadow-md sticky top-0 z-50">
    <div class="w-full px-4 sm:px-8 lg:px-12">
      <div class="flex justify-between h-16 items-center w-full">
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center cursor-pointer" @click="$router.push('/dashboard')">
          <span class="text-2xl font-bold text-primary-600 tracking-tight">Foodland</span>
        </div>
        <!-- Menu -->
        <div class="flex items-center space-x-2">
          <!-- Panier -->
          <button @click="$emit('go-cart')" title="Mon panier" class="relative p-2 rounded-full hover:bg-gray-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.5 17h9a1 1 0 00.85-1.53L17 13M7 13V6a1 1 0 011-1h5a1 1 0 011 1v7" />
            </svg>
            <span v-if="cartCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">{{ cartCount }}</span>
          </button>
          <!-- Commandes -->
          <button @click="$router.push('/orders')" title="Mes commandes" class="p-2 rounded-full hover:bg-gray-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4" />
            </svg>
          </button>
          <!-- Admin -->
          <button v-if="isAdmin" @click="$router.push('/admin/users')" title="Administration" class="p-2 rounded-full hover:bg-gray-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button v-if="isAdmin" @click="$router.push('/admin/articles')" title="Gestion des articles" class="p-2 rounded-full hover:bg-gray-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20h9" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.5 3.5a2.121 2.121 0 113 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
            </svg>
          </button>
          <!-- Déconnexion -->
          <button @click="$emit('logout')" class="ml-4 px-4 py-2 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition">Déconnexion</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";

defineProps({
  cartCount: {
    type: Number,
    default: 0,
  },
});

const isAdmin = ref(false);

onMounted(() => {
  const role = localStorage.getItem("role");
  isAdmin.value = role === "admin";
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
</style>
