export function getSharedButtonStyles(): string {
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

export function getSharedUiSectionStyles(): string {
  return `
    .ui-section {
      background: hsl(from var(--clr-lighter-blue) h s l / 0.05);
      border-radius: 10px;
      color: var(--clr-dark-blue);
      font-size: 1.25rem;
      font-weight:600;
      margin-top: 0.5rem;
      padding-left:1.5rem;
      padding-top: 0.5rem;
      padding-button: 0.5rem;
    }
    
    a:hover,
    a:focus-visible,
    {
      color: var(--clr-dark-blue);
    }
    
    a:active {
      color: white;
    }
    
    a {
      color:var(--clr-light-blue)
    }
    p {
      color: var(--clr-dark-blue);
      font-size: 1.25rem;
      font-weight: 600;
    }
      
  `;
}
