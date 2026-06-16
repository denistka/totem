Frontend Take-Home Task
Build a browser-based music mini-game for children
Time expectation: 6–10 hours
Deadline: Friday or Monday (please let us know if you prefer to have the weekend to work
on it).
Overview
Build a simple browser-based note-finding game with a speed element, aimed at children
aged 5–11. Think of it as a reaction game: a note appears, and the player must identify it
before the game speeds up or they lose progress.
A good reference point is the Chrome dinosaur game — simple, fun, a bit addictive, and gets
faster as you go. Except instead of jumping over cacti, the player is recognising notes. You
can interpret the visual format freely: a side-scrolling runner, falling notes, a moving target,

or anything else that works. The important thing is that it combines note recognition, single-
answer interaction, and progressive speed/difficulty.

What we’re looking at
 Frontend architecture and code quality
 Interaction design and game-loop thinking
 Visual design, animation, and polish — this should look and feel like something a
child would want to play
 How you translate a loose brief into something playable
Core requirements
Gameplay
 One musical note is shown at a time
 The player chooses the correct answer from multiple options
 The game gets faster or more difficult as the player progresses
 Immediate feedback for correct and incorrect answers
 Score or streak tracking
 The game ends or resets based on mistakes, timeout, or missed notes
You can choose how the note is presented: staff notation, letter name, piano key, or another
musical representation, as long as it clearly tests note recognition.
Game loop
The game should include a start state, an active play state, an end/game-over state, and a
way to restart.
Difficulty progression
Include at least one progression mechanic. For example:
 Increased speed over time / reduced answer time

 Wider pool of notes / different clefs / chords (optional)
 Less visual assistance
 Combo/streak pressure
UI
The interface should be designed for children aged 5–11: large tap/click targets, clear
hierarchy, minimal clutter, obvious feedback, and bright but not chaotic styling. It should
work on desktop, but mainly mobile view.
Design & animation
This is important to us. We want the game to look and feel like something built for kids — not
a developer prototype with placeholder styles. Specifically, we’d like to see:
 A clear, intentional colour scheme
 A character or visual element with some level of animation (it doesn’t need to be
complex, but it should bring the game to life)
 Overall visual polish that makes the experience feel playful and inviting
Keep the target audience in mind throughout: children aged 5–11.
Audio (optional)
Success/fail sounds, note playback, simple UI sounds.
Technical requirements
Please use React and TypeScript. Beyond that, you’re free to choose your own stack for
styling, state management, animation, and testing.
If you use music notation, we recommend VexFlow — it’s what we use internally. For
animation, we use Framer Motion and Lottie internally, but use whatever you’re comfortable
with.
For state management, keep it simple — the game is small enough that React state and a
custom hook or two should be plenty. Don’t spend time on persistence beyond in-memory or
localStorage. Some testing is great to see, but don’t go overboard — focus on the parts that
matter most.
Included assets
We’ve included a piano keyboard component that you can use for user input. If you make
any improvements to it, please let us know so we can review the updates.
Deliverables
 A Git repository or zipped project
 A README covering: how to run the project, design decisions, tradeoffs, what you’d
improve with more time, and what tools you used in your development process
(including LLMs, if applicable)
 Screenshots or a short screen recording if helpful

Bonus: ideas for improvement
The core game is the minimum deliverable. If you have time and want to go further, here are
some directions you could explore:
 Animation and visual polish
 Audio feedback (note playback on correct/incorrect)
 Lives system — slow down on mistakes, speed up on streaks
 Automatic note generation (e.g. following a scale or key)
 Key changes as the player progresses
 Chords appearing at higher levels
Just some ideas, feel free to come up with your own. Good luck, looking forward to seeing
what you build!
The Muse Team