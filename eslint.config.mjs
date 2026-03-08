import coreWebVitals from "eslint-config-next/core-web-vitals";

export default [
  ...coreWebVitals,
  {
    rules: {
      // These rules are overly strict for common valid patterns (hydration guards,
      // returning ref.current from hooks, Math.random in useMemo).
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      "react-hooks/purity": "off",
    },
  },
];
