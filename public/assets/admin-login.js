(() => {
  /* --------RETRIEVERS--------- */

  const reqResError = document.querySelector(".modal-login .req-res .error-hd");

  const createFormSubmit = (form, submitMethod = () => {}) => {
    document.querySelector(`${form}`).addEventListener("submit", (e) => {
      e.preventDefault();
      let formObj = e.target;
      const formVals = formToJson(formObj);
      reqResError.innerHTML = "";
      switchClass(".req-res", "async", "add");
      submitMethod(formVals)
        .then(() => {
          switchClass("#modal", "close", "add");
        })
        .catch((e) => {
          reqResError.innerHTML = e;
        })
        .finally(() => {
          switchClass(".req-res", "async", "remove");
        });
    });
  };

  const loginAsync = (body) => {
    return new Promise((resolve, reject) => {
      server({
        url: `auth/login` /* "error" */,
        method: "POST",
        body,
        resolve: (res) => {
          if (res.data) {
            window.localStorage.setItem("user", res.data.token);
            window.location = "/admin-events.html";
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

  createFormSubmit(".modal-login", loginAsync);
})();
