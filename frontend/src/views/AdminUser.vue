<template>
  <v-app>
    <Navbar :cartCount="0" @logout="logout" @go-cart="goCart" />

    <v-main class="pa-6">
      <v-container>
        <h2 class="my-6 text-center">Administration des Utilisateurs</h2>

        <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>

        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <v-btn
                  v-if="user.role !== 'admin'"
                  icon
                  color="red"
                  @click="deleteUser(user.id)"
                  title="Supprimer"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="4" class="text-center">
                Aucun utilisateur enregistré.
              </td>
            </tr>
          </tbody>
        </table>
      </v-container>
    </v-main>
  </v-app>
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
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
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
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3000/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Erreur lors de la suppression");

    users.value = users.value.filter((u) => u.id !== id);
  } catch (err) {
    error.value = err.message;
  }
};

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};

const goCart = () => router.push("/cart");

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th,
.admin-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.admin-table th {
  background-color: #f5f5f5;
  font-weight: bold;
  font-size: 16px;
}

.admin-table tr:hover {
  background-color: #f1f1f1;
}

.text-center {
  text-align: center;
}
</style>
