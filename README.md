# Shelterverse Sim

BSB — BEYOND SAFE BOUNDARIES

Interactive 10-Floor Underground Emergency Community

Build a polished, interactive web app for a school project called BSB — Beyond Safe Boundaries.

BSB is a conceptual 10-floor underground emergency community for approximately 20–30 people, designed to demonstrate how shelter, water, air, food, energy, healthcare, sanitation, education, security, and community spaces can work together during prolonged emergencies.

This is an educational simulation, not a real construction, medical, security, or engineering guide.

The experience should feel like a combination of a science-museum interactive exhibit, architectural visualization, and disaster-resilience simulator.

1. MAIN EXPERIENCE

The centerpiece is a large interactive 2D SVG cutaway of the entire 10-floor bunker.

Users can:

Explore all floors

Click rooms

Inspect systems

See people moving through the facility

View system dependencies

Trigger disaster scenarios

Advance simulated time

Watch resources change

Run a guided presentation

Do not make the bunker a grid of cards. It should look like a cohesive architectural cutaway with concrete walls, floors, doors, stairs, elevators, pipes, ventilation ducts, cables, equipment, furniture, plants, and people.

Use subtle depth, shadows, textures and animations.

2. VISUAL STYLE

Use a premium dark technical aesthetic:

Dark charcoal/steel bunker

Cyan/blue water and air

Amber power

Green food

Red/coral medical

Purple/steel security

Green/amber/red status indicators

Subtle gradients and glass panels

Clean technical typography

Minimal, professional animations

Avoid excessive neon or a generic SaaS-dashboard appearance.

3. 10-FLOOR PLAN

FLOOR 1 — ENTRY & DECONTAMINATION

Main entrance

Emergency exit access

Safety gear & equipment room

Decontamination A

Decontamination B

Generator room

Reception/check-in

Emergency equipment storage

Elevator

Stair access

Purpose: transition safely between the outside environment and protected areas.

FLOOR 2 — SECURITY & EMERGENCY CONTROL

Security/control room

Fire-control room

Security holding/observation A

Security holding/observation B

CCTV monitoring

Emergency communications

Controlled equipment vault

Controlled training range

Show access control, alarms, cameras and communications.

Do not implement weapon mechanics or tactical/security instructions.

FLOOR 3 — WATER, AIR & TECHNOLOGY

Water system

Water treatment

Water storage connection

Air filtration

HVAC equipment

Fire-control pump A

Fire-control pump B

Fiber-optic/IT server room

Computer database

Maintenance tools/materials

Make this one of the most visually detailed floors.

Animate water through pipes, air through ducts, power through cables and network activity through fiber.

FLOOR 4 — MEDICAL & HEALTHCARE

Research/diagnostic room

OB-GYN

Dental

Operating/treatment room

Isolation A

Isolation B

Isolation C

Medical equipment

Pharmacy

Comfort room

Counseling room

Show medical beds, equipment, cabinets and pharmacy storage.

Do not provide medical treatment instructions.

FLOOR 5 — FOOD PRODUCTION & STORAGE

Aquaponics

Hydroponics/agriculture

Poultry area

Food storage

Food pantry

Seed storage

Supporting air filtration

Visually connect:

Water → Aquaponics/Hydroponics → Food → Storage → Kitchen → Community

Show organic food waste moving toward Floor 10.

FLOOR 6 — RESIDENTIAL A

8 bedrooms

Laundry

Shared bathrooms

Personal storage

Small lounge

Show beds, storage and residents.

FLOOR 7 — RESIDENTIAL B

8 bedrooms

Laundry

Shared bathrooms

Personal storage

Small lounge

FLOOR 8 — COMMUNITY & WELL-BEING

Make this one of the most visually appealing floors.

Prayer/quiet room

Gym

Game room

Bathrooms

Common area

Mini theater

Dining area

Kitchen

Mini indoor park

Show residents eating, exercising, socializing and relaxing.

FLOOR 9 — EDUCATION & DEVELOPMENT

Sleeping/guest quarters

