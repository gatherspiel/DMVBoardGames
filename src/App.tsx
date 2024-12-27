import { EventListingPage } from "./events/EventListingPage.tsx";

const sourceCodeLocation =
  "https://github.com/Create-Third-Places/DMVBoardGames";
function App() {
  return (
    <>
      <div id="event-page-info" className="page-summary page-section">
        <p>
          This page is a work in progress listing of board game events in the
          DMV area. Email gulu@createthirdplaces.com to request an update to
          this list or share feedback.
        </p>
        <p>
          To request a new feature or view the source code, go{" "}
          <a href={sourceCodeLocation}>here</a>
        </p>
      </div>

      <EventListingPage></EventListingPage>
    </>
  );
}

export default App;
