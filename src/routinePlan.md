I have an existing SEU Weekly Routine UI. I uploaded two reference images:

- Image 02 = My real/current PC version. This design is already correct and MUST NOT be changed for desktop/PC.
- Image 01 = The new futuristic card-style design I want as a separate version.

Your task is to create 2 separate versions without breaking or changing my real PC design.

VERSION 1: Futuristic Version
Name this version: “Futuristic Version”

Create a path Futuristic version for download the routine which is Image 01. 
create new Mobile version which instruction I given below:

Design requirements:
- Use a modern dark futuristic dashboard style.
- Keep the same routine data, courses, teachers, room, time, gap, sessions, and weekly stats.
- Use large rounded glassmorphism containers.
- Each day should appear as a separate horizontal row/card.
- Day name should be on the left side with bold spaced letters like SUN, MON, TUE, WED.
- Routine classes should be displayed as big rounded cards inside each day row.
- Use beautiful gradients for subject cards.
- Use neon/cyber colors such as cyan, blue, purple, yellow, and soft teal.
- Add soft borders, subtle glow, dark background, and smooth shadows.
- Header should show:
  - “SEU Weekly Routine”
  - “Seven days, one clear view.”
  - Stats: Courses, Sessions, Weekly hours.
- Make the UI premium, polished, modern, and eye-catching.
- This version should be separate from the real PC version. Do not overwrite the existing desktop design.

VERSION 2: Mobile Version
Name this version: “Mobile Version”

Create a mobile responsive version that looks exactly like my real/current PC version from Image 02.

Very important:
- The mobile version must keep the same PC table/grid format.
- Do NOT convert the mobile version into card rows.
- Do NOT use the futuristic Image 01 design for mobile.
- Do NOT change the real PC design.
- The mobile version should only optimize spacing for small screens.

Mobile design requirements:
- Keep the same dark table layout from Image 02.
- Keep the same header style, stats box, table grid, day column, time columns, and course cards.
- Keep the same colors, borders, fonts, spacing style, and visual identity from Image 02.
- Only reduce unnecessary empty space in table columns.
- Make time columns more compact so they do not waste space.
- Reduce cell padding, card padding, font sizes, and column widths only for mobile screens.
- Keep the day column narrow.
- Course cards should fit nicely inside the table cells.
- Allow horizontal scroll only if absolutely needed, but first try to make the table compact.
- The desktop/PC version must remain exactly unchanged.

Technical rules:
- Do not modify existing desktop CSS for screens larger than 1024px.
- Add new CSS only inside responsive media queries for mobile/tablet.
- Use separate class names for the Futuristic Version so it cannot affect the Real PC Version.
- Example:
  - `.real-pc-routine` = current existing PC design, do not change
  - `.futuristic-routine` = new Futuristic Version
  - `.mobile-routine` or mobile media query = compact version of Image 02
- If using React/Next.js, create separate components:
  - `RealPcRoutine` = existing design, unchanged
  - `FuturisticRoutine` = Image 01 style
  - `MobileRoutine` or responsive styles = compact Image 02 style
- Make sure no global CSS accidentally changes the existing PC layout.
- Test at:
  - Desktop: 1440px and above → must look exactly like Image 02
  - Tablet: 768px → compact PC-style table
  - Mobile: 390px → same PC-style table, compact columns, no futuristic card layout

Final result:
1. Keep my original Real PC version exactly the same as Image 02.
2. Add a new separate “Futuristic Version” that looks like Image 01.
3. Add a “Mobile Version” that copies Image 02 design but reduces wasted table column space for small screens.
4. Do not mix Futuristic Version styles with the Real PC or Mobile Version.