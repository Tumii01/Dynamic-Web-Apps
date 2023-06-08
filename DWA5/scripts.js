const form = document.querySelector("[data-form]");
const result = document.querySelector("[data-result]");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const entries = new FormData(event.target);
    const { dividend, divider } = Object.fromEntries(entries);




    if (!dividend || !divider) {
        result.innerText = "Division not performed. Both values are required in inputs. Try again";
      } else if (divider < 0) {
        result.innerText = "Division not performed. Invalid number provided. Try again";
        console.error("Invalid number provided");
        console.trace();
      } else if (isNaN(dividend) || isNaN(divider)) {
        result.innerText = "Something critical went wrong. Please reload the page";
        console.error("Critical error: Non-numeric value provided");
        console.trace();
      } else {
        result.innerText = Math.floor(dividend / divider);
      }
    });

  
//     try {
//       if (!dividend || !divider) {
//         throw new Error("Division not performed. Both values are required in inputs. Try again");
//       }
  
//       if (isNaN(dividend) || isNaN(divider)) {
//         throw new Error("Something critical went wrong. Please reload the page");
//       }
  
//       if (divider < 0) {
//         throw new Error("Division not performed. Invalid number provided. Try again");
//       }
  
//       result.innerText = Math.floor(dividend / divider);
//     } catch (error) {
//       result.innerText = error.message;
//       console.error("Error:", error.message);
//       console.trace();
//     }
//   });
  