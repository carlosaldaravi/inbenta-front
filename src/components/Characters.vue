<template>
    <div>
        I haven't found any results, but here is a list of some Star Wars characters:
        <ul>
            <li v-for="(character, index) in characters" :key="index" class="flex relative left-4">
                - {{character}}
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
        characters: { type: Array, required: true },
    },
}
</script>