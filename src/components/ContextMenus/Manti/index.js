import React from "react";

export default function index({ config }) {
  return (
    <div>
      {config.map((item) => (
        <button
          key={item.ID}
          onClick={() => console.log(`${item.Name} will be invoked`)}
        >
          {item.Name}
        </button>
      ))}
    </div>
  );
}
