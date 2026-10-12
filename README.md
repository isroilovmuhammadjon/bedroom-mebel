# Bedroom Mebel website: how to update it

The whole site is one file, `index.html`. All content the shop changes (contacts, colours, fabrics, products and prices) is in one clearly marked block near the end of the file:

```
/* BEDROOM MEBEL — EDITABLE DATA */
...
/* END OF EDITABLE DATA */
```

Open `index.html` in any text editor (VS Code, Notepad++, even Notepad), change that block, save, and upload the file again. Nothing else needs to change.

> The products and prices in the file now are **examples**. Replace them with the shop's real models before going live.

---

## 1. Contacts: `BRAND`

```js
const BRAND = {
  phone: '+998 99 723 77 07',   // shown on the site
  phoneRaw: '+998997237707',    // copied by the "Copy" button
  telegram: 'bedroom_mebel',    // t.me/bedroom_mebel
  instagram: 'bedroom_mebel'
};
```

## 2. Body colours: `FINISHES`

```js
walnut: { hex:'#6E4A33', kind:'wood', name:{uz:'Yong‘oq', ru:'Орех', en:'Walnut'} },
```

- `walnut`: a short id, used in products (`finishes:['walnut', ...]`).
- `hex`: the colour. Pick it from a photo of the real laminate/paint with any colour picker.
- `kind`:
  - `wood` adds wood grain.
  - `matte` is flat paint or laminate.
  - `gloss` is shiny with reflections.
- `name`: the label in Uzbek, Russian and English.

## 3. Fabrics: `FABRICS`

Same format. `kind` is one of:
- `velvet`: soft sheen
- `boucle`: textured, nubby
- `linen`: flat weave

## 4. Products: `PRODUCTS`

Each product is one `{ ... }` block. Copy an existing one of the same type and edit it.

```js
{ id:'samarqand',            // unique, latin letters, no spaces
  cat:'bed',                 // bed | nightstand | bench | wardrobe | dresser
  badge:{uz:'Xit',ru:'Хит',en:'Bestseller'},   // optional label on the photo
  name:{uz:'Samarqand',ru:'Самарканд',en:'Samarqand'},
  desc:{uz:'...',ru:'...',en:'...'},
  model:{ style:'channel', base:'plinth', hh:1.15 },   // how the 3D model looks, see below
  sizes:[ {w:140,l:200,price:3900000}, {w:160,l:200,price:4300000} ],
  finishes:['oak','walnut','cashmere'],   // first one is the default
  fabrics:['beige','grey'],               // [] if not upholstered
  options:[ {id:'lift', flag:'lift', price:700000,
             name:{uz:'Ko‘targich mexanizm',ru:'Подъёмный механизм',en:'Lift-up storage'}} ],
  photo:'images/samarqand.jpg'            // optional, see section 5
}
```

**Sizes** are in centimetres, and the price is in so‘m:
- Beds use `{w, l, price}`: mattress width × length.
- Everything else uses `{w, d, h, price}`: width × depth × height.

The 3D model is drawn at exactly these sizes, so a 90 cm bed looks narrow and a 200 cm bed looks wide in the room.

### 3D model settings (`model`)

| Product | Setting | Choices |
|---|---|---|
| Bed | `style` (headboard) | `channel` vertical soft panels · `tufted` buttoned · `wing` with side wings · `panel` flat wood · `slat` wooden slats |
| Bed | `base` | `plinth` box base · `legs` on legs · `float` floating base |
| Bed | `hh` | headboard height in metres (e.g. `1.15`) |
| Bed | flags | `drawers:true` side drawers · `led:true` LED glow (with `float`) · `upFrame:true` fabric-covered frame |
| Nightstand | `style` | `legs` 2 drawers on legs · `shelf` drawer + open shelf · `drawers3` tall, 3 drawers |
| Bench | `style` | `soft` upholstered on legs · `storage` box with soft lid |
| Wardrobe | `style` | `kupe` sliding doors · `hinged` swing doors |
| Wardrobe | flags | `mirror:true` mirror door |
| Dresser | `rows`, `cols` | number of drawers, e.g. `rows:3, cols:2` |
| Dresser | flags | `legs:true` on legs · `mirror:true` round mirror above |

**Options** with a `flag` (for example `lift`, `mirror`, `led`, `drawers`) also switch that feature on the 3D model when the customer ticks them. Options without a flag only add to the price.

## 5. Real product photos (optional)

Add `photo:'images/name.jpg'` to a product. The catalog card then shows the photo, while the 3D room keeps using the 3D model. Put the images in an `images` folder next to `index.html` when you host the site.

