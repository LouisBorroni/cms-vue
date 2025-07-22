<template>
  <div class="min-h-screen bg-gray-50 w-full">
    <Navbar :cartCount="0" @logout="logout" @go-cart="goCart" />
    <main class="py-8 px-4 w-full max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold mb-8 text-primary-600 text-center">Administration des Utilisateurs</h2>
      <div v-if="error" class="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-lg shadow mb-6 text-center">
        {{ error }}
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white rounded-xl shadow-lg">
          <thead>
            <tr class="bg-gray-100">
              <th class="py-3 px-4 text-left font-semibold text-gray-700">ID</th>
              <th class="py-3 px-4 text-left font-semibold text-gray-700">Email</th>
              <th class="py-3 px-4 text-left font-semibold text-gray-700">Rôle</th>
              <th class="py-3 px-4 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-b last:border-b-0 hover:bg-gray-50">
              <td class="py-3 px-4">{{ user.id }}</td>
              <td class="py-3 px-4">{{ user.email }}</td>
              <td class="py-3 px-4">
                <span :class="user.role === 'admin' ? 'text-primary-600 font-bold' : 'text-gray-700'">{{ user.role }}</span>
              </td>
              <td class="py-3 px-4">
                <button
                  v-if="user.role !== 'admin'"
                  @click="deleteUser(user.id)"
                  class="text-red-500 hover:text-red-700 p-2 rounded-full transition"
                  title="Supprimer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="4" class="text-center py-6 text-gray-500">Aucun utilisateur enregistré.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Navbar from "../components/Navbar.vue";

const router = useRouter();
const users = ref([]);
const error = ref("");

const fetchUsers = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/admin/users", {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Erreur lors du chargement");

    const data = await res.json();
    users.value = data;
  } catch (err) {
    error.value = err.message;
  }
};

const deleteUser = async (id) => {
  if (!confirm("Supprimer cet utilisateur ?")) return;

  try {
    const res = await fetch(`http://localhost:3000/api/admin/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Erreur lors de la suppression");

    users.value = users.value.filter((u) => u.id !== id);
  } catch (err) {
    error.value = err.message;
  }
};

const logout = () => {
  router.push("/login");
};

const goCart = () => router.push("/cart");

onMounted(() => {
  fetchUsers();
});
</script>
