import React from "react";
import { screen, render } from "@testing-library/react";
import ResultsPanel from "./resultsPanel";
import { FrameResultType } from "../game/frameResultType";

const renderResultsPanel = (): void => {
  const framesResults = [
    {
      frameNumber: 1,
      resultType: FrameResultType.OPEN,
      throwResults: [
        { throwNumber: 1, nbKnockedDownPins: 3 },
        { throwNumber: 2, nbKnockedDownPins: 5 },
      ],
    },
    { frameNumber: 2, resultType: FrameResultType.OPEN, throwResults: [{ throwNumber: 1, nbKnockedDownPins: 7 }] },
  ];

  const framesScores = { 1: { score: 8 }, 2: { score: 15 } };

  render(<ResultsPanel framesResults={framesResults} framesScores={framesScores} />);
};

describe("Results Panel", () => {
  it("should render the frames results", () => {
    renderResultsPanel();

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("should render the total score", () => {
    const expectedTotalScore = "15";

    renderResultsPanel();

    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByTestId("scoreCell").innerHTML).toContain(expectedTotalScore);
  });
});
