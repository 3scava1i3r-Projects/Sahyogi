# Custom Cursor Usage Guide

The custom cursor has been integrated into your project and is now active globally.

## Features

- **Simple Design**: Clean, minimal small black dot cursor
- **Instant Tracking**: Follows mouse movement precisely
- **Minimal Impact**: Lightweight and non-intrusive

## Making Elements Interactive with the Cursor

The cursor is purely visual and doesn't have interactive scaling features in the simplified version.

## Customization

The custom cursor can be customized by editing `/src/components/ui/custom-cursor.tsx`:

### Change Colors
Modify the SVG circle fill colors:
```css
.cursor__ball--big svg circle {
  fill: #3b82f6; /* Change this to your desired color */
}
```
Size
Modify the width and height in the CSS:
```css
.custom-cursor {
  width: 8px; /* Adjust size */
  height: 8px;
}
```

### Change Color
Update the background-color:
```css
.custom-cursor {
  background-color: #000000; /* Change to any color */
}
- Optimized using requestAnimationFrame for smooth 60fps animations
Minimal performance impact with instant tracking