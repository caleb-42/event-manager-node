(() => {
  switchEvents("#modal #modal-bg", ["#modal", "close", "add"]);
  switchEvents("#modal #modal-bg", ["#modal", "close", "add"]);
  switchEvents("#modal .modal-close-btn", ["#modal", "close", "add"]);
  switchEvents("#navicon", ["#app-drawer", "close", "remove"]);
  switchEvents("#app-drawer .back-arrows", ["#app-drawer", "close", "add"]);
  switchEvents("#app-drawer #aside-backdrop", ["#app-drawer", "close", "add"]);
  switchEvents("#modal .modal-close-btn", ["#modal", "close", "add"]);
  let params = window.location.href.split("/");
  let event = params[params.length - 1];

  const makePageItem = (res) => {
    document.querySelector("nav .header-nav .date").innerHTML = singleEventDate(
      res
    );
    document.querySelector(
      "nav .header-nav .middle"
    ).innerHTML = singleEventTitleLocation(res);
    document.querySelector("main .item-con .desc").innerHTML = singleEventBody(
      res
    );
    document.querySelector(
      "main .item-con .event-types-con span"
    ).innerHTML = singleEditEventTypes(res);
    let speakerList = singleEditEventSpeakers(res);
    let speakr = document.querySelector("main .item-con .speakers");
    speakr.innerHTML = speakerList
      ? `<div class="speaker-list">${speakerList}</div>`
      : "";
  };

  const fetchEventItem = server({
    url: `events?id=${event}` /* "error" */,
    resolve: (res) => {
      if (!res.data) {
        requestCycle.BAD();
        return (document.querySelector(".server-message").innerHTML = errorMsg(
          "Item not found"
        ));
      }
      console.log(res);
      switchEvents("#edit-event", ["#modal", "edit-event", "replace"]);
      switchEvents("#edit-event-type", [
        "#modal",
        "edit-event-type",
        "replace",
      ]);
      switchEvents("#edit-speaker", ["#modal", "edit-speaker", "replace"]);

      requestCycle.GOOD();
      makePageItem(res.data);
    },
    reject: (err) => {
      document.querySelector(".loader-con").innerHTML = errorMsg();
      requestCycle.BAD();
    },
  });
  fetchEventItem();
})();
