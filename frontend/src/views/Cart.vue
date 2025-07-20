<template>
  <v-app>
    <Navbar :cartCount="cart.length" @logout="logout" @go-cart="goCart" />

    <v-container fluid>
      <v-row justify="center" class="mt-10">
        <v-col cols="12" md="8">
          <h2 class="text-center mb-8">🛒 Mon Panier</h2>

          <v-alert
            v-if="cart.length === 0"
            type="info"
            class="mb-8"
            border="left"
            colored-border
            elevation="2"
          >
            Votre panier est vide.
          </v-alert>

          <v-list two-line v-if="cart.length > 0" class="elevation-2 rounded-lg">
            <v-list-item
              v-for="(item, index) in cart"
              :key="item.id"
              class="pa-4"
            >
              <v-list-item-avatar size="100">
                <v-img :src="item.image_url || 'https://via.placeholder.com/150'" />
              </v-list-item-avatar>

              <v-list-item-content class="ml-4">
                <v-list-item-title class="text-h6 font-weight-medium">{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle class="mb-3 grey--text">
                  {{ formatPrice(item.price) }} €
                </v-list-item-subtitle>

                <v-text-field
                  v-model.number="item.quantity"
                  type="number"
                  min="1"
                  label="Quantité"
                  dense
                  outlined
                  style="max-width: 100px"
                  @change="saveCart"
                />
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon color="red" @click="removeItem(index)" title="Supprimer">
                  <v-icon size="28">mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>

          <v-card
            v-if="cart.length > 0"
            class="mt-8 pa-4"
            outlined
            elevation="2"
          >
            <v-row align="center" justify="space-between">
              <v-col cols="12" sm="6" class="text-h5 font-weight-bold">
                Total : {{ formatPrice(total) }} €
              </v-col>
              <v-col cols="12" sm="6" class="text-right">
                <v-btn
                  color="green darken-1"
                  dark
                  large
                  @click="checkout"
                  :disabled="cart.length === 0"
                  elevation="4"
                >
                  Passer commande
                </v-btn>
              </v-col>
            </v-row>
          </v-card>

          <v-row justify="center" v-if="cart.length === 0" class="mt-6">
            <v-btn color="primary" @click="goDashboard" elevation="2">
              Retour aux articles
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import Navbar from '../components/Navbar.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const cart = ref(
  JSON.parse(localStorage.getItem('cart') || '[]').map(item => ({
    ...item,
    quantity: item.quantity || 1,
  }))
)

const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cart.value))
}

const total = computed(() =>
  cart.value.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
)

const formatPrice = (price) => Number(price).toFixed(2)

const removeItem = (index) => {
  cart.value.splice(index, 1)
  saveCart()
}

const checkout = async () => {
  if (cart.value.length === 0) return

  try {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Vous devez être connecté pour passer commande.')
      router.push('/login')
      return
    }

    const res = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: cart.value,
        total: total.value,
      }),
    })

    if (!res.ok) {
      const errData = await res.json()
      alert('Erreur lors de la commande : ' + (errData.error || 'Erreur inconnue'))
      return
    }

    alert(`Commande passée pour un total de ${formatPrice(total.value)} € !`)
    cart.value = []
    saveCart()
    router.push('/dashboard')
  } catch (err) {
    alert('Erreur réseau lors de la commande')
    console.error(err)
  }
}

const goDashboard = () => {
  router.push('/dashboard')
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

const goCart = () => {
  router.push('/cart')
}
</script>


<style scoped>
h2 {
  font-weight: 700;
  font-family: 'Roboto', sans-serif;
}

.v-list-item {
  border-bottom: 1px solid #eee;
}

.v-list-item:last-child {
  border-bottom: none;
}

.v-list-item-avatar {
  border-radius: 12px;
  overflow: hidden;
}

.v-text-field input {
  font-weight: 600;
}
</style>
