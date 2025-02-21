export class ClientModel {
  static getInitialState = (): unknown => {
    const initialState = window.__INITIAL_STATE__ ?? {};

    delete window.__INITIAL_STATE__;

    const initialStateContainer = document.getElementById('__INITIAL_STATE__');

    if (initialStateContainer) {
      initialStateContainer.outerHTML = '';
    }

    return initialState;
  };
}
