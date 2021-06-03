<template>
  <div class="container">
    <form class="form" onsubmit="event.preventDefault();">
      <div class="form-header">
        Signup
      </div>
      <div class="form-body">
        <p class="info-block">
          Please enter your username, email address and password to create new
          account.
        </p>
        <router-link class="signup-block" to="/login">
          Have account? Login now.
        </router-link>
        <p class="error-block">{{ error }}</p>
        <div class="input-group">
          <label for="username">Username</label>
          <input type="text" v-model="username" id="username" />
        </div>
        <div class="input-group">
          <label for="email">E-mail</label>
          <input type="text" v-model="email" id="email" />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" v-model="password" id="password" />
        </div>
        <div class="input-group">
          <label for="password2">Confirm the password</label>
          <input type="password" v-model="password2" id="password2" />
        </div>
        <div class="button-box">
          <button
            class="button-go"
            v-on:click="Signup"
            onclick="this.disabled = true;"
            id="btn-login"
          >
            Signup >
          </button>
        </div>
      </div>
      <div class="form-footer">Welcom to the Umbrella.</div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: relative;
  display: flex;
  min-height: 100vh;
  width: 100%;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;

  background: rgb(243, 243, 243);

  .form {
    height: fit-content;
    padding: 20px 50px;
    max-width: 300px;
    position: relative;

    background: white;
    border: 1px solid rgb(233, 233, 233);
    border-radius: 0.2rem;

    &-header {
      padding-top: 10px;

      font-weight: 700;
      font-size: 1.2rem;
      text-transform: uppercase;
      text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
    }

    &-body {
      padding-top: 10px;

      .info-block {
        font-weight: 300;
        font-size: 0.8rem;
        padding-bottom: 5px;
      }

      .signup-block {
        display: block;
        font-weight: 300;
        font-size: 0.8rem;
        padding-bottom: 5px;
        text-decoration: underline;
        color: blue;
      }

      .error-block {
        display: block;
        font-weight: 300;
        font-size: 0.8rem;
        padding-top: 5px;
        color: rgb(199, 25, 25);
        height: 1rem;

        transition: all 300ms;
      }

      .input-group {
        padding-top: 10px;
        padding-bottom: 10px;
        display: flex;
        flex-direction: column;

        label {
          font-weight: 300;
          font-size: 0.8rem;
          cursor: pointer;
        }

        input {
          padding: 5px 0;
          border: none;
          border-bottom: 1px solid black;
          outline: none;
        }
      }

      .button-box {
        display: flex;
        justify-content: space-between;

        .button-go {
          background: transparent;
          font-size: 1rem;
          padding-top: 10px;
          border: none;
          outline: none;
          cursor: pointer;
          font-weight: 500;

          transition: all 300ms;

          &:hover {
            word-spacing: 5px;
            padding-right: 5px;
            font-weight: 900;
            text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
          }
        }

        .button-lose {
          background: transparent;
          font-size: 0.7rem;
          padding-top: 10px;
          border: none;
          outline: none;
          cursor: pointer;

          &:hover {
            text-decoration: underline;
            color: rgb(65, 4, 4);
          }
        }
      }
    }

    &-footer {
      padding-top: 30px;

      font-weight: 300;
      font-size: 0.7rem;
      color: rgb(112, 9, 9);
      text-align: center;
    }
  }
}
</style>

<script>
import axios from "axios";

export default {
  name: "Login",
  data: function() {
    return {
      username: "",
      email: "",
      password: "",
      password2: "",
      error: "",
    };
  },
  methods: {
    Signup: function() {
      if (!this.email || !this.password || !this.username || !this.password2) {
        this.error = "Fill in all the fields";
        setTimeout(
          () => (document.getElementById("btn-login").disabled = false),
          100
        );
        return 0;
      }
      if (this.password !== this.password2) {
        this.error = "Passwords don't match";
        setTimeout(
          () => (document.getElementById("btn-login").disabled = false),
          100
        );
        return 0;
      }
      axios
        .post("https://authdiplom.herokuapp.com/api/auth/signup", {
          // .post("http://localhost:3000/api/auth/login", {
          email: this.email,
          password: this.password,
          name: this.username,
        })
        .then((res) => {
          if (res.data.user) {
            this.$router.push({ path: "/login" });
          } else this.error = res.data.error.message;
        })
        .catch((error) => {
          try {
            this.error =
              error.response.data.error.message || error.response.data.error;
          } catch (e) {
            this.error = error.message;
          }
          document.getElementById("btn-login").disabled = false;
        });
    },
  },
};
</script>
