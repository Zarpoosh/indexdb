let $ = document;
const registerForm = $.querySelector(".register-form");
const nameInput = $.querySelector(".nameInpu");
const paswordInput = $.querySelector(".passwordInput");
const emailInput = $.querySelector(".emailInput");

let db = null;
let objectStore = null;

window.addEventListener("load", () => {
  let DBOpenReq = indexedDB.open("sablearn", 7);

  DBOpenReq.addEventListener("error", (err) => {
    console.warn(" error", err);
  });

  DBOpenReq.addEventListener("success", (event) => {
    db = event.target.result;
    console.log(" success", event.target.result);
  });

  DBOpenReq.addEventListener("upgradeneeded", (event) => {
    db = event.target.result;

    console.log("old version :", event.oldVersion);
    // console.log("upgrade", db);
    console.log("new version :", event.newVersion);

    if (!db.objectStoreNames.contains("users")) {
      objectStore = db.createObjectStore("users", {
        keyPath: "userID",
      });
    }
    if (db.objectStoreNames.contains("users")) {
      db.deleteObjectStore("users");
    }

    // db.createObjectStore("sourses")
    console.log("upgrade", db.objectStoreNames);
  });
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let newUser = {
    userID: Math.floor(Math.random() * 999),
    name: nameInput.value,
    password: paswordInput.value,
    email: emailInput.value,
  };

  let tx = db.transaction("users", "readwrite");

  tx.addEventListener(" error", (err) => {
    console.warn("error", err);
  });

  tx.addEventListener(" complete", (event) => {
    console.log("Tx", event);
    clearInput();
  });
  let store = tx.objectStore("users");
  let request = store.add(newUser);

  request.addEventListener(" error", (err) => {
    console.warn("error", err);
  });

  request.addEventListener(" success", (event) => {
    console.log("Request", event);
  });
});

function clearInput() {
  nameInput.value = "";
  paswordInput.value = "";
  emailInput.value = "";
}
