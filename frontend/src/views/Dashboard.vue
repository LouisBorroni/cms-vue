<template>
  <v-app>
    <Navbar :cartCount="cart.length" @logout="logout" @go-cart="goCart" />

    <v-container fluid>
      <v-row>
        <v-col
          v-for="article in articles"
          :key="article.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card>
            <v-img
              :src="article.image_url || 'https://via.placeholder.com/150'"
              height="200px"
            ></v-img>

            <v-card-title>{{ article.name }}</v-card-title>

            <v-card-subtitle>{{ formatPrice(article.price) }} €</v-card-subtitle>

            <v-card-text>{{ article.description }}</v-card-text>

            <v-card-actions>
              <v-btn color="primary" @click="addToCart(article)">
                Ajouter au panier
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-snackbar v-model="snackbar" timeout="2000" top right>
        {{ snackbarMessage }}
        <template v-slot:action>
          <v-btn icon @click="snackbar = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import { useRouter } from 'vue-router'

const articles = ref([])
const cart = ref([])
const snackbar = ref(false)
const snackbarMessage = ref('')
const router = useRouter()

const fetchArticles = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/articles')
    articles.value = await res.json()
  } catch (e) {
    console.error(e)
  }
}

const saveCartToLocalStorage = () => {
  localStorage.setItem('cart', JSON.stringify(cart.value))
}

const loadCartFromLocalStorage = () => {
  const stored = localStorage.getItem('cart')
  if (stored) {
    try {
      cart.value = JSON.parse(stored)
    } catch {
      cart.value = []
    }
  }
}

const addToCart = (article) => {
  if (!cart.value.some(item => item.id === article.id)) {
    cart.value.push(article)
    saveCartToLocalStorage()
    snackbarMessage.value = `"${article.name}" ajouté au panier`
    snackbar.value = true
  } else {
    snackbarMessage.value = `"${article.name}" est déjà dans le panier`
    snackbar.value = true
  }
}

const formatPrice = (price) => Number(price).toFixed(2)

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

const goCart = () => {
  router.push('/cart')
}

onMounted(() => {
  fetchArticles()
  loadCartFromLocalStorage()
})
</script>
