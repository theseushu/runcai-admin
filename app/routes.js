import { getAsyncInjectors } from 'utils/asyncInjectors';
import createIndexPageRoute from 'modules/indexPage/route';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars

  return [
    // others are inside indexPageRoute
    createIndexPageRoute({ store, injectReducer, injectSagas, loadModule, errorLoading }),
    {
      path: '/login',
      name: 'singupOrLogin',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('modules/signupOrLoginPage'),
        ]);
        const renderRoute = loadModule(cb);
        importModules.then(([component]) => {
          renderRoute(component);
        });
        importModules.catch(errorLoading);
      },
    }, {
      path: '/signup',
      name: 'singupOrLogin',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('modules/signupOrLoginPage'),
        ]);
        const renderRoute = loadModule(cb);
        importModules.then(([component]) => {
          renderRoute(component);
        });
        importModules.catch(errorLoading);
      },
    },
    {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        System.import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
