const yesButton = document.getElementById("yes");
const message = document.getElementById("message");

yesButton.addEventListener("click", function () {
  message.textContent = "Yay! I knew it! 💖";
});