Conference room

Bathroom

Computer lab

Library

Classroom

Art room

Music room

Show people studying, reading and creating.

FLOOR 10 — WASTE & BACKUP SYSTEMS

Drainage system

Backup generators

First-aid room

Waste segregation

Anaerobic digestion

Wastewater treatment

Recycling/processing

Utility maintenance

Show conceptual flows:

Organic Waste → Segregation → Processing

Wastewater → Treatment → Appropriate Reuse/Discharge

Keep these conceptual rather than providing engineering procedures.

4. FLOOR NAVIGATION

Create a vertical navigator:

OVERVIEW

F01 ENTRY
F02 SECURITY
F03 LIFE SUPPORT
F04 MEDICAL
F05 FOOD
F06 RESIDENTIAL
F07 RESIDENTIAL
F08 COMMUNITY
F09 EDUCATION
F10 WASTE

Clicking a floor smoothly zooms/scrolls to it.

5. INTERACTIVE ROOMS

Every major room is clickable.

Clicking a room:

Highlights it

Dims unrelated areas

Slightly zooms toward it

Opens an information panel

Panel:

ROOM NAME

Purpose
Status
Metric
Connected systems
Why it matters

6. SYSTEMS VIEW

Add:

EXPLORE SYSTEMS

Options:

WATER | AIR | POWER | FOOD | MEDICAL | COMMUNICATIONS | WASTE | PEOPLE

Selecting a system should highlight every related room and animate its flow.

Example:

POWER

Highlight:

Floor 1 generators
Floor 3 infrastructure
Floor 4 medical
Floor 5 food production
Floor 8 kitchen
Floor 10 backup generators

Show dependencies between them.

This should be a major feature of the project.

7. SYSTEM DEPENDENCIES

Visually connect:

WATER

Floor 3 → Medical → Food → Residential → Community → Wastewater

AIR

Floor 3 → Floors 4–9

POWER

Generators → critical systems throughout bunker

FOOD

Floor 5 → Kitchen → Dining → Residents

WASTE

Floors 5–9 → Floor 10

COMMUNICATIONS

Floor 2 ↔ Floor 3 ↔ all floors

Use animated lines/particles.

If a system degrades, connected systems should visually react.

8. SURVIVAL DASHBOARD

Show:

POPULATION: 24 / 30

WATER: 87%
FOOD: 72%
POWER: 84%
AIR QUALITY: 98%
MEDICAL: 91%
STRUCTURAL INTEGRITY: 96%
WASTE CAPACITY: 78%
COMMUNITY WELL-BEING: 89%

Also show an illustrative:

ESTIMATED SUSTAINABILITY: ~70 DAYS

Use animated gauges and green/amber/red states.

Footer:

SIMULATION VALUES — FOR EDUCATIONAL DEMONSTRATION

9. POPULATION

Default population: 24 residents, capacity 30.

Show a simple breakdown of:

Adults

Children

Medical staff

Maintenance staff

Education/community staff

Use small animated human figures throughout the bunker.

During disasters, residents move to predefined safe areas. No complex pathfinding is required.

10. DISASTER SIMULATION

Add:

SIMULATE DISASTER

Options:

NORMAL

EARTHQUAKE

FLOOD

WILDFIRE / HAZARDOUS AIR

EXTREME STORM

POWER FAILURE

Each scenario changes:

Environment

Resource levels

System states

Resident locations

Event log

Emergency indicators

EARTHQUAKE

Subtle bunker shake

Structural integrity decreases

Power decreases

Some systems degrade

Emergency lighting activates

Residents move to safer areas

FLOOD

Water appears around surface

Main access becomes restricted

Drainage activates

Residents move toward safer upper areas

WILDFIRE / HAZARDOUS AIR

Smoke outside

External air intake closes

Air filtration activates

Power consumption increases

Residents remain indoors

EXTREME STORM

Rain/wind/lightning

Reduced solar generation

Increased rainwater collection

Surface access restricted

POWER FAILURE

Main power unavailable

Backup generators activate

