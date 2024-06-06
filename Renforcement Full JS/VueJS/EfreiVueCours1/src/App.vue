<script setup lang="ts">
import { ref, type Ref } from 'vue'
const myVariable = 'Ma Variable'

const count = ref(0)
const message = 'bravo !'
function increaseCount(): void {
  count.value++
}

const pizzas: Ref<string[]> = ref(['pepperoni', '4 fromages', 'vegan', 'thon'])
const color: Ref<'red'> = ref("red")
// Ref<'red'> only red not string
const userInput = ref('')

function addPizza(): void {
  pizzas.value.push(userInput.value)
  userInput.value = ''
}

function isColorRed(): boolean {
  return color.value === "red"
}
</script>

<template>
  {{ myVariable }}

  <h3 v-if="count >= 5">
    {{ message }}
  </h3>
  <h3 v-else>"rien"</h3>

  <h1>
    {{ count }}
  </h1>
  <button @click="increaseCount()">increaseCount</button>

  <div>
    <ul>
      <li v-for="pizza in pizzas" :class="{ red: isColorRed() }">{{ pizza }}</li>
    </ul>
  </div>
  {{ userInput }}
  <input type="test" v-model="userInput" />
  <!-- bind input to userInput -->
  <button @click="addPizza()">addPizza</button>
</template>

<style scoped>
.red {
  color: red;
}
</style>
