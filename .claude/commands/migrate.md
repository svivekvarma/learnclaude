# Database Migration

Add a new field to the tasks table. The field description is: $ARGUMENTS

Steps:
1. **Read** db.js, index.js, and index.test.js to understand the current schema and patterns.
2. **db.js**: Add the new column to the CREATE TABLE statement. Add a migration block using the PRAGMA table_info pattern to ALTER TABLE for existing databases.
3. **index.js POST route**: Destructure the new field from req.body, add validation if needed, include in the INSERT statement.
4. **index.js PUT route**: Destructure the new field, add validation, add to the updates object.
5. **index.js GET route**: Add query parameter filtering if the field is filterable.
6. **index.test.js**: Add tests for: creating with the field, default value, updating the field, clearing the field (if nullable).
7. **public/index.html**: Add form input for the new field.
8. **public/app.js**: Wire up the form input, include in fetch body, render in task list.
9. **public/style.css**: Add styling for the new field display.
10. Run `npm test` to verify all tests pass.

Follow the exact patterns used for `priority` and `dueDate` fields.
