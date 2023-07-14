"use strict";

let words = document.querySelector(".wordCount");
let characters = document.querySelector(".charCount");

let showError = document.querySelector(".errorText");
let english = document.querySelector(".english");
let urdu = document.querySelector(".urdu");

const submit = document.querySelector(".submit");

let word = 0;
let char = 0;
let isPreviousChar = false;

words.textContent = word;
characters.textContent = char;

submit.addEventListener("click", async function () {
  const url = "https://api.openai.com/v1/completions";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer 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",
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: `Translate the following Roman Urdu text to English: ${urdu.value}`,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      // Handle API error response
      throw new Error("API error: " + response.status);
    }

    const data = await response.json();
    console.log(data);

    if (data.choices && data.choices.length > 0) {
      console.log(data.choices[0].text.trim());
      english.value = data.choices[0].text.trim();
    }
  } catch (error) {
    // Handle other errors, such as network errors or parsing errors
    console.error("An error occurred:", error.message);
  }

  urdu.value = "";
  word = char = 0;
  words.textContent = word;
  characters.textContent = char;
});

urdu.addEventListener("keydown", function (e) {
  if (e.key === " " && isPreviousChar) {
    word++;
    char++;
    isPreviousChar = false;
  } else if (
    e.key.length === 1 &&
    e.key !== "ArrowUp" &&
    e.key !== "ArrowDown" &&
    e.key !== "ArrowLeft" &&
    e.key !== "ArrowRight"
  ) {
    char++;

    if (e.key !== " ") {
      isPreviousChar = true;
    }
  } else if (e.key === "Backspace") {
    const lastChar = urdu.value[urdu.value.length - 1];
    const secondLastChar = urdu.value[urdu.value.length - 2];
    if (lastChar !== " " && secondLastChar === " " && word > 0) {
      word--;
    }
    if (char > 0) {
      char--;
      isPreviousChar = false;
    }

    if (lastChar === urdu.value[0] && word > 0) {
      word--;
    }
  }

  words.textContent = word;
  characters.textContent = char;
});
