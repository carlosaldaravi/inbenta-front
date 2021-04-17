<template>
    <div>
        The <strong>force</strong> is in this movies:
        <ul>
            <li v-for="(film, index) in films" :key="index" class="flex relative left-4">
                - {{film}}
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