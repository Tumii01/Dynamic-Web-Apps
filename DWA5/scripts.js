const form = document.querySelector("[data-form]");
const result = document.querySelector("[data-result]");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const entries = new FormData(event.target);
    const { dividend, divider } = Object.fromEntries(entries);
  
    try {
      if (!dividend || !divider) {
        throw new Error("Division not performed. Both values are required in inputs. Try again");
      }
  
      if (isNaN(dividend) || isNaN(divider)) {
        throw new Error("Something critical went wrong. Please reload the page");
      }
  
      if (divider < 0) {
        throw new Error("Division not performed. Invalid number provided. Try again");
      }
  
      result.innerText = Math.floor(dividend / divider);
    } catch (error) {
      result.innerText = error.message;
      console.error("Error:", error.message);
      console.trace();
    }
  });
  