Note: photos from other websites will not load inside the Claude preview. They work once the site is on your own hosting.

## 6. Putting the site on the internet

1. Buy a domain (for example `bedroommebel.uz`) from any `.uz` registrar.
2. Use any static hosting:
   - Netlify, Vercel, Cloudflare Pages or GitHub Pages (free tiers work).
   - Or any regular hosting with a "public_html" folder.
3. Upload `index.html` (and the `images` folder, if you use photos).
4. Point the domain to the hosting, following the host's instructions.

The site needs no server, database or build step. It loads the 3D engine and fonts from public CDNs.

## 7. How orders work

When a customer presses "Prepare order message", the site builds a text containing:
- their name and phone
- every selected item with size, colour, fabric, options and price
- the total
- their room settings

They copy it and send it to the shop on Telegram. The site does not send anything by itself.

## 8. What the customer can do in the 3D room

- **Furniture:**
  - Add or replace a bed, nightstands (left, right or both), a bench at the foot of the bed, a wardrobe and a dresser.
  - Change size, body colour, fabric and extras.
  - Tap any piece in the room to edit it.
  - Open and close the wardrobe doors.
- **Arranging the room:**
  - Three ready-made layouts: "Toward the corner" (default), "Centred" and "Facing the window". Each one places the furniture against different walls, keeps it clear of the window and avoids overlaps.
  - Drag any piece with a mouse to move it. On phones, tap the "Move" button above the room first, then drag with a finger; tap it again to go back to scrolling. Without it, swiping up and down over the room scrolls the page and swiping sideways turns the room. Near a wall it snaps flat against it. The nightstands, bench, rug, wall art and decorated wall follow the bed.
  - A "Rotate 90°" button for the bed, wardrobe and dresser.
- **Room:**
  - Walls: colour and finish: paint, plaster, 6 wallpaper patterns (damask, stripes, geometric, leaves, flowers, check) shown at real wallpaper size, or **the customer's own wallpaper photo** with a pattern-size slider. The photo stays in the customer's browser and is never uploaded anywhere.
  - Wall behind the bed: plain, wood slats, soft panels, mouldings or painted arch.
  - Floor: 6 types.
  - Window: left wall, back wall or none, in 3 sizes.
  - Curtains: 5 styles and 11 colours. Tapping the curtains opens their settings.
  - An armchair with a side table, or a small sofa, in 7 colours.
  - Rug, lamps, plant, wall art, floor lamp.
  - Day, evening and night lighting.
- **Views:** overview, bed close-up, from the door, top view, or free rotate and zoom. Walls between the camera and the room hide automatically.
- **Menu:** on computers, the header menu jumps straight to the 3D room, the catalog (or one category of it), "How it works" and contacts. On tablets it is a row of buttons under the header.
- **Phone layout:** phones get their own layout:
  - A fixed bottom bar with 3D room, Catalog, Order (with the number of items) and Contact.
  - The page shows the room with a "Design the room" button. It (or tapping any furniture) opens the room full screen with all options underneath, so every change is visible. Furniture is dragged directly with a finger there. "Done" returns to the page.
  - The catalog shows two products per row, with the category filter staying at the top.
  - Product details open as a sheet from the bottom of the screen.
- **Memory:** the design and arrangement are remembered in the customer's browser.

The armchair and sofa are room decor, not catalog products. If the shop sells sofas, they can be added as a new product category later.

## 9. Separate screens

The site is split into four screens, switched from the menu (top on computers, bottom bar on phones):

- **Home** (`#home`): banner, main features and "How it works".
- **3D room** (`#room`): only the room and its settings. On phones the room fills the screen with its controls underneath.
- **Catalog** (`#catalog`): all products, with category filters.
- **Contact** (`#contact`): phone, Telegram, Instagram and the message form.

The furniture, colours and room choices are shared between screens: "See in room" in the catalog opens the 3D room with that product placed. A link can open a screen directly, for example `yoursite.uz/#catalog` for an Instagram bio, or `yoursite.uz/#room`.

## 10. 3D product view

Clicking a product in the catalog opens its details with a live 3D model instead of a still picture:

- Drag (or swipe) to turn it all the way around; scroll or pinch to zoom. It turns slowly on its own until touched.
- Choosing a size, body colour or fabric updates the 3D model immediately.
- Wardrobes get an "Open doors" button to show the shelves and hanging space inside.

It uses the same 3D engine as the room, so it adds no extra memory load on phones. Each product's 3D model comes from its `model` settings (section 4), so new products appear in 3D automatically.
