export function getSharedButtonStyles() {
  return `
    button {
      background-color: var(--clr-lighter-blue); 
      border-color: var(--clr-darker-blue);
      border-radius: 5px;
      border-width:1px;
      color: white;
      font-size: 1rem;
      margin-top: 0.5rem;
      padding: 0.5rem;
    }
    
    button:hover {
      background-color: var(--clr-darker-blue);
    }
  `;
}
