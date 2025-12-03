export class CustomLoadActionDoc extends HTMLElement {
  connectedCallback(){
    this.innerHTML = `
     <div id="custom-load-action-class-guide">
        <p>Class to define a custom data store load action with direct control over any async calls that are made.
          It is intended for use when additional processing needs to be done after an async call, or if a store needs
          to combine data from multiple sources.</p>

        <details>
          <summary>Example</summary>
          <code-display-component>
async function retrieveData() {
  const data = await fetch(
    \`\${LOGIN_CLIENT_URL}/auth/v1/logout?scope=global\`,
    {
      method: "POST",
      headers: {
        apiKey: SUPABASE_CLIENT_KEY,
        authorization:
        "bearer " +
        (await getLocalStorageDataIfPresent(AUTH_TOKEN_KEY))?.access_token,
      },
    },
  );
  if (data.ok) {
    deleteLocalStoreData(AUTH_TOKEN_KEY);
    window.location.assign("/index.html");
    return new AuthResponse(false);
  } else {
    return new AuthResponse(
      true,
      {},
      "Failed to logout:" + JSON.stringify(data),
    );
  }
}

export const LOGOUT_STORE = new DataStore(new CustomLoadAction(retrieveData));
          </code-display-component>
        </details>
    
    `
  }
}