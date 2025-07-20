<template>
  <v-app>
    <Navbar :cartCount="0" @logout="logout" @go-cart="goCart" />

    <v-container class="py-8">
      <h2 class="text-h5 mb-4">👤 Gestion des utilisateurs</h2>

      <v-alert v-if="users.length === 0" type="info">
        Aucun utilisateur enregistré.
      </v-alert>

      <v-table v-else>
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
                color="red"
                icon
                @click="deleteUser(user.id)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const users = ref([]);

const fetchUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:3000/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    users.value = data;
  } catch (err) {
    alert('Erreur chargement des utilisateurs');
  }
};

const deleteUser = async (id) => {
  const confirmDelete = confirm('Supprimer cet utilisateur ?');
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      users.value = users.value.filter((u) => u.id !== id);
    } else {
      alert('Erreur suppression');
    }
  } catch (err) {
    alert('Erreur réseau');
  }
};

const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};

const goCart = () => router.push('/cart');

onMounted(() => {
  fetchUsers();
});
</script>
