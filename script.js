const bookmarkName = document.getElementById("bookmark-name");
const bookmarkUrl = document.getElementById("bookmark-url");
const bookmarkTag = document.getElementById("bookmark-tag");
const addBookmarkBtn = document.getElementById("add-bookmark");
const bookmarkList = document.getElementById("bookmark-list");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");

// State
/** @type {Bookmark[]} */
let bookmarks = [];

function seed() {
  bookmarks = [
    {
      id: "1704067200000",
      name: "MDN Web Docs",
      url: "https://developer.mozilla.org",
      tag: "docs",
      created: 1704067200000,
    },
    {
      id: "1704153600000",
      name: "GitHub",
      url: "https://github.com",
      tag: "dev",
      created: 1704153600000,
    },
    {
      id: "1704240000000",
      name: "Stack Overflow",
      url: "https://stackoverflow.com",
      tag: "programming",
      created: 1704240000000,
    },
    {
      id: "1704326400000",
      name: "Hacker News",
      url: "https://news.ycombinator.com",
      tag: "news",
      created: 1704326400000,
    },
    {
      id: "1704412800000",
      name: "YouTube",
      url: "https://youtube.com",
      tag: "",
      created: 1704412800000,
    },
    {
      id: "1704499200000",
      name: "Reddit",
      url: "https://reddit.com",
      tag: "community",
      created: 1704499200000,
    },
    {
      id: "1704585600000",
      name: "TypeScript Handbook",
      url: "https://www.typescriptlang.org/docs",
      tag: "typescript",
      created: 1704585600000,
    },
    {
      id: "1704672000000",
      name: "React Documentation",
      url: "https://react.dev",
      tag: "frontend",
      created: 1704672000000,
    },
    {
      id: "1704758400000",
      name: "NPM",
      url: "https://www.npmjs.com",
      tag: "packages",
      created: 1704758400000,
    },
    {
      id: "1704844800000",
      name: "CSS Tricks",
      url: "https://css-tricks.com",
      tag: "css",
      created: 1704844800000,
    },
    {
      id: "1704931200000",
      name: "Google Drive",
      url: "https://drive.google.com",
      tag: "",
      created: 1704931200000,
    },
    {
      id: "1705017600000",
      name: "Wikipedia",
      url: "https://wikipedia.org",
      tag: "reference",
      created: 1705017600000,
    },
  ];
  saveBookmarks();
  renderBookmarks();
}

// NOTE: optional
seed()

/**
 * @typedef {
 *  id: string,
 *  name: string,
 *  url: string,
 *  tag: string,
 *  created: number,
 * } Bookmark
 */

document.addEventListener("DOMContentLoaded", init);

// --- Handlers ---

// Add Bookmark Handler
addBookmarkBtn.addEventListener("click", function () {
  const name = bookmarkName.value.trim();
  const url = bookmarkUrl.value.trim();
  const tag = bookmarkTag.value.trim();

  if (!name || !url) {
    alert("Please enter both a name and a URL.");
    return;
  }

  if (!isValidUrl(url)) {
    alert("Please enter a valid URL starting with http:// or https://");
    return;
  }

  const newBookmark = {
    id: Date.now().toString(),
    name,
    url,
    tag,
    created: Date.now(),
  };

  bookmarks.push(newBookmark);
  saveBookmarks();
  renderBookmarks();

  bookmarkName.value = "";
  bookmarkUrl.value = "";
  bookmarkTag.value = "";
});

// Event Delegation for List Items (Remove, Edit, Save)
bookmarkList.addEventListener("click", function (e) {
  const li = e.target.closest("li");
  if (!li) return;

  const id = li.dataset.id;
  const action = e.target.dataset.action;

  if (action === "remove") {
    bookmarks = bookmarks.filter((b) => b.id !== id);
    saveBookmarks();
    renderBookmarks();
  } else if (action === "edit") {
    enableEditMode(li, id);
  } else if (action === "save") {
    saveEdit(li, id);
  }
});

// Search Handler
searchInput.addEventListener("input", renderBookmarks);

// Sort Handler
sortSelect.addEventListener("change", renderBookmarks);

// --- Core Functions ---

function init() {
  bookmarks = getBookmarksFromStorage();
  renderBookmarks();
}

function isValidUrl(url) {
  return url.startsWith("http://") || url.startsWith("https://");
}

function getBookmarksFromStorage() {
  const stored = localStorage.getItem("bookmarks");
  let parsed = stored ? JSON.parse(stored) : [];
  return parsed;
}

function saveBookmarks() {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks)); // saves to local
}

function renderBookmarks() {
  bookmarkList.innerHTML = "";

  // Filter
  const query = searchInput.value.toLowerCase();
  let filtered = bookmarks.filter(
    (b) =>
      b.name.toLowerCase().includes(query) ||
      (b.tag && b.tag.toLowerCase().includes(query)),
  );

  // Sort
  const sortMethod = sortSelect.value;
  filtered.sort((a, b) => {
    if (sortMethod === "date-desc") return b.created - a.created;
    if (sortMethod === "date-asc") return a.created - b.created;
    if (sortMethod === "alpha-asc") return a.name.localeCompare(b.name);
    if (sortMethod === "alpha-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  // Render
  filtered.forEach((bookmark) => {
    const li = document.createElement("li");
    li.dataset.id = bookmark.id;

    li.innerHTML = `
      <div class="bookmark-content">
        <div class="bookmark-info">
            <a href="${bookmark.url}" target="_blank" class="bookmark-link">${bookmark.name}</a>
            ${bookmark.tag ? `<span class="tag-badge">${bookmark.tag}</span>` : ""}
        </div>
        <a href="${bookmark.url}" target="_blank" class="bookmark-url">${bookmark.url}</a>
        <div class="actions">
            <button data-action="edit">Edit</button>
            <button data-action="remove">Remove</button>
        </div>
      </div>
    `;
    bookmarkList.appendChild(li);
  });
}

function enableEditMode(li, id) {
  const bookmark = bookmarks.find((b) => b.id === id);
  if (!bookmark) return;

  const infoDiv = li.querySelector(".bookmark-info");
  const actionsDiv = li.querySelector(".actions");

  // Replace text with inputs
  infoDiv.innerHTML = `
    <input type="text" class="edit-input edit-name" value="${bookmark.name}" placeholder="Name">
    <input type="text" class="edit-input edit-url" value="${bookmark.url}" placeholder="URL">
    <input type="text" class="edit-input edit-tag" value="${bookmark.tag || ""}" placeholder="Tag">
  `;

  // Change Edit button to Save
  actionsDiv.innerHTML = `
    <button data-action="save">Save</button>
    <button data-action="remove">Remove</button>
  `;
}

function saveEdit(li, id) {
  const nameInput = li.querySelector(".edit-name");
  const urlInput = li.querySelector(".edit-url");
  const tagInput = li.querySelector(".edit-tag");

  const newName = nameInput.value.trim();
  const newUrl = urlInput.value.trim();
  const newTag = tagInput.value.trim();

  if (!newName || !newUrl) {
    alert("Name and URL are required.");
    return;
  }

  // Update state
  const index = bookmarks.findIndex((b) => b.id === id);
  if (index !== -1) {
    bookmarks[index].name = newName;
    bookmarks[index].url = newUrl;
    bookmarks[index].tag = newTag;
    saveBookmarks();
    renderBookmarks();
  }
}
