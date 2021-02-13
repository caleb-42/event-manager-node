const eventItem = (item, uri) => {
  let isSpecial = item.event_types.find((item) => {
    return ["Leap", "Recruiting Mission", "Hackathon"].includes(item.name);
  });
  let [day, month, year] = new Date(item.start_date)
    .toLocaleString("default", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .split(" ");
  return `
    <div onclick="window.location='${uri}/${item.id}'" class="item w-100 ${
    isSpecial ? "special" : ""
  }">
        <div class="list-item">
            <div class="date">
                <p>${day}</p>
                <p>${month}</p>
            </div>
            <div class="content">
                <div class="main">
                    <h5 class="title">${item.name}</h5>
                    <p class="location">${item.location}</p>
                </div>
                <div class="meta">
                    <p class="event-types">${
                      item.event_types
                        ? item.event_types
                            .map((val) =>
                              [
                                "Leap",
                                "Recruiting Mission",
                                "Hackathon",
                              ].includes(val.name)
                                ? `<span class="special-event-type">${val.name}</span>`
                                : val.name
                            )
                            .join(" | ")
                        : ""
                    }</p>
                </div>
            </div>
        </div>
        <div class="grid-item">
            <div class="content">
                <div class="main">
                    <h5 class="title">${item.name}</h5>
                    <p class="location">${item.location}</p>
                </div>

                <div class="date">
                    <p>${day} ${month} ${year}</p>
                </div>
            </div>
            <div class="meta">
                <p class="event-types">${
                  item.event_types
                    ? item.event_types.map((val) => val.name).join(" | ")
                    : ""
                }</p>
            </div>
        </div>
    </div>
`;
};

const eventEditItem = (item, uri) => {
  let isSpecial = item.event_types.find((item) => {
    return ["Leap", "Recruiting Mission", "Hackathon"].includes(item.name);
  });
  let [day, month, year] = new Date(item.start_date)
    .toLocaleString("default", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .split(" ");
  return `
    <div data-id="${item.id}" data-path="${uri}/${item.id}" class="item w-100 ${
      isSpecial ? "special" : ""
    }">
        <div class="list-item">
            <div class="date">
                <p>${day}</p>
                <p>${month}</p>
            </div>
            <div class="content">
                <div class="main">
                    <h5 class="title">${item.name}</h5>
                    <p class="location">${item.location}</p>
                </div>
                <div class="meta">
                    <p class="event-types">${
                      item.event_types
                        ? item.event_types
                            .map((val) =>
                              [
                                "Leap",
                                "Recruiting Mission",
                                "Hackathon",
                              ].includes(val.name)
                                ? `<span class="special-event-type">${val.name}</span>`
                                : val.name
                            )
                            .join(" | ")
                        : ""
                    }</p>
                      <button class="btn red anim remove-event">Delete</button>
                </div>
            </div>
        </div>
        <div class="grid-item">
            <div class="content">
                <div class="main">
                    <h5 class="title">${item.name}</h5>
                    <p class="location">${item.location}</p>
                </div>

                <div class="date">
                    <p>${day} ${month} ${year}</p>
                </div>
            </div>
            <div class="meta">
                <p class="event-types">${
                  item.event_types
                    ? item.event_types.map((val) => val.name).join(" | ")
                    : ""
                }</p>
                  <button  class="btn red anim remove-event">Delete</button>
            </div>
        </div>
    </div>
`;
};
const registrationItem = (item) => {
  let [day, month, year] = new Date(item.start_date)
    .toLocaleString("default", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .split(" ");
  return `
    <div class="item w-100">
        <div class="list-item">
            <div class="date">
                <p>${day}</p>
                <p>${month}</p>
            </div>
            <div class="content">
                <div class="main">
                    <h5 class="title">${item.event_name}</h5>
                    <p class="location">${item.email}</p>
                </div>
                <div class="meta d-flex align-items-center">
                    ${
                      item.notified
                        ? "notified"
                        : `<button class="btn green anim notify-btn" data-id=${item.id} class="notify">
                          notify
                        </button>`
                    }
                </div>
            </div>
        </div>
    </div>
`;
};
const eventTypeItem = (item) => {
  return `
    <div  class="item w-100">
        <div class="grid-item">
            <h5 class="title">${item.name}</h5>
            <div data-id="${item.id}" class="remove-icon ${
    [
      "MeetUp",
      "Leap",
      "Recruiting Mission",
      "Hackathon",
      "Premium-only Webinar",
      "Open Webinar",
    ].includes(item.name)
      ? "gone"
      : ""
  }">&times;</div>
        </div>
    </div>
`;
};

const eventTypeListItem = (item) => {
  return `<option value="${item.id}">${item.name}</option>`;
};

const loader = () => `<div class="loader-con flex-grow d-flex justify-content-center align-items-center">
<div class="loader"></div>
</div>`;

const errorMsg = (
  message = "Failed to fetch data, please refresh"
) => `<div class=" flex-grow d-flex justify-content-center align-items-center">
<p>${message}</p>
</div>`;

const singleEventDate = (item) => {
  let [day, month, year] = new Date(item.start_date)
    .toLocaleString("default", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .split(" ");
  return `<div class="date">
<p>${day} ${month} ${year}</p>
</div>`;
};

const singleEventTitleLocation = (item) => `<h1>${item.name}</h1>
<h5>${item.location}</h5>`;

const singleEventBody = (item) => `${item.description}`;

const singleEditEventTypes = (item) => {
  return `<div class="event-types">${
    item.event_types
      ? item.event_types
          .map(
            (val) =>
              `<div data-id="${val.id}" class="chip pointer">${val.name}&nbsp;&nbsp;&times;</div>`
          )
          .join("")
      : ""
  }</div>`;
};

const singleEditEventSpeakers = (item) => {
  return item.speakers
    .map(
      (speaker) => `
    <div class="speaker">
        <div class="dp" ${
          speaker.pic
            ? 'style="background-size: cover; background-image: url(' +
              speaker.pic +
              ")"
            : ""
        }">
        <div data-name="${speaker.name}" class="remove-icon">&times;</div>
        </div>
        <div class="details">
            <h6>${speaker.name}</h6>
            <span>${speaker.desc}</span>
        </div>
    </div>
  `
    )
    .join("");
};

const singleEventTypes = (item) =>
  `${item.event_types.map((val) => val.name).join(" | ")}`;

const singleEventSpeakers = (item) => {
  return item.speakers
    .map(
      (speaker) => `
    <div class="speaker">
        <div class="dp" ${
          speaker.pic
            ? 'style="background-size: cover; background-image: url(' +
              speaker.pic +
              ")"
            : ""
        }"></div>
        <div class="details">
            <h6>${speaker.name}</h6>
            <span>Software Developer</span>
        </div>
    </div>
  `
    )
    .join("");
};
