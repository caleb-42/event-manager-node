const switchClass = (target, toggleClass, type = "toggle") => {
  try {
    const objs = document.querySelectorAll(`${target}`);
    objs.forEach((obj) => {
      if (type === "toggle") obj.classList.toggle(toggleClass);
      if (type === "add" && !obj.classList.contains(toggleClass)) {
        obj.classList.add(toggleClass);
      }
      if (type === "remove" && obj.classList.contains(toggleClass))
        obj.classList.remove(toggleClass);
      if (type === "replace") obj.classList = [toggleClass];
    });
  } catch (e) {
    console.error(e);
    return false;
  }
  return true;
};

const switchEvents = (target, arg) => {
  document.querySelector(target).addEventListener("click", () => {
    switchClass(arg[0], arg[1], arg[2]);
  });
};

const server = ({
  url = "",
  method = "GET",
  body = {},
  resolve = (res) => {},
  reject = (err) => {},
  contentType = { "Content-Type": "application/json" },
}) => {
  body = JSON.stringify(body);
  const user = window.localStorage.getItem("user");
  const payload = {
    method,
    headers: {
      ...contentType,
      Authorization: `Bearer ${user}`,
    },
    credentials: "include",
  };
  if (method !== "GET") payload.body = body;
  if (contentType === null) delete payload.headers;
  const endpoint = `/api/${url}`;
  fetch(endpoint, payload)
    .then((resp) => resp.json())
    .then((res) => {
      setTimeout(() => {
        if (res.status && res.status !== 200 && res.status !== 201) {
          reject(res.error);
        }
        resolve(res);
      }, 0);
    })
    .catch((err) => {
      reject(err);
    });
};

const formToJson = (form) => {
  const inputs = [].slice.call(form.elements);
  const val = {};
  inputs.forEach((input) => {
    if (["checkbox", "radio"].indexOf(input.type) !== -1 && input.name !== "") {
      val[input.name] = val[input.name] || false;
      if (input.checked)
        val[input.name] = input.type === "radio" ? input.value : true;
    } else if (input.name !== "") val[input.name] = input.value;
  });
  return val;
};

const toggleLoader = (btn = ".submit", res = ".resp", loadr = ".loader") => {
  const loaders = document.querySelectorAll(loadr);
  const resp = document.querySelectorAll(res);
  loaders.forEach((loader) => {
    if (loader.classList.contains("gone")) {
      resp.forEach((elem) => {
        elem.textContent = "";
      });
      loader.classList.remove("gone");
      switchClass(res, "gone", "add");
      document.querySelectorAll(btn).forEach((elem) => {
        elem.disabled = true;
      });
    } else {
      loader.classList.add("gone");
      switchClass(res, "gone", "remove");
      document.querySelectorAll(btn).forEach((elem) => {
        elem.disabled = false;
      });
    }
  });
};

const requestCycle = {
  START: () => {
    switchClass(".loader-con", "gone", "renove");
    switchClass(".server-message-con", "gone", "add");
    switchClass(".item-block", "gone", "add");
  },
  GOOD: () => {
    switchClass(".loader-con", "gone", "add");
    switchClass(".item-block", "gone", "remove");
  },
  BAD: () => {
    switchClass(".loader-con", "gone", "add");
    switchClass(".server-message-con", "gone", "remove");
  },
};
