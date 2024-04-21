const cursorDotWithLag = ({
  zIndex = 9999,
  diameter = 80,
  borderWidth = 2,
  borderColor = '#fff',
  easing = 8, // Increase the easing value
  background = 'transparent',
  lag = 0.2,
  dotDiameter = 10,
  dotColor = '#fff',
  outerCircleBorderColor = 'red',
  hoverEffectEnabled = true,
  hoverDiameter = 100,
  hoverColor = 'blue'
} = {}) => {

  let inited = false;
  const mainCursor = { x: 0, y: 0 };
  const alt = { x: 0, y: 0, o: 1, d: diameter };
  const dot = document.createElement('div');
  const innerDot = document.createElement('div');
  const tim = easing / 15;

  dot.className = `cursor-dot-outer`;
  innerDot.className = `cursor-dot-inner`;

  dot.style = `
    position: fixed;
    top: 0;
    left: 0;
    border-radius: 100%;
    pointer-events: none;
    opacity: 0;
    z-index: ${zIndex};
    height: ${diameter}px;
    width: ${diameter}px;
    background: ${background};
    border: ${borderWidth}px solid ${outerCircleBorderColor}; // Set the border color of the outer circle here
    mix-blend-mode: exclusion;
    transition: background ${tim}s, border ${tim}s;
  `;

  innerDot.style = `
    position: fixed;
    border-radius: 100%;
    pointer-events: none;
    background: ${dotColor};
    height: ${dotDiameter}px;
    width: ${dotDiameter}px;
    z-index: ${zIndex + 1}; // Place inner dot above outer circle
  `;

  document.body.appendChild(dot);
  document.body.appendChild(innerDot);

  // Hide the mouse pointer
  document.body.style.cursor = 'none';

  document.addEventListener('mousemove', e => {
    mainCursor.x = e.clientX;
    mainCursor.y = e.clientY;
    dot.style.opacity = 1;
    innerDot.style.opacity = 1;
    if (!inited) {
      inited = true;
      draw();
    }
  });

  const draw = () => {
    const lagX = (mainCursor.x - alt.x) * lag;
    const lagY = (mainCursor.y - alt.y) * lag;
    alt.x += lagX / easing;
    alt.y += lagY / easing;

    // Update the position of the outer circle (dot) using transform
    const t3d = `translate3d(${alt.x - alt.d / 2}px,${alt.y - alt.d / 2}px,0)`;
    dot.style.transform = t3d;

    // Update the position of the inner dot (main cursor)
    innerDot.style.transform = `translate(${mainCursor.x - dotDiameter / 2}px,${mainCursor.y - dotDiameter / 2}px)`;

    // Use requestAnimationFrame consistently for smoother animation
    requestAnimationFrame(draw);
  };

  dot.over = (any, style) => {
    const fn = el => {
      el.addEventListener('mouseenter', _ => {
        if (style.background) dot.style.backgroundColor = style.background;
        if (style.borderColor) dot.style.borderColor = style.borderColor;
        if (style.scale) alt.d = diameter * style.scale;
        if (hoverEffectEnabled) {
          // Apply hover effect with CSS transitions
          dot.style.width = `${hoverDiameter}px`;
          dot.style.height = `${hoverDiameter}px`;
          dot.style.backgroundColor = hoverColor;
          dot.style.borderColor = hoverColor;
        }
      });
      el.addEventListener('mouseleave', _ => {
        if (style.background) dot.style.backgroundColor = background;
        if (style.borderColor) dot.style.borderColor = outerCircleBorderColor;
        if (style.scale) alt.d = diameter;
        if (hoverEffectEnabled) {
          // Restore original style with CSS transitions
          dot.style.width = `${diameter}px`;
          dot.style.height = `${diameter}px`;
          dot.style.backgroundColor = background;
          dot.style.borderColor = outerCircleBorderColor;
        }
      });
    };
    if (isEl(any)) fn(any);
    else if (isStr(any)) {
      document.querySelectorAll(any).forEach(fn);
    }
  };

  // Start the draw loop
  draw();

  return dot;
};

document.addEventListener('DOMContentLoaded', function () {
  const cursor = cursorDotWithLag({
    diameter: 30,
    easing: 8, // Increase the easing value
    dotDiameter: 6,
    dotColor: '#fff',
    outerCircleBorderColor: 'black',
    borderWidth: 1.5,
    hoverEffectEnabled: true, // Enable hover effect
    hoverDiameter: 50, // Customize hover diameter here
    hoverColor: 'blue' // Customize hover color here
  });

  // Add hover effect to elements with class .hover-text-element
  const textElements = document.querySelectorAll('.hover-text-element');

  textElements.forEach((element) => {
    element.addEventListener('mouseenter', () => {
      cursor.classList.add('active');
    });

    element.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
    });
  });

  document.addEventListener('mousedown', () => {
    cursor.classList.add('active');
  });

  document.addEventListener('mouseup', () => {
    cursor.classList.remove('active');
  });
});

