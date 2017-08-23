# Mazer
*An interactive maze creator and solver*

See a demo at [joncole.me/pages/mazer](http://www.joncole.me/pages/mazer).

## About

Mazer is an interactive maze generator and solver. Through the GUI, you can choose which algorithm / bias method / solver you want to use. The generation is staggered so you can watch it work.

## Building
This is a Node project. Run `npm install` to pull the dependencies and then `npm run build` to package the final files into `/dist/`.

You can use `npm run dev:watch` to open a browser window showing the contents of `/testpage/index.html`, which is a demo page for this project.

## Resources
- [Mazes for Programmers](http://www.mazesforprogrammers.com/)
    - This book is awesome. It has a lot of really clear examples of maze generation algorithms.
- https://medium.com/@G3Kappa/generating-mazes-from-pictures-or-masking-entropy-4d050d148539
    - This article goes into various ways of biasing maze generation algorithms to get some really nice patterns in your pseudorandomness.

## License
MIT license. See [LICENSE.md](LICENSE.md) for details.