import { loadInitialState } from "@/utils/localStorage";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

// Define types for the state
export interface Aile {
  id: string;
  name: string;
}

export interface Shelf {
  id: string;
  name: string;
  aile_id: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  sku: string;
  size: string;
  shelf_id: string;
}

export interface ExampleState {
  products: any[]; // Define a proper type for your products
  identifierIs: string;
  showIdentifier: boolean;
  showName: boolean;
  showPrice: boolean;
  showSize: boolean;
  whichCName: string;
  whichCPrice: string;
  whichCSize: string;
  whichCQR: string;
  toPrintItems: Product[]; // Define the shape of your print items
  ailes: Aile[];
  shelves: Shelf[];
  isSubmitted: boolean;
}

const defaultState: ExampleState = {
  products: [], // Array of product objects
  identifierIs: "", // Stores which QR code is active or being used
  showIdentifier: true, // Fixed typo in variable name
  showName: true,
  showPrice: true,
  showSize: true,
  whichCName: "", // Stores the name of the category
  whichCPrice: "", // Stores the price of the category
  whichCSize: "", // Stores the size of the category
  whichCQR: "", // Stores the QR code of the category
  toPrintItems: [], // Array of items to print, each containing product_id and shelves_id
  ailes: [{ id: "123456789", name: "Aile 1" }], // Array of aisles, each containing aisle_id and name
  shelves: [{ id: "1", name: "1st", aile_id: "123456789" }], // Array of shelves, each containing shelves_id, name, and aisle_id
  isSubmitted: false,
};

// Load the state from localStorage or fall back to defaultState
const initialState: ExampleState = loadInitialState(
  "exampleState",
  defaultState
);

const exampleSlice = createSlice({
  name: "example",
  initialState,
  reducers: {
    // Updates the products list
    updateProduct: (state, action) => {
      state.products = [ ...state.products, ...action.payload ];
    },

    updateSetting: (state, action) => {
      console.log("updateSetting", action.payload);

      // Destructure relevant fields from the payload
      const {
        identifierIs,
        showIdentifier,
        showName,
        showPrice,
        showSize,
        whichCName,
        whichCPrice,
        whichCSize,
        whichCQR,
        isSubmitted,
      } = action.payload;

      // Update the corresponding state properties
      if (identifierIs !== undefined) state.identifierIs = identifierIs;
      if (showIdentifier !== undefined) state.showIdentifier = showIdentifier;
      if (showName !== undefined) state.showName = showName;
      if (showPrice !== undefined) state.showPrice = showPrice;
      if (showSize !== undefined) state.showSize = showSize;
      if (whichCName !== undefined) state.whichCName = whichCName;
      if (whichCPrice !== undefined) state.whichCPrice = whichCPrice;
      if (whichCSize !== undefined) state.whichCSize = whichCSize;
      if (whichCQR !== undefined) state.whichCQR = whichCQR;
      if (isSubmitted) state.isSubmitted = isSubmitted;
    },

    // Toggles the visibility of identifiers
    toggleIdentifier: (state) => {
      state.showIdentifier = !state.showIdentifier;
    },

    // Toggles the visibility of the product name
    toggleShowName: (state) => {
      state.showName = !state.showName;
    },

    // Toggles the visibility of the product price
    toggleShowPrice: (state) => {
      state.showPrice = !state.showPrice;
    },

    // Toggles the visibility of the product size
    toggleShowSize: (state) => {
      state.showSize = !state.showSize;
    },

    // Sets the current category name
    setWhichCName: (state, action) => {
      state.whichCName = action.payload;
    },

    // Sets the current category price
    setWhichCPrice: (state, action) => {
      state.whichCPrice = action.payload;
    },

    // Sets the current category size
    setWhichCSize: (state, action) => {
      state.whichCSize = action.payload;
    },

    // Adds a new item to the `toPrintItems` list given the sku and shelf id.
    addToPrintItem: (state, action) => {
      const { sku, shelf_id } = action.payload;

      // Filter the product that matches the given SKU and shelf ID
      const matchedProduct = state.products.find((product) => {
        console.log(product[state.whichCQR]);
        return product[state.whichCQR] === sku;
      });

      if (matchedProduct) {
        // Push to `toPrintItems` if the product matches and is not already in the list
        const isAlreadyAdded = state.toPrintItems.some(
          (item) => item.sku === matchedProduct[state.whichCQR] && item.shelf_id === shelf_id
        );

        if (!isAlreadyAdded) {
          state.toPrintItems.push({
            id: Date.now().toString(),
            name: matchedProduct[state.whichCName],
            price: matchedProduct[state.whichCPrice],
            sku: matchedProduct[state.whichCQR],
            size: matchedProduct[state.whichCSize],
            shelf_id,
          });
          toast.success("Item added to print list.");
          console.log("Item added to print list:", matchedProduct);
        } else {
          toast.success("Item already exists in the print list.");
          console.log("Item already exists in the print list:", matchedProduct);
        }
      } else {
        toast.error(
          `No product found with SKU: ${sku} and shelf ID: ${shelf_id}`
        );
        console.error(
          `No product found with SKU: ${sku} and shelf ID: ${shelf_id}`
        );
      }
    },

    // Updates the list of aisles
    updateAiles: (state, action) => {
      state.ailes = action.payload; // Payload should be an array of aisle objects
    },

    //Add ailes.
    addAile: (state, action) => {
      state.ailes.push(action.payload);
    },

    // Updates the list of shelves
    updateShelves: (state, action) => {
      state.shelves = action.payload; // Payload should be an array of shelf objects
    },

    //Add shelf
    addShelf: (state, action) => {
      state.shelves.push(action.payload);
    },

    //delete shelf
    deleteShelf: (state, action) => {
      state.shelves = state.shelves.filter(
        (shelf) => shelf.id !== action.payload
      );
    },

    // Clears all items from the `toPrintItems` list
    clearToPrintItems: (state) => {
      state.toPrintItems = [];
    },
  },
});

export const {
  updateProduct,
  updateSetting,
  toggleIdentifier,
  toggleShowName,
  toggleShowPrice,
  toggleShowSize,
  setWhichCName,
  setWhichCPrice,
  setWhichCSize,
  addToPrintItem,
  updateAiles,
  addAile,
  updateShelves,
  addShelf,
  deleteShelf,
  clearToPrintItems,
} = exampleSlice.actions;

// Selectors
export const selectAiles = (state: { example: ExampleState }) =>
  state.example.ailes;
export const selectShelves = (state: { example: ExampleState }) =>
  state.example.shelves;
export const selectToPrintItems = (state: { example: ExampleState }) =>
  state.example.toPrintItems;
export const selectIsSubmitted = (state: { example: ExampleState }) =>
  state.example.isSubmitted;
export const selectSetting = (state: { example: ExampleState }) => ({
  showName: state.example.showName,
  showPrice: state.example.showPrice,
  showSize: state.example.showSize,
});

export const selectState = (state: {example: ExampleState}) => (state.example)

export default exampleSlice.reducer;
