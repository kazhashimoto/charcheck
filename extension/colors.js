/**
 * Convert color names to hex format
 * @param {String} name color-name, #rgb, #rrggbb, ..., rgb(), rgba(), hsl(), hsla()
 * @return {String} #rrggbb, #rrggbbaa
 */
function name2hex(name) {
  const div = document.createElement('div');
  div.style.color = name;
  document.body.appendChild(div);

  const cat = (p, c) => p + c;
  const style = window.getComputedStyle(div);
  const found = style.color.match(/rgba?\((.+)\)/);
  const rgba = found[1].split(',')
    .map((v, i) => {
      let x = +v.trim();
      if (i === 3) {
        x = Math.round(255 * x);
      }
      let hex = x.toString(16);
      if (x < 16) {
        hex = '0' + hex;
      }
      return hex;
    }).reduce(cat, '#');

  document.body.removeChild(div);
  return rgba;
}

/**
 * Get array of rgba values from hex format
 * @param {String} hex #rgb, #rgba, #rrggbb, #rrggbbaa
 * @return {Array} [r,g,b,a] (a === undefined if hex contains no alpha value)
 */
function getRGB(hex) {
  if (hex.length === 4 || hex.length === 5) {
    hex = [...hex].map(e => e + e).join('').replace(/^#/, '');
  }

  let re;
  if (hex.length === 7) {
    re = /#(.{2})(.{2})(.{2})/;
  } else if (hex.length === 9) {
    re = /#(.{2})(.{2})(.{2})(.{2})/;
  } else {
    return null;
  }
  let found = hex.match(re);
  const rgba = found.slice(1).map(e => Number('0x' + e));
  return rgba
}

/**
 * Adapted from:
 * https://css-tricks.com/converting-color-spaces-in-javascript/
 * https://codepen.io/jkantner/pen/VVEMRK
 *
 * Converts RGB to HSL
 * @param {Array} rgb [r,g,b] or [r,g,b, a]
 * @param {Array} hsl [] --> [h, s, l, a]
 * @return {String} "hsl(h,s%,l%)" or "hsla(h,s%,l%,a)"
 */
function rgb2hsl(rgb, hsl) {
  // Make r, g, and b fractions of 1
  let r, g, b, a;
  [r, g, b, a] = rgb.map(e => e /= 255);

  // Find greatest and smallest channel values
  let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

  // Calculate hue
  // No difference
  if (delta == 0)
    h = 0;
  // Red is max
  else if (cmax == r)
    h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax == g)
    h = (b - r) / delta + 2;
  // Blue is max
  else
    h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0)
      h += 360;

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  let result;
  if (a === undefined) {
    result = `hsl(${h},${s}%,${l}%)`;
  } else {
    a = a.toFixed(3);
    result = `hsla(${h},${s}%,${l}%,${a})`;
  }

  if (hsl) {
    hsl[0] = h;
    hsl[1] = +s;
    hsl[2] = +l;
    if (a !== undefined) {
      hsl[3] = +a;
    }
  }
  return result;
}

/**
 * Adapted from:
 * https://css-tricks.com/converting-color-spaces-in-javascript/
 * https://codepen.io/jkantner/pen/VVEMRK
 *
 * Converts HSL to RGB
 * @oaram {Array} hsl [h,s,l] or [h,s,l,a]
 * @return {String} #rrggbb or #rrggbbaa
 */
function hsl2rgb(hsl) {
  let h, s, l, a;
  [h, s, l, a] = [...hsl];

  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0,
      b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  // Having obtained RGB, convert channels to hex
  const cat = (p, c) => p + c;
  const result = [r + m, g + m, b + m, a].map(e => {
    if (e === undefined) {
      return '';
    }
    const x = Math.round(e * 255);
    let hex = x.toString(16);
    if (x < 16) {
      hex = '0' + hex;
    }
    return hex;
  }).reduce(cat, '#');
  return result;
}
