# Inventory Refactor

**Inventory Refactor** is designed to address a common problem faced by small to large stores: product data that is not properly categorized. The tool enables stores to recategorize and refine their inventory using SKU data, while also allowing adjustments to product details such as names, descriptions, and prices.

## Why not just use Excel or Google Sheets?

While Excel and Google Sheets are widely used for inventory tasks, they present several challenges in this use case:

1. **Duplicate Scanning**:
   Large inventories often require multiple sessions to complete. Without real-time feedback, it is easy to scan the same item multiple times without realizing it.

2. **Dynamic Store Environment**:
   Products may move around during normal store operations, making it difficult to rely on a single “scan all at once” approach.

3. **Limited Editing Flexibility**:
   A SKU alone does not provide all the necessary context (e.g., product name, description, or updated price). With spreadsheets, scanning and later trying to identify or edit details becomes cumbersome.

4. **Tedious Customization**:
   While it is technically possible to build automation with Google Apps Script, this approach requires learning new APIs and results in a workflow that is less efficient than using a purpose-built application.

By contrast, this project allows scanning while simultaneously editing and saving product data into a new, well-structured inventory.

## Advantages over Excel and Sheets

The difference in efficiency between using traditional spreadsheet tools and the custom application was significant:

- **Using Excel/Sheets**:
  Each scanned item required locating it in the old inventory, then re-entering every detail manually. This process took about 3–5 minutes per product and quickly became demotivating.

- **Using Inventory Refactor**:
  When product details matched the old inventory, the application processed them instantly—within a split second. For items requiring minor edits, the application prefilled all available fields, leaving only essential adjustments (e.g., refining the product name).

This resulted in a massive time savings: work that previously required nearly a week was completed in 4–5 hours.

## Business Impact

Many companies hire multiple staff members to perform manual inventory refactoring, often paying upwards of \$2,000–\$3,000 for the task. With this application, a single person in a small store—where budgets are limited and organization is often a challenge—can achieve the same results in a fraction of the time.
