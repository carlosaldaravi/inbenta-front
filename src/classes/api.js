import axios from "axios";
import { config } from "../config";
import { Result } from "./result";
import { Localit } from "localit";

const lstore = new Localit();

// This is an axios wrapper. Only Get and Post methods are defined here since we dont use Put, Patch and Delete calls.
// There are try-catch blocks so we can easily use the Vue Alert component when a request fails
export const API = class API {
  constructor(url = null) {
    this.apiURL = url || config.apiURL;
    this.graphqlURL = config.graphqlURL;

    this.result = new Result();
  }

  async get(url, params = null) {
    try {
      let { data } = await axios({
        method: "get",
        url: `${this.apiURL}${url}`,
        data: params,
        headers: {
          Authorization: "",
        },
      });
      this.result.ok(data);
    } catch (e) {
      this.result.error(e);
    } finally {
      // eslint-disable-next-line
      return this.result;
    }
  }

  async post(option, params) {
    let url = "";
    switch (option) {
      case "api":
        url = this.apiURL;
        break;
      case "graphql":
        url = this.graphqlURL;
        break;
    }

    params.accessToken = lstore.get("accessToken");
    params.sessionToken = lstore.get("sessionToken");

    try {
      let { data } = await axios({
        method: "post",
        url,
        data: params,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      this.result.ok(data);
    } catch (e) {
      this.result.error(e);
    } finally {
      // eslint-disable-next-line
      return this.result;
    }
  }

  setBaseURL(url = config.apiURL) {
    this.apiURL = url;
  }
};
