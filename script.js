const canvas = document.getElementById('batCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;

const players = [
  { name: "Kartik", img: "images/kartik.jpg" },
  { name: "Priyansh", img: "images/priyansh.jpg" },
  { name: "Mradul", img: "images/mradul.jpg" },
  { name: "Bhavya", img: "images/bhavya.jpg" },
  { name: "Arnav", img: "images/arnav.jpg" },
  { name: "Kautik", img: "images/kautik.jpg" },
  { name: "Mann", img: "images/mann.jpg" }
];

const circles = [];
const radius = 35;
const nextBtn = document.getElementById("nextButton"); // or nextBall in HTML
const selectedPlayers = new Set();

// Load players in circular formation
players.forEach((p, i) => {
  const img = new Image();
  img.src = p.img;
  const angle = (Math.PI * 2 * i) / players.length;

  circles.push({
    name: p.name,
    img,
    x: canvas.width / 2 + 150 * Math.cos(angle),
    y: canvas.height / 2 + 150 * Math.sin(angle),
    dx: (Math.random() - 0.5) * 1.6,
    dy: (Math.random() - 0.5) * 1.6,
    selected: false,
    colliding: false
  });
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Reset collision flag before detecting
  circles.forEach(c => c.colliding = false);

  // ✅ Collision detection & glow trigger
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      const a = circles[i];
      const b = circles[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);

      if (dist < radius * 2) {
        a.colliding = true;
        b.colliding = true;

        // Soft bounce movement
        let tempDx = a.dx;
        let tempDy = a.dy;
        a.dx = b.dx;
        a.dy = b.dy;
        b.dx = tempDx;
        b.dy = tempDy;
      }
    }
  }

  circles.forEach(c => {
    // Move circles
    c.x += c.dx;
    c.y += c.dy;

    if (c.x < radius || c.x > canvas.width - radius) c.dx *= -1;
    if (c.y < radius || c.y > canvas.height - radius) c.dy *= -1;

    ctx.save();
    ctx.beginPath();
    ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(c.img, c.x - radius, c.y - radius, radius * 2, radius * 2);
    ctx.restore();

    // ✅ glowing outline based on state
    ctx.beginPath();
    ctx.arc(c.x, c.y, radius + (c.colliding ? 3 : 0), 0, Math.PI * 2);
    ctx.lineWidth = c.selected ? 6 : 4;

    if (c.selected) {
      ctx.strokeStyle = "rgba(0,255,144,1)"; // neon green
      ctx.shadowColor = "rgba(0,255,144,0.8)";
      ctx.shadowBlur = 18;
    } else if (c.colliding) {
      ctx.strokeStyle = "rgba(0,255,144,0.9)";
      ctx.shadowColor = "rgba(0,255,144,0.7)";
      ctx.shadowBlur = 15;
    } else {
      ctx.strokeStyle = "white";
      ctx.shadowBlur = 0;
    }

    ctx.stroke();
  });

  requestAnimationFrame(draw);
}

draw();

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  circles.forEach(c => {
    const dist = Math.hypot(clickX - c.x, clickY - c.y);

    if (dist < radius) {
      c.selected = !c.selected;
      if (c.selected) selectedPlayers.add(c.name);
      else selectedPlayers.delete(c.name);
    }
  });

  // ✅ glow active on button when >= 3 selected
  if (selectedPlayers.size >= 3) {
    nextBtn.style.display = "block";
    nextBtn.classList.add("ready");
  } else {
    nextBtn.classList.remove("ready");
    nextBtn.style.display = "none";
  }
});

// ✅ animate fly-away on click
nextBtn.addEventListener("click", () => {
  nextBtn.classList.add("fly");

  setTimeout(() => {
    localStorage.setItem("selectedPlayers", JSON.stringify([...selectedPlayers]));
    window.location.href = "tournament.html";
  }, 500);
});
