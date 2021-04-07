<template>

    <div>
        <Header />
        <h1> Main </h1>
        <ul id="notes">
  <li v-for="note in notes" :key="note.id" >
    {{ note.content }}
  </li>
</ul>
        </div>
</template>

<script>
import Header from "./Header.vue"

export default {
    name: "Main",
    components: { Header },
    props: ['notes']
}
</script>
