# Troubleshooting

The **Troubleshooting** section is here to help you resolve common issues you might encounter while using Label Creator. Whether you're facing problems with data uploads, SKU searches, label generation, or printing, this guide provides practical solutions to get you back on track quickly.

---

## Common Issues and Solutions

### 1. **Problem: Data File Not Uploading**

- **Description**: The file fails to upload, or you see an error message when attempting to upload a data file.
- **Possible Causes**:

  - Incorrect file format (only JSON is supported).
  - File size exceeds the upload limit.
  - Corrupt or improperly structured file.

- **Solution**:
  1. Ensure the file is in JSON format and adheres to the correct structure.
  2. Check the file size and reduce it if necessary.
  3. Validate the file by opening it in a JSON editor to ensure there are no syntax errors.

---

### 2. **Problem: SKU Search Returns No Results**

- **Description**: Searching for an SKU doesn’t yield any matching items, even when the SKU exists in the data file.
- **Possible Causes**:

  - Incorrect or misspelled SKU entry.
  - The identifier field (e.g., `whichCQR`) is not correctly configured in the settings.
  - The item does not exist in the uploaded data.

- **Solution**:
  1. Double-check the SKU entry for typos.
  2. Verify that the correct identifier field is selected in the **Settings Form**.
  3. Ensure the item exists in the uploaded data file and try again.

---

### 3. **Problem: Labels Display Incorrect Information**

- **Description**: Labels are missing fields or show incorrect data.
- **Possible Causes**:

  - Misconfigured settings for label content.
  - The uploaded data file does not include the required fields.

- **Solution**:
  1. Review the **Settings Form** to ensure the correct fields (e.g., name, price, size) are selected.
  2. Open the uploaded data file and confirm that the fields exist and are properly formatted.

---

### 4. **Problem: Labels Not Printing Correctly**

- **Description**: Labels are misaligned, cut off, or missing after printing.
- **Possible Causes**:

  - Printer settings are not configured for the label sheet size.
  - Incorrect page margins or scaling in the print dialog.

- **Solution**:
  1. Check the printer settings and ensure the label sheet size matches the selected paper size.
  2. Disable scaling or set it to 100% in the print dialog.
  3. Perform a test print and adjust margins if necessary.

---

### 5. **Problem: Duplicate Items in the Label List**

- **Description**: Duplicate items appear in the list of labels after SKU searches.
- **Possible Causes**:

  - The same SKU was added multiple times.

- **Solution**:
  1. Avoid pressing "Enter" repeatedly after entering the SKU.
  2. The system automatically prevents duplicates. If duplicates still occur, refresh the page and try again.

---

### 6. **Problem: Error Notifications Persist**

- **Description**: The system continues to display error messages even after resolving the issue.
- **Possible Causes**:

  - The application’s state wasn’t updated.

- **Solution**:
  1. Refresh the page to reset the application state.
  2. Clear the input field or reset settings if needed.
  3. If the issue persists, restart the application.

---

## General Tips for Troubleshooting

- **Check Logs**: Use the browser console (F12) to view error messages for technical details.
- **Validate Data**: Ensure your JSON file is properly structured using online validators or JSON formatting tools.
- **Restart the App**: Sometimes, a simple restart can resolve unexpected behavior.
- **Contact Support**: If the issue persists, reach out to our support team with details about the problem.

---

By following this guide, you can resolve most issues on your own and continue using Label Creator efficiently. For additional help, refer to the [FAQs](#) or contact customer support.
