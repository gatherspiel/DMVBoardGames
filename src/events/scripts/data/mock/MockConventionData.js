export const CONVENTION_2 = {
  id: 2,
  link: "https://tabletop.events/conventions/circle-dc-2025",
  name: "Circle DC",
  days: ["3/28/2025", "3/29/2025", "3/30/2025"],
};

export const CONVENTION_4 = {
  id: 4,
  link: "https://final3con.com/",
  name: "Final Three Con",
  days: ["4/25/2025", "4/26/2025", "4/27/2025"],
};

export const CONVENTION_5 = {
  id: 5,
  link: "https://www.novaopen.com/",
  name: "NOVA Open",
  days: ["8/27/2025", "8/28/2025", "8/29/2025", "8/30/2025", "8/31/2025"],
};

export function getConventionData() {
  return [CONVENTION_2, CONVENTION_4, CONVENTION_5];
}
