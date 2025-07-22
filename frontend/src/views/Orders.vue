<template>
  <div class="min-h-screen bg-gray-50 w-full">
    <Navbar :cartCount="0" @logout="logout" @go-cart="goCart" />
    <main class="py-8 px-4 w-full max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold mb-8 text-primary-600 text-center flex items-center justify-center">
        📦 Historique des commandes
      </h2>

      <div
        v-if="orders.length === 0"
        class="bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-6 rounded-lg shadow mb-8 text-center"
      >
        Aucune commande trouvée.
      </div>

      <div v-else class="space-y-8">
        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-white rounded-xl shadow p-6"
        >
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
            <div class="text-lg font-bold text-primary-600">
              Commande #{{ order.id }}
            </div>
            <div class="text-gray-500">
              {{ new Date(order.created_at).toLocaleString() }}
            </div>
          </div>

          <div class="divide-y divide-gray-200">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="flex items-center gap-4">
                <img
                  :src="item.image_url || 'https://via.placeholder.com/80'"
                  class="w-16 h-16 object-cover rounded-lg border"
                />
                <div>
                  <div class="font-semibold text-gray-800">{{ item.name }}</div>
                  <div class="text-gray-500 text-sm">x{{ item.quantity }}</div>
                </div>
              </div>
              <div class="mt-2 sm:mt-0 text-primary-600 font-bold">
                {{ formatPrice(item.price * item.quantity) }} €
              </div>
            </div>
          </div>

          <div class="text-right font-bold text-lg text-primary-600 mt-4">
            Total : {{ formatPrice(order.total) }} €
          </div>

          <button
            @click="generateInvoicePDFHandler(order)"
            class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition"
          >
            Télécharger la facture PDF
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import { generateInvoicePDF } from "../tools/generateInvoice";
import { useRouter } from "vue-router";

interface User {
  email: string;
  role?: string;
}

const router = useRouter();
const orders = ref<any[]>([]);
const user = ref<User | null>(null);

// 🔐 Récupération des commandes (protégée)
const fetchOrders = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/orders", {
      credentials: "include", // <- Important pour cookie httpOnly
    });

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    const data = await res.json();

    orders.value = data.map((order: any) => ({
      ...order,
      items: typeof order.items === "string" ? JSON.parse(order.items) : order.items,
    }));
  } catch (err: any) {
    alert("Erreur de chargement des commandes : " + err.message);
    console.error(err);
  }
};

const fetchUser = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/users/me", {
      credentials: "include",
    });

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    user.value = await res.json();
  } catch (err: any) {
    alert("Erreur réseau : " + err.message);
    console.error(err);
  }
};

const formatPrice = (price: number | string) => Number(price).toFixed(2);

const logout = async () => {
  try {
    await fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Erreur logout:", err);
  }
  router.push("/login");
};

const goCart = () => {
  router.push("/cart");
};

const generateInvoicePDFHandler = (order: any) => {
  generateInvoicePDF(order, user.value);
};

onMounted(() => {
  fetchUser(); 
  fetchOrders();
});
</script>
