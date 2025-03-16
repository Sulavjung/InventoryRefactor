import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToPrintItem } from "@/store/slices/exampleSlices";

const SkuInput = () => {
  const [sku, setSku] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null); // Ref to manage the input element
  const { aisleId, shelveId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    // Focus the input field when the component is mounted
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [aisleId, shelveId]);

  // Handle key down event to filter items by SKU
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const shelfId = shelveId?.toString() || "unknown";

    console.log(aisleId, shelfId);
    dispatch(addToPrintItem({ sku, shelf_id: shelfId }));
    setSku("");
  };

  return (
    <>
      <div className="my-4">
        <Label htmlFor="sku" className="mt-2">
          Enter SKU
        </Label>
        <Input
          key={`${aisleId}-${shelveId}`}
          id="sku"
          value={sku}
          ref={inputRef} // Attach the ref to the input
          onChange={(e) => setSku(e.target.value)}
          onKeyDown={handleKeyDown}
          className="mt-2 p-2 border rounded text-black"
          placeholder="Enter SKU"
        />
      </div>
    </>
  );
};

export default SkuInput;
