import React, { FC, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { FrameResult } from "../game/frameResult";
import { FrameScore } from "../game/frameScore";

interface ResultsPanelProps {
  framesResults: FrameResult[];
  framesScore: FrameScore[];
}

const ResultsPanel: FC<ResultsPanelProps> = ({ framesResults, framesScore }) => {
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
      <Table sx={{ minWidth: 200 }} aria-label="customized table">
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
              <StyledTableCell align="center">{frameResult && frameResult.throwResults.length > 0 ? frameResult.throwResults[0].knockedPinsCount : "-"}</StyledTableCell>
              <StyledTableCell align="center">{frameResult && frameResult.throwResults.length > 1 ? frameResult.throwResults[1].knockedPinsCount : "-"}</StyledTableCell>
              <StyledTableCell align="center">{frameResult && frameResult.throwResults.length > 2 ? frameResult.throwResults[2].knockedPinsCount : "-"}</StyledTableCell>
              <StyledTableCell align="center">{framesScore[frameResult.frameNumber - 1].score}</StyledTableCell>
            </StyledTableRow>
          ))}
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>Total</TableCell>
            <TableCell align="center">{framesScore.length === 0 ? 0 : framesScore.slice(-1)[0].score}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResultsPanel;
