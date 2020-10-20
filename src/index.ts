import pipe from './util/pipe'
import curry from './util/curry'
import go from './util/go'
import compose from './util/compose'
import maybe from './monad/Maybe'
import either from './monad/Either'
import state from './monad/State'
import writer from './monad/Writer'
import task from './monad/Task'
import reader from './monad/reader'
console.log('%c ● monadologia!', 'background: #222; color: #bada55; font-size: 30px');
console.log('%c A Functional Programming helper library!', 'background: #222; color: #bada55; font-size: 30px');
export default {pipe, curry, go, compose, maybe, either, state, writer, task, reader}