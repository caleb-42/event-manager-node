(() => {
  switchEvents("#modal #modal-bg", ["#modal", "close", "add"]);
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
    document.querySelector("main .item-con p").innerHTML = singleEventBody(res);
    document.querySelector(
      "main .item-con .event-types"
    ).innerHTML = singleEventTypes(res);
    let speakerList = singleEventSpeakers(res);
    document.querySelector("main .item-con .speakers").innerHTML = speakerList
      ? `<h3>Speakers</h3>
    <div class="speaker-list">${speakerList}</div>`
      : "";
  };

  const createFormSubmit = (form, submitMethod = () => {}) => {
    document.querySelector(`${form} .submit`).addEventListener("click", (e) => {
      let formObj = document.querySelector(`form${form}`);
      const formVals = formToJson(formObj);
      console.log(formVals);
      submitMethod(formVals);
    });
  };

  const registerForEvent = (form) => {
    form.event_id = Number(event);
    registerEvent(form).then(() => {
      switchClass("#modal", "close", "add");
    });
  };

  const fetchEventItem = () =>
    server({
      url: `events?id=${event}` /* "error" */,
      resolve: (res) => {
        if (!res.data) {
          requestCycle.BAD();
          return (document.querySelector(
            ".server-message"
          ).innerHTML = errorMsg("Item not found"));
        }
        console.log(res);
        switchEvents("#register", ["#modal", "close", "remove"]);
        requestCycle.GOOD();
        makePageItem(res.data);
      },
      reject: (err) => {
        document.querySelector(".loader-con").innerHTML = errorMsg();
        requestCycle.BAD();
      },
    });

  const registerEvent = (data) => {
    return new Promise((resolve, reject) => {
      server({
        url: `event/registration` /* "error" */,
        method: "POST",
        body: data,
        resolve: (res) => {
          if (res.data) {
            fetchEventItem();
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
  fetchEventItem();
  createFormSubmit(".modal-register", registerForEvent);
})();
