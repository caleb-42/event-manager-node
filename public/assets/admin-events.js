(() => {
  const user = localStorage.getItem("user");
  if (!user) window.location = "/admin-login.html";
  switchEvents("#modal #modal-bg", ["#modal", "close", "add"]);
  switchEvents("#modal .modal-close-btn", ["#modal", "close", "add"]);
  switchEvents("#navicon", ["#app-drawer", "close", "remove"]);
  switchEvents("#app-drawer #aside-backdrop", ["#app-drawer", "close", "add"]);
  switchEvents("#app-drawer .back-arrows", ["#app-drawer", "close", "add"]);
  switchEvents(".grid-toggle", ["body", "grid", "add"]);
  switchEvents(".list-toggle", ["body", "grid", "remove"]);
  switchEvents("#new-event", ["#modal", "close", "remove"]);

  document.querySelectorAll("input.search-input").forEach((item) => {
    item.addEventListener("input", (e) => {
      searchEvents(e.target.value);
    });
  });

  const formObj = document.querySelector("form.modal-event");
  const reqResError = document.querySelector(".req-res .error-hd");

  const makePageList = (res) => {
    let list = "";
    res.map((item) => {
      list += eventEditItem(item, "/event-edit");
    });
    document.querySelector(".item-con").innerHTML = list;
    document.querySelectorAll(".item-con .item").forEach((item) => {
      item.addEventListener("click", (e) => {
        if (!e.target.classList.contains("remove-event")) {
          window.location = item.dataset.path;
        } else {
          deleteEvent(item.dataset.id);
        }
      });
    });
  };

  /* --------ACTIONS------- */
  const makeEvent = (form) => {
    for (let item in form) {
      if (!form[item])
        return (reqResError.innerHTML = "all fields are required");
    }
    form.start_date = new Date(form.start_date).toISOString();
    form.end_date = new Date(form.end_date).toISOString();
    reqResError.innerHTML = "";
    switchClass(".req-res", "async", "add");
    createEventItem(form)
      .then(() => {
        formObj.name.value = "";
        formObj.location.value = "";
        formObj.start_date.valueAsDate = null;
        formObj.end_date.valueAsDate = null;
        formObj.description.value = "";
        switchClass("#modal", "close", "add");
      })
      .catch((e) => {
        reqResError.innerHTML = e;
      })
      .finally(() => {
        switchClass(".req-res", "async", "remove");
      });
  };

  const createFormSubmit = (form, submitMethod = () => {}) => {
    document.querySelector(`${form}`).addEventListener("submit", (e) => {
      e.preventDefault();
      let formObj = e.target;
      const formVals = formToJson(formObj);
      submitMethod(formVals);
    });
  };

  /* -------ASYNC --------- */

  const fetchEvents = () => {
    requestCycle.START();
    server({
      url: "events" /* "error" */,
      resolve: (res) => {
        if (res.data.length === 0) {
          requestCycle.BAD();
          return (document.querySelector(
            ".server-message"
          ).innerHTML = errorMsg("No Records found"));
        }
        makePageList(res.data);
        requestCycle.GOOD();
      },
      reject: (err) => {
        document.querySelector(".server-message").innerHTML = errorMsg();
        requestCycle.BAD();
      },
    });
  };

  const searchEvents = (search) => {
    requestCycle.START();
    server({
      url: `events?q=${search}` /* "error" */,
      resolve: (res) => {
        if (res.data.length === 0) {
          requestCycle.BAD();
          return (document.querySelector(
            ".server-message"
          ).innerHTML = errorMsg("No Records found"));
        }
        makePageList(res.data);
        requestCycle.GOOD();
      },
      reject: (err) => {
        document.querySelector(".server-message").innerHTML = errorMsg();
        requestCycle.BAD();
      },
    });
  };

  const createEventItem = (data) => {
    return new Promise((resolve, reject) => {
      server({
        url: `events` /* "error" */,
        method: "POST",
        body: data,
        resolve: (res) => {
          if (res.data) {
            fetchEvents();
          }
          resolve(res);
        },
        reject: (err) => {
          requestCycle.BAD();
          reject(err);
        },
      });
    });
  };

  const deleteEvent = (event) => {
    return new Promise((resolve, reject) => {
      if (!confirm("Are you sure you want to delete this item?")) return;
      server({
        url: `events?id=${event}` /* "error" */,
        method: "DELETE",
        resolve: (res) => {
          if (res.data) {
            fetchEvents();
          }
          resolve();
        },
        reject: (err) => {
          requestCycle.BAD();
          reject();
        },
      });
    });
  };

  fetchEvents();
  createFormSubmit(".modal-event", makeEvent);
})();
