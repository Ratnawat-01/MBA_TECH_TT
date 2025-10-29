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
const nextBtn = document.getElementById('nextButton');
const selectedPlayers = new Set();

players.forEach((p, i) => {
  const img = new Image();
  img.src = p.img;
  const angle = (Math.PI * 2 * i) / players.length;
  circles.push({
    name: p.name,
    img,
    x: canvas.width / 2 + 150 * Math.cos(angle),
    y: canvas.height / 2 + 150 * Math.sin(angle),
    dx: (Math.random() - 0.5) * 1.5,
    dy: (Math.random() - 0.5) * 1.5,
    selected: false
  });
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  circles.forEach(c => {
    // Move
    c.x += c.dx;
    c.y += c.dy;
    if (c.x < radius || c.x > canvas.width - radius) c.dx *= -1;
    if (c.y < radius || c.y > canvas.height - radius) c.dy *= -1;

    // Draw circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(c.img, c.x - radius, c.y - radius, radius * 2, radius * 2);
    ctx.restore();

    // Outline
    ctx.beginPath();
    ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = c.selected ? 'lime' : 'white';
    ctx.stroke();
  });

  requestAnimationFrame(draw);
}

draw();

// Click detection
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  circles.forEach(c => {
    const dist = Math.hypot(x - c.x, y - c.y);
    if (dist < radius) {
      c.selected = !c.selected;
      if (c.selected) selectedPlayers.add(c.name);
      else selectedPlayers.delete(c.name);
    }
  });

  if (selectedPlayers.size >= 3) {
    nextBtn.style.display = 'block';
  } else {
    nextBtn.style.display = 'none';
  }
});

nextBtn.addEventListener('click', () => {
  localStorage.setItem('selectedPlayers', JSON.stringify([...selectedPlayers]));
  window.location.href = 'tournament.html';
});
