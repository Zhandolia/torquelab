# TorqueLab

Interactive 3D automotive mechanics training. Rotate, zoom, explode and
disassemble real service procedures instead of squinting at a phone video.

**Live: https://zhandolia.github.io/torquelab/**

```bash
npm install
npm run dev      # http://localhost:5181
npm run build
npm run preview  # http://localhost:4173/torquelab/ — mirrors the deployed subpath
```

Pushing to `main` builds and deploys to GitHub Pages via
`.github/workflows/deploy.yml`.

---

## Why it is built this way

**Every 3D assembly is generated procedurally in TypeScript.** There are no
`.glb` files, no CAD imports and no asset pipeline. A brake rotor is a lathe
and extrude operation; a timing belt is a convex-hull tangent solve wrapped in
a hand-built `BufferGeometry`. That choice has consequences worth knowing:

- The whole app is ~250 KB of code plus Three.js. Nothing to download at runtime.
- Geometry is *parametric*. Change `teeth` on a sprocket and the belt re-wraps.
- Anyone who can read TypeScript can add a part. No Blender licence, no
  modelling skill, no binary diffs in version control.
- The models are **teaching models, not CAD**. They show relationships,
  sequence and fastener function. They are not dimensionally accurate, and the
  app says so to the user.

---

## Layout

```
src/
  lib/
    types.ts          Procedure / Step / Vehicle / PartInfo data model
    store.ts          Zustand + localStorage: progress, quiz answers, viewer prefs
  data/
    vehicles.ts       The training fleet and why each platform was chosen
    partsMeta.ts      Reference card for every named part in every assembly
    procedures/       One file per procedure — the actual course content
  three/
    geo.ts            Geometry factories (discs, sprockets, helixes, belt paths)
    materials.tsx     <Mat> — a material that reacts to focus/ghost/x-ray state
    context.ts        ViewerCtx + PartStateCtx
    Part.tsx          Named sub-assembly: explode, highlight, ghost, hit-test, anchor
    parts.tsx         Reusable mechanical primitives (Bolt, Rotor, Caliper, Piston…)
    assemblies/       Sixteen complete assemblies, composed from parts.tsx
    Viewer.tsx        Canvas, lights, camera tween, explode driver, callouts
  components/         UI atoms, toolbar, part inspector, quiz
  pages/              Home, Garage, VehicleDetail, Library, Bench, Runner,
                      Path, Exam, Diagnose, Measure, Torque, Safety,
                      Electrical
```

### The three ideas that make it work

**1. `<Part>` wraps every named thing.**

```tsx
<Part id="rotor" dir={[0, 0, 1.3]}>
  <Rotor od={1.41} />
</Part>
```

`dir` is the direction and distance that part travels when the assembly is
exploded. The wrapper reads viewer state and decides whether the part is
highlighted, ghosted, hidden or pickable — and registers its bounding-box
centre so callout labels can position themselves automatically. No step ever
has to hand-place a label in 3D space.

**2. A step is a camera, a focus set and a disassembly state.**

```ts
{
  id: 's4',
  title: 'Unbolt the caliper from its bracket',
  body: 'The two **guide pin bolts** hold the caliper body to the bracket…',
  camera: { pos: [-2.4, 0.6, 2.2], target: [-0.7, 0, 0] },
  focus:  ['guidePins', 'caliper'],     // highlighted; everything else ghosts
  explode: 0.3,
  hotspots: [{ part: 'guidePins', label: 'Guide pin bolt ×2', spec: '32 N·m' }],
  torque:  [{ fastener: 'Caliper guide pin bolt', nm: 32, ftlb: 24 }],
}
```

`hiddenByStep` on the procedure carries the running disassembly state — the
parts already off the car by the time you reach that step. That is what makes
the model agree with the written order instead of showing a wheel that the
text removed three steps ago.

**3. Specs live next to the step that needs them.** Torque, measurement limits,
tools and hazards are per-step data, not an appendix. The N·m / ft-lb toggle is
global and persists.

