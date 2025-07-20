<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title
      @click="$router.push('/dashboard')"
      style="cursor: pointer"
    >
      Foodland
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn icon @click="$emit('go-cart')" title="Mon panier">
      <v-badge :content="cartCount" color="red" overlap>
        <v-icon>mdi-cart</v-icon>
      </v-badge>
    </v-btn>

    <v-btn icon @click="$router.push('/orders')" title="Mes commandes">
      <v-icon>mdi-package-variant-closed</v-icon>
    </v-btn>

    <v-btn
      v-if="isAdmin"
      icon
      @click="$router.push('/admin/users')"
      title="Administration"
    >
      <v-icon>mdi-shield-account</v-icon>
    </v-btn>

    <v-btn
      v-if="isAdmin"
      icon
      @click="$router.push('/admin/articles')"
      title="Gestion des articles"
    >
      <v-icon>mdi-pencil-box-multiple</v-icon>
    </v-btn>

    <v-btn text @click="$emit('logout')">Déconnexion</v-btn>
  </v-app-bar>
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
