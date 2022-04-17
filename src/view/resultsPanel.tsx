import React, { FC } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { FrameResult } from "../game/frameResult";
import { FramesScores } from "../game/frameScore";

interface ResultsPanelProps {
  framesResults: FrameResult[];
  framesScores: FramesScores;
}

const ResultsPanel: FC<ResultsPanelProps> = ({ framesResults, framesScores }) => {
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 200 }} size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell>Frame </StyledTableCell>
            <StyledTableCell>Throw 1</StyledTableCell>
            <StyledTableCell> Throw 2</StyledTableCell>
            <StyledTableCell>Throw 3</StyledTableCell>
            <StyledTableCell>Score</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {framesResults.map((frameResult: FrameResult) => (
            <StyledTableRow key={frameResult.frameNumber}>
              <StyledTableCell align="center">{frameResult.frameNumber}</StyledTableCell>
              <StyledTableCell align="center">{frameResult.throwResults.length > 0 ? frameResult.throwResults[0].nbKnockedDownPins : "-"}</StyledTableCell>
              <StyledTableCell align="center">{frameResult.throwResults.length > 1 ? frameResult.throwResults[1].nbKnockedDownPins : "-"}</StyledTableCell>
              <StyledTableCell align="center">{frameResult.throwResults.length > 2 ? frameResult.throwResults[2].nbKnockedDownPins : "-"}</StyledTableCell>
              <StyledTableCell align="center">{framesScores && framesScores[frameResult.frameNumber] && framesScores[frameResult.frameNumber].score}</StyledTableCell>
            </StyledTableRow>
          ))}
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>Total</TableCell>
            <TableCell data-testid="scoreCell" align="center">
              {framesScores && framesScores[framesResults.length] && framesScores[framesResults.length].score}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResultsPanel;
