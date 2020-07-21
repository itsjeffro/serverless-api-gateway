import LambdaEventInterface from "src/lib/LambdaEvent/LambdaEventInterface";

import LambdaEvent from '../../lib/LambdaEvent';

interface HandleInterface {
  /**
   * The main method for executing this class.
   */
  handle(lambdaEvent: LambdaEvent): any
}

export default HandleInterface;