---

## The learning path

`src/data/curriculum.ts` groups the procedures into four levels ordered by
consequence rather than by system — you start where a mistake costs an
afternoon and finish where it costs a cylinder head. Each level ends in an
assessment that draws across its procedures and tests reasoning rather than
recall.

```
1  Shop Foundations    Pre-ASE      5 procedures, 11 questions, pass 75%
2  Brake Systems       ASE A5       3 procedures, 11 questions, pass 75%
3  Chassis & Driveline ASE A2/A3/A4 4 procedures, 11 questions, pass 75%
4  Engine Mechanical   ASE A1       4 procedures, 10 questions, pass 80%
```

Gating is deliberate: an exam unlocks when every procedure in its level is
finished **and** the previous level has been passed. Procedures themselves are
never locked — anyone can read ahead from the library. The path gates
certification, not learning.

**Question options are shuffled before display** (`src/lib/shuffle.ts`).
Questions are authored with the correct answer first because that is far
easier to write and review, which would otherwise let anyone pass by always
picking A. The shuffle is seeded from the question id so it is stable across
renders, sessions and devices — answers are stored as indices, so a random
shuffle would invalidate every saved result on the next render. The same
treatment applies to the checkpoints inside each procedure.

Passing all four levels produces a completion record with an optional name,
printable from the path page. It is a record of study on a training platform,
and the app says so on the record itself.

---

## The diagnostic bay

`src/data/diagnostics.ts` is the other half of the training. Every procedure
answers *how do I do this job*; none of them answers *is this the job*, which
is the half of trade school nobody films and the reason so many home repairs
are a correct procedure performed on an innocent part.

A case opens with a customer describing a symptom and guessing at the cause.
Each decision costs time, and some of them put parts on the car that were never
at fault:

```ts
{
  text: 'Fit a new pair of front tyres — cupped tyres make exactly this noise',
  costMin: 45,
  costParts: 420,
  why: 'Cupped tyres genuinely do make this noise, and tyre roar is the most
        common misdiagnosis of a wheel bearing. But these tyres are not cupped,
        and you have not ruled anything in yet.',
}
```

You can always reach the answer — a wrong move reveals why it was wrong and
leaves the decision open. What gets scored is the cost of getting there, against
a benchmark computed as the sum of the right moves (`bookTime`), so a clean run
is always achievable and a guessed run is visibly expensive. Each case ends in a
verdict and a link to the procedure that actually fixes it.

Options are shuffled like the exams, but the seed shape matters more than it
looks. A seeded permutation spreads answers; over a set this small it does not
guarantee an *even* spread. The obvious `case:stage` seed put 8 of the 18 right
answers at position A, so clicking the top option would have worked 44% of the
time. `stage@case` lands on 5/5/5/3, which is about as close to uniform as 18
decisions get. If you add cases, count where the right answers land before you
assume the shuffle has handled it.

---

## The measurement bench

Sixteen procedures hand you a limit in hundredths of a millimetre. None of them
teaches you to read the instrument, because trade school does that in week one
and everyone else is assumed to know it already. "Discard at 21.0 mm" is
useless to someone who has never read a vernier scale, and most self-taught
mechanics never have.

`src/components/instruments.tsx` draws three instruments in SVG, driven by a
value in millimetres. They are reading surfaces, not scale models, and the
distinction is deliberate: **the scales are drawn to scale against each other**,
so the reading comes out of the geometry rather than out of a label. Move the
micrometer to 7.82 mm and the thimble genuinely shows 32 at the datum line with
the 7.5 mark uncovered below it, because that is where 7.82 mm of screw travel
puts them. The frame around them is schematic — a 25 mm jaw gap at the scale
the barrel needs would be wider than the screen.

```
Outside micrometer   0–25 mm    0.01 mm   sleeve + 50-division thimble
Vernier caliper      0–150 mm   0.05 mm   20 divisions spanning 39 mm
Dial indicator       0–10 mm    0.01 mm   1 mm per revolution + counter
```

