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

  server({
    url: `api/events?id=${event}` /* "error" */,
    resolve: (res) => {
      console.log(res);
      switchEvents("#edit-event", ["#modal", "edit-event", "replace"]);
      switchEvents("#edit-event-type", [
        "#modal",
        "edit-event-type",
        "replace",
      ]);
      switchEvents("#edit-speaker", ["#modal", "edit-speaker", "replace"]);

      switchClass(".loader-con", "gone", "add");
      switchClass(".item-block", "gone", "remove");
      document.querySelector(
        "nav .header-nav .date"
      ).innerHTML = singleEventDate(res);
      document.querySelector(
        "nav .header-nav .middle"
      ).innerHTML = singleEventTitleLocation(res);
      document.querySelector(
        "main .item-con .desc"
      ).innerHTML = singleEventBody(res);
      document.querySelector(
        "main .item-con .event-types span"
      ).innerHTML = singleEventTypes(res);
      let speakerList = singleEventSpeakers(res);
      let speakr = document.querySelector("main .item-con .speakers");
      speakr.innerHTML = speakerList
        ? `<div class="speaker-list">${speakerList}</div>`
        : "";
    },
    reject: (err) => {
      document.querySelector(".loader-con").innerHTML = errorMsg();
    },
  });
})();
