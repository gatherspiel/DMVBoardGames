import { Group } from "./Group.tsx";
import { fetchEventDataAtom } from "../state/EventState.ts";
import { useAtom } from "jotai";

export function EventListingPage() {
  const [data, setData] = useAtom(fetchEventDataAtom);
  console.log(data + ":" + setData);
  return (
    <div>
      {JSON.stringify(data)}

      <Group data={"Test1"}></Group>
      <Group data={"Test1"}></Group>
      <Group data={"Test1"}></Group>
    </div>
  );
}
