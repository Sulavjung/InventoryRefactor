import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToPrintItem } from "@/store/slices/exampleSlices";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Papa, { ParseResult } from "papaparse";

// Define a generic Item type
type Item = Record<string, string>;

const ProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [foundItem, setFoundItem] = useState<Item | null>(null);
  const [newInventory, setNewInventory] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [csvLoaded, setCsvLoaded] = useState(false);
  const [headers, setHeaders] = useState<string[]>([]);
  const [skuColumn, setSkuColumn] = useState<string>("");
  const [saveColumns, setSaveColumns] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editForm, setEditForm] = useState<Partial<Item>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState<Partial<Item>>({});
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();

  // Load inventory and newInventory from localStorage on mount
  useEffect(() => {
    const savedInventory = localStorage.getItem("inventoryData");
    if (savedInventory) {
      try {
        const parsedItems = JSON.parse(savedInventory);
        setItems(parsedItems);
        setCsvLoaded(true);
        if (parsedItems.length > 0) {
          setHeaders(Object.keys(parsedItems[0]));
          setSkuColumn(Object.keys(parsedItems[0])[0]); // Default to first column
          setSaveColumns(Object.keys(parsedItems[0])); // Default to all columns
        }
        toast.success("Loaded inventory from local storage");
      } catch (error) {
        toast.error("Failed to load inventory from local storage");
      }
    }

    const savedNewInventory = localStorage.getItem("newInventory");
    if (savedNewInventory) {
      try {
        const parsedNewInventory = JSON.parse(savedNewInventory);
        setNewInventory(parsedNewInventory);
      } catch (error) {
        toast.error("Failed to load new inventory from local storage");
      }
    }
  }, []);

  // Focus search input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle CSV file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }

    setIsLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result: ParseResult<Item>) => {
        if (!result.meta.fields || result.meta.fields.length === 0) {
          toast.error("CSV has no valid headers");
          setIsLoading(false);
          return;
        }
        const parsedItems = result.data.map((item) =>
          Object.fromEntries(
            Object.entries(item).map(([key, value]) => [
              key,
              String(value || ""),
            ])
          )
        );
        setItems(parsedItems);
        setHeaders(result.meta.fields);
        setSkuColumn(result.meta.fields[0]); // Default to first column
        setSaveColumns(result.meta.fields); // Default to all columns
        setCsvLoaded(true);
        localStorage.setItem("inventoryData", JSON.stringify(parsedItems));
        toast.success("CSV file loaded and saved to local storage");
        setIsLoading(false);
      },
      error: (error: Error) => {
        toast.error(`Failed to parse CSV: ${error.message}`);
        setIsLoading(false);
      },
    });
  };

  // Handle search on Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !searchTerm || !csvLoaded || !skuColumn) return;

    setIsLoading(true);

    // First check if the item already exists in newInventory
    const existsInNewInventory = newInventory.some(
      (item) =>
        String(item[skuColumn] || "").toLowerCase() === searchTerm.toLowerCase()
    );

    if (existsInNewInventory) {
      setIsLoading(false);
      toast.warning(
        `Item with ${skuColumn} "${searchTerm}" already exists in new inventory`
      );
      setSearchTerm("");
      return; // stop further checks
    }

    // Then check if the item exists in the full items list (CSV)
    const found = items.find((item) =>
      String(item[skuColumn] || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setIsLoading(false);

    if (found) {
      setFoundItem(found);
      dispatch(
        addToPrintItem({
          sku: found[skuColumn] || "unknown",
          shelf_id: "unknown",
        })
      );

      // Save selected columns to newInventory
      const filteredItem = Object.fromEntries(
        Object.entries(found).filter(([key]) => saveColumns.includes(key))
      );
      const updatedNewInventory = [...newInventory, filteredItem];
      setNewInventory(updatedNewInventory);
      localStorage.setItem("newInventory", JSON.stringify(updatedNewInventory));

      toast.success(`Found product: ${found["Name"] || "Unknown"}`);
      setSearchTerm("");
    } else {
      // Not in CSV list either → allow creating new item
      setFoundItem(null);
      setIsCreating(true);
      setCreateForm({ [skuColumn]: searchTerm });
      toast.info("No product found. Create a new item below.");
    }
  };

  // Handle create form changes
  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save new item
  const handleCreateSave = () => {
    if (!createForm[skuColumn]) {
      toast.error(`Please provide a value for ${skuColumn}`);
      return;
    }

    const newItem = Object.fromEntries(
      saveColumns.map((col) => [col, createForm[col] || ""])
    );
    const updatedNewInventory = [...newInventory];
    if (
      !updatedNewInventory.some(
        (item) => item[skuColumn] === newItem[skuColumn]
      )
    ) {
      updatedNewInventory.push(newItem);
      setNewInventory(updatedNewInventory);
      localStorage.setItem("newInventory", JSON.stringify(updatedNewInventory));
      dispatch(
        addToPrintItem({ sku: newItem[skuColumn], shelf_id: "unknown" })
      );
      toast.success("New item created and added to new inventory");
    } else {
      toast.warning("Item already exists in new inventory");
    }
    setIsCreating(false);
    setCreateForm({});
    setSearchTerm("");
  };

  // Handle save column selection
  const handleSaveColumnsChange = (column: string) => {
    setSaveColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column]
    );
  };

  // Start editing an item
  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setEditForm({ ...item });
  };

  // Handle edit form changes
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save edited item
  const handleSaveEdit = () => {
    if (!editingItem) return;

    const updatedNewInventory = newInventory.map((item) =>
      item[skuColumn] === editingItem[skuColumn]
        ? { ...item, ...editForm }
        : item
    );
    setNewInventory(updatedNewInventory);
    localStorage.setItem("newInventory", JSON.stringify(updatedNewInventory));
    setEditingItem(null);
    setEditForm({});
    toast.success("Item updated successfully");
  };

  // Delete item from newInventory
  const handleDelete = (item: Item) => {
    const updatedNewInventory = newInventory.filter(
      (i) => i[skuColumn] !== item[skuColumn]
    );
    setNewInventory(updatedNewInventory);
    localStorage.setItem("newInventory", JSON.stringify(updatedNewInventory));
    toast.success("Item deleted from new inventory");
  };

  // Download newInventory as CSV
  const handleDownloadCsv = () => {
    if (newInventory.length === 0) {
      toast.error("No items in new inventory to download");
      return;
    }

    const csv = Papa.unparse(newInventory, { columns: saveColumns });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "new_inventory.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("New inventory downloaded as CSV");
  };

  // Clear search results
  const handleClear = () => {
    setFoundItem(null);
    setSearchTerm("");
    setIsCreating(false);
    setCreateForm({});
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Product Search</h1>

      {/* File Upload */}
      <div className="mb-4">
        <Label htmlFor="csvUpload" className="mb-2 block">
          Upload Inventory CSV
        </Label>
        <Input
          id="csvUpload"
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="p-2"
          disabled={isLoading}
          aria-label="Upload inventory CSV file"
        />
        {!csvLoaded && !isLoading && (
          <p className="text-sm text-gray-500 mt-2">
            Please upload a CSV file to search products.
          </p>
        )}
      </div>

      {/* SKU Column and Save Columns Selection */}
      {csvLoaded && (
        <div className="mb-4">
          <Label htmlFor="skuColumn" className="mb-2 block">
            Select SKU Column
          </Label>
          <Select value={skuColumn} onValueChange={setSkuColumn}>
            <SelectTrigger id="skuColumn" className="mb-2">
              <SelectValue placeholder="Select SKU column" />
            </SelectTrigger>
            <SelectContent>
              {headers.map((header) => (
                <SelectItem key={header} value={header}>
                  {header}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label className="mb-2 block mt-4">
            Select Columns to Save in New Inventory
          </Label>
          <div className="flex flex-wrap gap-2 mb-4">
            {headers.map((header) => (
              <Button
                key={header}
                variant={saveColumns.includes(header) ? "default" : "outline"}
                size="sm"
                onClick={() => handleSaveColumnsChange(header)}
                aria-label={`Toggle save column ${header}`}
              >
                {header}
              </Button>
            ))}
          </div>

          <Label htmlFor="search" className="mb-2 block">
            Search Product
          </Label>
          <Input
            id="search"
            value={searchTerm}
            ref={inputRef}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Enter value for ${
              skuColumn || "selected SKU column"
            }`}
            className="p-2"
            disabled={isLoading || !skuColumn}
            aria-label={`Search product by ${
              skuColumn || "selected SKU column"
            }`}
          />
        </div>
      )}

      {/* Loading State */}
      {isLoading && <p className="text-center">Loading...</p>}

      {/* Create New Item Form */}
      {isCreating && !isLoading && !foundItem && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Create New Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {saveColumns.map((header) => (
                <div key={header}>
                  <Label htmlFor={`create${header}`}>{header}</Label>
                  <Input
                    id={`create${header}`}
                    name={header}
                    value={createForm[header] || ""}
                    onChange={handleCreateChange}
                    placeholder={`Enter ${header}`}
                    disabled={header === skuColumn && searchTerm}
                    aria-label={`Enter ${header} for new item`}
                  />
                </div>
              ))}
            </div>
            <Button
              variant="default"
              className="mt-4 mr-2"
              onClick={handleCreateSave}
              aria-label="Save new item"
            >
              Save
            </Button>
            <Button
              variant="outline"
              className="mt-4"
              onClick={handleClear}
              aria-label="Cancel create"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Product Details */}
      {foundItem && !isLoading && !isCreating && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {saveColumns.map((key) => (
                <p key={key}>
                  <strong>{key}:</strong> {foundItem[key] || "N/A"}
                </p>
              ))}
            </div>

            <hr />

            {/* Price Margin if cost price is valid and greater than 0 or remove $ sign and conver to number */}
            <div className="mt-2">
              <h2 className="text-lg font-semibold mb-2">Price Margin</h2>
              {foundItem["Cost"] &&
              Number(foundItem["Cost"].replace(/[^0-9.-]+/g, "")) > 0 ? (
                (() => {
                  const cost = Number(
                    foundItem["Cost"].replace(/[^0-9.-]+/g, "")
                  );
                  const price = foundItem["Price"]
                    ? Number(foundItem["Price"].replace(/[^0-9.-]+/g, ""))
                    : 0;
                  const margin = price - cost;
                  const marginPercent = (margin / cost) * 100;
                  return (
                    <div>
                      <p>
                        <strong>Margin:</strong> ${margin.toFixed(2)} (
                        {marginPercent.toFixed(2)}%)
                      </p>
                      {/* Price for 30 35 40 45 50 percent  */}
                      <div className="mt-2">
                        <p className="font-semibold">Suggested Prices:</p>
                        <div className="list-disc list-inside flex flex-row gap-1">
                          {[25, 30, 35, 40, 45, 50, 60, 70, 80].map(
                            (percent) => {
                              const suggestedPrice = cost * (1 + percent / 100);
                              return (
                                <div
                                  key={percent}
                                  className="border px-2 py-1 rounded bg-white shadow "
                                >
                                  {percent}%: ${suggestedPrice.toFixed(2)}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <p className="text-sm text-gray-600">
                  Cost price is not available or invalid for margin calculation.
                </p>
              )}
            </div>
            <Button
              variant="outline"
              className="mt-4 mr-2"
              onClick={handleClear}
              disabled={isLoading}
              aria-label="Clear search results"
            >
              Clear
            </Button>
            <Button
              variant="default"
              className="mt-4"
              onClick={() => handleEdit(foundItem)}
              disabled={isLoading}
              aria-label="Edit item"
            >
              Edit
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Form */}
      {editingItem && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Edit Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {saveColumns.map((header) => (
                <div key={header}>
                  <Label htmlFor={`edit${header}`}>{header}</Label>
                  <Input
                    id={`edit${header}`}
                    name={header}
                    value={editForm[header] || ""}
                    onChange={handleEditChange}
                    placeholder={`Enter ${header}`}
                    aria-label={`Edit ${header}`}
                  />
                </div>
              ))}
            </div>
            <Button
              variant="default"
              className="mt-4 mr-2"
              onClick={handleSaveEdit}
              aria-label="Save edited item"
            >
              Save
            </Button>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setEditingItem(null)}
              aria-label="Cancel edit"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}

      {/* New Inventory List */}
      {newInventory.length > 0 && (
        <>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Total Items</CardTitle>
              <CardDescription>{newInventory.length} items</CardDescription>
            </CardHeader>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>New Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="default"
                className="mb-4"
                onClick={handleDownloadCsv}
                aria-label="Download new inventory as CSV"
              >
                Download New Inventory CSV
              </Button>
              <table className="w-full table-auto mb-4">
                <thead>
                  <tr>
                    {saveColumns.map((col) => (
                      <th
                        key={col}
                        className="border px-2 py-1 text-left bg-gray-100"
                      >
                        {col}
                      </th>
                    ))}
                    <th className="border px-2 py-1 bg-gray-100">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newInventory.reverse().map((item) => (
                    <tr key={item[skuColumn]}>
                      {saveColumns.map((col) => (
                        <td key={col} className="border px-2 py-1">
                          {item[col] || "N/A"}
                        </td>
                      ))}
                      <td className="border px-2 py-1">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            aria-label={`Edit ${item["Name"]}`}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(item)}
                            aria-label={`Delete ${item["Name"]}`}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ul className="space-y-2">
                {newInventory.reverse().map((item) => (
                  <li
                    key={item[skuColumn]}
                    className="flex justify-between items-center"
                  >
                    <span>
                      {item["Name"]} ({skuColumn}: {item[skuColumn] || "N/A"})
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                        aria-label={`Edit ${item["Name"]}`}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item)}
                        aria-label={`Delete ${item["Name"]}`}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}

      {/* No Results Message */}
      {!foundItem && !isLoading && !isCreating && searchTerm && csvLoaded && (
        <p className="text-center text-gray-500 mt-4">No product found.</p>
      )}
    </div>
  );
};

export default ProductSearch;
