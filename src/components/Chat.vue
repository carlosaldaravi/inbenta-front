<template>
  <div class="p-2 rounded h-screen mb-12">
    <section
      id="conversation-box"
      class="overflow-y-auto overflow-x-hidden h-4/5 bg-gray-100"
      @click="focusInput()"
    >
      <div>
        <header v-if="conversation.length == 0" class="italic">
          Write something to chat with YodaBot.
          <span class="italic text-xs">(For example start with "Hello")</span>
        </header>
        <ul class="space-y-1">
          <li v-for="(message, index) in conversation" :key="index">
            <ChatMessages
              :user="message.user"
              :message="message.message"
              :time="message.time"
              :date="message.date"
              :type="message.type"
              :films="message.films"
              :characters="message.characters"
              :notFound="message.notFound"
            />
          </li>
        </ul>
      </div>
      <div>
        <p v-if="sending" class="italic text-gray-400">YodaBot is writing...</p>
      </div>
    </section>
    <form action="">
      <div class="flex px-2 pb-6 pt-2 w-full bg-gray-100">
        <input
          v-model="msg"
          ref="text"
          class="border-2 rounded mr-4 w-full px-1 overflow-x-hidden"
          type="text"
          :placeholder="conversation.length == 0 ? 'Write here...' : ''"
        />
        <div>
          <button
            class="rounded-full h-8 w-8 md:h-12 md:w-12 flex items-center justify-center border-gray-900 border-2 bg-green-400 my-1"
            :class="msg == '' || sending ? 'opacity-40' : 'opacity-100'"
            :disabled="msg == '' || sending"
            type="submit"
            @click="(sending = true), sendMessage()"
            v-on:click.stop.prevent
          >
            <img
              src="../assets/icon/send.svg"
              class="w-4 h-4 md:w-6 md:h-6"
              alt=""
            />
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { API } from "../classes/api";
import {
  getTime,
  getDate,
  isBiggerThan,
  isResultNotFound,
  lastTwoAreNotFound,
  setFilmsList,
  setCharactersList,
} from "../helpers/functions";
import { getFilmsQuery, getCharactersQuery } from "../helpers/graphql";
import ChatMessages from "./ChatMessages";
import { Localit } from "localit";

const lstore = new Localit();

export default {
  name: "Chat",
  components: { ChatMessages },
  data() {
    return {
      api: new API(),
      conversation: [],
      sending: false,
      msg: "",
    };
  },
  created() {
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
      if (!lstore.get("accessToken") && !lstore.get("sessionToken"))
        await this.newConversation();

      if (this.msg === "") return;

      this.conversation.push({
        user: "Me",
        message: this.msg,
        time: getTime(),
        date: getDate(),
        type: "normal",
        notFound: false,
      });
      this.sending = true;
      //  if force is in the message the call is to a graphql
      //  to get a list of films
      if (this.msg.includes("force")) {
        let query = getFilmsQuery();
        let { data, success } = await this.api.post(`graphql`, query);
        if (!success) return;
        let films = [];
        data.data.allFilms.films.forEach((film) => films.push(film.title));

        this.conversation.push({
          user: "YodaBot",
          message: "",
          films,
          type: "forceResponse",
          time: getTime(),
          date: getDate(),
          notFound: false,
        });
        lstore.set("conversation", this.conversation);
      } else {
        let { data, success } = await this.api.post(`api`, {
          userMessage: this.msg,
        });
        if (!success) return;
        if (!data.answers) return;

        // normal flow token still working and good response
        // check if last 2 messages were not found
        // to send a different response to the user
        let auxConversation = [];
        this.conversation.forEach((chat) => auxConversation.push(chat));
        console.log(auxConversation);
        if (
          auxConversation.length > 1 &&
          lastTwoAreNotFound(auxConversation, data.answers[0].flags)
        ) {
          let query = getCharactersQuery();
          let { data, success } = await this.api.post(`graphql`, query);
          if (success) {
            let characters = [];
            data.data.allPeople.people.forEach((character) =>
              characters.push(character.name)
            );

            this.conversation.push({
              user: "YodaBot",
              message: "",
              time: getTime(),
              date: getDate(),
              characters: characters,
              type: "noResults",
              notFound: false,
            });
            lstore.set("conversation", this.conversation);
          }
        } else {
          // normal response

          this.conversation.push({
            user: "YodaBot",
            message: data.answers[0].messageList[0],
            time: getTime(),
            date: getDate(),
            type: "response",
            notFound: isResultNotFound(data.answers[0].flags),
          });
        }
        lstore.set("conversation", this.conversation);
      }
      this.sending = false;
      this.scrollBottom();
      this.focusInput();
      this.msg = "";
    },
    focusInput() {
      this.$refs.text.focus();
    },
    async checkConversationHistory() {
      let accessToken = lstore.get("accessToken");
      let sessionToken = lstore.get("sessionToken");
      if (accessToken && sessionToken) {
        if (lstore.get("conversation")) {
          this.conversation = lstore.get("conversation");
        }
      } else {
        this.newConversation();
      }
    },
    async newConversation() {
      // session expired or no token so start a new conversation
      // to get new accessToken and sessionToken

      let { data, success } = await this.api.post(`api`, {
        requestToken: true,
      });
      if (!success) return;
      lstore.set("accessToken", data.accessToken, "19m");
      lstore.set("sessionToken", data.sessionToken, "19m");
    },
    scrollBottom() {
      // set timeout to do scroll until last sms
      setTimeout(function() {
        var objDiv = document.getElementById("conversation-box");
        objDiv.scrollTop = objDiv.scrollHeight;
      }, 25);
    },
  },
};
</script>
<style>
section,
form {
  min-width: 280px;
}
</style>
