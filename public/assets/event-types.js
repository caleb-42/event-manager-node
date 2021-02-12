(() => {
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
  };

  const fetchEventTypes = () => {
    requestCycle.START();
    server({
      url: "event-types" /* "error" */,
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

  fetchEventTypes();
})();
