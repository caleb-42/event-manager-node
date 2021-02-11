(() => {
  switchEvents("#modal #modal-bg", ["#modal", "close", "add"]);
  switchEvents("#modal .modal-close-btn", ["#modal", "close", "add"]);
  let params = window.location.href.split("/");
  let event = params[params.length - 1];
  server({
    url: `api/events?id=${event}` /* "error" */,
    resolve: (res) => {
      console.log(res);
      switchEvents("#register", ["#modal", "close", "remove"]);
      switchClass(".loader-con", "gone", "add");
      switchClass(".item-block", "gone", "remove");
      document.querySelector(
        "nav .header-nav .date"
      ).innerHTML = singleEventDate(res);
      document.querySelector(
        "nav .header-nav .middle"
      ).innerHTML = singleEventTitleLocation(res);
      document.querySelector("main .item-con p").innerHTML = singleEventBody(
        res
      );
      document.querySelector(
        "main .item-con .event-types"
      ).innerHTML = singleEventTypes(res);
      let speakerList = singleEventSpeakers(res);
      document.querySelector("main .item-con .speakers").innerHTML = speakerList
        ? `<h3>Speakers</h3>
      <div class="speaker-list">${speakerList}</div>`
        : "";
    },
    reject: (err) => {
      document.querySelector(".loader-con").innerHTML = errorMsg();
    },
  });
})();
