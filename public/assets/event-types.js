(() => {
  const user = localStorage.getItem("user");
  if (!user) window.location = "/admin-login.html";
  switchEvents("#modal #modal-bg", ["#modal", "close", "add"]);
  switchEvents("#modal .modal-close-btn", ["#modal", "close", "add"]);
  switchEvents("#navicon", ["#app-drawer", "close", "remove"]);
  switchEvents("#app-drawer #aside-backdrop", ["#app-drawer", "close", "add"]);
  switchEvents("#app-drawer .back-arrows", ["#app-drawer", "close", "add"]);
  switchEvents("#new-event", ["#modal", "close", "remove"]);

  const formObj = document.querySelector("form.modal-event-type");
  const reqResError = document.querySelector(".req-res .error-hd");

  const makePageList = (res) => {
    let list = "";
    res.map((item) => {
      list += eventTypeItem(item);
    });
    document.querySelector(".item-con").innerHTML = list;
    document.querySelectorAll(".item .remove-icon").forEach((item) => {
      item.addEventListener("click", (e) => {
        deleteEventType(item.dataset.id);
      });
    });
  };

  /* --------ACTIONS------- */
  const makeEventType = (form) => {
    reqResError.innerHTML = "";
    switchClass(".req-res", "async", "add");
    createEventType(form)
      .then(() => {
        formObj.name.value = "";
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

  /* -------ASYNC----------- */
  const fetchEventTypes = () => {
    requestCycle.START();
    server({
      url: "event-types" /* "error" */,
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

  const createEventType = (data) => {
    return new Promise((resolve, reject) => {
      server({
        url: `event-types` /* "error" */,
        method: "POST",
        body: data,
        resolve: (res) => {
          if (res.data) {
            fetchEventTypes();
          }
          resolve();
        },
        reject: (err) => {
          requestCycle.BAD();
          reject(err);
        },
      });
    });
  };

  const deleteEventType = (eventType) => {
    return new Promise((resolve, reject) => {
      if (!confirm("Are you sure you want to delete this item?")) return;
      server({
        url: `event-types?id=${eventType}` /* "error" */,
        method: "DELETE",
        resolve: (res) => {
          if (res.data) {
            fetchEventTypes();
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

  fetchEventTypes();
  createFormSubmit(".modal-event-type", makeEventType);
})();
