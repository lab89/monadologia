interface Monad {
    pure(): Monad;
    map(): Monad;
    flatMap(): Monad;
}

export default Monad;