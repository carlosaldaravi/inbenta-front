<template>
    <div
        class="flex justify-between border-2 rounded px-2"
        :class="
            user === 'Me'
            ? 'bg-green-100 rounded-tl-xl rounded-br-xl'
            : 'bg-gray-200 rounded-tr-xl rounded-bl-xl'
        "
        >
        <strong>{{ user }}:</strong>
        <div v-if="type == 'forceResponse'">
           <Films :films="films"/>
        </div>
        <div v-else-if="type == 'noResults'">
           <Characters :characters="characters"/>
        </div>
        <div v-else>
            {{ message }}
        </div>
    </div>
</template>

<script>
import Films from './Films';
import Characters from './Characters';
export default {
    components: { Films, Characters },
    props: {
        user: { type: String, required: true },
        message: { type: String, required: true },
        time: { type: String, required: true },
        date: { type: String, required: true },
        notFound: { type: Boolean, required: true },
        films: { type: Array, required: false },
        characters: { type: Array, required: false },
        type: { type: String, required: true },
    },
    // eslint-disable-next-line
    // components: { Films },
}
</script>