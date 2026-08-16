# BSB — Beyond Safe Boundaries

An interactive 10-floor underground emergency community, built as a single-page educational simulation: a large SVG architectural cutaway with live systems, disaster scenarios, time simulation, guided demo, and presentation mode.

## The experience

Three-column desktop layout (stacked/tabbed on mobile):

```text
+-------------+-----------------------------+---------------+
| FLOOR NAV   |  SURFACE + 10-FLOOR CUTAWAY |  DASHBOARD    |
| OVERVIEW    |  (scroll/zoom, clickable    |  gauges       |
| F01..F10    |   rooms, people, flows)     |  population   |
| SYSTEMS     |                             |  event log    |
+-------------+-----------------------------+---------------+
|  DISASTER SCENARIOS | TIME CONTROLS | DEMO | PRESENT      |
+---------------------------------------------------------- +
```

- **Cutaway**: one continuous SVG "section" of the shelter — surface terrain on top, then floors 1–10 stacked with concrete slabs, shafts for the elevator and stairs running the full height, pipe/duct/cable risers, room furniture (beds, tanks, grow racks, servers, kitchen, theater seats, planting beds), and small animated human figures.
- **Floor navigator**: clicking a floor smoothly scrolls and zooms the SVG viewBox to that floor; OVERVIEW zooms out to the whole section.
- **Room click**: highlights the room, dims everything else, nudges the zoom, and opens the info panel (name, purpose, status, metric, connected systems, why it matters).
- **Systems view**: WATER / AIR / POWER / FOOD / MEDICAL / COMMUNICATIONS / WASTE / PEOPLE. Selecting one dims unrelated rooms and animates particles along the dependency paths between floors.
- **Dashboard**: animated arc gauges for water, food, power, air, medical, structural, waste, well-being, plus population breakdown and estimated sustainability days, with green/amber/red states and the "SIMULATION VALUES" footer.
- **Disasters**: Normal, Earthquake, Flood, Wildfire/Hazardous air, Extreme storm, Power failure. Each changes surface weather, interior lighting, resource drain rates, system statuses, and moves residents to safe areas; the earthquake adds a subtle shake, flood raises surface water, wildfire adds haze, storm adds rain/lightning, power failure darkens the interior to emergency red.
- **Cascading failures**: when a resource drops below thresholds, dependent rooms/systems flip to warning or critical, get an outlined pulse in the cutaway, and log entries appear.
- **Time**: paused / +1 day / +7 days / +30 days, plus an auto-tick when running. Consumption, production, waste and morale all move; food production and rain collection replenish.
- **Event log**: newest first, timestamped, colored by severity.
- **Guided demo**: scripted 11-step tour that drives the same state (zoom to floors, select systems, trigger earthquake, advance 7 days) with next/back/exit and the closing quote.
- **Presentation mode**: expands the cutaway, hides secondary panels, enlarges type, keeps status + controls; ESC exits.
- **Why it matters** section and the educational disclaimer stay visible below the model.

## Content

All 10 floors and every room listed in the brief, each with purpose, status, a metric, connected systems, and a "why it matters" line. Framing stays conceptual — no engineering, medical, or security procedures; the Floor 2 range/vault and Floor 10 processing rooms are described at a purely conceptual level.

## Technical approach

- Single route: rewrite `src/routes/index.tsx` with app-specific `head()` metadata; no backend.
- Design tokens for the dark technical palette (steel/charcoal surfaces, cyan water, sky air, amber power, green food, coral medical, violet security, status colors) added to `src/styles.css` and used semantically — no hardcoded colors in components.
- Data + logic in `src/lib/bunker/`: `floors.ts`, `rooms.ts`, `systems.ts`, `flows.ts`, `scenarios.ts`, `simulation.ts` (pure reducer: state, actions, tick math, cascade rules, event generation).
- UI in `src/components/bunker/`: `BunkerVisualization`, `Surface`, `Floor`, `Room`, `PeopleLayer`, `SystemFlow`, `FloorNavigator`, `SystemsView`, `SurvivalDashboard`, `DisasterControls`, `TimeControls`, `EventLog`, `RoomInfoPanel`, `GuidedDemo`, `PresentationMode`.
- State via `useReducer` in one `useSimulation` hook; components stay presentational.
- Animation via CSS/SVG (`animateMotion`, dash offsets, keyframes) with `prefers-reduced-motion` respect; Lucide for icons.
- Responsive: three columns on desktop, collapsible panels on tablet, bottom sheet + drawer nav on mobile.

## Verification

Browser pass over floor navigation, room selection, each system, all six scenarios, time steps, cascade thresholds, guided demo, presentation mode, reset, and a mobile viewport check.
