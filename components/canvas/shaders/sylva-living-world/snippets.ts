export const BOUGH_BUILDERS = `  /* Both tree variants grow the same world out of the authored root's own
     systems — swept limbs, bark, moss cushion, fur, ferns, scattered leaf or
     flower, wind, scan, pointer, butterfly — at the same close range. What
     changes between them is the leaf on the twigs, the palette they are lit
     in, and the field behind them; the wood underneath is one thing. */
  var BOUGH_SEGS   = [200, 44, 28, 18, 12];
  var BOUGH_RADIAL = [26, 16, 11, 8, 6];

  function boughLimb(pts, r0, r1, depth, flare) {
    var curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
    var segs = BOUGH_SEGS[depth] || 12, radial = BOUGH_RADIAL[depth] || 6;
    var taper = flare || 1.0;
    /* every limb draws its last few percent down to a point: tubes are open
       ended, and a twig that simply stops shows a hollow cap in the air */
    var rw = function (t) {
      var r = r1 + (r0 - r1) * Math.pow(1 - t, taper);
      return r * knot(t, 0.030, 0.013) * (1 - 0.92 * sstep(0.90, 1.0, t));
    };
    /* The cushion sits ON the bough rather than around it, and thins with the
       wood: moss packs deep in the old crotches where rain sits and is gone
       by the time a twig is pencil thin. */
    var moss = function (t) { return rw(t) * (0.50 - 0.28 * t) * (depth === 0 ? 1.0 : 0.58); };
    var L = {
      curve: curve, segs: segs, radial: radial,
      rw: rw, moss: moss,
      blade: function (t) { return moss(t) * 0.145 + 0.016; },
      sink: 0
    };
    L.fr = transportFrames(curve, segs);
    L.len = curve.getLength();
    L.vScale = Math.max(10, L.len * 7.0);
    /* blossom breaks from young wood — the flower pass reads this so a bough
       does not come out flowering along its bark like fungus */
    L.young = depth >= 1 ? 1 : 0;
    return L;
  }

  function growBranch(list, start, dir, len, r0, depth, maxDepth) {
    var side = new THREE.Vector3().crossVectors(dir, UP);
    if (side.lengthSq() < 1e-6) side.set(1, 0, 0);
    side.normalize();
    var up = new THREE.Vector3().crossVectors(side, dir).normalize();
    /* Young cherry wood leaves the fork climbing and eases over as it thins,
       so the outer third of a spray hangs under its own blossom. */
    var lift = rand(0.12, 0.26) - depth * 0.05;
    var sway = rand(-0.30, 0.30);
    function node(f, u2, k) {
      return start.clone().addScaledVector(dir, len * f)
        .addScaledVector(up, len * u2).addScaledVector(side, len * k);
    }
    var L = boughLimb([
      start.clone(),
      node(0.34, lift * 0.46, sway * 0.34),
      node(0.69, lift * 0.98, sway * 0.82),
      node(1.00, lift * 0.72, sway)
    ], r0, r0 * 0.56, depth);
    list.push(L);
    if (depth >= maxDepth) return;

    var kids = depth <= 1 ? 3 : (rng() < 0.58 ? 3 : 2);
    for (var i = 0; i < kids; i++) {
      var tt = Math.min(0.99, 0.42 + (i / kids) * 0.58 + rand(-0.05, 0.05));
      var pt = L.curve.getPointAt(tt);
      var tan = L.curve.getTangentAt(tt).normalize();
      var ax = new THREE.Vector3().crossVectors(tan, UP);
      if (ax.lengthSq() < 1e-6) ax.set(1, 0, 0);
      ax.normalize().applyAxisAngle(tan, rng() * TAU);
      var kdir = tan.clone().applyAxisAngle(ax, rand(0.42, 1.00));
      /* every fork still reaches for the light, or a spray grows sideways
         into a bush instead of up into a branch */
      kdir.addScaledVector(UP, 0.16 - depth * 0.03).normalize();
      growBranch(list, pt, kdir, len * rand(0.56, 0.74),
                       r0 * 0.56 * rand(0.62, 0.84), depth + 1, maxDepth);
    }
  }

  /* Twigs are seated on the bough's own surface, the same way the authored
     build seats its stub offshoots — a spray that starts on the axis reads as
     a wire pushed through the branch once the cushion is on. */
  function sproutTwigs(list, host, count, len, r0, maxDepth) {
    var hp = new THREE.Vector3(), hn = new THREE.Vector3();
    for (var i = 0, guard = 0; i < count && guard < count * 40; guard++) {
      var t = clamp01(0.04 + 0.92 * ((i + rand(-0.45, 1.45)) / count));
      var th = rng() * TAU;
      limbSurface(host, t, th, hp, hn);
      if (hn.y < -0.32) continue;                   /* not off the underside */
      limbFrame(host, t);
      var dir = hn.clone().multiplyScalar(rand(0.75, 1.25))
        .addScaledVector(UP, rand(0.10, 0.52))
        .addScaledVector(_ft, rand(-0.95, 1.15)).normalize();
      hp.addScaledVector(hn, -host.rw(t) * 0.5);
      growBranch(list, hp.clone(), dir, len * rand(0.55, 1.42),
                      r0 * rand(0.68, 1.30), 1, maxDepth);
      i++;
    }
  }

  function buildBoughs() {
    var P = makeP(ARCH.aspect);
    var narrow = NARROW.matches;
    var limbs = [];
    /* the near bough: enters low left, crests at 40%, and runs out of frame
       on the right — the authored root's own path, read as cherry wood */
    var boughA = boughLimb(narrow ? [
      /* a tall frame wants the boughs raked across it, or the composition
         sits in a band with empty sky above and below */
      P(-0.26, 1.18, -0.42), P(0.00, 1.04, -0.16), P(0.26, 0.90, 0.08),
      P(0.52, 0.79, 0.20), P(0.78, 0.71, 0.10), P(1.12, 0.66, -0.30)
    ] : [
      P(-0.18, 1.05, -0.42), P(0.02, 0.99, -0.16), P(0.22, 0.92, 0.08),
      P(0.43, 0.88, 0.20), P(0.64, 0.87, 0.12), P(0.86, 0.90, -0.08),
      P(1.16, 0.96, -0.38)
    ], 0.42, 0.25, 0);
    /* the far bough: crosses the other way and sits back, so the two read as
       one tree seen from under it rather than as a pair of pipes */
    var boughB = boughLimb(narrow ? [
      P(-0.22, 0.74, -0.66), P(0.06, 0.60, -0.50), P(0.34, 0.46, -0.36),
      P(0.62, 0.33, -0.40), P(0.94, 0.22, -0.62)
    ] : [
      P(-0.16, 0.78, -0.66), P(0.10, 0.68, -0.50), P(0.36, 0.56, -0.36),
      P(0.62, 0.44, -0.40), P(0.86, 0.34, -0.54), P(1.14, 0.26, -0.76)
    ], 0.235, 0.13, 0);
    /* a limb climbing out of the top right corner, to close the frame */
    var boughC = boughLimb(narrow ? [
      P(1.08, 1.12, 0.16), P(0.94, 0.98, 0.24), P(0.82, 0.84, 0.20),
      P(0.74, 0.68, 0.06), P(0.70, 0.52, -0.14)
    ] : [
      P(0.30, 0.94, 0.16), P(0.37, 0.78, 0.24), P(0.47, 0.63, 0.20),
      P(0.60, 0.50, 0.06), P(0.76, 0.40, -0.14)
    ], 0.165, 0.078, 0);
    limbs.push(boughA, boughB, boughC);

    sproutTwigs(limbs, boughA, 15, 0.94, 0.070, 4);
    sproutTwigs(limbs, boughB, 10, 0.76, 0.050, 4);
    sproutTwigs(limbs, boughC, 8, 0.64, 0.039, 3);
    return limbs;
  }

  /* the far layer: a stand of small trees on the horizon, hazed back into the
     sky so the near boughs have depth behind them */
  function buildGrove() {
    var P = makeP(FAR.aspect);
    var limbs = [];
    var TREES = [[-0.04, 0.46, -0.5], [0.27, 0.60, 0.2], [0.56, 0.40, -0.3],
                 [0.82, 0.54, 0.1], [1.07, 0.44, -0.4]];
    for (var i = 0; i < TREES.length; i++) {
      var t = TREES[i], s = t[1];
      var base = P(t[0], 1.04 + (i % 2) * 0.03, t[2]);
      var top  = P(t[0] + (i - 2) * 0.008, 1.02 - 0.22 * s, t[2] + 0.1);
      var trunk = boughLimb([base, base.clone().lerp(top, 0.42),
                              base.clone().lerp(top, 0.76), top], 0.10 * s, 0.042 * s, 1);
      limbs.push(trunk);
      /* a stand reads as a stand only if no two crowns are the same width,
         and a crown reads as a crown only if its limbs leave the trunk at
         different heights — level spokes come out as a lollipop */
      var spread = 0.60 + (i % 3) * 0.17;
      for (var k = 0; k < 6; k++) {
        var a = (k / 6) * TAU + i * 0.7;
        var from = trunk.curve.getPointAt(0.72 + (k % 3) * 0.14);
        growBranch(limbs, from,
          new THREE.Vector3(Math.cos(a) * 0.82, 0.34 + (k % 2) * 0.40, Math.sin(a) * 0.46).normalize(),
          spread * 0.50 * s, 0.034 * s, 2, 3);
      }
    }
    return limbs;
  }`;

