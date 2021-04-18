<template>
    <div>
        The <strong>force</strong> is in this movies:
        <ul>
            <li v-for="(film, index) in films" :key="index" class="flex relative left-4">
                <img src="../assets/img/espada.png" alt="espada" class="w-10 h-auto object-contain mr-1">
                {{film}}
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
        films: { type: Array, required: true },
    },
}
</script>