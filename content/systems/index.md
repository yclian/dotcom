---
title: "systems"
description: "Principles on epistemology, system dynamics, and operational judgment."
date: 2026-11-11
publish: true
enableToc: true
tags:
  - systems
  - philosophy
  - engineering
---

# systems

> *Principles scale better and last longer than tools.*

Frameworks, runtimes, and organizational charts rotate every few years. The failure modes of human judgment, coupled systems, and incentives do not.

These principles distill fifteen years of notes across epistemology, probability, system dynamics, and engineering management into a living operating canon.

---

### i. epistemology & judgment

#### 1. test reason against evidence

> **Hold *a priori* structure and *a posteriori* evidence in tension. Treat every plan as a hypothesis, and fight dogma with reasoning and observable reality.**

Immanuel Kant argued that the mind is not a passive bucket collecting raw data; we bring *a priori* structural categories (causality, time, boundaries) that make experience intelligible in the first place. David Hume provided the necessary empiricist counterweight: no matter how elegant our mental model, causal claims answer to *a posteriori* observation. Theodor Adorno warned of the trap where our concepts masquerade as the thing itself, and Ludwig Wittgenstein reminded us that meaning lives in actual practice rather than abstract rules.

Let's use a common household example. Suppose a remote computer at home goes offline over the weekend, and you spend an hour troubleshooting battery-sleep settings because you are used to working on laptops. The theory sounds completely reasonable until you remember that this machine is plugged straight into the wall with no battery at all, and a quick look at the logs shows a brief power outage had simply shut it down.

In engineering and management, pure empiricism without structure drowns in noisy telemetry, while pure structure without empirical checks hardens into dogma. Treating every design document or strategic plan as a falsifiable hypothesis keeps both feet on the ground.

---

#### 2. harden the perimeter and trust judgment inside

> **Set hard boundaries at the perimeter to give maximum flexibility inside, and rely on human judgment rather than rigid rules when boundaries are vague.**

The ancient Sorites paradox asks how many grains of sand make a heap, or at what exact hair a person becomes bald. Modern epistemic logicians like Timothy Williamson show that vague predicates cannot be rescued by inventing arbitrary numerical cutoffs. Meanwhile, Jean-Jacques Rousseau observed that genuine autonomy requires a clear constitutional perimeter.

I was once in the middle of a discussion where engineers were debating whether a function should be strictly capped at 20 lines instead of 25. On the surface it looked like engineering discipline, but it was really the Sorites paradox in disguise. Inside a module, whether a function is 18 or 24 lines is a matter of readability and context that belongs to human judgment, not a linter rule.

Most organizations get this backwards: they police petty rules on the inside while leaving their perimeter boundaries dangerously blurry. When you set hard, binary walls at the perimeter (personal and corporate credentials never share a runtime, and scripts never mutate production state without an explicit dry-run gate), you buy people maximum freedom to exercise judgment on the inside.

---

#### 3. respect extremes and shift the odds

> **Do not assume the world follows a neat bell curve; extreme events happen far more often than average models predict (respect the heavy tails). Shift the odds early through preparation, never act without a reason, and back real conviction with dry powder rather than leverage.**

As statistician David Hand and historian Peter Bernstein each showed, human beings love smooth bell curves because averages feel comforting, yet markets, outages, and human affairs have heavy tails. In a large enough system, "million-to-one" coincidences happen every afternoon, large datasets breed convincing illusions when we cherry-pick outcomes after the fact, and a single extreme day can wipe out years of quiet averages.

Compare the odds of an ordinary city resident being struck by lightning against a park ranger patrolling exposed ridges in storm season. Small differences in your starting position and readiness protocols act as a massive probability lever on survival and outcome.

That is why taking an action without a clear reason is already a mistake. In both engineering and capital allocation, you prepare early so tail events cannot knock you out of the game, you fund genuine conviction with real reserves rather than borrowed fragility, and when a generational wave arrives, you do not cap your own upside for a small illusion of comfort.

---

### ii. systems, flow & cognitive dynamics

#### 4. automate reflexes and tripwire deliberation

> **Automate fast reflexes (System 1) so you are not the bottleneck, and install structural tripwires to wake up deliberate thought (System 2).**

