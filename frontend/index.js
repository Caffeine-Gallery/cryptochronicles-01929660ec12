import { AuthClient } from "@dfinity/auth-client";
import { backend } from "declarations/backend";

let authClient = null;
let identity = null;
let quill = null;

async function init() {
  authClient = await AuthClient.create();

  document.getElementById("loginButton").addEventListener("click", async () => {
    const loginButton = document.getElementById("loginButton");
    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";

    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      onSuccess: async () => {
        identity = authClient.getIdentity();
        loginButton.textContent = "Logged In";
        loginButton.disabled = true;
        loadPosts();
      },
    });
  });

  document.getElementById("newPostButton").addEventListener("click", () => {
    document.getElementById("newPostForm").classList.toggle("hidden");
  });

  document.getElementById("submitPostButton").addEventListener("click", async () => {
    const submitButton = document.getElementById("submitPostButton");
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    const title = document.getElementById("postTitle").value;
    const body = quill.root.innerHTML;
    const author = identity.getPrincipal();

    await backend.addPost(title, body, author);

    submitButton.disabled = false;
    submitButton.textContent = "Submit Post";
    document.getElementById("postTitle").value = "";
    quill.setContents([]);

    document.getElementById("newPostForm").classList.add("hidden");
    loadPosts();
  });

  quill = new Quill('#editor', {
    theme: 'snow'
  });

  loadPosts();
}

async function loadPosts() {
  const posts = await backend.getPosts();
  const postsContainer = document.getElementById("postsContainer");
  postsContainer.innerHTML = '';

  for (const post of posts) {
    const postElement = document.createElement("div");
    postElement.className = "post";

    const titleElement = document.createElement("h2");
    titleElement.textContent = post.title;

    const bodyElement = document.createElement("div");
    bodyElement.innerHTML = post.body;

    const authorElement = document.createElement("p");
    authorElement.className = "author";
    authorElement.textContent = `By: ${post.author.toText()}`;

    const timestampElement = document.createElement("p");
    timestampElement.className = "timestamp";
    const timestamp = Number(post.timestamp) / 1000000;
    const date = new Date(timestamp);
    timestampElement.textContent = date.toLocaleString();

    postElement.appendChild(titleElement);
    postElement.appendChild(authorElement);
    postElement.appendChild(timestampElement);
    postElement.appendChild(bodyElement);

    postsContainer.appendChild(postElement);
  }
}

init();
