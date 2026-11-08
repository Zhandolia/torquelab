import type { Procedure } from '../../lib/types'

/** Hidden while the trim panel is still on — you cannot see inside the door. */
const INSIDE = ['regulator', 'speaker', 'speakerScrews', 'weatherSheet']
const PANEL_OFF = ['trimPanel', 'clips', 'trimScrews', 'armrest', 'switchPack', 'handleRod']

export const civicDoorPanel: Procedure = {
  id: 'civic-door-panel',
  title: 'Door Trim Panel Removal',
  subtitle: 'Interior trim, clips and harnesses — without breaking anything',
  primaryVehicleId: 'civic-2016',
  alsoApplies: ['camry-2014', 'accord-v6-2009'],
  system: 'interior',
  location: 'interior',
  difficulty: 1,
  timeMin: 45,
  assembly: 'doorPanel',
  summary:
    'Every interior job — speakers, window regulators, lock actuators, mirror glass — starts with a trim panel. Interior work is not about torque, it is about knowing where the fasteners hide and what order releases them. Do it right and nothing rattles afterwards.',
  objectives: [
    'Locate hidden fasteners behind trim plugs, in grab pockets and under switch panels',
    'Release a christmas-tree clip without snapping it or tearing the panel boss',
    'Disconnect a locking electrical connector correctly',
    'Explain what the plastic weather sheet does and why it must be resealed',
    'Reassemble so there are no rattles, no gaps and no warning lights',
  ],
  tools: [
    { name: 'Nylon trim removal set', detail: 'Plastic, not a screwdriver', category: 'specialty' },
    { name: 'Door clip pliers / upholstery fork', category: 'specialty' },
    { name: 'Phillips #2 and Torx T20 drivers', category: 'hand' },
    { name: '10 mm socket + short extension', category: 'hand' },
    { name: 'Small LED torch or headlamp', category: 'hand' },
    { name: 'Spare trim clips', detail: 'Assume you will break two', category: 'consumable' },
    { name: 'Butyl sealant rope', detail: 'For resealing the weather sheet', category: 'consumable' },
    { name: 'Soft blanket or seat cover', detail: 'Somewhere to put the panel', category: 'consumable' },
  ],
  parts: [
    { name: 'Door trim clip set', qty: '1 pack', note: 'Vehicle-specific — generics usually sit proud' },
    { name: 'Butyl sealant', qty: '1 roll' },
  ],
  torqueTable: [
    { fastener: 'Trim panel screw', nm: 2, inlb: 18, note: 'Hand-tight into plastic. A driver will strip it' },
    { fastener: 'Speaker screw', nm: 3, inlb: 27 },
    { fastener: 'Window regulator bolt', nm: 8, ftlb: 6 },
    { fastener: 'Door module bolt', nm: 9, ftlb: 7 },
  ],
  hazards: [
    { kind: 'sharp', text: 'Door shells are stamped steel with raw edges inside. Gloves — the cuts are invisible and deep.' },
    { kind: 'electrical', text: 'Disconnect the battery before unplugging airbag-side connectors. Yellow connectors are never touched live.' },
    { kind: 'eye', text: 'Clips fire across the car when they let go.' },
  ],
  steps: [
    {
      id: 'd1',
      title: 'Find every fastener before you pull anything',
      body:
        'Trim panels are held by **screws you can see, screws hidden under plugs, and clips you cannot see at all**. Pulling before every threaded fastener is out is how panels crack. Work the perimeter with a torch first.',
      detail: [
        'Inside the grab pocket — almost always one or two screws',
        'Behind the door pull trim plug',
        'Under the switch panel bezel',
        'Along the bottom edge, facing down',
      ],
      camera: { pos: [4.3, 2.0, 5.4], target: [0, 0.1, 0] },
      focus: ['trimScrews', 'clips'],
      hotspots: [
        { part: 'trimScrews', label: 'Hidden screws', spec: 'remove all first' },
        { part: 'clips', label: 'Perimeter clips ×12' },
      ],
      explode: 0.4,
      durationMin: 8,
    },
    {
      id: 'd2',
      title: 'Lift the switch panel and unplug it',
      body:
        'The window switch bezel usually unclips upward and sits on the armrest. Unplug it with the **locking tab released first** — squeeze or lift the latch, then pull on the connector body. Never pull the wires.',
      camera: { pos: [2.4, 1.6, 4.2], target: [0.9, 0.6, 0] },
      focus: ['switchPack'],
      hotspots: [{ part: 'switchPack', label: 'Window switch pack', spec: 'release latch, pull the body' }],
      explode: 0.35,
      hazards: ['electrical'],
      durationMin: 7,
      mistake:
        'Levering a connector out with a screwdriver. It cracks the housing, and a cracked connector lets water in and corrodes the pins.',
    },
    {
      id: 'd3',
      title: 'Release the perimeter clips',
      body:
        'Slide a wide nylon tool between the panel and the door skin **next to a clip, not between clips**, and lever against the door shell. Each one releases with a pop. Work around the bottom and up both sides.',
      detail: [
        'Push the tool in until you feel the clip, then lever — the fulcrum is the metal door, never the painted trim',
        'If a clip will not release, you have missed a screw',
        'Expect to break one or two. That is why the spares are on the list',
      ],
      camera: { pos: [3.8, 0.9, 4.8], target: [0, -0.3, 0] },
      focus: ['clips', 'trimPanel'],
      hotspots: [{ part: 'clips', label: 'Christmas-tree clips ×12' }],
      explode: 0.45,
      hazards: ['eye'],
      durationMin: 10,
      tip:
        'Metal pry tools leave marks in the paint that show up the day the car is sold. Nylon only, and keep the pressure against the door frame.',
    },
    {
      id: 'd4',
      title: 'Lift up and off, then disconnect the rest',
      body:
        'With the clips free the panel is still hooked over the window sill — **lift it straight up, then out**. Hold it while you disconnect the inner handle cable and any remaining connectors.',
      camera: { pos: [4.0, 1.4, 5.2], target: [0, 0.1, 0.4] },
      focus: ['trimPanel', 'handleRod'],
      hotspots: [
        { part: 'handleRod', label: 'Inner handle cable' },
        { part: 'trimPanel', label: 'Lift up, then out' },
      ],
      explode: 0.7,
      durationMin: 8,
    },
    {
      id: 'd5',
      title: 'Peel the weather sheet carefully',
      body:
        'Behind the panel is a plastic sheet glued on with butyl. **It is a water barrier, not packaging.** Peel it back gently and keep the butyl bead intact so it can be reused — the sheet is what keeps rain out of your carpet and off the door module.',
      camera: { pos: [3.4, 1.2, 5.0], target: [0, 0.1, -0.2] },
      focus: ['weatherSheet'],
      hotspots: [{ part: 'weatherSheet', label: 'Weather sheet', spec: 'water barrier — reseal fully' }],
      explode: 0.4,
      durationMin: 7,
      mistake:
        'Tearing the sheet off and leaving it off. The owner comes back in six months with a wet footwell and a corroded window module.',
    },
    {
      id: 'd6',
      title: 'Now the door is open for work',
      body:
        'With the sheet back, the speaker, window regulator, lock actuator and wiring are all accessible. Speaker screws are **3 N·m** into plastic and regulator bolts are **8 N·m** — these are hand-tool numbers, not impact-driver numbers.',
      camera: { pos: [3.2, 0.6, 4.6], target: [-0.4, -0.3, -0.3] },
      focus: ['speaker', 'speakerScrews', 'regulator'],
      hotspots: [
        { part: 'speaker', label: 'Door speaker', spec: '3 N·m' },
        { part: 'regulator', label: 'Window regulator', spec: '8 N·m' },
      ],
      explode: 0.5,
      torque: [
        { fastener: 'Speaker screw', nm: 3, inlb: 27 },
        { fastener: 'Window regulator bolt', nm: 8, ftlb: 6 },
      ],
      durationMin: 5,
    },
    {
      id: 'd7',
      title: 'Reassemble: reseal, reconnect, then rattle-check',
      body:
        'Reseal the weather sheet all the way round. Fit **new clips wherever one broke**, reconnect every plug until it clicks, hang the panel on the sill, and press each clip home with the heel of your hand. Then test the window and locks before the panel is fully seated.',
      detail: [
        'Test the switches before you snap everything together, not after',
        'Press clips in by hand — a knee or a hammer cracks the boss',
        'Run the window fully up and down and listen for the glass contacting trim',
        'Shut the door firmly once and listen. No rattle means you got the clips right',
      ],
      camera: { pos: [4.2, 1.6, 5.6], target: [0, 0.1, 0.2] },
      focus: ['trimPanel', 'clips', 'weatherSheet'],
      explode: 0.1,
      torque: [{ fastener: 'Trim panel screw', nm: 2, inlb: 18, note: 'Hand-tight only' }],
      durationMin: 12,
    },
  ],
  hiddenByStep: {
    d1: INSIDE,
    d2: INSIDE,
    d3: INSIDE,
    d4: INSIDE,
    d5: PANEL_OFF,
    d6: [...PANEL_OFF, 'weatherSheet'],
    d7: [],
  },
  checkpoints: [
    {
      id: 'dc1',
      afterStep: 'd3',
      question: 'A clip along the bottom edge will not release no matter how hard you lever. What should you do?',
      options: [
        {
          text: 'Stop and look for a fastener you have missed — a screw still holding the panel will not let the clips release',
          correct: true,
          why:
            'Almost always the answer. Clips release with moderate force. Resistance that does not give means something threaded is still holding, usually a screw in the grab pocket or under a plug.',
        },
        {
          text: 'Apply more force until it pops — clips are designed to be destroyed',
          why: 'Clips are reusable and the panel boss they anchor to is not. Force cracks the panel, which is far more expensive.',
        },
        {
          text: 'Switch to a flat-blade screwdriver for more leverage',
          why: 'That gouges the panel and marks the paint, and still does not solve the real problem.',
        },
        {
          text: 'Warm the panel with a heat gun to soften the clip',
          why: 'Heat deforms the trim surface. It is not a fastener-removal technique.',
        },
      ],
    },
    {
      id: 'dc2',
      afterStep: 'd5',
      question: 'What is the actual function of the plastic sheet glued behind the trim panel?',
      options: [
        {
          text: 'It is a water and vapour barrier that directs water running down inside the door out through the drains instead of into the cabin',
          correct: true,
          why:
            'Doors are deliberately wet inside — glass carries water down past the seal. The sheet keeps it on the outer side of the barrier so it drains out the bottom. Leave it off and the water goes into the carpet.',
        },
        {
          text: 'Sound deadening only',
          why: 'It does reduce noise, but its primary job is water management.',
        },
        {
          text: 'It stops the trim clips from rattling',
          why: 'No. The clips locate in the door shell, not the sheet.',
        },
        {
          text: 'It is shipping protection and can be discarded',
          why: 'A common and expensive assumption. It is a functional part.',
        },
      ],
    },
  ],
}
