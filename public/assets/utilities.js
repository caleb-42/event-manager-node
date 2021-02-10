const switchClass = (target, toggleClass, type = "toggle") => {
  try {
    const objs = document.querySelectorAll(`${target}`);
    objs.forEach((obj) => {
      if (type === "toggle") obj.classList.toggle(toggleClass);
      if (type === "add" && !obj.classList.contains(toggleClass))
        obj.classList.add(toggleClass);
      if (type === "remove" && obj.classList.contains(toggleClass))
        obj.classList.remove(toggleClass);
    });
  } catch (e) {
    console.error(e);
    return false;
  }
  return true;
};

const switchEvents = (target, arg) => {
  document.querySelector(target).addEventListener("click", () => {
    switchClass(arg[0], arg[1], arg[2]);
  });
};
