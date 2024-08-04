import { makeClass, tw } from ".." with { type: "macro" };

const value = tw("w-1/2 md:w-1/3 lg:w-1/4", "bg-white");
const clazz = makeClass(
  "slide",
  "[&::-moz-range-track]:rounded-full [&::-webkit-slider-runnable-track]:rounded-full",
  "cursor-pointer appearance-none border-none bg-transparent !outline-none bg-white",
  "[&::-webkit-slider-runnable-track]:bg-black [&::-moz-range-track]:bg-black",
  "[&::-moz-range-track]:inset-shadow-sm [&::-webkit-slider-runnable-track]:inset-shadow-sm",
  "[&::-moz-range-track]:h-2 [&::-webkit-slider-runnable-track]:h-2",
  "[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:-mt-1 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow",
  "focus-visible:[&::-webkit-slider-thumb]:outline-white focus-visible:[&::-webkit-slider-thumb]:outline-2 focus-visible:[&::-webkit-slider-thumb]:outline-offset-2",
  "[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow",
  "focus-visible:[&::-moz-range-thumb]:outline-white focus-visible:[&::-moz-range-thumb]:outline-2 focus-visible:[&::-moz-range-thumb]:outline-offset-2"
);
console.log(value, clazz);
