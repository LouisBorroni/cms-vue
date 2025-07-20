<template>
  <v-app>
    <Navbar :cartCount="0" @logout="logout" @go-cart="goCart" />
    <v-main class="pa-6">
            <v-container fluid>
      <h2 class="text-center my-8">📦 Historique des commandes</h2>

      <v-alert
        v-if="orders.length === 0"
        type="info"
        class="mb-8"
        border="left"
        colored-border
        elevation="2"
      >
        Aucune commande trouvée.
      </v-alert>

      <v-list v-if="orders.length > 0" class="elevation-2 rounded-lg">
        <v-list-item
          v-for="order in orders"
          :key="order.id"
          class="pa-4 flex-column"
        >
          <div class="mb-3 font-weight-bold">
            Commande #{{ order.id }} — 
            {{ new Date(order.created_at).toLocaleString() }}
          </div>

          <v-list dense>
            <v-list-item
              v-for="item in order.items"
              :key="item.id"
              class="py-1"
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.quantity }} × {{ formatPrice(item.price) }} € =
                  {{ formatPrice(item.price * item.quantity) }} €
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <div class="text-right font-weight-bold mt-4">
            Total : {{ formatPrice(order.total) }} €
          </div>

          <v-divider class="my-4"></v-divider>
        </v-list-item>
      </v-list>
    </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const orders = ref([]);

const fetchOrders = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const res = await fetch("http://localhost:3000/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      alert("Erreur lors du chargement des commandes");
      return;
    }

    const data = await res.json();

    orders.value = data.map((order) => ({
      ...order,
      items:
        typeof order.items === "string"
          ? JSON.parse(order.items)
          : order.items,
    }));
  } catch (err) {
    alert("Erreur de chargement des commandes : " + err.message);
    console.error(err);
  }
};

const formatPrice = (price) => Number(price).toFixed(2);

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};

const goCart = () => {
  router.push("/cart");
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.v-list-item {
  border-bottom: 1px solid #eee;
}
.v-list-item:last-child {
  border-bottom: none;
}
</style>
