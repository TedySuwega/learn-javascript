# Daily Learning Review Prompt Template

## How to Use

Just type this in chat:

```
Review @Exercises/dayXX/DAY_XX.md using @DAILY_REVIEW_PROMPT.md
```

Example: `Review @Exercises/day05/DAY_05.md using @DAILY_REVIEW_PROMPT.md`

---

## Review Instructions (for AI)

When this prompt is referenced, do the following for the mentioned DAY file:

1. **Check quiz answers** in the mentioned DAY_XX.md
   - Add feedback below each answer (do not change user's answers)
   - Use "**✅ Correct!**" for correct answers
   - Use "**❌ Incorrect**" or "**⚠️ Partial**" with explanation for wrong/partial answers

2. **Add "📊 Quiz Results: Day XX"** section with:
   - Table: Question | Result | Notes
   - Score line: X/Y (percentage)

3. **Check practice and exercise code** in corresponding `Exercises/dayXX/` folder
   - Note the locations in DAY_XX.md
   - Add brief "Exercise review" note if needed

4. **Add "💬 Q&A Session Notes"** section with:
   - All questions user asked during today's learning session
   - Format: `### Q: <question>` then `**A:** <answer with code example>`
   - Separate each Q&A with `---`

5. **Mark all checklist items** as `[x]` in DAY_XX.md

6. **Update @Progress/PROGRESS.md**:
   - Set the day row to ✅ completed with today's date and quiz score
   - Update "Quiz Scores by Day" table with score and details
   - Update Week summary total and average

Keep the same template format as Days 1-4.

---

## What This Prompt Triggers

| Step | Action                                    | File(s)                |
| ---- | ----------------------------------------- | ---------------------- |
| 1    | Add feedback under each quiz/bonus answer | `Exercises/dayXX/DAY_XX.md`       |
| 2    | Insert Quiz Results table with score      | `Exercises/dayXX/DAY_XX.md`       |
| 3    | Note practice/exercise folder locations   | `Exercises/dayXX/DAY_XX.md`       |
| 4    | Add Q&A Session Notes from chat questions | `Exercises/dayXX/DAY_XX.md`       |
| 5    | Mark checklist complete                   | `Exercises/dayXX/DAY_XX.md`       |
| 6    | Update progress tracker                   | `Progress/PROGRESS.md` |

---

## Folder Structure Reference

- **Days 1-2**: `Exercises/dayXX/practice.ts` and `Exercises/dayXX/exercises.ts`
- **Days 3+**: `Exercises/dayXX/practice/` and `Exercises/dayXX/exercise/` (with `src/` subfolders)

---

## Output Format (Consistent Across All Days)

- Feedback line: `**✅ Correct!** <short explanation>`
- Quiz Results heading: `## 📊 Quiz Results: Day XX`
- Table columns: `Question | Result | Notes`
- Result icons: `✅ Correct`, `⚠️ Partial`, `❌ Incorrect`
- Score format: `**Score: X/Y (XX%)**`
- Q&A heading: `## 💬 Q&A Session Notes`
- Q&A format:
  ```
  ### Q: <Your question>
  
  **A:** <Answer with explanation and code example if helpful>
  
  ---
  ```