Emergency lighting activates

Non-essential systems reduce consumption

Power-dependent systems degrade

11. CASCADING FAILURES

Demonstrate system interdependence.

For example:

LOW POWER

→ Water treatment warning
→ Air filtration warning
→ IT/communications warning
→ Food production warning
→ Kitchen warning
→ Medical equipment warning

LOW WATER

→ Food production warning
→ Kitchen warning
→ Sanitation warning
→ Medical warning

This is a key educational feature.

12. TIME SIMULATION

Controls:

PAUSED | +1 DAY | +7 DAYS | +30 DAYS

As time advances:

Food decreases

Water decreases

Power changes

Medical supplies decrease

Waste increases

Food production can replenish food

Rain collection can replenish water

Energy generation changes with conditions

Community well-being changes

Keep all values illustrative, not real engineering predictions.

13. EVENT LOG

Display events such as:

14:00  Simulation initialized
14:01  24 residents accounted for
14:02  Essential systems online
14:04  Earthquake detected
14:04  Emergency systems activated
14:05  Residents moving to safer areas
14:06  Backup power activated


Newest events first.

14. GUIDED DEMO

Add:

START GUIDED DEMO

Create a short automated presentation:

Show the complete bunker.

Introduce BSB and its purpose.

Highlight Floor 1.

Highlight Floor 3 infrastructure.

Highlight medical systems.

Highlight food production.

Show residential/community/education areas.

Activate Earthquake.

Show cascading system effects.

Advance +7 days.

End with:

“The goal is not simply to survive the disaster. It is to maintain a functioning community after the disaster.”

Allow the presenter to exit at any time.

15. PRESENTATION MODE

Add:

PRESENTATION MODE

When enabled:

Expand the bunker

Hide secondary panels

Increase text size

Keep essential status information

Keep simulation controls

Optimize for classroom projection

Press ESC to exit.

16. SURFACE & ENVIRONMENT

NORMAL:

Terrain

Trees

Solar panels

Main entrance

Emergency access

Rainwater collection

EARTHQUAKE:

Subtle shake/dust

FLOOD:

Rising water

WILDFIRE:

Smoke/haze

STORM:

Rain/lightning

POWER FAILURE:

Darker interior/emergency lighting

17. TECHNICAL IMPLEMENTATION

Use:

React

TypeScript

Tailwind CSS

SVG

CSS animations

Lucide icons

No backend, authentication or external APIs.

Use local React state/reducer for simulation.

Suggested structure:

components/bunker/
  BunkerVisualization
  Surface
  Floor
  Room
  PeopleLayer
  SystemFlow
  FloorNavigator
  SystemsView
  SurvivalDashboard
  DisasterControls
  TimeControls
  EventLog
  RoomInfoPanel
  GuidedDemo
  PresentationMode

lib/bunker/
  floors.ts
  rooms.ts
  systems.ts
  flows.ts
  scenarios.ts
  simulation.ts


Keep simulation logic separate from UI components.

18. EDUCATIONAL FRAMING

Include:

WHY IT MATTERS

A resilient emergency shelter is an interconnected system. Water, energy, air, food, healthcare, sanitation, communication and community life all depend on one another.

Also include:

Conceptual educational model. Simulation values and facility layouts are illustrative and are not engineering, medical, architectural, security, or construction guidance.

19. QUALITY REQUIREMENTS

The final application must feel like an interactive digital model of an underground community, not a dashboard or static floor plan.

Priorities:

Beautiful 10-floor SVG cutaway

Easy floor navigation

Interactive rooms

Systems View and dependency visualization

Disaster simulation

Population movement

Time/resource simulation

Guided classroom demo

Presentation Mode

Responsive desktop/tablet/mobile layout

Test:

Floor navigation

Room selection

Systems View

All disaster scenarios

Time advancement

Resource changes

Cascading failures

Guided Demo

Presentation Mode

Reset

Mobile layout

Build the complete working application, not a static mockup.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/79e0f371-181c-45f3-9d74-fe1bdb3def88).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
