(() => {
  const loginEvent = (form) => {
    loginAsync(form);
  };

  /* --------RETRIEVERS--------- */

  const createFormSubmit = (form, submitMethod = () => {}) => {
    document.querySelector(`${form} .submit`).addEventListener("click", (e) => {
      let formObj = document.querySelector(`form${form}`);
      const formVals = formToJson(formObj);
      submitMethod(formVals);
    });
  };

  const loginAsync = (body) => {
    server({
      url: `auth/login` /* "error" */,
      method: "POST",
      body,
      resolve: (res) => {
        if (res.data) {
          window.localStorage.setItem("user", res.data.token);
          window.location = "/admin-events.html";
        }
      },
      reject: (err) => {
        requestCycle.BAD();
      },
    });
  };

  createFormSubmit(".modal-login", loginEvent);
})();
