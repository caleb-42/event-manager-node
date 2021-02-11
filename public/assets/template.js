const eventItem = (item) => {
  let [day, month, year] = new Date(item.start_date)
    .toLocaleString("default", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .split(" ");
  return `
    <div onclick="window.location='/event/${item.id}'" class="item w-100">
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
                    <p class="event-types">${item.event_types
                      .map((val) => val.name)
                      .join(" | ")}</p>
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
                <p class="event-types">${item.event_types
                  .map((val) => val.name)
                  .join(" | ")}</p>
            </div>
        </div>
    </div>
`;
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

const singleEventBody = (item) => item.description;

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