Each has an explore mode, a drill that generates readings until you can take
them, and the specs from the procedures that need it. Two details that are not
decoration:

- The caliper's coinciding division is highlighted in **explore mode only**.
  Finding that line is the entire skill, so the hint is off in the drill or the
  instrument answers its own question.
- On a phone the two long scales **scroll sideways inside their panel** rather
  than shrinking. Squeezed to a 375 px screen the thimble divisions came out at
  three pixels, which is not a reading surface, it is a picture of one.

---

## Fasteners & torque

Every procedure here quotes torque figures and several stop to explain why one
bolt on a caliper is 136 N·m and the one beside it is 32. What none of them
says out loud is the thing underneath all of it: **torque is not the point.
Clamp load is the point, and torque is a cheap, noisy way of guessing at it.**

`src/data/fasteners.ts` carries the model that makes that visible:

```
T = K · D · F
```

K is the nut factor — an empirical lump standing in for every friction effect
in the joint at once. It is not a physical constant, it scatters by about a
quarter either way even on a test bench, and roughly 90% of applied torque is
spent on friction rather than on stretching the bolt. That is the whole reason
lubricating a thread and then torquing to the dry figure destroys joints.

The simulator takes seven real fasteners out of these procedures and shows the
clamp load against the bolt's proof and yield loads. The caliper bracket bolt
at its published 136 N·m on clean dry threads lands at 56.7 kN — **74% of
proof**, right in the band torque specs are normally written for, which is a
good sign the specimen data and the model agree. Put anti-seize on the same
bolt, keep the same wrench reading, and it reads 103 kN: **135% of proof, past
yield**. The second readout gives the torque that would actually deliver the
intended clamp load under those conditions — 75 N·m, not 136.

Three of the specimens have a `limit` field, because the bolt is not always
the weakest thing in the joint. A spark plug and a drain plug are both sized
for what the aluminium around them can take.

The page also carries the torque-angle curve (why TTY exists and why it cannot
be reused), grade markings, reuse rules, and an index of **all 80 torque
figures** in the platform, aggregated from every procedure's `torqueTable` and
sorted by how hard the joint is clamped.

Numbers here are a teaching model, not an engineering calculation, and the page
says so where it shows them.

---

## The safety brief

Every procedure carries a hazard strip, and a strip only ever tells you the
conclusion. It says "crush / falling load" and moves on. That is the right
thing for a procedure to do and the wrong thing for the platform to leave it
at, because the audience this was built for is somebody on their own, on a
driveway, with a trolley jack and no lift and nobody to find them.

`src/data/safety.ts` and `/safety` cover lifting and supporting, stored energy,
and the long version of all nine hazard kinds — each cross-linked to the
procedures that actually declare it, computed from their own `hazards` arrays.

The lift diagram is a side view of a unibody car with ten points people really
do put jacks and stands on, three of them rated and seven of them not. Explore
mode colours them and explains each one; drill mode asks you to pick every
point you would put a stand under.

One detail in there is deliberate and worth keeping. When the drill is checked,
the points go back to being coloured by **what the point actually is**, not by
whether you got it right — with your choices marked by dashed rings instead.
Scoring colour would paint an untouched bumper beam green for "correctly left
alone", and on a safety diagram green reads as *safe to use*. The diagram is
never allowed to say something about the car that is not true.

Structural members are drawn visibly heavier than pressed sheet, which does
hint at the answer. That is on purpose: telling structure from sheet metal by
looking at it is the skill.

None of it replaces the lift-point diagram in the vehicle's own handbook, and
the drawing says so on its face.

---

## The electrical bench

The platform maps itself onto the ASE certification areas and was missing one:
**A6, electrical and electronic systems.** That is where most modern faults
live and the area self-taught mechanics are worst at, because a wiring diagram
tells you nothing about where to put the probes.

