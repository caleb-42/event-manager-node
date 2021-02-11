(() => {
  switchEvents(".grid-toggle", ["body", "grid", "add"]);
  switchEvents(".list-toggle", ["body", "grid", "remove"]);
  server({
    url: "api/events" /* "error" */,
    resolve: (res) => {
      let list = "";
      res.map((item) => {
        list += eventItem(item);
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