Daniel Kahneman mapped the division between fast, automatic pattern recognition (System 1) and slow, effortful deliberation (System 2). Both fail when miscast: using slow deliberation for routine sorting makes you a chronic bottleneck, while trusting fast reflexes when signals conflict leads to confident mistakes.

Think about how we drive a familiar route home versus what happens the moment we hear a strange knocking sound from the engine. On an ordinary commute, our reflexes handle lane keeping and braking effortlessly so our mind is not exhausted by every meter of asphalt. The instant an unfamiliar vibration appears, however, a tripwire fires: we turn down the radio, slow down, and switch into deliberate diagnostic thought.

Operations and engineering teams need the exact same two-speed design. If every routine alert or triage decision has to wait for a senior architect's review, you become the bottleneck. If you automate everything blindly without an ambiguity tripwire that halts when confidence drops or signals conflict, the system drives straight off a cliff.

---

#### 5. minimize upkeep and guard ownership

> **Resist the inflow and stop doing what is not required. Minimize upkeep to maximize delivering true value, focus on work that compounds, and never trade away ownership for convenience.**

In system dynamics, John Sterman and Peter Senge demonstrated how stock-and-flow queues collapse when inflow exceeds capacity, and how "Shifting the Burden" to a convenient external crutch quietly atrophies the core capability of a team.

Think about being an Uber driver. Sending a passenger from one place to another is value, the thing the passenger actually pays for. Maintaining the car is essential, but it is not value. You do not earn a living by spending twelve hours a day polishing the engine in the garage; you obsessively minimize the effort spent on upkeep so you can aggressively maximize the time spent delivering real value on the road.

The same dynamics apply to ownership. Earlier in my career, I watched a team bring in a dedicated role to take over all backlog prioritization and problem framing so the engineers could "just focus on coding." For the first month it felt like a relief. Within a quarter, however, the engineers had become passive ticket-takers who no longer understood why the system existed or how its pieces fit together. Trading away the hardest part of thinking for short-term convenience quietly steals a team's ownership.

---

#### 6. expose friction and break failure chains

> **Reduce risk and failure by exposing anomalies, friction, and their causal chain early, and never fail the same way twice.**

Studying high-reliability organizations and the Toyota Production System, Steven Spear, Nelson Repenning, and Donald Kieffer showed that resilient systems do not hide friction behind heroic workarounds. They pull the *andon* cord on the first anomaly so the causal chain is still short, visible, and cheap to fix.

A failure is rarely just the tragic moment at the end; it is almost always a quiet chain of events that started much earlier: a failure to notice an early anomaly, a failure to notify the right people in time, or a failure to rehearse what happens when the primary path breaks. Something as small as email forwarding can fail silently after an upstream change, dropping a handful of messages without throwing a single error. And as an airline captain mentor once reminded me, you can build all the guardrails you want, but an unobserved guardrail might as well not exist. Having an independent daily check that reconciles what entered the front door against what actually landed in the inbox catches the gap while the trail is still warm.

---

#### 7. judge by causal order over memory

> **Judge only when there is a trustable, observable causal order, never from memory or psychological time.**

In *The Direction of Time*, Hans Reichenbach distinguished between psychological time (how human memory orders events by emotional salience) and physical causal order anchored in irreversible traces.

Eleven seconds on a rollercoaster feels completely different to the person riding it than to the person waiting on the platform. Everyone's inner clock is warped by emotion, stress, and recency. Compare that to a basketball game: two spectators might disagree on how long the fourth quarter felt, or even on the exact wall-clock minute a foul happened, but nobody can disagree on the observable causal order of which basket was scored first.

When we run an incident post-mortem or sit down on Friday afternoon for a retrospective, human memory is a terrible witness. We remember the loud Tuesday argument and forget the three quiet Wednesday commits that solved the underlying problem. Before making a judgment, always reconstruct the sequence from the commit graph, the timestamps, and the ledger, never from recollection.

---

#### 8. diagnose deeply and reason backward

> **Do not confuse ambition or goals with strategy. Diagnose the root problem before prescribing solutions, look forward and reason backward from the end state, align incentives with outcomes rather than effort, and never mistake dependency for mutual benefit.**

Richard Rumelt pointed out that most "strategies" are just dress-up lists of wishes: long on ambition, short on coherent action. Game theorists Avinash Dixit and Barry Nalebuff added the first rule of strategic interaction: look forward to the end state and reason backward to decide what must be true today.