`src/lib/circuit.ts` solves one series loop — battery, feed, fuse, switch,
lamp, ground — from the element resistances, every time anything changes.
**Nothing the meter displays is written down anywhere.** That matters: it keeps
the numbers honest when somebody probes a pair of points nobody anticipated,
and it means the teaching moments are consequences rather than assertions.

Healthy, the loop carries 6.09 A, drops 0.23 V on the supply side and 0.07 V on
the ground side. Drop a corroded ground stud into it and the same solver gives
you the lesson for free:

```
voltage drop across the stud, under load   6.52 V   (limit 0.2 V)
continuity across the same stud            2.21 Ω   — and it beeps
```

That is the trap the whole page exists for. A continuity test proves a path
exists, not that it can carry current. Put an open fuse in instead and you get
the other classic signature: 12.60 V on the feed side, 0.00 V on the other,
12.60 V straight across the fuse, 0.00 A everywhere — because with no current
there is no drop anywhere, so the step between two adjacent probes *is* the
fault.

The schematic colours itself from the solution — amber where there is voltage,
grey where there is not — so an open paints the colour change exactly onto the
broken element. Explore mode lets you choose the fault; diagnose mode hides it
behind a customer complaint and asks you to name it.

## The job sheet

`/sheet/:id` — the page you take outside. Everything else here is for learning
the job at a desk, where a dark screen and a 3D model are exactly right. This is
the other half of the problem: standing in a driveway with the bonnet up, sun on
the phone, hands too dirty to scrub a model around.

Which is why it is the one light page in a dark app. A dark page on a phone
outdoors is a mirror and on paper it is a cartridge. It prints (`@media print`
in `index.css` drops the chrome, keeps the amber and red flags via
`print-color-adjust`, and holds sections, rows and list items whole across page
breaks) and it carries **both torque units on every line**, because at the car
there is nobody to ask and no toggle worth fumbling for.

Everything on it is derived in `lib/jobsheet.ts` rather than written a second
time — a torque figure that disagrees with itself in two places on the same
platform is worse than none. The torque table is annotated with the step numbers
where each fastener is tightened; anything a step calls for that the procedure's
own table omits is still listed, flagged `step only`, so a gap in the data shows
up on the sheet instead of hiding there.

### Two times, and why they differ

The sheet prints a **shop flat rate** and a **your first time**, and on fourteen
of the sixteen procedures they disagree. That is not a bug in either number —
they answer different questions. `timeMin` is what a shop would quote somebody
who has done the job before and is not stopping to learn anything. `stepMinutes`
sums the procedure's own step durations, which include reading the step, looking
at the model, taking the measurement and answering the checkpoint.

On the Silverado hub bearing the gap is 120 minutes against 185 — **54% more**.
Printing only the smaller figure is how somebody starts a safety-critical job at
four in the afternoon and finishes it in the dark, so the sheet prints both and
says which is which. All 172 steps carry a duration, so the larger figure is a
complete sum and not an extrapolation.

### What a step list cannot tell you

`data/prep.ts` is the only hand-written part, and it exists because a shop never
has to ask these questions. A shop has a second bay, a parts runner, a lift the
car can sit on for a week and somebody else's car to drive home in. An
enthusiast has one car, one Saturday and a driveway:

1. **From which step can the car no longer move under its own power?**
2. **Which step is the point of no return** — where going back costs more than
   going forward?
3. **Can I stop halfway and come back tomorrow?** (`yes` / `risky` / `no` —
   the strut is `no`, because nobody leaves a spring compressed overnight.)
4. **What must already be in my hands before I start?**

The commitment bar draws the whole job as one strip of steps: grey while you
could still put the tools down and drive it, amber once you are finishing it,
hatched where the car cannot move. The hatch is an overlay on either colour, not
a third state, and the legend says so — a car can be immobile while you could
still bolt it back together.

`commitStep` and `immobileFrom` point at step ids, which rot whenever a
procedure gains or loses a step, so `prep.ts` validates itself in development
and logs to the console. Writing this file from memory produced three wrong
procedure ids and twelve wrong step ids on the first attempt — each procedure
numbers its steps with its own prefix (`o1`, `b1`, `d1`, `t1`, …), not `s1` —
and the guard found all fifteen before the page was ever opened.

