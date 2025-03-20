import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://karqyskuudnvfxohwkok.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthcnF5c2t1dWRudmZ4b2h3a29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5ODQ5NjgsImV4cCI6MjA1NzU2MDk2OH0.TR-Pn6dknOTtqS9y-gxK_S1-nw6TX-sL3gRH2kXJY_I",
);

window.onload = function () {
  let form = document.getElementById("loginForm");

  async function login() {
    console.log(supabase);
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    console.log(email);
    console.log(password);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    console.log(data);
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    login();
  });
};
