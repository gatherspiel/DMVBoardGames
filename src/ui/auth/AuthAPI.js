import { createClient } from "@supabase/supabase-js";

export class AuthAPI {
  constructor() {
    this.authClient = createClient(
      "https://karqyskuudnvfxohwkok.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthcnF5c2t1dWRudmZ4b2h3a29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5ODQ5NjgsImV4cCI6MjA1NzU2MDk2OH0.TR-Pn6dknOTtqS9y-gxK_S1-nw6TX-sL3gRH2kXJY_I",
    );
  }

  async retrieveData(params) {
    console.log("Params:" + JSON.stringify(params));
    //TODO: Call Supabase API.
  }

  async updateData(response) {
    console.log("Response:" + response);
    //TODO: Update state of login component and login status in authState"
  }
}
