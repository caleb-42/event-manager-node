(() => {
  switchEvents("#modal #modal-bg", ["#modal", "close", "add"]);
  switchEvents("#modal .modal-close-btn", ["#modal", "close", "add"]);
  switchEvents("#navicon", ["#app-drawer", "close", "remove"]);
  switchEvents("#app-drawer #aside-backdrop", ["#app-drawer", "close", "add"]);
  switchEvents("#app-drawer .back-arrows", ["#app-drawer", "close", "add"]);
  switchEvents("#new-event", ["#modal", "close", "remove"]);
  server({
    url: "api/events" /* "error" */,
    resolve: (res) => {
      let list = "";
      res.map((item) => {
        list += eventTypeItem(item);
      });
      switchClass(".loader-con", "gone", "add");
      switchClass(".item-block", "gone", "remove");
      document.querySelector(".item-con").innerHTML = list;
    },
    reject: (err) => {
      document.querySelector(".loader-con").innerHTML = errorMsg();
    },
  });
})();
