#!/usr/bin/env python3
"""Generate PWA icons for Vlog Workbench"""
from PIL import Image, ImageDraw, ImageFont
import os

ICON_DIR = os.path.dirname(os.path.abspath(__file__))

def create_icon(size, filename):
    """Create a gradient icon with film/camera emoji-style design"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background gradient (dark blue to lighter blue)
    for y in range(size):
        ratio = y / size
        r = int(10 + (0 * ratio))
        g = int(25 + (42 * ratio))
        b = int(41 + (92 * ratio))
        draw.line([(0, y), (size, y)], fill=(r, g, b, 255))

    # Rounded rectangle background
    margin = int(size * 0.08)
    radius = int(size * 0.22)
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=radius,
        fill=(10, 25, 41, 255)
    )

    # Draw a simple camera/play icon
    cx, cy = size // 2, size // 2
    icon_size = int(size * 0.35)

    # Play triangle (accent cyan)
    accent = (0, 212, 255, 255)
    triangle = [
        (cx - icon_size // 3, cy - icon_size // 2),
        (cx - icon_size // 3, cy + icon_size // 2),
        (cx + icon_size // 2, cy)
    ]
    draw.polygon(triangle, fill=accent)

    # Border accent
    border_margin = int(size * 0.12)
    border_radius = int(size * 0.18)
    draw.rounded_rectangle(
        [border_margin, border_margin, size - border_margin, size - border_margin],
        radius=border_radius,
        outline=(0, 212, 255, 180),
        width=max(2, int(size * 0.015))
    )

    img.save(os.path.join(ICON_DIR, filename))
    print(f"Created {filename} ({size}x{size})")

create_icon(192, 'icon-192.png')
create_icon(512, 'icon-512.png')
create_icon(180, 'apple-touch-icon.png')

# Also create favicon
create_icon(32, 'favicon-32.png')

print("All icons generated!")
