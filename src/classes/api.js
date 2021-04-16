import axios from "axios";
import { config } from "../config";
import { Result } from "./result";

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
      let res = await axios({
        method: "get",
        url: `${this.apiURL}${url}`,
        data: params,
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: "",
        },
      });
      this.result.ok(res.data);
    } catch (e) {
      this.result.error(e);
    } finally {
      // eslint-disable-next-line
      return this.result;
    }
  }

  async post(option, params) {
    let url = ''
    switch(option){
      case 'api': url = this.apiURL; break;
      case 'graphql': url = this.graphqlURL; break;
    }
    let res = null;
    try {
      res = await axios({
        method: "post",
        url,
        data: params,
        headers: {
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
      this.result.ok(res.data);
    } catch (e) {
      this.result.error(e);
    } finally {
      // eslint-disable-next-line
      return this.result;
    }
  }

  setBaseURL(url = null) {
    this.apiURL = url || config.apiURL;
  }
};