export const MAPLE_OUTLINE = `  /* One palmate five-lobe silhouette, traced once and shared by the leaves on
     the twigs and the ones coming down: three lobes forward, two out to the
     sides, with a deep sinus cut between each pair. Half of it is authored and
     the other half is that half mirrored — a maple leaf is symmetric, and two
     hand-traced halves never quite are. */
  var MAPLE_HALF = [
    [0.00, -1.00], [0.21, -0.64], [0.52, -0.72], [0.45, -0.32],
    [0.84, -0.24], [0.50, 0.06], [0.70, 0.36], [0.31, 0.31],
    [0.15, 0.60], [0.05, 0.98]
  ];

  function mapleOutline(g, r) {
    var pts = [], i;
    for (i = 0; i < MAPLE_HALF.length; i++) pts.push([MAPLE_HALF[i][0] * r, MAPLE_HALF[i][1] * r]);
    for (i = MAPLE_HALF.length - 1; i >= 0; i--) pts.push([-MAPLE_HALF[i][0] * r, MAPLE_HALF[i][1] * r]);
    /* Drawn as a closed quadratic spline rather than as segments: straight
       lines between the lobe tips and the sinuses come out as a paper star at
       the size these are seen, and a maple lobe is a curve on both sides. */
    var n = pts.length;
    function mid(a, b) { return [(a[0] + b[0]) * 0.5, (a[1] + b[1]) * 0.5]; }
    var m = mid(pts[n - 1], pts[0]);
    g.beginPath();
    g.moveTo(m[0], m[1]);
    for (i = 0; i < n; i++) {
      var cur = pts[i], nxt = pts[(i + 1) % n];
      m = mid(cur, nxt);
      g.quadraticCurveTo(cur[0], cur[1], m[0], m[1]);
    }
    g.closePath();
  }`;

