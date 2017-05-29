/*jshint esversion: 6 */
import Navigo from 'navigo';
import { homeController } from './controllers/home';
import { krakenController } from './controllers/kraken';
import { bittrexController } from './controllers/bittrex';



let root = null,
    useHash = true,
    hash = '#!';
//@ts-ignore
let router = new Navigo(root, useHash, hash);

router.on({
    '/': () => { router.navigate('home'); },
    '/#': () => { router.navigate('home'); },
    'home': homeController,
    'kraken': krakenController,
    'bittrex': bittrexController,
    // 'home/:sideBarContent': (params) => sideBarController.get(params),
    // 'chart/:sideBarContent': (params) => sideBarController.get(params),
    // 'table/:sideBarContent': (params) => sideBarController.get(params),
    // 'user/:sideBarContent': (params) => sideBarController.get(params),
    // 'chart': chartController.get,
    // 'table': tableController.get,
    // 'user': usersController.get,
    // 'user/:id/:action': (params) => usersController.get(params),
    // 'logout': usersController.logout,
    // 'signup': usersController.signup,
    // 'signin': usersController.signin,
}).notFound(query => {
    // called when there is path specified but
    // there is no route matching
    console.log(`Router couldn't find the path: ${query}`);
    // toastr.info(`Router couldn't find the path: ${query}`);
}).resolve();