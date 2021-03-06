(() => {
  switchEvents("#modal #modal-bg", ["#modal", "close", "add"]);
  switchEvents("#modal .modal-close-btn", ["#modal", "close", "add"]);
  let params = window.location.href.split("/");
  let event = params[params.length - 1];

  const formObj = document.querySelector("form.modal-register");
  const reqResError = document.querySelector(".req-res .error-hd");

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
    const premium = res.event_types.find(
      (item) => item.name === "Premium-only Webinar"
    );
    if (premium) switchClass("#modal-dialog", "premium", "replace");
  };

  const createFormSubmit = (form, submitMethod = () => {}) => {
    document.querySelector(`${form}`).addEventListener("submit", (e) => {
      e.preventDefault();
      let formObj = e.target;
      const formVals = formToJson(formObj);
      submitMethod(formVals);
    });
  };

  const registerForEvent = (form) => {
    form.event_id = Number(event);
    switchClass(".req-res", "async", "add");
    registerEvent(form)
      .then(() => {
        formObj.name.value = "";
        formObj.email.value = "";
        reqResError.innerHTML =
          "your registered was a success, check your email for confirmation";
        setTimeout(() => {
          switchClass("#modal", "close", "add");
          reqResError.innerHTML = "";
        }, 4500);
      })
      .catch((e) => {
        reqResError.innerHTML = e;
      })
      .finally(() => {
        switchClass(".req-res", "async", "remove");
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
          resolve();
        },
        reject: (err) => {
          requestCycle.BAD();
          reject(err);
        },
      });
    });
  };
  fetchEventItem();
  createFormSubmit(".modal-register", registerForEvent);
})();
