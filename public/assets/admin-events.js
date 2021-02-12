(() => {
  switchEvents("#modal #modal-bg", ["#modal", "close", "add"]);
  switchEvents("#modal .modal-close-btn", ["#modal", "close", "add"]);
  switchEvents("#navicon", ["#app-drawer", "close", "remove"]);
  switchEvents("#app-drawer #aside-backdrop", ["#app-drawer", "close", "add"]);
  switchEvents("#app-drawer .back-arrows", ["#app-drawer", "close", "add"]);
  switchEvents(".grid-toggle", ["body", "grid", "add"]);
  switchEvents(".list-toggle", ["body", "grid", "remove"]);
  switchEvents("#new-event", ["#modal", "close", "remove"]);

  document.querySelectorAll("input.search-input").forEach((item) => {
    console.log(item);
    item.addEventListener("input", (e) => {
      console.log("asc", e.target.value);
      searchEvents(e.target.value);
    });
  });

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
    form.start_date = new Date(form.start_date).toISOString();
    form.end_date = new Date(form.end_date).toISOString();

    createEventItem(form).then(() => {
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

  /* -------ASYNC --------- */

  const fetchEvents = () => {
    requestCycle.START();
    server({
      url: "events" /* "error" */,
      resolve: (res) => {
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

  const deleteEvent = (event) => {
    return new Promise((resolve, reject) => {
      server({
        url: `events?id=${event}` /* "error" */,
        method: "DELETE",
        resolve: (res) => {
          if (res.data) {
            fetchEvents();
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

  fetchEvents();
  createFormSubmit(".modal-event", makeEvent);
})();