export const SAKURA_FALLING_SPRITE = `  /* one petal, for the fall through the frame and for the trail the pointer
     lifts off the cushion */
  function fallingSprite() {
    var c = document.createElement('canvas'); c.width = c.height = 64;
    var g = c.getContext('2d');
    g.translate(32, 32);
    var r = 27;
    var grad = g.createLinearGradient(0, -r, 0, r);
    grad.addColorStop(0, 'rgba(255, 248, 246, 0.98)');
    grad.addColorStop(0.55, 'rgba(255, 198, 212, 0.94)');
    grad.addColorStop(1, 'rgba(244, 146, 172, 0.74)');
    g.fillStyle = grad;
    /* narrow at the stem, broad at the shoulders, notched at the tip — the
       notch is the whole silhouette of a cherry petal */
    g.beginPath();
    g.moveTo(0, r);
    g.bezierCurveTo(-r * 0.70, r * 0.42, -r * 0.82, -r * 0.44, -r * 0.30, -r * 0.92);
    g.quadraticCurveTo(0, -r * 0.62, r * 0.30, -r * 0.92);
    g.bezierCurveTo(r * 0.82, -r * 0.44, r * 0.70, r * 0.42, 0, r);
    g.fill();
    var t = new THREE.CanvasTexture(c);
    t.minFilter = THREE.LinearFilter;
    if ('sRGBEncoding' in THREE) t.encoding = THREE.sRGBEncoding;
    return t;
  }`;

