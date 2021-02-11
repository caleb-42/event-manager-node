const switchClass = (target, toggleClass, type = "toggle") => {
  try {
    const objs = document.querySelectorAll(`${target}`);
    objs.forEach((obj) => {
      if (type === "toggle") obj.classList.toggle(toggleClass);
      if (type === "add" && !obj.classList.contains(toggleClass))
        obj.classList.add(toggleClass);
      if (type === "remove" && obj.classList.contains(toggleClass))
        obj.classList.remove(toggleClass);
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
  /* body = JSON.stringify(body);
  const payload = {
    method,
    headers: contentType,
    credentials: "include",
  };
  if (method !== "GET") payload.body = body;
  if (contentType === null) delete payload.headers;
  const endpoint = `/api/${url}`;
  fetch(endpoint, payload)
    .then((resp) => resp.json())
    .then((res) => {
      setTimeout(() => {
        resolve(res);
      }, 0);
    })
    .catch((err) => {
      reject(err);
    }); */

  try {
    let res = dummyData({ url, method });
    setTimeout(() => {
      resolve(res);
    }, 0);
  } catch (e) {
    console.log(e);
    setTimeout(() => {
      reject("something went wrong");
    }, 0);
  }
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

const dummyData = ({ url, method }) => {
  const data = {
    "api/events": {
      GET: [
        {
          id: 1,
          name: "Open Coffee",
          location: "lagos, Nigeria",
          description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
          industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
          and scrambled it to make a type specimen book. It has survived not only five centuries, but also the
          leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s
          with the release of Letraset sheets containing Lorem`,
          start_date: "2020-12-31T23:00:01.000Z",
          end_date: "2021-01-05T23:00:01.000Z",
          speakers: [
            {
              name: "paul",
              desc: "engineer",
              pic: "/avatar.png",
            },
            {
              name: "jmaes",
              desc: "singer",
              pic: "/avatar.png",
            },
          ],
          event_types: [
            {
              id: 1,
              name: "MeetUp",
            },
            {
              id: 2,
              name: "Leap",
            },
          ],
        },
        {
          id: 2,
          name: "DevFest",
          location: "lagos, Nigeria",
          description: "wonderful meeting",
          start_date: "2020-12-31T23:00:01.000Z",
          end_date: "2021-01-05T23:00:01.000Z",
          speakers: [],
          event_types: [
            {
              id: 1,
              name: "Cruise",
            },
            {
              id: 2,
              name: "Jump",
            },
          ],
        },
      ],
    },
  };
  console.log(/api\/events[?]id=[0-9]+$/.test(url));
  if (/api\/events[?]id=[0-9]+$/.test(url)) {
    let params = window.location.href.split("/");
    let event = params[params.length - 1];
    console.log(event);
    return data["api/events"]["GET"].find((item) => item.id == event);
  }

  return data[url][method];
};
