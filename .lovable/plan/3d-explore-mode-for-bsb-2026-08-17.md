# 3D Explore Mode for BSB

Add an optional 3D architectural view of any single floor, alongside — never replacing — the existing 2D section, simulation, dashboard and event log.

## What you get

- A `2D SECTION / 3D EXPLORE` toggle above the main viewport. 2D stays exactly as it is today.
- In 3D mode: an isometric-style cutaway of one floor at a time, built procedurally from the existing floor and room data (F01–F10, all current rooms with their real names, purposes and "why it matters" text).
- Floor selector F01–F10 (the existing left-hand floor navigator drives it, plus in-view floor chips). Switching floors unmounts the old floor and builds the new one.
- Orbit, zoom, pan with damping; `Reset View` and `Fullscreen` buttons.
- Click a room: it highlights (accent emissive + outline), other rooms dim, and the existing room info panel shows name, purpose, status, metric, systems and rationale — same selection state as 2D, so selecting in 3D also updates 2D.
- Dark technical BSB language: same background, grid floor, thin edge lines, per-system accent colors, monospace labels.

## Floor composition (procedural)

Each floor is generated from its room list:
- Floor slab + ceiling ring, exterior bunker shell (open on the camera side for the cutaway).
- Rooms packed into two bands either side of a central corridor, sized by each room's existing `span` value, with door gaps in the corridor-facing wall.
- Central core with stair flight and elevator shaft, consistent across all 10 floors.
- Floating labels per room (billboarded, small, culled when zoomed out).
- Simple procedural furniture keyed off the existing `fixture` type already in the data (bunks, tanks, pumps, servers, medbeds, cabinets, kitchen, seats, desks, machines, lockers, shower, screens, park, gym, plants) — a handful of boxes/cylinders each, purely for identification.
- Floor accent color taken from each floor's existing `accent` system.

## Content note

The 3D view reuses the room data already in the project. Two rooms in your F02 list (Gun Vault, Shooting Range) are not in the current data — the existing floor keeps the equivalent Controlled Equipment Vault, Controlled Training Area, observation rooms, CCTV, comms and control room. I'll keep those names rather than adding weapons-specific rooms. Everything else on your list already matches existing data (F05 already has aquaponics, hydroponics/agriculture, poultry, food storage, pantry, seed storage and air filtration).

## Performance

- Only the selected floor is mounted; its geometries/materials are disposed on change.
- Shared geometries and a small material cache (base / accent / selected / hovered) reused across rooms; hover and selection only swap material references, no rebuilds.
- `frameloop="demand"` so frames render on interaction only; no shadows, no post-processing, no particles.
- Instanced meshes for repeated furniture; DPR clamped to 2; canvas mounted client-only to avoid SSR issues.

## Technical details

- Add `three`, `@react-three/fiber`, `@react-three/drei`.
- New files under `src/components/bunker/three/`: `Floor3DView.tsx` (canvas, controls, toolbar, fullscreen), `Floor3DScene.tsx` (slab/shell/core/corridor), `Room3D.tsx` (walls, door gap, label, click/hover), `Fixtures3D.tsx` (procedural furniture by fixture kind), plus `src/lib/bunker/layout3d.ts` (pure function: floor id → room rectangles, corridor, core).
- The R3F canvas is loaded via `React.lazy` behind a hydration gate so SSR/prerender never evaluates three.js.
- `src/routes/index.tsx` gains a `viewMode` state (`"2d" | "3d"`) and renders either `BunkerVisualization` or `Floor3DView` in the same slot; all other panels untouched. 3D mode defaults to the currently selected floor (F01 if none).
- Room click dispatches the existing `selectRoom` action — no new state model.
- Responsive: on small screens the toolbar wraps, controls get touch-friendly targets, `touch-action: none` on the canvas; presentation mode gives 3D the full tall viewport.

## Verification

Cycle F01→F10, click rooms on each, orbit/zoom/pan, toggle 2D↔3D, fullscreen, mobile/tablet widths, and a clean typecheck/build.
