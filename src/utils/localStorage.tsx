// utils/localStorage.js
export const loadState = () => {
    try {
      const serializedState = localStorage.getItem("reduxState");
      if (serializedState === null) {
        return undefined; // No data in localStorage, initialize a new store
      }
      return JSON.parse(serializedState); // Load the existing state
    } catch (err) {
      console.error("Could not load state from localStorage:", err);
      return undefined;
    }
  };
  
// utils/localStorage.ts
export const saveState = (key: string, state: any) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(key, serializedState);
    } catch (error) {
      console.error("Could not save state to localStorage:", error);
    }
  };

  // utils/localStorage.ts
export const loadInitialState = (key: string, defaultState: any) => {
    try {
      const serializedState = localStorage.getItem(key);
      if (serializedState === null) {
        return defaultState; // Return the default state if nothing is in localStorage
      }
      return JSON.parse(serializedState);
    } catch (error) {
      console.error("Could not load initial state from localStorage:", error);
      return defaultState; // Fallback to default state on error
    }
  };
  
  