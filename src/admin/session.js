import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://karqyskuudnvfxohwkok.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthcnF5c2t1dWRudmZ4b2h3a29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5ODQ5NjgsImV4cCI6MjA1NzU2MDk2OH0.TR-Pn6dknOTtqS9y-gxK_S1-nw6TX-sL3gRH2kXJY_I",
);

const SERVER_URL = "http://localhost:7070/";
const ENDPOINT = "admin/saveData";
window.onload = function () {
  let form = document.getElementById("loginForm");

  async function saveData() {
    console.log(supabase);
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const data = document.getElementById("data").value;

    const url = SERVER_URL + ENDPOINT;
    try {
      console.log("Attempting to save data");
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
          data: JSON.parse(data),
        }),
      });
      console.log(response);
    } catch (error) {
      console.log(error.message);
    }

    const { authData, authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    console.log(authData);
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    saveData();
  });
};
