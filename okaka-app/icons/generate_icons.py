#!/usr/bin/env python3
"""Generate app icons for 哦卡卡的工作台"""
from PIL import Image, ImageDraw, ImageFont
import os

ICON_DIR = os.path.dirname(os.path.abspath(__file__))

def create_icon(size, filename):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Pink gradient background
    for y in range(size):
        ratio = y / size
        r = int(252 + (236 - 252) * ratio)
        g = int(231 + (72 - 231) * ratio)
        b = int(243 + (153 - 243) * ratio)
        draw.line([(0, y), (size, y)], fill=(r, g, b, 255))

    # Rounded rect
    margin = int(size * 0.06)
    radius = int(size * 0.22)
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=radius,
        fill=(252, 231, 243, 255)
    )

    # Draw a ribbon/bow shape (pink theme)
    cx, cy = size // 2, size // 2
    s = int(size * 0.28)

    # Simple "ribbon" shape - two triangles meeting at center
    pink = (236, 72, 153, 255)
    dark_pink = (219, 39, 119, 255)

    # Left loop
    draw.ellipse([cx - s, cy - s//2, cx - s//6, cy + s//2], fill=pink)
    # Right loop
    draw.ellipse([cx + s//6, cy - s//2, cx + s, cy + s//2], fill=pink)
    # Center knot
    draw.ellipse([cx - s//5, cy - s//4, cx + s//5, cy + s//4], fill=dark_pink)

    # Ribbons hanging down
    ribbon_w = max(2, int(size * 0.02))
    draw.polygon([
        (cx - s//4, cy + s//4),
        (cx - s//2, cy + s),
        (cx - s//4 + ribbon_w, cy + s),
        (cx + ribbon_w, cy + s//4)
    ], fill=pink)
    draw.polygon([
        (cx + s//4, cy + s//4),
        (cx + s//2, cy + s),
        (cx + s//4 - ribbon_w, cy + s),
        (cx - ribbon_w, cy + s//4)
    ], fill=pink)

    img.save(os.path.join(ICON_DIR, filename))
    print(f"Created {filename} ({size}x{size})")

# Generate all needed sizes
for size, name in [(192, 'icon-192.png'), (512, 'icon-512.png'), (180, 'apple-touch-icon.png'), (32, 'favicon-32.png'), (16, 'favicon-16.png')]:
    create_icon(size, name)

# Create favicon.ico (multi-size)
icon32 = Image.open(os.path.join(ICON_DIR, 'favicon-32.png'))
icon16 = Image.open(os.path.join(ICON_DIR, 'favicon-16.png'))
icon32.save(os.path.join(ICON_DIR, 'favicon.ico'), format='ICO', sizes=[(32,32),(16,16)])
print("Created favicon.ico")
print("All icons generated!")
