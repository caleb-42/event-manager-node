(() => {
  const user = localStorage.getItem("user");
  if (!user) window.location = "/admin-login.html";
  switchEvents("#modal #modal-bg", ["#modal", "close", "add"]);
  switchEvents("#modal .modal-close-btn", ["#modal", "close", "add"]);
  switchEvents("#navicon", ["#app-drawer", "close", "remove"]);
  switchEvents("#app-drawer #aside-backdrop", ["#app-drawer", "close", "add"]);
  switchEvents("#app-drawer .back-arrows", ["#app-drawer", "close", "add"]);
  switchEvents("#new-event", ["#modal", "close", "remove"]);

  const makePageList = (res) => {
    let list = "";
    res.map((item) => {
      list += eventTypeItem(item);
    });
    document.querySelector(".item-con").innerHTML = list;
    document.querySelectorAll(".item .remove-icon").forEach((item) => {
      console.log(item);
      item.addEventListener("click", (e) => {
        console.log(item);
        deleteEventType(item.dataset.id);
      });
    });
    /* document.querySelectorAll(".item-con .item").forEach((item) => {
      item.addEventListener("click", (e) => {
        console.log(e.target);
        if (e.target.classList.contains("remove-icon")) {
          deleteEventType(item.dataset.name);
        }
      });
    }); */
  };

  /* --------ACTIONS------- */
  const makeEventType = (form) => {
    createEventType(form).then(() => {
      switchClass("#modal", "close", "add");
    });
  };

  const createFormSubmit = (form, submitMethod = () => {}) => {
    document.querySelector(`${form} .submit`).addEventListener("click", (e) => {
      let formObj = document.querySelector(`form${form}`);
      const formVals = formToJson(formObj);
      console.log(formVals);
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
        console.log(res);
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
          console.log(res);
          resolve();
        },
        reject: (err) => {
          requestCycle.BAD();
          reject();
        },
      });
    });
  };

  const deleteEventType = (eventType) => {
    return new Promise((resolve, reject) => {
      server({
        url: `event-types?id=${eventType}` /* "error" */,
        method: "DELETE",
        resolve: (res) => {
          if (res.data) {
            fetchEventTypes();
          }
          console.log(res);
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
