type SwapLabelProps = {
  idle: string;
  hover?: string;
  active?: string;
  isActive?: boolean;
};

/**
 * The idle label is shown when the user is not hovering over the element,
 * and the hover label is shown when the user hovers over the element.
 * @param idle - The label to show when the user is not hovering over the element.
 * @param hover - The label to show when the user hovers over the element.
 */
function SwapLabel({ idle, hover, active, isActive = false }: SwapLabelProps) {
  const cell = 'col-start-1 row-start-1 transition-opacity duration-150';
  const showActive = isActive && active;

  return (
    <span className="grid">
      <span
        aria-hidden={!!showActive}
        className={`${cell} ${showActive ? 'opacity-0' : hover ? 'opacity-100 group-hover:opacity-0' : 'opacity-100'}`}
      >
        {idle}
      </span>

      {hover && (
        <span
          aria-hidden
          className={`${cell} ${showActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}
        >
          {hover}
        </span>
      )}

      {active && (
        <span
          aria-hidden={!isActive}
          className={`${cell} ${isActive ? 'opacity-100' : 'opacity-0'}`}
        >
          {active}
        </span>
      )}
    </span>
  );
}

export default SwapLabel;