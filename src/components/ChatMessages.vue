<template>
    <div
        class="flex border-2 rounded px-2"
        :class="{
                'bg-green-100 rounded-tl-xl rounded-br-xl' : user === 'Me',
                'bg-gray-200 rounded-tr-xl rounded-bl-xl' : user === 'YodaBot',
                'grid grid-cols-6' : user=='YodaBot'
            }"
        >
        <div v-if="user==='YodaBot'" class="w-16 h-16">
            <img src="../assets/img/Yoda.png" alt="this is yoda" class="w-full h-full rounded-full border-2 object-contain">
        </div>
        <div v-else>
            <strong>{{ user }}:</strong>
        </div>
        <div class="col-span-5">
            <div v-if="type == 'forceResponse'">
            <Films :films="films"/>
            </div>
            <div v-else-if="type == 'noResults'">
            <Characters :characters="characters"/>
            </div>
            <div v-else class="ml-2">
                {{ message }}
            </div>
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