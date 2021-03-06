(() => {
  const user = localStorage.getItem("user");
  if (!user) window.location = "/admin-login.html";
  const state = {
    eventTypes: [],
    event: {},
  };

  switchEvents("#modal #modal-bg", ["#modal", "close", "add"]);
  switchEvents("#modal #modal-bg", ["#modal", "close", "add"]);
  switchEvents("#modal .modal-close-btn", ["#modal", "close", "add"]);
  switchEvents("#navicon", ["#app-drawer", "close", "remove"]);
  switchEvents("#app-drawer .back-arrows", ["#app-drawer", "close", "add"]);
  switchEvents("#app-drawer #aside-backdrop", ["#app-drawer", "close", "add"]);
  switchEvents("#modal .modal-close-btn", ["#modal", "close", "add"]);
  switchEvents("#edit-event", ["#modal", "edit-event", "replace"]);
  switchEvents("#edit-event-type", ["#modal", "edit-event-type", "replace"]);
  switchEvents("#edit-speaker", ["#modal", "edit-speaker", "replace"]);
  document.querySelector("#edit-event").addEventListener("click", (e) => {
    const form = document.querySelector("form.modal-event");
    console;
    form.name.value = state.event.name;
    form.location.value = state.event.location;
    form.description.value = state.event.description;
    form.start_date.valueAsDate = new Date(state.event.start_date);
    form.end_date.valueAsDate = new Date(state.event.end_date);
  });
  let params = window.location.href.split("/");
  let event = params[params.length - 1];

  const eventFormObj = document.querySelector("form.modal-event");
  const eventReqResError = document.querySelector(
    ".modal-event .req-res .error-hd"
  );

  const speakerFormObj = document.querySelector("form.modal-speaker");
  const speakerReqResError = document.querySelector(
    ".modal-speaker .req-res .error-hd"
  );

  const eventTypeReqResError = document.querySelector(
    ".modal-event-type .req-res .error-hd"
  );

  /* ------MAKERS------- */
  const makeEventTypes = (res) => {
    document.querySelector(
      "main .item-con .event-types-con div.types"
    ).innerHTML = singleEditEventTypes(res);
    document.querySelectorAll(".event-types .chip").forEach((item) => {
      item.addEventListener("click", (e) => {
        deleteEventType(item.dataset.id);
      });
    });
  };

  const makeEventList = (data) => {
    let list = "";
    data.map((item) => {
      list += eventTypeListItem(item);
    });
    document.querySelector(".modal-event-type #event-type").innerHTML = list;
  };

  const makeEvent = (res) => {
    document.querySelector("nav .header-nav .date").innerHTML = singleEventDate(
      res
    );
    document.querySelector(
      "nav .header-nav .middle"
    ).innerHTML = singleEventTitleLocation(res);
    document.querySelector("main .item-con .desc").innerHTML = singleEventBody(
      res
    );
  };

  const makeSpeakers = (res) => {
    let speakerList = singleEditEventSpeakers(res);
    let speakr = document.querySelector("main .item-con .speakers");
    speakr.innerHTML = speakerList
      ? `<div class="speaker-list">${speakerList}</div>`
      : "";
    document.querySelectorAll(".speaker .remove-icon").forEach((item) => {
      item.addEventListener("click", (e) => {
        deleteSpeaker(item.dataset.name);
      });
    });
  };

  const makePageItem = (res) => {
    makeEvent(res);
    makeEventTypes(res);
    makeSpeakers(res);
  };

  /* --------ACTIONS------- */
  const deleteSpeaker = (name) => {
    let oldSpeakers = [];
    if (state.event && state.event.speakers) oldSpeakers = state.event.speakers;

    const speakers = oldSpeakers.filter((element) => element.name !== name);
    editEventItem({ speakers });
  };

  const deleteEventType = (id) => {
    let oldEventTypes = [];
    if (state.event && state.event.event_types)
      oldEventTypes = state.event.event_types;

    const eventTypes = oldEventTypes.filter(
      (element) => element.id !== Number(id)
    );
    const event_types = eventTypes.map((item) => item.id);
    editEventItem({ event_types });
  };

  const addEventType = (form) => {
    let oldEventTypes = [];
    if (state.event && state.event.event_types)
      oldEventTypes = state.event.event_types;

    const eventTypes = oldEventTypes.map((item) => item.id);
    eventTypes.push(form["event-types"]);

    eventTypeReqResError.innerHTML = "";
    switchClass("#event-type-req-res", "async", "add");
    editEventItem({ event_types: eventTypes })
      .then(() => {
        switchClass("#modal", "close", "add");
      })
      .catch((e) => {
        eventTypeReqResError.innerHTML = e;
      })
      .finally(() => {
        switchClass("#event-type-req-res", "async", "remove");
      });
  };

  const addSpeaker = (form) => {
    let oldEventSpeakers = [];
    if (state.event && state.event.speakers)
      oldEventSpeakers = state.event.speakers;

    const eventSpeakers = oldEventSpeakers.map((item) => item);
    eventSpeakers.push(form);

    speakerReqResError.innerHTML = "";
    switchClass("#speakers-req-res", "async", "add");
    editEventItem({ speakers: eventSpeakers })
      .then(() => {
        speakerFormObj.name.value = "";
        speakerFormObj.desc.value = "";
        switchClass("#modal", "close", "add");
      })
      .catch((e) => {
        speakerReqResError.innerHTML = e;
      })
      .finally(() => {
        switchClass("#speakers-req-res", "async", "remove");
      });
  };

  const editEvent = (form) => {
    let oldEvent = {};
    if (state.event && state.event) oldEvent = state.event;
    if (form.start_date)
      form.start_date = new Date(form.start_date).toISOString();
    if (form.end_date) form.end_date = new Date(form.end_date).toISOString();
    const event = {
      start_date: form.start_date || oldEvent.start_date,
      end_date: form.end_date || oldEvent.end_date,
      location: form.location || oldEvent.location,
      name: form.name || oldEvent.name,
      description: form.description || oldEvent.description,
    };

    eventReqResError.innerHTML = "";
    switchClass("#event-req-res", "async", "add");
    editEventItem(event)
      .then(() => {
        eventFormObj.name.value = "";
        eventFormObj.location.value = "";
        eventFormObj.start_date.valueAsDate = null;
        eventFormObj.end_date.valueAsDate = null;
        eventFormObj.description.value = "";
        switchClass("#modal", "close", "add");
      })
      .catch((e) => {
        eventReqResError.innerHTML = e;
      })
      .finally(() => {
        switchClass("#event-req-res", "async", "remove");
      });
  };

  /* --------RETRIEVERS--------- */

  const createFormSubmit = (form, submitMethod = () => {}) => {
    document.querySelector(`${form}`).addEventListener("submit", (e) => {
      e.preventDefault();
      let formObj = e.target;
      const formVals = formToJson(formObj);
      submitMethod(formVals);
    });
  };

  /* ---------ASYNC REQUESTS----------- */

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
        state.event = res.data;
        requestCycle.GOOD();
        makePageItem(res.data);
      },
      reject: (err) => {
        document.querySelector(".loader-con").innerHTML = errorMsg();
        requestCycle.BAD();
      },
    });

  const editEventItem = (data) => {
    return new Promise((resolve, reject) => {
      server({
        url: `events?id=${event}` /* "error" */,
        method: "PATCH",
        body: data,
        resolve: (res) => {
          if (res.data) {
            fetchEventItem();
          }
          resolve(res);
        },
        reject: (err) => {
          requestCycle.BAD();
          reject(err);
        },
      });
    });
  };

  const getEventTypes = (data) =>
    server({
      url: "event-types" /* "error" */,
      resolve: (res) => {
        if (!res.data) return;
        state.eventTypes = res.data;
        makeEventList(res.data);
      },
    });

  /* ------------CALLS ON LOAD---------- */
  fetchEventItem();
  getEventTypes();
  createFormSubmit(".modal-event-type", addEventType);
  createFormSubmit(".modal-speaker", addSpeaker);
  createFormSubmit(".modal-event", editEvent);
})();
