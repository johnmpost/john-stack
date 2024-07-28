import { discoverAndRun } from "../fununit/run";
import {
  showResults as showResultsSuccinct,
  showResultsVerbose,
} from "../fununit/lib";

const [, , globPath, ...rest] = process.argv;
const isVerbose = rest.includes("v");
const showResults = isVerbose ? showResultsVerbose : showResultsSuccinct;
discoverAndRun(globPath, showResults);
