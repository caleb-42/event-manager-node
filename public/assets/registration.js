(() => {
  const user = localStorage.getItem("user");
  if (!user) window.location = "/admin-login.html";

  switchEvents("#navicon", ["#app-drawer", "close", "remove"]);
  switchEvents("#app-drawer #aside-backdrop", ["#app-drawer", "close", "add"]);
  switchEvents("#app-drawer .back-arrows", ["#app-drawer", "close", "add"]);

  const notify = (item) => {
    const id = item.dataset.id;
    console.log(id);
    notifyUsers(id);
  };

  document.querySelectorAll("input.search-input").forEach((item) => {
    console.log(item);
    item.addEventListener("input", (e) => {
      console.log("asc", e.target.value);
      searchRegistration(e.target.value);
    });
  });

  const makePageList = (res) => {
    let list = "";
    res.map((item) => {
      list += registrationItem(item);
    });
    document.querySelector(".item-con").innerHTML = list;
    document.querySelectorAll(".notify-btn").forEach((item) => {
      item.addEventListener("click", () => notify(item));
    });
  };

  const fetchRegistrations = () => {
    requestCycle.START();
    server({
      url: "event/registration" /* "error" */,
      resolve: (res) => {
        console.log(res);
        if (res.data.length === 0) {
          requestCycle.BAD();
          return (document.querySelector(
            ".server-message"
          ).innerHTML = errorMsg("No Records found"));
        }
        makePageList(res.data);
        requestCycle.GOOD();
      },
      reject: (err) => {
        document.querySelector(".server-message").innerHTML = errorMsg();
        requestCycle.BAD();
      },
    });
  };

  const searchRegistration = (email) => {
    requestCycle.START();
    server({
      url: `event/registration?email=${email}` /* "error" */,
      resolve: (res) => {
        if (res.data.length === 0) {
          requestCycle.BAD();
          return (document.querySelector(
            ".server-message"
          ).innerHTML = errorMsg("No Records found"));
        }
        console.log(res);
        makePageList(res.data);
        requestCycle.GOOD();
      },
      reject: (err) => {
        document.querySelector(".server-message").innerHTML = errorMsg();
        requestCycle.BAD();
      },
    });
  };

  const notifyUsers = (id) => {
    requestCycle.START();
    server({
      url: `registration/notify?id=${id}` /* "error" */,
      resolve: (res) => {
        fetchRegistrations();
        requestCycle.GOOD();
      },
      reject: (err) => {
        requestCycle.BAD();
      },
    });
  };

  fetchRegistrations();
})();
