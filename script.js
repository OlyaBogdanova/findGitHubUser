const form = document.querySelector("form");
const input = document.querySelector("input");
const APIURL = "https://api.github.com/users/";

async function getUser(username) {
  try {
    const res = await axios(APIURL + username);
    getRepos(username);
    const { data } = res;
    createUserCard(data);
  } catch (e) {
    if (e.response.status == 404) {
      createErrorCard("No profile with this username");
    }
  }
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value.trim()) {
    getUser(input.value.trim());
    input.value = "";
  }
});

function createUserCard({
  login,
  avatar_url,
  bio,
  followers,
  following,
  public_repos,
  repos_url,
}) {
  const cardHTML = `
    <div class="card">
    <div>
      <img
        src="${avatar_url}"
        alt=""
        class="avatar"
      />
    </div>
    <div class="user-info">
      <h2>${login}</h2>
      <p>
      ${bio}
      </p>
      <ul>
        <li>${followers} <strong>Followers</strong></li>
        <li>${following} <strong>Following</strong></li>
        <li>${public_repos} <strong>Repos</strong></li>
      </ul>
      <div id="repos">
    
      </div>
    </div>
  </div>`;
  main.innerHTML = cardHTML;
}

function createErrorCard(msg) {
  const cardHTML = `
    <div class='card'>${msg}</div>
    `;
  main.innerHTML = cardHTML;
}

async function getRepos(username) {
  try {
    const { data } = await axios(APIURL + username + "/repos");
    addReposToCard(data);
  } catch (error) {
    console.log(error);
  }
}

function addReposToCard(repos) {
  const reposEl = document.getElementById("repos");
  repos.forEach((repo) => {
    const repoLink = document.createElement("a");
    repoLink.classList.add("repo");
    repoLink.href = repo.html_url;
    repoLink.target = "_blank";
    repoLink.innerText = repo.name;
    reposEl.appendChild(repoLink);
  });
}
