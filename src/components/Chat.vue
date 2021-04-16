<template>
  <div class="p-2 rounded h-screen mb-12">
      <section id="conversation-box" class="overflow-y-auto overflow-x-hidden h-4/5 bg-gray-100"
                @click="focusInput()">
        <ul>
            <li v-if="conversation.length == 0" class="italic">Write something to chat with YodaBot. <span class="italic text-xs">(For example start with "Hello")</span></li>
            <li v-for="(chat, index) in conversation" :key="index" class="list-none mb-1">
                <div v-if="index == 0" class="italic text-xs text-center my-1">{{ chat.date }}</div>
                <!-- show new date if message to show is after the day than before message -->
                <div v-else-if="isBiggerThan(chat.date,conversation[index-1].date)" class="italic text-xs text-center my-1">{{ chat.date }}</div>
                <div class="flex justify-between border-2 rounded px-2"
                    :class="chat.user == 'Me' ? 'bg-green-100 rounded-tl-xl rounded-br-xl' : 'bg-gray-200 rounded-tr-xl rounded-bl-xl'">
                    <div class="flex">
                        <span class="font-bold mr-1">{{ chat.user }}: </span>
                        <p v-html="chat.message" class="inline-block"></p>
                    </div>
                    <div class="italic text-xs text-gray-400 flex">
                        <span class="self-end">
                            {{ chat.time }}
                        </span>
                    </div>
                </div>
            </li>
        </ul>
        <div>
            <p v-if="sending" class="italic text-gray-400">YodaBot is writing...</p>
        </div>
      </section>
      <form action="">
          <div class="flex px-2 pb-6 pt-2 w-full bg-gray-100">
            <input v-model="msg" ref="text" class="border-2 rounded mr-4 w-full px-1 overflow-x-hidden" type="text" 
            :placeholder="conversation.length == 0 ? 'Write here...' : ''">
            <div>
                <button class="rounded-full h-8 w-8 md:h-12 md:w-12 flex items-center justify-center border-gray-900 border-2 bg-green-400 my-1" 
                        :class="msg == '' || sending ? 'opacity-40' : 'opacity-100'"
                        :disabled="msg == '' || sending"
                        type="submit"
                        @click="sending = true, sendMessage()"
                        v-on:click.stop.prevent
                        >
                    <img src="../assets/icon/send.svg" class="w-4 h-4 md:w-6 md:h-6" alt="">
                </button>
            </div>
          </div>
      </form>
  </div>
</template>

<script>
import { API } from "../classes/api";
import { getTime, 
         getDate,
         isBiggerThan,
         isResultNotFound,
         lastTwoAreNotFound,
         setFilmsList,
         setCharactersList
        } from "../helpers/functions";
import { getFilmsQuery, getCharactersQuery } from "../helpers/graphql"
export default {
    name: 'Chat',
    data() {
        return {
            api: new API(),
            conversation: [],
            sending: false,
            msg: '',
            msgAux: '',
        }
    },
    created(){
        this.checkConversationHistory();
        this.scrollBottom();
    },
    mounted() {
        this.focusInput();
    },
    methods: {
        getTime,
        getDate,
        isBiggerThan,
        isResultNotFound,
        lastTwoAreNotFound,
        setFilmsList,
        setCharactersList,
        getFilmsQuery,
        getCharactersQuery,
        async sendMessage() {
            // msg '' when function called itself for token expired
            if(this.msg != ''){
                this.msgAux = this.msg;
                this.msg = '';
                this.conversation.push({
                    user: 'Me',
                    message: this.msgAux,
                    time: getTime(),
                    date: getDate(),
                    notFound: false
                });
            }
            this.sending = true;
            //  if force is in the message the call is to a graphql
            //  to get a list of films
            if(this.msgAux.includes("force")){
                let query = getFilmsQuery();
                let res = await this.api.post(`graphql`, query);
                if (res.success) {
                    let msg;
                    let films = [];
                    res.data.data.allFilms.films.forEach(film => films.push(film.title));
                    if(films.length > 0) {
                        msg = setFilmsList(films);
                    }
                    this.conversation.push({ 
                        user: 'YodaBot',
                        message: msg,
                        time: getTime(),
                        date: getDate(),
                        notFound: false
                    });
                    localStorage.setItem("conversation", JSON.stringify(this.conversation));
                }
            } else {
                let accessToken = localStorage.getItem("accessToken");
                let sessionToken = localStorage.getItem("sessionToken");
                let res = await this.api.post(`api`, { accessToken, sessionToken, userMessage: this.msgAux });
                if (res.success) {
                    if(res.data.answers){
                        // normal flow token still working and good response
                        // check if last 2 messages were not found
                        // to send a different response to the user
                        let auxConversation = [];
                        this.conversation.forEach(chat => auxConversation.push(chat));
                        if(auxConversation.length > 1 && lastTwoAreNotFound(auxConversation, res.data.answers[0].flags)) {
                            let query = getCharactersQuery();
                            let res = await this.api.post(`graphql`, query);
                            if (res.success) {
                                let msg;
                                let characters = [];
                                res.data.data.allPeople.people.forEach(character => characters.push(character.name));
                                if(characters.length > 0) {
                                    msg = setCharactersList(characters);
                                }
                                this.conversation.push({ user: 'YodaBot', message: msg, time: getTime(), date: getDate(), notFound: false });
                                localStorage.setItem("conversation", JSON.stringify(this.conversation));
                            }
                        } else {
                            this.conversation.push({ 
                                user: 'YodaBot',
                                message: res.data.answers[0].message,
                                time: getTime(), date: getDate(),
                                notFound: isResultNotFound(res.data.answers[0].flags)
                            });
                        }
                        localStorage.setItem("conversation", JSON.stringify(this.conversation));
                    } else {
                         // here means the token is expired so its necesary update it
                        this.newConversation();
                        this.sendMessage();
                    }
                }
            }
            this.sending = false;
            this.scrollBottom();
            this.focusInput();
        },
        focusInput() {
            this.$refs.text.focus();
        },
        async checkConversationHistory() {
            let accessToken = localStorage.getItem("accessToken");
            let sessionToken = localStorage.getItem("sessionToken");
            if(accessToken && sessionToken) {
                if(localStorage.getItem("conversation")){
                    this.conversation = JSON.parse(localStorage.getItem("conversation"));
                }
            } else {
                console.log('nueva conversación');
                this.newConversation();
            }
        },
        async newConversation(){
             // session expired or no token so start a new conversation
             // to get new accessToken and sessionToken
             
            let res = await this.api.post(`api`, {});
                if (res.success) {
                    localStorage.setItem("accessToken", res.data.accessToken);
                    localStorage.setItem("sessionToken", res.data.sessionToken);
                }
        },
        scrollBottom(){
            // set timeout to do scroll until last sms
            setTimeout(function(){ 
                var objDiv = document.getElementById("conversation-box");
                objDiv.scrollTop = objDiv.scrollHeight;
            },25);
        }
    }
}
</script>
<style>
    section, form {
        min-width: 280px;
    }
</style>