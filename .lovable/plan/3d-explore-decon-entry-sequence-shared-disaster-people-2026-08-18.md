# 3D Explore: Decon Entry Sequence + Shared Disaster People

## What I found (verified in code)

**People in the 2D simulator** — `src/lib/bunker/people.ts` exposes `peopleFor(scenario, population)`, a pure, deterministic function. For each person index it picks a floor by round-robin over `scenarioById(scenario).safeFloors`, picks a room on that floor with a seeded pseudo-random, then converts that room to SVG pixel coordinates via `roomRect`/`floorY` from `flows.ts`. There is no per-person persistent state and no movement engine: when the scenario changes, `SCENARIOS[x].safeFloors` changes and the whole set is recomputed. `PeopleLayer.tsx` renders it and dims people not on the selected floor.

**Simulation state** — one `useReducer` in `src/routes/index.tsx` (`simulation.ts`) holds `scenario`, `population`, `selectedFloor`, `selectedRoom`. `Floor3DView` already receives `floorId` and `selectedRoom` from that same state, so the 3D view is already inside the single source of truth. It just isn't passed `scenario`/`population` yet.

**Conclusion: direct reuse is possible.** The logical layer (person -> floor -> room) is coordinate-free; only the final coordinate step is 2D-specific. No separate 3D disaster system is needed and no change to disaster rules is required.

**Floor 1 (`Entry & Decontamination`) is the entrance floor.** In `layout3d.ts`, Floor 1 forces Main Entrance into the west row and Emergency Exit into the east row; everything else (including Decon A, Decon B, Reception) falls into whichever of north/south is emptier. So the decon rooms are currently on the wrong side of the building relative to the entrance.

## 1. West-wing entrance sequence (Floor 1 only)

Rework only the Floor 1 branch of `floorLayout` in `src/lib/bunker/layout3d.ts`:

```text
        (north row rooms)
   +-------------------------------+
 W | ENTRANCE |                    |
 E |----------|  ring corridor +   |
 S | DECON A  |  central core      |  E ... Emergency Exit
 T | DECON B  |                    |
   | RECEPTION|                    |
   +-------------------------------+
        (south row rooms)
```

- Build the west wing as an explicit stacked group along Z instead of the generic row logic: Main Entrance (outer, on the surface-facing edge), then Decon A and Decon B side by side directly inboard of it, then Check-In / Reception immediately south of the decon pair.
- Widen the west wing depth so it holds two bands (entrance band + decon band) rather than the single `ROOM_DEPTH` band, keeping the ring corridor and core untouched.
- Openings: door from Main Entrance into Decon A and a second into Decon B (`doorOffset` per box, on the shared inboard wall of the entrance); each decon room gets an outbound door onto the west ring corridor. The Main Entrance itself gets **no** direct door onto the corridor, so the only modelled path inward is through a decon room.
- Reception sits on the decon band, adjacent to the decon rooms with its own corridor door, so check-in stays visually part of the entry area.
- The existing east-side surface path / solid-block logic for Floor 1 stays as-is; Floors 2-10 keep the current generic layout branch untouched (guarded by `floorId === 1`).

## 2. Shared people model between 2D and 3D

- Refactor `people.ts` into two layers, keeping the existing export signature:
  - `assignPeople(scenario, population)` -> `{ id, floor, roomId, child, delay, spread }` (spread = the same seeded 0..1 offsets already used, so 2D positions come out byte-identical).
  - `peopleFor(...)` keeps its current shape by mapping assignments through `roomRect`/`floorY`. `PeopleLayer.tsx` is unchanged.
- New `src/components/bunker/three/People3D.tsx`: consumes `assignPeople(state.scenario, state.population)`, filters to the currently displayed floor, looks up each person's `roomId` in the `FloorLayout.boxes` for that floor, and places a lightweight capsule+sphere figure inside that room box using the same `spread` values. Shared geometries/materials, no shadows, disposed with the scene.
- Pass `scenario` and `population` from `src/routes/index.tsx` through `Floor3DView` -> `Floor3DCanvas` -> `Floor3DScene`.
- Result: selecting Earthquake changes `safeFloors`, so both views recompute from the same assignment. Same-floor room changes appear as people relocating within the floor; cross-floor movement appears as people leaving the displayed floor and populating the safe floors, matching the 2D dimming behaviour. A small "N residents on this floor / M elsewhere" readout in the 3D toolbar makes the cross-floor case legible.
- Positions animate with a short eased transition on scenario change (people already carry a `delay`); `frameloop` stays on demand except while a transition is running.

## 3. Not changing

`simulation.ts` rules, `scenarios.ts` data, 2D components, floors 2-10 geometry, existing 3D controls (reset, labels, fullscreen, floor chips, 2D Section toggle).

## Validation

Playwright pass on Floor 1 in 3D: confirm entrance/decon A/decon B/reception adjacency and door openings, confirm floors 2-10 render unchanged, then switch scenario to Earthquake and confirm 3D people leave F01 and appear on F06/F07/F08 consistently with the 2D view.
