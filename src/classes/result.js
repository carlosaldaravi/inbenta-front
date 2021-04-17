// This is an axios wrapper.
// There are try-catch blocks so we can easily use the Vue Alert component when a request fails
export const Result = class Result {
  constructor() {
    this.success = null;
    this.data = null;
  }

  error(data) {
    this.data = data;
    this.success = false;
    return { data: this.data, success: false };
  }

  ok(data) {
    this.data = data;
    this.success = true;
    return { data: this.data, success: this.success };
  }
};
