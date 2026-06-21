export interface ArticleImage {
  readonly src: string;
  readonly alt: string;
  readonly caption?: string;
}

export interface ArticleMetadata {
  readonly publishedAt: string;
  readonly updatedAt?: string;
  readonly author?: string;
}

export interface Article {
  readonly id: string;
  readonly slug: string;
  readonly headline: string;
  readonly subheadline?: string;
  readonly excerpt: string;
  readonly body: string;
  readonly keywords: readonly string[];
  readonly mainImage: ArticleImage;
  readonly images?: readonly ArticleImage[];
  readonly metadata: ArticleMetadata;
}

export const articles: readonly Article[] = [
  {
    id: 'the-language-of-paf',
    slug: 'the-language-of-paf',
    headline: 'The Language of PAF',
    subheadline:
      'Why low-output humbuckers still define some of the greatest recorded guitar tones.',
    excerpt:
      'Exploring the harmonic texture, compression behavior, and musical dynamics of vintage-output humbuckers.',
    body: `Three letters carry more mythology than almost anything else in electric guitar history: PAF. They stand for "Patent Applied For," the small decal Gibson stuck to the underside of its new humbucking pickup between roughly 1957 and 1962, while the patent for Seth Lover's hum-cancelling design worked its way through the United States Patent Office. The sticker was a piece of legal housekeeping. The sound underneath it became a language that players have been trying to speak fluently ever since.

To understand why, you have to understand what the PAF was actually for. Seth Lover did not set out to invent a tonal icon. He set out to cancel hum. Single-coil pickups of the era acted like little antennas, picking up the sixty-cycle buzz of transformers and fluorescent lights along with the strings. Lover's solution was elegant: wind two coils, reverse the winding direction and the magnetic polarity of one relative to the other, and wire them in series. Hum arriving equally at both coils gets cancelled, while the signal from the strings adds together. The pickup was quiet. That it also sounded extraordinary was, in a sense, a happy accident of the materials and methods Gibson had on hand.

Those materials are the first half of the story. Early humbuckers used alnico magnets — an alloy of aluminum, nickel, cobalt, and iron — most often alnico 2 or alnico 5, in a bar that sat beneath the two coils. The magnet charge was modest by modern standards, and it varied from pickup to pickup. The coils themselves were wound with 42-gauge plain enamel wire to somewhere around 5,000 turns each, which produced a direct-current resistance most commonly in the 7k to 9k range. That is a low number. Many modern bridge humbuckers read twelve, fifteen, even eighteen. Output, in other words, was never the point.

The second half of the story is inconsistency. Gibson's winding machines of the late fifties were not precision instruments, and the operators were not trying to make every pickup identical. Coils were wound with uneven tension and an irregular, scattered layering that kept the turns from stacking too neatly. The two coils in a single pickup often ended up with slightly different turn counts. This mismatch is crucial. Two perfectly matched coils cancel hum perfectly but also cancel some of the high end and produce a more compressed, hooded tone. Slightly mismatched coils leave a little of that single-coil air and chime intact. The "magic" so many players chase is, to a large degree, the sound of a factory not being able to make the same thing twice.

What does all of this produce at the speaker? A pickup that is articulate rather than loud. The lower turn count and modest inductance push the resonant peak higher and keep it broad, so the top end stays open and detailed instead of collapsing into a midrange honk. Clean, a good PAF-style pickup chimes and blooms; individual notes inside a chord keep their identity. The lower output also means the pickup is not slamming the front end of an amplifier on its own. Instead, it lets the amp breathe.

That last point is where the real conversation happens. A low-output humbucker interacts with a cranked tube amplifier in a way a high-output pickup cannot. Because the pickup is not forcing the preamp into hard clipping, the amp's own dynamics come forward. Pick softly and the sound cleans up; dig in and it growls. Roll the guitar's volume knob back and the tone doesn't just get quieter, it gets cleaner and glassier, because you're changing the interaction between the pickup's inductance and the cable and input capacitance. The pickup becomes an expressive control surface rather than a fixed setting. This is the responsiveness that recordings from the late fifties through the early seventies are full of, and it is why a PAF set still feels alive under the hands.

There is a temptation to treat all of this as nostalgia, as if older simply meant better. It does not. Plenty of original PAFs sound mediocre; the same inconsistency that produced legends produced duds. What the vintage examples teach is not a target number but a set of priorities. Keep the output modest. Keep the inductance in a range that leaves the top end intact. Mismatch the coils on purpose. Choose a magnet that has the warmth and slight softness the design wants, and consider one that has lost a little of its charge. None of that shows up cleanly on a spec sheet, which is exactly why the spec-sheet arms race of high-output pickups missed the point for so long.

When we wind a PAF-voiced pickup, we are not trying to clone a specific 1959 example down to the last turn — that pickup was an accident, and the next one off the same machine was a different accident. We are trying to recreate the conditions that made those accidents musical. That means winding by ear and by feel, deliberately scattering the turns, calibrating neck and bridge units as a pair so they balance across the instrument, and choosing and aging magnets to taste rather than to a catalog number. The goal is a pickup that says something back to you.

So when someone asks what a PAF sounds like, the honest answer is that it does not have a single sound. It has a vocabulary: clarity under gain, compression that comes from the amp rather than the pickup, a top end that stays sweet instead of brittle, and a dynamic range wide enough that the volume knob becomes part of your playing. Learn to listen for those qualities and you stop chasing a relic and start chasing a behavior. That behavior is the real patent — applied for in 1957, and never quite expired.`,
    keywords: ['PAF', 'vintage pickups', 'humbucker', 'tone', 'alnico'],
    mainImage: {
      src: '/assets/images/articles/the-language-of-paf/main.svg',
      alt: 'A vintage-style humbucker photographed on a dark workshop bench',
      caption: 'A low-output humbucker with aged-nickel cover.',
    },
    metadata: {
      publishedAt: '2026-06-20',
      author: 'Basement Pickups',
    },
  },
  {
    id: 'scatter-winding-by-hand',
    slug: 'scatter-winding-by-hand',
    headline: 'Scatter Winding, By Hand',
    subheadline: 'How small, deliberate inconsistencies in coil geometry shape harmonic response.',
    excerpt:
      'A look at the bench process behind hand-wound coils — and why the irregularities matter more than the average.',
    body: `Every pickup is, at heart, a coil of copper wire wrapped thousands of times around a bobbin. It would be reasonable to assume that the best coil is the most perfectly made one: even tension, tidy layers, every turn sitting neatly beside the last. For a transformer, that would be true. For a guitar pickup, it is almost exactly wrong. The tone players prize in the great vintage pickups comes in large part from the coil being wound imperfectly — and on purpose. That practice has a name: scatter winding.

To see why it matters, it helps to picture what a coil actually is electrically. A pickup is not just resistance. It is an inductor, and it has capacitance, and together with the resistance those three properties form a resonant circuit. The coil's inductance and its self-capacitance set a resonant frequency, a peak where the pickup is most sensitive, and the height and position of that peak are a big part of what we hear as a pickup's voice. Resistance — the DCR number everyone quotes — is almost a side effect. The capacitance is where winding technique lives.

Capacitance in a coil builds up between adjacent turns of wire and, more importantly, between adjacent layers. When wire is wound in tidy, parallel layers, many turns sit directly on top of turns from the layer below, separated only by a thin film of enamel insulation. Each of those overlaps is a tiny capacitor, and there are thousands of them. Stack them up and the coil's self-capacitance climbs. Higher capacitance pulls the resonant peak down in frequency and can make it taller and narrower, which the ear reads as a darker, more concentrated, sometimes harsh or "peaky" tone.

Scatter winding breaks up that tidy geometry. Instead of laying the wire down in neat rows, the winder moves the wire back and forth across the bobbin in an irregular, wandering pattern, so that turns cross each other at angles and rarely stack directly on top of one another. The average position of the wire is still roughly the same — you still end up with the same number of turns in about the same space — but the layer-to-layer overlap is reduced. Less overlap means less capacitance. Less capacitance means the resonant peak sits higher and stays broader. The ear reads that as openness, air, and detail: the pickup breathes instead of honking.

This is the part that is hard to put into a spec sheet. Two coils can have the same turn count, the same DCR, the same magnet, and sound noticeably different, because one was wound neatly and the other was scattered. The measurable difference is in the capacitance and therefore the resonant behavior, but nobody prints coil capacitance on a hang tag. It is a property you build with your hands and verify with your ears.

Doing it by hand is what makes it real. A modern automated winder can be programmed to traverse the wire in a pseudo-random pattern, and good ones get close. But a hand winder feeds the wire with their own fingers, guiding it across the bobbin while the coil turns, feeling the tension change as the spool plays out and adjusting on the fly. Tension is its own variable: wind too tight and the wire stretches, the enamel thins, and the turns pack down hard; wind too loose and the coil is fragile and microphonic. The winder is constantly negotiating between tension, traverse speed, and the rotation of the bobbin, and no two coils come out identical. That variation is the point and also the discipline.

It is also why hand winding resists easy repeatability, and why anyone who does it seriously keeps notes. The skill is not in making one magical coil; it is in being able to make a second one that behaves like the first. We track turns, we track tension by feel and by the behavior of the machine, and we measure each finished coil — DCR, and where we can, inductance and resonant peak — so that a neck and bridge pair actually belong together. A scatter-wound pickup that is wildly inconsistent from unit to unit is not boutique craftsmanship; it is just noise. The aim is controlled inconsistency: irregular within a coil, predictable between builds.

There is a romance to scatter winding that sometimes gets oversold, so it is worth being honest about its limits. Scatter winding does not add output. It does not fix a bad magnet or a poor cover or a sloppy solder joint. It will not make a thin pickup fat. What it does is shape the high end and the feel — it keeps the top open, softens the resonant peak so it flatters rather than fatigues, and lends the coil a slightly less efficient, more relaxed character that interacts beautifully with overdrive. It is one tool among several, and it works because it is paired with the right magnet, the right turn count, and the right calibration.

When a coil comes off the bench scatter-wound well, you can feel it before you measure it. The pickup has a kind of looseness and bloom — notes open up, chords stay legible, and the treble has shimmer instead of glare. Put that next to a machine-perfect coil of the same resistance and the difference is not subtle. One sounds like a specification. The other sounds like a hand was involved. That is the whole reason we still wind this way, one wandering pass of wire at a time.`,
    keywords: ['scatter winding', 'craft', 'workshop', 'coil', 'tone'],
    mainImage: {
      src: '/assets/images/articles/scatter-winding-by-hand/main.svg',
      alt: 'Close-up of copper magnet wire being scatter-wound on a bobbin',
      caption: 'Scatter winding introduces subtle inconsistencies that shape harmonic response.',
    },
    metadata: {
      publishedAt: '2026-06-20',
      author: 'Basement Pickups',
    },
  },
  {
    id: 'aging-an-alnico-magnet',
    slug: 'aging-an-alnico-magnet',
    headline: 'Aging an Alnico Magnet',
    subheadline: 'What sixty years of charge loss does to a pickup — and how to honor it.',
    excerpt:
      'Vintage magnets sound different because they are weaker. We unpack why that matters, and how we approach aging.',
    body: `Alnico is one of those materials whose name is just its recipe read aloud: aluminum, nickel, cobalt, with iron and a few other elements making up the balance. Cast or sintered into a bar and then magnetized, it became the standard permanent magnet for guitar pickups in the 1950s and never really left. Alnico 2, alnico 3, alnico 4, alnico 5, alnico 8 — the numbers refer to different alloy mixes with different magnetic strengths and characters. They are the heart of a pickup's voice, and like any heart, they change with age.

The thing players notice about genuinely old pickups is that they often sound softer, sweeter, and more dynamic than a brand-new pickup built to the same spec. There are several reasons, but one of the most important is simple physics: the magnet has lost some of its charge. A magnetized piece of alnico does not hold its full field forever. Over decades, exposure to heat, to stray external fields, to physical shock, and to the slow internal relaxation of the material itself all nudge the magnet toward a lower state of magnetization. It does not become useless; it becomes weaker. And weaker, in a guitar pickup, is frequently more musical.

To understand why, think about what the magnet is doing. It magnetizes the steel parts of the pickup and the strings above it, and as the strings vibrate they disturb that magnetic field, inducing a voltage in the coil. A stronger magnet senses the strings with more authority: more output, yes, but also a firmer magnetic "pull" on the strings themselves. That pull is real and audible. Set a strong pickup too close to the strings and you can hear it fight the vibration — reduced sustain, a slightly stiff or warbly response, intonation that wanders on the lowest strings. A weaker field exerts less pull. The strings move more freely, sustain opens up, and the pickup's response loosens.

There is a compression effect too. A weaker magnet senses small string motion less aggressively and lets large string motion bloom against a softer ceiling, so the dynamic curve becomes gentler at the top. The pickup feels like it has a little natural give. Combine that with the slightly lower output and you get the classic vintage feel: a pickup that cleans up easily, compresses sweetly when pushed, and never sounds brittle. None of this is mystical. It is the predictable result of a magnet sitting in a guitar case for half a century.

The obvious question follows: if a partially discharged magnet sounds good, can we get there without waiting sixty years? We can, carefully. The process is usually called aging or, more precisely, partial degaussing — deliberately removing some of the magnet's charge in a controlled way. The crude version is to bring an opposing magnet near the bar and knock the field down, but that is imprecise and easy to overshoot. The better approach uses a calibrated alternating field, gradually reduced, to bring the magnet down to a target strength, or a measured DC field applied against the magnet's polarity in small, checked steps.

The key word is measured. A gaussmeter turns this from guesswork into a repeatable process. We read the magnet's surface field before we start, decide on a target — a percentage of full charge that suits the voicing we are after — and step the magnet down toward it, re-measuring as we go. Take off too little and you have done nothing audible; take off too much and the pickup goes limp and lifeless, with weak output and a vague, undefined low end. There is a window, and it is different for each alloy and each design, which is why notes and a meter matter more than folklore here.

It also matters which alnico you start with, because the alloys do not respond identically and they do not start in the same place. Alnico 2 is already a softer, lower-field magnet with a warm, slightly compressed character, so it often wants only a gentle touch. Alnico 5 is stronger, tighter, and more focused, with a firmer low end and more aggressive top, and aging it can tame that edge into something rounder. Alnico 8 is stronger still, dense and punchy, and a measured reduction can keep its power while pulling back some of its stiffness. The goal is never to make every magnet weak; it is to place each one where it flatters the coil it sits under.

Aging asymmetrically is a subtler trick worth mentioning. Real vintage magnets did not lose charge perfectly evenly along their length, and there is character in that. A magnet that is slightly stronger under one coil than the other shifts the balance of the pickup in small ways that can add life, much as coil mismatch does in a PAF. It is a fine adjustment, easy to overdo, and only worth attempting once the basics are under control.

What all of this honors is a simple truth: a pickup is a system, and the magnet is the part of that system that quietly drifts over time. Pretending a fresh pickup will sound like a sixty-year-old one straight off the bench is wishful thinking — the magnet is at full charge, and full charge has a sound. Aging the magnet, deliberately and by measurement, lets us deliver some of that hard-won vintage character now, without asking a player to wait out the decades. Done with restraint and a meter, it is not a gimmick. It is just acknowledging that the best-sounding magnets in history were, every one of them, a little bit tired.`,
    keywords: ['magnets', 'alnico', 'aging', 'tone', 'vintage'],
    mainImage: {
      src: '/assets/images/articles/aging-an-alnico-magnet/main.svg',
      alt: 'A set of Alnico bar magnets photographed against dark felt',
      caption: 'Alnico 2 bar magnets, partially de-gaussed for a softer field.',
    },
    metadata: {
      publishedAt: '2026-06-20',
      author: 'Basement Pickups',
    },
  },
  {
    id: 'installation-without-regret',
    slug: 'installation-without-regret',
    headline: 'Installation Without Regret',
    subheadline:
      'Small details on the bench that decide whether a new pickup actually sounds like itself.',
    excerpt:
      'Wiring, grounding, height, and shielding — the unglamorous work that lets a great pickup show what it can do.',
    body: `A great pickup can sound disappointing in a guitar, and the pickup is rarely the reason. More often, the install is. The wire run, the pot values, the capacitor, the grounding scheme, the shielding, the height — each of these shapes the final sound, and each is easy to get subtly wrong. The frustrating part is that a botched install does not usually fail outright. It just quietly robs the pickup of some clarity, or adds a little hum, or rolls off some top end, and the player blames the pickup. So it is worth treating installation as part of the build rather than an afterthought.

Start with the potentiometers, because they set the stage before the pickup ever speaks. A pot is a variable resistor, and the volume pot's value forms a load across the pickup that pulls down its resonant peak. The standard pairing is 250k pots with single coils and 500k pots with humbuckers, and that is not arbitrary: 500k loads the pickup more lightly, preserving the brightness a humbucker wants, while 250k tames the naturally brighter single coil. Swap them and you change the voice. A humbucker on 250k pots sounds warmer and rounder; a single coil on 500k sounds glassier and edgier. Neither is wrong, but it should be a choice, not an accident. Quality matters too — a reputable pot holds its value and its taper, where a cheap one may read far from its marked value and shift the whole response.

The tone capacitor is the next small part with an outsized reputation. Its job is simple: it bleeds high frequencies to ground when you turn the tone control down, and its value sets how much. Common values run from around 0.022 microfarads for humbuckers to 0.047 for single coils, with smaller values giving a more usable, less drastic roll-off. The mythology around capacitor type — paper-in-oil versus film versus ceramic — is mostly overstated; with the tone fully up, the cap is barely in the circuit at all. Choose a value that gives you a tone sweep you actually use, buy a reliable part, and spend your attention elsewhere.

That elsewhere is grounding, which is where most real-world problems live. Hum and buzz usually trace back to grounding that is incomplete, doubled up, or arranged in a loop. The cleanest approach is a star ground: every ground connection — pickups, pots, jack, bridge or tailpiece — runs back to a single common point rather than daisy-chaining from part to part in a ring. A ground loop, where current can take two paths back to the same point, acts like an antenna and invites noise. The bridge ground wire matters here too; it ties the strings, and therefore you, to the circuit ground, which is why touching the strings quietens single-coil hum. It also makes good shielding practice a safety matter, not just a tone one.

Shielding finishes the job the grounded humbucking design starts. Lining the control cavity and pickup routes with copper tape or conductive paint, all of it tied to ground, builds a shielded enclosure around the electronics that keeps radiated electrical noise out. For single coils especially, good cavity shielding can be the difference between a usable guitar and one that screams near every dimmer switch and computer monitor. The detail that trips people up is continuity: the shielding only works if every section connects to its neighbors and the whole thing returns to the star ground. A beautifully foiled cavity with one isolated patch is just decoration.

Then there is lead dressing — the unglamorous business of how the wires are routed and how long they are. Long, coiled, or messily bundled signal leads add capacitance and can pick up noise; keep the hot leads as short as practical and avoid running them parallel to one another for long stretches. With braided vintage-style or coax pickup leads, respect the shield: the outer braid is ground and the inner conductor is hot, and they must not be allowed to short. Tidy lead dressing is not about looking neat for its own sake; it is about not adding stray capacitance and noise to a signal you worked hard to keep clean.

Soldering is the last place to rush and the easiest place to ruin good work. A joint should be heated quickly and cleanly so the solder flows and wets both surfaces, then left to cool undisturbed — a dull, grainy "cold" joint is unreliable and can crackle or cut out later. Pot casings act as ground terminals and are heat sinks, so they want a hotter iron and a brief, confident touch rather than a long, lukewarm one that bakes the component. And before any of it, confirm the pickup's wiring color code and the coil polarity, because getting a pickup out of phase with its neighbor produces that thin, hollow, scooped sound the moment you select both together. Phase problems are almost always a wiring mistake, not a faulty pickup.

Finally, set the height, because the best wiring in the world cannot fix a pickup sitting at the wrong distance from the strings. Closer means louder and fatter but, past a point, the magnet pulls on the strings and sustain and intonation suffer, especially on the bass side and most of all with strong magnets. Farther away means quieter but often clearer and more dynamic. Start from a sensible baseline, fret the highest fret, and adjust by ear in small moves, balancing neck and bridge so the two are even in volume as you switch between them. Height is a tone control you have already paid for; use it.

None of this is glamorous, and none of it shows up in a demo video. But it is the work that lets a pickup sound like itself in your guitar instead of like a compromise. We document the wiring, recommend pot and cap values, and include a height guide with every set for exactly this reason. The instrument should sound like the pickup — not like the shortcuts taken on the day it went in.`,
    keywords: ['installation', 'wiring', 'workshop', 'pots', 'shielding'],
    mainImage: {
      src: '/assets/images/articles/installation-without-regret/main.svg',
      alt: 'A guitar control cavity photographed under warm workshop lighting, partially wired',
      caption: 'A control cavity mid-wire, before the back plate goes on.',
    },
    metadata: {
      publishedAt: '2026-06-20',
      author: 'Basement Pickups',
    },
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
