import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToPrintItem } from "@/store/slices/exampleSlices";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Papa, { ParseResult } from "papaparse";

// Define the Item interface for TypeScript
interface Item {
  sku: string;
  name: string;
  quantity: number;
  price: number;
}

const ProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [foundItem, setFoundItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [csvLoaded, setCsvLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();

  // Load inventory from localStorage on mount
  useEffect(() => {
    const savedInventory = localStorage.getItem("inventoryData");
    if (savedInventory) {
      try {
        const parsedItems = JSON.parse(savedInventory);
        setItems(parsedItems);
        setCsvLoaded(true);
        toast.success("Loaded inventory from local storage");
      } catch (error) {
        toast.error("Failed to load inventory from local storage");
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
        if (!result.meta.fields?.includes("sku")) {
          toast.error(
            "CSV missing required headers (sku, name, quantity, price)"
          );
          setIsLoading(false);
          return;
        }
        const parsedItems = result.data
          .map((item) => ({
            sku: String(item.sku),
            name: String(item.name),
            quantity: Number(item.quantity),
            price: Number(item.price),
          }))
          .filter(
            (item) =>
              item.sku &&
              item.name &&
              !isNaN(item.quantity) &&
              !isNaN(item.price)
          ); // Filter invalid entries
        setItems(parsedItems);
        setCsvLoaded(true);
        // Save to localStorage
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
    if (e.key !== "Enter" || !searchTerm || !csvLoaded) return;

    setIsLoading(true);
    const found = items.find(
      (item) =>
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setIsLoading(false);

    if (found) {
      setFoundItem(found);
      dispatch(addToPrintItem({ sku: found.sku, shelf_id: "unknown" }));
      // Save to newInventory in localStorage
      const newInventory = JSON.parse(
        localStorage.getItem("newInventory") || "[]"
      );
      if (!newInventory.some((item: Item) => item.sku === found.sku)) {
        newInventory.push(found);
        localStorage.setItem("newInventory", JSON.stringify(newInventory));
      }
      toast.success(`Found product: ${found.name}`);
      setSearchTerm(""); // Clear input
    } else {
      setFoundItem(null);
      toast.error("No product found matching the search term");
    }
  };

  // Clear search results
  const handleClear = () => {
    setFoundItem(null);
    setSearchTerm("");
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

      {/* Search Input */}
      {csvLoaded && (
        <div className="mb-4">
          <Label htmlFor="search" className="mb-2 block">
            Search Product (SKU or Name)
          </Label>
          <Input
            id="search"
            value={searchTerm}
            ref={inputRef}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter SKU or product name"
            className="p-2"
            disabled={isLoading}
            aria-label="Search product by SKU or name"
          />
        </div>
      )}

      {/* Loading State */}
      {isLoading && <p className="text-center">Loading...</p>}

      {/* Product Details */}
      {foundItem && !isLoading && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>SKU:</strong> {foundItem.sku}
              </p>
              <p>
                <strong>Name:</strong> {foundItem.name}
              </p>
              <p>
                <strong>Quantity:</strong> {foundItem.quantity}
              </p>
              <p>
                <strong>Price:</strong> ${foundItem.price.toFixed(2)}
              </p>
            </div>
            <Button
              variant="outline"
              className="mt-4"
              onClick={handleClear}
              disabled={isLoading}
              aria-label="Clear search results"
            >
              Clear
            </Button>
          </CardContent>
        </Card>
      )}

      {/* No Results Message */}
      {!foundItem && !isLoading && searchTerm && csvLoaded && (
        <p className="text-center text-gray-500 mt-4">No product found.</p>
      )}
    </div>
  );
};

export default ProductSearch;
