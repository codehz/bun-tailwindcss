import { tw } from ".." with { type: "macro" };

const value = tw('w-1/2 md:w-1/3 lg:w-1/4');
console.log(value);