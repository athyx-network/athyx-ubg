const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
const particles = [];
const particleCount = 120;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = 1 + Math.random() * 2;
    this.speed = 0.4 + Math.random() * 1.2;
    this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.15;
    this.alpha = 0.1 + Math.random() * 0.5;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    if (this.x > canvas.width + 20 || this.y > canvas.height + 20) {
      if (Math.random() < 0.5) {
        this.x = Math.random() * canvas.width;
        this.y = -10 - Math.random() * 40;
      } else {
        this.x = -10 - Math.random() * 40;
        this.y = Math.random() * canvas.height;
      }
      this.size = 1 + Math.random() * 2;
      this.speed = 0.4 + Math.random() * 1.2;
      this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.15;
      this.alpha = 0.1 + Math.random() * 0.5;
    }
  }

  draw() {
    ctx.fillStyle = `rgba(200, 200, 200, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < particleCount; i += 1) {
  particles.push(new Particle());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const particle of particles) {
    particle.update();
    particle.draw();
  }
  requestAnimationFrame(animate);
}

animate();