## Extending it

**Add a procedure** — create `src/data/procedures/myProcedure.ts` exporting a
`Procedure`, then add it to the array in `procedures/index.ts`. If it reuses an
existing assembly you are done; the part ids in `focus`, `hotspots` and
`hiddenByStep` must match that assembly's `<Part id="…">` values. Give every
step a `durationMin`, or the job sheet's time figure quietly becomes a
lower bound. Then add a matching entry to `data/prep.ts` — without one the
procedure still works everywhere else but its job sheet loses its planning
panel, which is the one section that is not derivable from anything. The dev
guard in `prep.ts` will tell you in the console if you forget.

**Add an assembly** — create `src/three/assemblies/MyThing.tsx`, compose it from
`three/parts.tsx` (add new primitives there if needed), register it in
`assemblies/index.ts` with a `DEFAULT_CAM` entry, and add its part reference
cards to `data/partsMeta.ts`.

**Add a vehicle** — append to `data/vehicles.ts` and add a silhouette shape in
`pages/Garage.tsx`.

### Camera framing

Cameras are hand-placed per step. One unit ≈ 200 mm (`MM` in `geo.ts`), the
field of view is 38°, so usable distance is roughly `subject height / 0.69`
plus margin. If a step renders empty it is almost always a camera inside the
geometry or a focus set containing only small fasteners while everything else
ghosts out — give the step a wider camera or drop `focus` entirely so the
assembly stays full-colour and let the hotspots do the labelling.

---

## Content status

Sixteen procedures across sixteen assemblies on six training platforms,
covering every system category the app defines: brakes (front disc, drum, and
rear disc with an integrated parking brake), suspension, steering and wheel
bearings, engine mechanical, valve timing, transmission and driveline, cooling,
interior trim, exterior body and core maintenance including ignition.

Two things in the 3D are deliberate simplifications worth knowing about:

- `beltPath` wraps the belt around the **outside** of every pulley, so belt
  routes are convex. Timing drives genuinely are; serpentine drives usually
  include a backside idler the belt wraps the other way. The serpentine module
  says so in the step text and points the student at the routing decal.
- Assemblies are laid out for legibility, not packaging. Nothing is fighting
  for space the way it does on a real car, which is the point — you learn the
  relationships here and the contortions in the driveway.

Six diagnostic cases sit alongside them, one per system where the fault is
genuinely mistakable: a pulsating pedal that is not warped rotors, a growl that
is not where it sounds, a misfire that is not the coil, a dragging brake that
is not the caliper, an overheat that is not the thermostat, and a clicking
joint that is really a split boot.

All torque figures, clearances and discard specs are **training reference
values**, chosen to teach which fasteners matter and in what order. They are
not a service information product. The app states this on every specs panel
and in the footer, and it should keep doing so.

## Deployment

GitHub Pages, built by Actions on every push to `main`. Two details make a
single-page app work on Pages:

- `base` is `/torquelab/` for `vite build` and `vite preview`, but `/` for the
  dev server. If `vite preview` is left at `/` it serves the SPA fallback for
  every asset and the page comes up blank, which looks exactly like a broken
  build.
- Pages has no rewrite rule, so a deep link like `/torquelab/procedure/x` would
  404 before React Router loaded. The build writes `404.html` as a copy of
  `index.html`; Pages serves it for unknown paths and the router takes over.
  `BrowserRouter` reads `basename` from `import.meta.env.BASE_URL` so there is
  one source of truth for the path prefix.

Renaming the repo means changing `REPO_BASE` in `vite.config.ts` to match.

## Stack

React 19 · TypeScript · Vite 6 · Three.js via `@react-three/fiber` and
`@react-three/drei` · Zustand (persisted to `localStorage`) · Tailwind v4.
No backend. Progress never leaves the browser.