Walk into almost any struggling organization and you will see people jumping straight to solutions and tool purchases before anyone has acted like a doctor to diagnose the disease. You will also see leaders confuse two very different kinds of deadlines. Asking developers from the bottom up to invent padded calendar estimates or using story points as management KPIs only teaches smart people to game the numbers. Setting an audacious top-down constraint, on the other hand, forces a team to ask what unnecessary requirements can be deleted so only the core remains, while deferring irreversible technical commitments until the last responsible moment.

Incentives and leverage finish the job. A cost-plus contract rewards contractors for dragging work out, whereas a fixed-price commitment forces continuous innovation to finish cleanly. And in partnerships or platform integrations, always look past polite slogans of "win-win": when an integration quietly turns into subordination, dependency is not mutual benefit.

---

### iii. ethics, critique & praxis

#### 9. obligate dissent and drive progression

> **Expose contradictions and obligate dissent to reach the best decision, then commit fully and drive progression over perfection.**

G.W.F. Hegel saw progress as the working through of internal contradictions rather than polite agreement. John Stuart Mill argued that even a true belief becomes dead dogma unless it is regularly forced to defend itself against earnest dissent. Yet as Edmund Burke, Friedrich Nietzsche, and Slavoj Žižek each recognized from different angles, critique cannot become an excuse for paralysis: once a decision is reached, you must act and carry existing reality forward.

Whenever someone in a meeting says "we need to reach consensus before we move," I get nervous. As Eric Schmidt once shared about how Google thought about decisions, consensus is not everyone agreeing with each other; it is everyone agreeing to find the best idea. That only happens when people feel an obligation to dissent and put real alternatives on the table, and when the team has the backbone to commit fully once the call is made.

Driving progression over perfection also means respecting what it actually takes to move a living organization. Anyone who has spent time in technology knows that the job of IT is really change management, which is largely system and data migration throughout. Designing a clean target architecture on a whiteboard takes an afternoon; your actual speed of change depends on how well you transition people, habits, and live data off the bridge you are still standing on.

---

#### 10. build habits and shape the environment

> **Rely on durable habits and clear environments rather than willpower. Know your habits before automating them, and shape conditions where the right action is natural.**

You cannot "go big" every single day on pure adrenaline and hourly dopamine. As Barbara Oakley observed, willpower is an expensive, scarce resource; spend it only to rewire your reaction to a cue, then let quiet daily habits carry the flow. Even deep problem-solving depends on pacing your environment, alternating intense focus with genuine rest so the mind can step out of old ruts.

Recently someone in a community chat asked me how to get real value out of autonomous AI agents. My answer was simple: step one is knowing your own habits. Automation without a tested personal habit just magnifies chaos, whereas turning an existing habit autonomous across your ledger, calendar, and work lets your life compound effortlessly.

The same structural lens applies when leading people. A person's performance is shaped first by the environment and clarity their manager creates, so fix the environment and give honest, fact-based feedback before blaming the individual.

And while warmth and likeability naturally keep doors open in life, so there is never a reason to be abrasive, being liked can never be the goal of leadership when hard standards have to be upheld.

---

#### 11. understand causality and participate fully

> **Understand causal mechanics to free yourself from hope, fear, and imagination. Be a participant with total integrity, not an outsider with expectations.**

Baruch Spinoza observed that hope and fear cannot exist without each other: both arise when we are ignorant of how causes actually work and project our imagination onto uncertain outcomes. Albert Camus and Jean-Paul Sartre called for lucid participation in the world without bad faith, owning our choices inside reality rather than wishing it were different.

Back in 2019, during a leadership retreat in Yilan, a simple realization stayed with me: if I want a team, a culture, or a system to be a certain way, I have to be a participant living it with integrity, not an outsider standing on the sideline expecting it from others.

When you take the trouble to understand the causal mechanics of a system, its capacity limits, its failure modes, and its tail risks, you stop hoping a fragile deployment will magically hold together and you stop fearing volatility. You set your pre-committed boundaries in advance, step into the arena as a participant, and when a day or an experiment goes sideways, you take Sartre's reminder to heart: there is only one day left, always starting over; it is given to us at dawn and taken away from us at dusk.
