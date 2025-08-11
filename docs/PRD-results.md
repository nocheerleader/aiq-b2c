## Results Page Rework PRD

### Objective
Rework the Results screen to match the wireframe and add an interactive flip card with a horizontal bar chart on the back. Apply the same layout to the shared results page.

### Users
- Quiz takers after unlocking results (email step)
- Visitors opening a shared results link

### Requirements
- Show logo at top of `Card` and a Start Over button aligned like the Email screen.
- Heading: "Your Results".
- Show computed archetype name (e.g., "The Thinker").
- Flip card:
  - Front: placeholder image + archetype Superpower text.
  - Back: horizontal bar chart with 3 bars labeled with gap names: Activation, Imagination, Technical. Bars show the score values (0–9), labels display the gap names.
- Helper text: xs "Click card to see more".
- Two standard cards beneath:
  - Profile
  - Growth Opportunity + Next Steps
- Keep the Share Results button.
- Apply same layout to `app/r/[id]/page.tsx`.

### Data
- New `data/archetypes.ts` exporting `ArchetypeContent` for each archetype:
  - `name`, `profile`, `superpower`, `growthOpportunity`, `nextSteps`, `imageUrl`
- Chart scores sourced from `computeResult(...).domainScores` (each 0–9).

### Non-Goals
- Changing quiz logic or scoring.
- Persisting data to a database.

### Acceptance Criteria
- Flip card toggles on click; front/back content renders correctly.
- Chart shows 3 horizontal bars with gap labels and score values.
- Layout matches wireframe hierarchy and spacing on mobile (max-w-md) and scales nicely.
- Shared results page mirrors layout and content with its decoded data.

