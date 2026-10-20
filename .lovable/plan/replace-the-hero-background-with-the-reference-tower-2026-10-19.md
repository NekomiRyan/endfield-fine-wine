# Replace the hero background with the reference tower

## Goal
Swap the current generated tower art for one based on the angled silver tower in your latest image, with no baked-in text.

## Approach
1. Use your uploaded image as the source and edit it into a clean, wide background:
   - Keep the angled silver tower with crossed blades, the dark charcoal backdrop, faint circles/grid and the cyan glow at the bottom.
   - Remove the "Talos Pioneers" title, paragraph, dots, stripes and both buttons, filling that area with plain dark background.
   - Widen to a 16:9 frame with the tower on the right, leaving open space on the left for the headline.
2. Check the result for leftover text or artifacts; fix with a follow-up edit if needed.
3. Replace the existing hero image so the page uses the new one. The layout stays the same.

## Note on internet images
Official Arknights: Endfield artwork is owned by Hypergryph/Gryphline, so I'll avoid pulling it from the web. Editing your own reference image gives the same tower look without that issue. If you'd rather I link a specific official image you have the rights to use, send the link.

## Technical details
- `imagegen--edit_image` with `user-uploads://image-3.png`, 1600x900, output overwrites `src/assets/hero.jpg`.
- No code changes needed in `src/routes/index.tsx` (same import, `object-right` positioning).