export const MAPLE_FALLING_SPRITE = `  /* one maple leaf, for the fall through the frame and for the trail the
     pointer lifts off the cushion */
  function fallingSprite() {
    var c = document.createElement('canvas'); c.width = c.height = 96;
    var g = c.getContext('2d');
    g.translate(48, 50);
    var r = 42;
    var grad = g.createLinearGradient(0, -r, 0, r);
    grad.addColorStop(0, 'rgba(255, 206, 122, 0.98)');
    grad.addColorStop(0.48, 'rgba(226, 104, 52, 0.96)');
    grad.addColorStop(1, 'rgba(158, 46, 38, 0.88)');
    g.fillStyle = grad;
    mapleOutline(g, r);
    g.fill();
    var t = new THREE.CanvasTexture(c);
    t.minFilter = THREE.LinearFilter;
    if ('sRGBEncoding' in THREE) t.encoding = THREE.sRGBEncoding;
    return t;
  }`;

export const SEQUOIA_FALLING_SPRITE = `  /* one shed sprig, for the drift through the frame and for the trail the
     pointer lifts off the cushion — the same ordered needle rank as the crown,
     at the size one sprig is actually read at */
  function fallingSprite() {
    var c = document.createElement('canvas'); c.width = c.height = 96;
    var g = c.getContext('2d');
    g.translate(48, 48);
    var grad = g.createLinearGradient(0, 36, 0, -36);
    grad.addColorStop(0, 'rgb(74, 96, 56)');
    grad.addColorStop(1, 'rgb(158, 182, 112)');
    g.strokeStyle = 'rgb(84, 78, 52)';
    g.lineCap = 'round';
    g.lineWidth = 2.4;
    g.beginPath(); g.moveTo(0, 34); g.lineTo(0, -30); g.stroke();
    for (var i = 0; i < 11; i++) {
      var f = i / 10, y = 32 - 60 * f;
      var taper = 1 - 0.7 * Math.max(0, (f - 0.74) / 0.26);
      var len = 26 * taper, wid = 2.8 * taper;
      for (var sgn = -1; sgn <= 1; sgn += 2) {
        g.save();
        g.translate(0, y);
        g.rotate(sgn * 0.86);
        g.beginPath();
        g.moveTo(-wid * 0.5, 0);
        g.quadraticCurveTo(-wid * 0.24, -len * 0.6, 0, -len);
        g.quadraticCurveTo(wid * 0.24, -len * 0.6, wid * 0.5, 0);
        g.closePath();
        g.fillStyle = grad;
        g.fill();
        g.restore();
      }
    }
    var t = new THREE.CanvasTexture(c);
    t.minFilter = THREE.LinearFilter;
    if ('sRGBEncoding' in THREE) t.encoding = THREE.sRGBEncoding;
    return t;
  }`;
