export default function index({ menu_config, local_config }) {
  return (
    <div style={{ display: "grid" }}>
      {menu_config.map((item) => (
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
