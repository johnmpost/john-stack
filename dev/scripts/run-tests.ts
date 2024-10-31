import {
  showResults as showResultsSuccinct,
  showResultsVerbose,
} from "../../libs/fununit/lib";
import { discoverAndRun } from "../../libs/fununit/run";

const [, , globPath, ...rest] = process.argv;
const isVerbose = rest.includes("v");
const showResults = isVerbose ? showResultsVerbose : showResultsSuccinct;
discoverAndRun(globPath, showResults);
