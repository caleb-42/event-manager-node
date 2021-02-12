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
  };

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

  fetchEvents();
})();
