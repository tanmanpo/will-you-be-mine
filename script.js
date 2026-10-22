const yesButton = document.getElementById("yes");
const noButton = document.getElementById("no");
const message = document.getElementById("message");

yesButton.addEventListener("click", function () {
  message.textContent = "Yay! I knew it! 💖";
});

function moveNoButton() {
  const maxX = window.innerWidth - noButton.offsetWidth;
  const maxY = window.innerHeight - noButton.offsetHeight;

  noButton.style.position = "absolute";
  noButton.style.left = Math.random() * maxX + "px";
  noButton.style.top = Math.random() * maxY + "px";
}

noButton.addEventListener("mouseover", moveNoButton);
noButton.addEventListener("touchstart", moveNoButton);
