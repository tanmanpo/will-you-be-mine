const yesButton = document.getElementById("yes");
const noButton = document.getElementById("no");
const message = document.getElementById("message");
const title = document.querySelector("h1");

function moveNoButton() {
  const maxX = window.innerWidth - noButton.offsetWidth;
  const maxY = window.innerHeight - noButton.offsetHeight;

  noButton.style.position = "absolute";
  noButton.style.left = Math.random() * maxX + "px";
  noButton.style.top = Math.random() * maxY + "px";
}

noButton.addEventListener("mouseover", moveNoButton);
noButton.addEventListener("touchstart", moveNoButton);

function createHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = "💖";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = Math.random() * 20 + 20 + "px";
  heart.style.animationDuration = Math.random() * 3 + 3 + "s";
  document.body.appendChild(heart);

  setTimeout(function () {
    heart.remove();
  }, 6000);
}

yesButton.addEventListener("click", function () {
  title.textContent = "Yaaay! 🎉";
  message.textContent = "You just made my day. Thank you! 💖";
  yesButton.style.display = "none";
  noButton.style.display = "none";

  setInterval(createHeart, 300);
});
