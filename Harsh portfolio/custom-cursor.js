// Helper function to select elements
const $$ = s => Array.prototype.slice.call(document.querySelectorAll(s));
const isEl = obj => obj instanceof HTMLElement;
const isStr = obj => Object.prototype.toString.call(obj) === '[object String]';

// Cursor creation function
const cursorDot = ({
  zIndex = 1,
  diameter = 80,
  borderWidth = 2,
  borderColor = '#fff',
  easing = 8,
  background = 'transparent',
} = {}) => {
  // Variables for cursor behavior
  let inited = false;
  const alt = { x: 0, y: 0, o: 1, d: diameter };
  const cur = { x: 0, y: 0, o: 0, d: diameter };
  const dot = document.createElement('div');
  const tim = easing / 15;

  // Configure cursor appearance
  dot.className = 'cursor-dot';
  dot.style.cssText = `
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
    border: ${borderWidth}px solid ${borderColor};
    mix-blend-mode: exclusion;
    transition: background ${tim}s, border ${tim}s;
  `;

  // Handle mouse movement
  document.addEventListener('mousemove', e => {
    alt.x = e.clientX;
    alt.y = e.clientY;
    dot.style.opacity = 1;
    if (!inited) {
      document.body.append(dot);
      cur.x = alt.x;
      cur.y = alt.y;
      inited = true;
      draw();
    }
  });

  // Update cursor appearance continuously
  const draw = () => {
    const dX = alt.x - cur.x;
    const dY = alt.y - cur.y;
    cur.x += dX / easing;
    cur.y += dY / easing;
    const t3d = `translate3d(${cur.x - cur.d / 2}px,${cur.y - cur.d / 2}px,0)`;
    dot.style.webkitTransform = t3d;
    dot.style.transform = t3d;

    const dO = alt.o - cur.o;
    cur.o += dO / easing;
    dot.style.opacity = cur.o;

    const dD = alt.d - cur.d;
    cur.d += dD / easing;
    dot.style.height = cur.d + 'px';
    dot.style.width = cur.d + 'px';

    try {
      requestAnimationFrame(draw);
    } catch (_) {
      setImmediate(draw);
    }
  };

  // Apply hover effects for specific elements with different customizations
  dot.over = (any, style) => {
    const fn = el => {
      el.addEventListener('mouseover', _ => {
        if (style.hoverBackground) dot.style.backgroundColor = style.hoverBackground;
        if (style.hoverBorderColor) dot.style.borderColor = style.hoverBorderColor;
        if (style.hoverScale) alt.d = diameter * style.hoverScale;
        if (style.hoverShape === 'circle') {
          // Adjust shape to a circle
          dot.style.borderRadius = '50%';
        } else if (style.hoverShape === 'square') {
          // Adjust shape to a square
          dot.style.borderRadius = '0%';
        }

        // Change text color of hovered text elements
        if (el instanceof HTMLElement) {
          const textElements = el.querySelectorAll('.hover-effect'); // Get all descendants with the 'hover-effect' class
          textElements.forEach(textEl => {
            if (textEl.style.color) {
              textEl.style.setProperty('--original-color', textEl.style.color);
              textEl.style.color = 'black'; // Change the text color
            }
          });
        }
      });
      el.addEventListener('mouseout', _ => {
        // Reset to default styles on mouseout
        if (style.hoverBackground) dot.style.backgroundColor = background;
        if (style.hoverBorderColor) dot.style.borderColor = borderColor;
        if (style.hoverScale) alt.d = diameter;

        // Reset shape to default
        dot.style.borderRadius = '50%';

        // Restore original text color for hovered text elements
        if (el instanceof HTMLElement) {
          const textElements = el.querySelectorAll('.hover-effect'); // Get all descendants with the 'hover-effect' class
          textElements.forEach(textEl => {
            const originalColor = textEl.style.getPropertyValue('--original-color');
            if (originalColor) {
              textEl.style.color = originalColor;
              textEl.style.removeProperty('--original-color');
            }
          });
        }
      });
    };
    if (isEl(any)) fn(any);
    else if (isStr(any)) $$(any).forEach(fn);
  };

  return dot;
};

// Function to hide the system cursor and replace it with a custom dot cursor
const hideSystemCursor = () => {
  // Create a new cursor dot element
  const cursorDot = document.createElement('div');
  cursorDot.className = 'custom-system-cursor';
  cursorDot.style.cssText = `
    position: fixed;
    width: 10px; /* Customize the dot cursor size */
    height: 10px; /* Customize the dot cursor size */
    background-color: black; /* Customize the dot cursor color */
    border-radius: 50%; /* Make it a circle */
    pointer-events: none;
    z-index: 9999; /* Set a high z-index to ensure it's on top */
  `;

  // Hide the system cursor
  document.body.style.cursor = 'none';

  // Append the dot cursor to the document
  document.body.appendChild(cursorDot);

  // Update the dot cursor position based on mouse movement
  document.addEventListener('mousemove', e => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
  });
};

// Call the hideSystemCursor function to replace the system cursor with the dot cursor
hideSystemCursor();

// Initialize the custom cursor
const customCursor = cursorDot({
  zIndex: 9999,
  diameter: 40, // Adjust the diameter as needed
  borderColor: 'white', // Adjust the cursor border color
  background: 'transparent'
});

// Apply additional hover effects for specific elements with different customizations
customCursor.over('a, button', {
  hoverBackground: 'white', // Customize background color on hover
  hoverBorderColor: 'white', // Customize border color on hover
  hoverScale: 1.2, // Customize scale on hover
  hoverShape: 'circle' // Customize shape on hover (circle or square)
});

// Add more customizations for other elements as needed
// Apply hover effects for specific elements with different customizations
customCursor.over('h1 span.hover-effect, h2 span.hover-effect', {
  hoverBackground: 'white', // Customize background color on hover
  hoverBorderColor: 'white', // Customize border color on hover
  hoverScale: 2, // Customize scale on hover
  hoverShape: 'circle' // Customize shape on hover (circle or square)
});
