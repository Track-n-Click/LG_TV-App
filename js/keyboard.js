export let isKeyboardVisible = false;
export let selectedRow = 0;
export let selectedCol = 0;

// ---- On-screen Keyboard Code ---- //
const keyboardLayout = [
  [
    { key: "1" },
    { key: "2" },
    { key: "3" },
    { key: "4" },
    { key: "5" },
    { key: "6" },
    { key: "7" },
    { key: "8" },
    { key: "9" },
    { key: "0" },
    { key: "-", label: "=" },
    { key: "delete" },
  ],
  [
    { key: "tab" },
    { key: "q" },
    { key: "w" },
    { key: "e" },
    { key: "r" },
    { key: "t" },
    { key: "y" },
    { key: "u" },
    { key: "i" },
    { key: "o" },
    { key: "p" },
    { key: "[" },
    { key: "]" },
    { key: "\\" },
  ],
  [
    { key: "caps" },
    { key: "a" },
    { key: "s" },
    { key: "d" },
    { key: "f" },
    { key: "g" },
    { key: "h" },
    { key: "j" },
    { key: "k" },
    { key: "l" },
    { key: ";" },
    { key: "'", label: '"' },
    { key: "enter" },
  ],
  [
    { key: "shift" },
    { key: "z" },
    { key: "x" },
    { key: "c" },
    { key: "v" },
    { key: "b" },
    { key: "n" },
    { key: "m" },
    { key: "," },
    { key: "." },
    { key: "/" },
    { key: "shift" },
  ],
  [{ key: ".com" }, { key: "@" }, { key: "SPACE", w: 600 }],
];

export function generateKeyboard() {
  const keyboardContainer = document.getElementById("on-screen-keyboard");
  keyboardContainer.innerHTML = ""; // Clear existing keyboard

  keyboardLayout.forEach((row, rowIndex) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("keyboard-row");
    rowDiv.setAttribute("data-row", rowIndex); // Set row attribute

    row.forEach((key, keyIndex) => {
      const keyDiv = document.createElement("div");
      keyDiv.classList.add("keyboard-key");
      keyDiv.setAttribute("data-key", key.key);
      keyDiv.setAttribute("data-col", keyIndex); // Set column attribute
      keyDiv.textContent = key.label || key.key; // If there's a label, use it; otherwise, use the key itself

      // Special handling for wide keys like SPACE, ENTER, etc.
      if (key.w) {
        keyDiv.style.width = `${key.w}px`;
      }

      // Add unique styling for special keys like backspace, enter, etc.
      if (["delete", "enter", "shift", "tab", "caps"].includes(key.key)) {
        keyDiv.classList.add("special-key");
      }

      rowDiv.appendChild(keyDiv);
    });

    keyboardContainer.appendChild(rowDiv);
  });
  keyboardContainer.classList.add("show");

  isKeyboardVisible = true;
  adjustModalForKeyboard(true);
  highlightKey();
}

export function highlightKey() {
  // Remove current highlights
  document
    .querySelectorAll(".keyboard-key")
    .forEach((key) => key.classList.remove("focused"));

  const selectedKey = document.querySelector(
    `.keyboard-row[data-row="${selectedRow}"] .keyboard-key[data-col="${selectedCol}"]`
  );
  if (selectedKey) {
    selectedKey.classList.add("focused"); // Add highlight to the selected key
  }
}

export function pressKey(inputField) {
  const selectedKey = document.querySelector(
    `.keyboard-row[data-row="${selectedRow}"] .keyboard-key[data-col="${selectedCol}"]`
  );
  // const inputField =
  //   document.querySelectorAll("#login-modal input")[activeInputIndex]; // The current input field

  if (!selectedKey || !inputField) return false; // Make sure both the selected key and input field exist

  if (selectedKey.dataset.key === "delete") {
    inputField.value = inputField.value.slice(0, -1); // Delete the last character
  } else if (selectedKey.dataset.key === "enter") {
    closeKeyboard(); // Close keyboard when Enter is pressed
    return true;
  } else if (
    selectedKey.dataset.key !== "shift" &&
    selectedKey.dataset.key !== "caps"
  ) {
    inputField.value += selectedKey.dataset.key; // Add the pressed key's value to the input
  }
  return false;
}

export function openKeyboard() {
  const keyboard = document.getElementById("on-screen-keyboard");
  if (!isKeyboardVisible && keyboard) {
    generateKeyboard();
    // keyboard.classList.remove("show");
    // isKeyboardVisible = true;
    // activeInputIndex = inputIndex; // Track the input field currently being focused
    // selectedRow = 0;
    // selectedCol = 0;
    // highlightKey(); // Focus the first key
    // document.addEventListener("keydown", navigateKeyboard); // Enable arrow key navigation for the keyboard
    // // Adjust modal top margin when keyboard opens
    // adjustModalForKeyboard(true);
  }
}

export function closeKeyboard() {
  const keyboard = document.getElementById("on-screen-keyboard");
  if (keyboard) {
    keyboard.classList.remove("show");
    isKeyboardVisible = false;
    document.removeEventListener("keydown", navigateKeyboard);
    adjustModalForKeyboard(false);
  }
}

export function adjustModalForKeyboard(isOpen) {
  const modalContent = document.querySelector(".modal-content");
  if (modalContent) {
    modalContent.style.marginTop = isOpen ? "50px" : "150px";
  }
}

// Handle keyboard navigation
export function navigateKeyboard(event, inputField) {
  if (!isKeyboardVisible) return;

  const numRows = document.querySelectorAll(".keyboard-row").length;
  const numCols = document.querySelectorAll(
    `.keyboard-row[data-row="${selectedRow}"] .keyboard-key`
  ).length;

  switch (event.key) {
    case "ArrowUp":
      selectedRow = (selectedRow - 1 + numRows) % numRows;
      break;
    case "ArrowDown":
      selectedRow = (selectedRow + 1) % numRows;
      break;
    case "ArrowLeft":
      selectedCol = (selectedCol - 1 + numCols) % numCols; // Cycle left through the columns
      break;
    case "ArrowRight":
      selectedCol = (selectedCol + 1) % numCols; // Cycle right through the columns
      break;
    case "Enter":
      if (pressKey(inputField)) {
        closeKeyboard(); // Close keyboard when "Enter" is pressed on the keyboard's "Enter" key
      }
      break;
    case "Escape":
      closeKeyboard(); // Close the keyboard when "Escape" is pressed
      break;
    default:
      return; // Ignore other keys
  }
  highlightKey(); // Update the visual highlight on the keyboard
  event.preventDefault(); // Prevent default behavior
}
