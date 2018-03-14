const id = x => x;
const random = Math.random;

const clamp = (min, max, x) => {
  return Math.max(min, Math.min(max, x));
};

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const move = (p, v, a) => ([p[0]+v[0]+a[0], p[1]+v[1]+a[1]]);

const initCanvas = (selector, width, height) => {
  const parent = document.querySelector(selector);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  parent.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  return ctx;
};

const generateLineCoords = (width, n) => {
  let coords = [];
  const gap = width / (n - 1);
  for (let i = 0; i < n; i++) {
    coords.push([i * gap, 0]);
  }
  return coords;
};

const generateCircleCoords = (radius, n) => {
  let coords = [];
  for (let i = 0; i < n; i++) {
    const cx = radius * Math.cos(Math.PI / n * 2 * i);
    const cy = radius * Math.sin(Math.PI / n * 2 * i);
    coords.push([ cx, cy ]);
  }
  return coords;
};

const generateCoefficients = (n, scales=[0.1, 0.1]) => {
  let coeffs = [];

  for (let i = 0; i < n; i++) {
    let dx = (random() - 0.5) * scales[0];
    let dy = (random() - 0.5) * scales[1];
    coeffs.push([dx, dy]);
  }
  return coeffs;
};

const generateAccumulatedCoefficients = (coeffs) => {
  let accumulateX = 0;
  let accumulateY = 0;

  return coeffs.map(([x, y]) => {
    accumulateX += x;
    accumulateY += y;
    return [accumulateX, accumulateY];
  });
};

const loopAnimation = (ctx, [offsetX, offsetY], drawFunc, params, update, fade=0.992) => {
  let opacity = 1;
  let initialParams = JSON.parse(JSON.stringify(params));
  const callback = () => {
    drawFunc(ctx, [offsetX, offsetY], opacity, ...params);
    params = update(params);
    opacity *= fade;
    if (opacity < 1/255 ) {
      window.setTimeout(() => {
        ctx.beginPath();
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        opacity = 1;
        params = initialParams;
        window.requestAnimationFrame(callback);
      }, 1000);
    } else {
      window.requestAnimationFrame(callback);
    }

  };
  callback();
};

const circles = (ctx, [offsetX, offsetY], opacity, r, coords) => {
  for (let i = 0; i < coords.length; i++) {
    ctx.beginPath();
    ctx.arc(offsetX+coords[i][0], offsetY+coords[i][1], r, 0, 2*Math.PI, true);
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})` || 'white';
    ctx.fill();
  }
};

const circlesStroked = (ctx, [offsetX, offsetY], opacity, r, coords) => {
  for (let i = 0; i < coords.length; i++) {
    ctx.beginPath();
    ctx.arc(offsetX+coords[i][0], offsetY+coords[i][1], r, 0, 2*Math.PI, true);
    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})` || 'white';
    ctx.stroke();
  }
};