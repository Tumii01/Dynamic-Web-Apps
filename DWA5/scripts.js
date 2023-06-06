const form = document.querySelector("[data-form]");
const result = document.querySelector("[data-result]");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const entries = new FormData(event.target);
  const { dividend, divider } = Object.fromEntries(entries);

  if (!dividend || !divider) {
    result.innerText = "Division not performed. Both values are required in inputs. Try again";
    return;
  }

  if (divider < 0) {
    result.innerText = "Division not performed. Invalid number provided. Try again";
    console.error("Invalid number provided");
    console.trace();
    return;
  }

  if (isNaN(dividend) || isNaN(divider)) {
    result.innerText= "Something critical went wrong. Please reload the page";
    console.error("Critical error: Non-numeric value provided");
    console.trace();
    return;
  }


  result.innerText = Math.floor(dividend / divider);
});
