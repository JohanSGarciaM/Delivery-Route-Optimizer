import { Injectable } from '@nestjs/common';

@Injectable()
export class RouteOptimizerService {
  optimize(durationMatrix: number[][]) {
    const deliveryCount = durationMatrix.length - 1;

    if (deliveryCount === 0) {
      return {
        order: [],
        totalDuration: 0,
      };
    }

    /*
     * Cada domicilio se representa con un bit.
     *
     * Ejemplo con 3 domicilios:
     *
     * 001 → domicilio 1 visitado
     * 010 → domicilio 2 visitado
     * 100 → domicilio 3 visitado
     * 111 → todos visitados
     */

    const totalStates = 1 << deliveryCount;

    const dp: number[][] = Array.from(
      { length: totalStates },
      () => Array(deliveryCount).fill(Infinity),
    );

    const previous: number[][] = Array.from(
      { length: totalStates },
      () => Array(deliveryCount).fill(-1),
    );

    /*
     * Estado inicial:
     *
     * origen → domicilio
     */
    for (let delivery = 0; delivery < deliveryCount; delivery++) {
      const state = 1 << delivery;

      dp[state][delivery] =
        durationMatrix[0][delivery + 1];
    }

    /*
     * Construimos todas las combinaciones posibles.
     */
    for (let state = 1; state < totalStates; state++) {
      for (
        let current = 0;
        current < deliveryCount;
        current++
      ) {
        const currentBit = 1 << current;

        if ((state & currentBit) === 0) {
          continue;
        }

        const previousState = state ^ currentBit;

        if (previousState === 0) {
          continue;
        }

        for (
          let previousDelivery = 0;
          previousDelivery < deliveryCount;
          previousDelivery++
        ) {
          const previousBit = 1 << previousDelivery;

          if (
            (previousState & previousBit) === 0
          ) {
            continue;
          }

          const candidate =
            dp[previousState][previousDelivery] +
            durationMatrix[
              previousDelivery + 1
            ][current + 1];

          if (candidate < dp[state][current]) {
            dp[state][current] = candidate;

            previous[state][current] =
              previousDelivery;
          }
        }
      }
    }

    /*
     * La ruta NO regresa al origen.
     *
     * Por eso buscamos el mejor último domicilio.
     */
    const finalState = totalStates - 1;

    let bestLastDelivery = 0;
    let bestDuration = Infinity;

    for (
      let delivery = 0;
      delivery < deliveryCount;
      delivery++
    ) {
      if (
        dp[finalState][delivery] <
        bestDuration
      ) {
        bestDuration =
          dp[finalState][delivery];

        bestLastDelivery = delivery;
      }
    }

    /*
     * Reconstruimos el orden de la ruta.
     */
    const order: number[] = [];

    let currentState = finalState;
    let currentDelivery = bestLastDelivery;

    while (currentDelivery !== -1) {
      order.unshift(currentDelivery + 1);

      const previousDelivery =
        previous[currentState][currentDelivery];

      currentState =
        currentState ^
        (1 << currentDelivery);

      currentDelivery = previousDelivery;
    }

    return {
      order,
      totalDuration: bestDuration,
    };
  }
}